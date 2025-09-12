import express from 'express';
import { google } from 'googleapis';
import { oauth2Client, SCOPES } from '../config/oauth2Client.js';
import dotenv from 'dotenv';
import currentConfig from '../config/environment.js';

dotenv.config();

const router = express.Router();

// Stockage temporaire du token 
let oauthToken = null;

// Vérifier le statut d'authentification
router.get('/status', (req, res) => {
  res.json({ isAuthenticated: !!oauthToken });
});

// Route pour initier l'authentification Gmail
router.get('/auth', (req, res) => {
  console.log('Variables d\'environnement Gmail:', {
    clientId: process.env.GMAIL_CLIENT_ID,
    redirectUri: process.env.GMAIL_REDIRECT_URI
  });
  
  if (!process.env.GMAIL_CLIENT_ID) {
    return res.status(500).json({ 
      error: 'Configuration Gmail manquante',
      details: 'GMAIL_CLIENT_ID non défini dans les variables d\'environnement'
    });
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    redirect_uri: process.env.GMAIL_REDIRECT_URI
  });
  res.redirect(authUrl);
});

// Route pour récupérer une pièce jointe
router.get('/attachment/:messageId/:attachmentId', ensureAuthenticated, async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const attachment = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: req.params.messageId,
      id: req.params.attachmentId
    });

    const data = Buffer.from(attachment.data.data, 'base64');
    res.send(data);
  } catch (error) {
    console.error('Erreur lors de la récupération de la pièce jointe:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la pièce jointe' });
  }
});

// Route de callback après l'authentification Google
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Stocker le token
    oauthToken = tokens;
    
    
    // Rediriger vers le frontend après l'authentification réussie
    res.redirect(`${currentConfig.frontendUrl}/dashboard/mail`);
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error);
    res.status(500).json({ error: 'Erreur lors de l\'authentification' });
  }
});

// Middleware pour vérifier l'authentification
function ensureAuthenticated(req, res, next) {
  console.log('Vérification de l\'authentification');
  if (!oauthToken) {
    console.error('Pas de token disponible');
    return res.status(401).json({ 
      error: 'Non authentifié. Veuillez vous connecter à Gmail.',
      authUrl: '/gmail/auth'
    });
  }
  console.log('Token trouvé, configuration du client');
  oauth2Client.setCredentials(oauthToken);
  next();
}

// Récupérer les mails
router.get('/mails', ensureAuthenticated, async (req, res) => {
  console.log('Récupération des mails');
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    let query = '';
    if (req.query.unread === 'true') query = 'is:unread';
    if (req.query.archived === 'true') query = '-in:inbox';   
    
    console.log('Requête Gmail avec query:', query);
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
      q: query,
    });
    
    console.log(`${response.data.messages?.length || 0} messages trouvés`);
    const messages = response.data.messages || [];
    
    // Récupérer les détails de chaque mail
    const mails = await Promise.all(messages.map(async (msg) => {
      try {
        const mail = await gmail.users.messages.get({ 
          userId: 'me', 
          id: msg.id,
          format: 'full' // Utiliser le format full pour obtenir toutes les parties du message
        });

        // Extraire les en-têtes utiles
        const headers = {};
        (mail.data.payload.headers || []).forEach(header => {
          headers[header.name.toLowerCase()] = header.value;
        });

        // Fonctions utilitaires pour extraire contenu et pièces jointes depuis payload
        const decodeBody = (body) => {
          if (!body) return '';
          try {
            // Gmail renvoie du base64url
            const normalized = body.replace(/-/g, '+').replace(/_/g, '/');
            return Buffer.from(normalized, 'base64').toString('utf8');
          } catch {
            return '';
          }
        };

        const collectParts = (payload) => {
          const result = { html: '', text: '', attachments: [] };
          if (!payload) return result;

          const stack = [payload];
          while (stack.length) {
            const part = stack.pop();
            const mimeType = part.mimeType || part.headers?.find(h => h.name.toLowerCase() === 'content-type')?.value || '';

            if (part.parts && part.parts.length) {
              part.parts.forEach(p => stack.push(p));
            }

            if (part.body && part.body.data) {
              if (mimeType.includes('text/html')) {
                result.html += decodeBody(part.body.data);
              } else if (mimeType.includes('text/plain')) {
                result.text += decodeBody(part.body.data);
              }
            }

            // Pièces jointes
            const isAttachment = !!part.body?.attachmentId || (part.filename && part.filename !== '');
            if (isAttachment) {
              result.attachments.push({
                filename: part.filename || 'attachment',
                mimeType: part.mimeType || 'application/octet-stream',
                size: part.body?.size || 0,
                attachmentId: part.body?.attachmentId
              });
            }
          }
          return result;
        };

        const extracted = collectParts(mail.data.payload);
        let content = extracted.html || (extracted.text ? extracted.text.replace(/\n/g, '<br>') : '');

        return {
          id: msg.id,
          subject: headers['subject'] || '',
          from: headers['from'] || '',
          date: headers['date'] || '',
          content: content || mail.data.snippet,
          snippet: mail.data.snippet,
          attachments: extracted.attachments
        };

      } catch (error) {
        console.error(`Erreur lors de la récupération du mail ${msg.id}:`, error);
        return {
          id: msg.id,
          subject: 'Erreur de chargement',
          from: '',
          date: '',
          content: 'Impossible de charger le contenu du mail.',
          snippet: '',
          attachments: []
        };
      }
    }));
    
    console.log(`Détails récupérés pour ${mails.length} messages`);
    res.json(mails);
  } catch (err) {
    console.error('Erreur lors de la récupération des mails:', err);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des mails',
      details: err.message
    });
  }
});

// Envoyer un mail
router.post('/send', ensureAuthenticated, async (req, res) => {
  console.log('Tentative d\'envoi de mail');
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const { to, subject, content } = req.body;

    // Créer le message au format RFC 2822
    const message = [
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      'Content-Transfer-Encoding: 7bit',
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      content
    ].join('\n');

    // Encoder en base64
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    console.log('Envoi du message encodé');
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Message envoyé avec succès');
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur lors de l\'envoi du mail:', err);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du mail',
      details: err.message
    });
  }
});

// Archiver un mail
router.post('/archive/:id', ensureAuthenticated, async (req, res) => {
  console.log('Tentative d\'archivage du mail:', req.params.id);
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    await gmail.users.messages.modify({
      userId: 'me',
      id: req.params.id,
      requestBody: {
        removeLabelIds: ['INBOX'],
      },
    });
    console.log('Mail archivé avec succès');
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur lors de l\'archivage du mail:', err);
    res.status(500).json({ 
      error: 'Erreur lors de l\'archivage du mail',
      details: err.message
    });
  }
});

// 6. Supprimer un mail
router.delete('/mails/:id', ensureAuthenticated, async (req, res) => {
  console.log('Tentative de suppression du mail:', req.params.id);
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    await gmail.users.messages.trash({
      userId: 'me',
      id: req.params.id,
    });
    console.log('Mail supprimé avec succès');
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur lors de la suppression du mail:', err);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du mail',
      details: err.message
    });
  }
});

// Route pour télécharger une pièce jointe
// NOTE: cette route existe déjà plus haut avec ensureAuthenticated. On supprime le doublon.
/* router.get('/attachment/:messageId/:attachmentId', async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const { messageId, attachmentId } = req.params;

    const attachment = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: messageId,
      id: attachmentId
    });

    const buffer = Buffer.from(attachment.data.data, 'base64');
    
    // Récupérer les informations du message pour obtenir le nom du fichier
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId
    });

    const attachmentPart = message.data.payload.parts.find(part => part.body.attachmentId === attachmentId);
    const filename = attachmentPart.filename;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', attachmentPart.mimeType);
    res.send(buffer);
  } catch (error) {
    console.error('Erreur lors du téléchargement de la pièce jointe:', error);
    res.status(500).json({ error: 'Erreur lors du téléchargement de la pièce jointe' });
  }
}); */

// Route pour afficher une image en ligne
router.get('/image/:messageId/:contentId', async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const { messageId, contentId } = req.params;

    // Récupérer le message complet
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'raw'
    });

    // Décoder le message
    const rawContent = Buffer.from(message.data.raw, 'base64').toString('utf8');
    
    // Trouver le boundary
    const boundary = rawContent.match(/boundary="?([^";\s]*)"?/)?.[1];
    
    if (boundary) {
      const parts = rawContent.split('--' + boundary);
      for (const part of parts) {
        const partContentId = part.match(/Content-ID:\s*<([^>]+)>/i)?.[1];
        
        if (partContentId === contentId) {
          const contentType = part.match(/Content-Type:\s*([^;\r\n]+)/i)?.[1];
          const match = part.match(/\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\r?\n$)/);
          
          if (match) {
            let imageData = match[1].trim();
            
            // Vérifier si l'image est encodée en base64
            if (part.toLowerCase().includes('content-transfer-encoding: base64')) {
              imageData = Buffer.from(imageData.replace(/\s/g, ''), 'base64');
            }
            
            res.setHeader('Content-Type', contentType);
            res.send(imageData);
            return;
          }
        }
      }
    }
    
    throw new Error('Image non trouvée');
  } catch (error) {
    console.error('Erreur lors de l\'affichage de l\'image:', error);
    res.status(500).json({ error: 'Erreur lors de l\'affichage de l\'image' });
  }
});

// Route pour récupérer les mails non lus
router.get('/mails/unread', async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 10
    });

    const messages = await Promise.all(
      response.data.messages.map(async (message) => {
        const fullMessage = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });
        return fullMessage.data;
      })
    );

    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des mails non lus:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des mails non lus' });
  }
});

export default router;