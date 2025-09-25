import rateLimit from 'express-rate-limit';

// Limiteur général 
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // max 120 requêtes par minute par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, réessayez plus tard.' }
});

// Limiteur strict pour routes sensibles (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 tentatives par fenêtre par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives sur cette route. Réessayez plus tard.' }
});

export default {
  generalLimiter,
  authLimiter
};
