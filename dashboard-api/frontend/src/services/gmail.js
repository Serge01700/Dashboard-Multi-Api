import apiClient from './axios-config.js';

// Récupérer tous les mails
export async function fetchAllMails() {
  try {
    const response = await apiClient.get('/gmail/mails');
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

// Récupérer les mails non lus
export async function fetchUnreadMails() {
  try {
    const response = await apiClient.get('/gmail/mails?unread=true');
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

// Récupérer les mails archivés
export async function fetchArchivedMails() {
  try {
    const response = await apiClient.get('/gmail/mails?archived=true');
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

// Envoyer un nouveau mail
export async function sendMail({ to, subject, content }) {
  try {
    const response = await apiClient.post('/gmail/send', { to, subject, content });
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

// Archiver un mail
export async function archiveMail(messageId) {
  try {
    const response = await apiClient.post(`/gmail/archive/${messageId}`);
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

// Supprimer un mail
export async function deleteMail(messageId) {
  try {
    const response = await apiClient.delete(`/gmail/delete/${messageId}`);
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

// Obtenir l'URL d'une image pour l'affichage
export function getImageUrl(messageId, attachmentId) {
  return `${apiClient.defaults.baseURL}/gmail/image/${messageId}/${attachmentId}`;
}

// Télécharger une pièce jointe
export async function downloadAttachment(messageId, attachmentId) {
  try {
    const response = await apiClient.get(`/gmail/attachment/${messageId}/${attachmentId}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

function handleGmailError(error) {
  if (error.response?.status === 401) {
    // Rediriger vers l'authentification Gmail si nécessaire
    if (error.response.data?.authUrl) {
      window.location.href = error.response.data.authUrl;
    }
  }
  console.error('Erreur Gmail:', error);
} 