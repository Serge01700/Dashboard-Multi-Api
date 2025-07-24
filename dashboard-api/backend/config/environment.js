// Détection explicite de l'environnement de production
const isDevelopment = process.env.NODE_ENV !== 'production';
console.log('Current NODE_ENV:', process.env.NODE_ENV);
console.log('isDevelopment:', isDevelopment);

const config = {
  development: {
    frontendUrl: 'http://localhost:5173',
    backendUrl: 'http://localhost:3000',
    oauthRedirectUrl: 'http://localhost:3000/api/gmail/callback'
  },
  production: {
    frontendUrl: 'http://localhost:8080',
    backendUrl: 'http://localhost:3000',
    oauthRedirectUrl: 'http://localhost:3000/api/gmail/callback'
  }
};

const currentConfig = isDevelopment ? config.development : config.production;
console.log('Using configuration:', isDevelopment ? 'development' : 'production');
console.log('Frontend URL:', currentConfig.frontendUrl);

export default currentConfig; 