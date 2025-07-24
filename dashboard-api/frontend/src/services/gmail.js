import apiClient from './axios-config.js';
import axios from './axios-config';

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
    const response = await apiClient.delete(`/gmail/mails/${messageId}`);
    return response.data;
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
}

// Obtenir l'URL d'une image pour l'affichage
export async function getImageUrl(messageId, attachmentId) {
  try {
    const response = await apiClient.get(`/gmail/image/${messageId}/${attachmentId}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    handleGmailError(error);
    throw error;
  }
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

// Fonction utilitaire pour gérer les erreurs Gmail
function handleGmailError(error) {
  if (error.response?.status === 401 && error.response?.data?.authUrl) {
    window.location.href = error.response.data.authUrl;
  }
}

export const initiateGmailAuth = () => {
  window.location.href = `${apiClient.defaults.baseURL}/gmail/auth`;
};

export const fetchEmails = async () => {
  try {
    const response = await apiClient.get('/gmail/mails');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des emails:', error);
    throw error;
  }
}; 