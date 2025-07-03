import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vérifier que les variables d'environnement nécessaires sont présentes
if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
  throw new Error('Les variables d\'environnement GMAIL_CLIENT_ID et GMAIL_CLIENT_SECRET sont requises');
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// Définir les scopes pour l'accès Gmail
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

// Générer l'URL d'authentification
export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

// Configurer les tokens
export function setCredentials(tokens) {
  oauth2Client.setCredentials(tokens);
}

export { oauth2Client, SCOPES }; 