import apiClient from './axios-config';

// Fonction pour traiter le HTML des emails
function sanitizeEmailContent(content) {
  if (!content) return '';
  
  // Convertir les caractères spéciaux
  content = content.replace(/[\u2028\u2029]/g, ' ');
  
  // Gérer l'encodage UTF-8
  try {
    content = decodeURIComponent(escape(content));
  } catch {
    // Si l'encodage échoue, on garde le contenu tel quel
  }
  
  return content;
}

// Gestion des erreurs
function handleMailError(error) {
  console.error('Mail service error:', error);
  if (error.response?.data?.authUrl) {
    window.location.href = error.response.data.authUrl;
  }
  throw error;
}

// Récupérer tous les mails
export async function fetchAllMails() {
  try {
    const response = await apiClient.get('/gmail/mails');
    return response.data.map(mail => ({
      ...mail,
      content: sanitizeEmailContent(mail.content),
      attachments: mail.attachments || []
    }));
  } catch (error) {
    handleMailError(error);
  }
}

// Récupérer les mails non lus
export async function fetchUnreadMails() {
  try {
    const response = await apiClient.get('/gmail/mails?unread=true');
    return response.data.map(mail => ({
      ...mail,
      content: sanitizeEmailContent(mail.content),
      attachments: mail.attachments || []
    }));
  } catch (error) {
    handleMailError(error);
  }
}

// Récupérer les mails archivés
export async function fetchArchivedMails() {
  try {
    const response = await apiClient.get('/gmail/mails?archived=true');
    return response.data.map(mail => ({
      ...mail,
      content: sanitizeEmailContent(mail.content),
      attachments: mail.attachments || []
    }));
  } catch (error) {
    handleMailError(error);
  }
}

// Télécharger une pièce jointe
export async function handleAttachmentDownload(messageId, attachmentId, filename) {
  try {
    const response = await apiClient.get(`/gmail/attachment/${messageId}/${attachmentId}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    handleMailError(error);
  }
}

// Archiver un mail
export async function archiveMail(messageId) {
  try {
    const response = await apiClient.post(`/gmail/archive/${messageId}`);
    return response.data;
  } catch (error) {
    handleMailError(error);
  }
}

// Supprimer un mail
export async function deleteMail(messageId) {
  try {
    const response = await apiClient.delete(`/gmail/mails/${messageId}`);
    return response.data;
  } catch (error) {
    handleMailError(error);
  }
}
