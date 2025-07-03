import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Configuration des scopes pour l'API Gmail
export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

// Création du client OAuth2
export const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// Si un refresh token est disponible, on configure le client avec
if (process.env.GMAIL_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });
} 