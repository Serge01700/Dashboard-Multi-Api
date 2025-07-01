import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let credentials;
try {
  // Essayer de lire le fichier credentials.json
  const credentialsPath = path.join(__dirname, 'credentials.json');
  const credentialsFile = fs.readFileSync(credentialsPath);
  credentials = JSON.parse(credentialsFile);
  console.log('Credentials chargées avec succès');
} catch (error) {
  console.error('Erreur lors du chargement des credentials:', error);
  throw new Error('Impossible de charger les credentials Gmail');
}

const { client_id, client_secret } = credentials.web;
const redirect_uri = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/api/gmail/callback';

console.log('Configuration OAuth2 avec redirect_uri:', redirect_uri);

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);

// Définir les scopes nécessaires pour l'API Gmail
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

export default oauth2Client; 