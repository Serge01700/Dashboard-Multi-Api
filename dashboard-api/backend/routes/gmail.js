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
          format: 'raw' // Utiliser le format raw pour obtenir le message complet
        });

        // Décoder le message raw
        const rawContent = Buffer.from(mail.data.raw, 'base64').toString('utf8');
        
        // Parser les en-têtes
        const headers = {};
        const headerMatch = rawContent.match(/^(.*?)\r?\n\r?\n/s);
        if (headerMatch) {
          const headerLines = headerMatch[1].split(/\r?\n/);
          let currentHeader = '';
          headerLines.forEach(line => {
            if (line.match(/^\s/)) {
              // Continuation de l'en-tête précédent
              headers[currentHeader] += ' ' + line.trim();
            } else {
              const match = line.match(/^(.*?):\s*(.*)/);
              if (match) {
                currentHeader = match[1].toLowerCase();
                headers[currentHeader] = match[2];
              }
            }
          });
        }

        // Extraire le contenu
        let content = '';
        const boundary = headers['content-type']?.match(/boundary="?([^";\s]*)"?/)?.[1];
        
        if (boundary) {
          const parts = rawContent.split('--' + boundary);
          parts.forEach(part => {
            if (part.includes('text/html')) {
              const match = part.match(/\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\r?\n$)/);
              if (match) {
                content = match[1].trim();
                // Décoder le contenu s'il est encodé en base64
                if (part.toLowerCase().includes('content-transfer-encoding: base64')) {
                  content = Buffer.from(content.replace(/\s/g, ''), 'base64').toString('utf8');
                }
              }
            } else if (!content && part.includes('text/plain')) {
              const match = part.match(/\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\r?\n$)/);
              if (match) {
                content = match[1].trim();
                // Décoder le contenu s'il est encodé en base64
                if (part.toLowerCase().includes('content-transfer-encoding: base64')) {
                  content = Buffer.from(content.replace(/\s/g, ''), 'base64').toString('utf8');
                }
                // Convertir le texte brut en HTML basique
                content = content.replace(/\n/g, '<br>');
              }
            }
          });
        } else {
          // Si pas de boundary, essayer de trouver le contenu après les en-têtes
          const match = rawContent.match(/\r?\n\r?\n([\s\S]*?)$/);
          if (match) {
            content = match[1].trim();
            // Vérifier si le contenu est encodé en base64
            if (headers['content-transfer-encoding']?.toLowerCase() === 'base64') {
              content = Buffer.from(content.replace(/\s/g, ''), 'base64').toString('utf8');
            }
          }
        }

        // Nettoyer le contenu HTML
        content = content
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();

        // Extraire les pièces jointes
        const attachments = [];
        if (boundary) {
          const parts = rawContent.split('--' + boundary);
          parts.forEach(part => {
            const contentType = part.match(/Content-Type:\s*([^;\r\n]+)/i)?.[1];
            const contentDisposition = part.match(/Content-Disposition:([^\r\n]+)/i)?.[1];
            const filename = contentDisposition?.match(/filename="?([^";\r\n]*)"?/)?.[1];
            const contentId = part.match(/Content-ID:\s*<([^>]+)>/i)?.[1];

            if (filename || (contentType && !contentType.startsWith('text/'))) {
              const match = part.match(/\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\r?\n$)/);
              if (match) {
                const attachmentData = match[1].trim();
                attachments.push({
                  filename: filename || 'attachment',
                  mimeType: contentType || 'application/octet-stream',
                  content: attachmentData,
                  contentId: contentId,
                  isInline: contentDisposition?.includes('inline')
                });
              }
            }
          });
        }

        // Remplacer les références CID par des URLs pour les images intégrées
        attachments.forEach(attachment => {
          if (attachment.contentId && attachment.isInline) {
            const imageUrl = `/gmail/image/${msg.id}/${attachment.contentId}`;
            content = content.replace(
              new RegExp(`cid:${attachment.contentId}`, 'gi'),
              imageUrl
            );
          }
        });

        return {
          id: msg.id,
          subject: headers['subject'] || '',
          from: headers['from'] || '',
          date: headers['date'] || '',
          content: content || mail.data.snippet,
          snippet: mail.data.snippet,
          attachments
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
router.get('/attachment/:messageId/:attachmentId', async (req, res) => {
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
});

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