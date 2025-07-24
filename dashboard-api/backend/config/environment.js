const isDevelopment = process.env.NODE_ENV !== 'production';

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

export default currentConfig; 