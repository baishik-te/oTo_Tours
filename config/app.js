const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api',
  adminApiKey: process.env.ADMIN_API_KEY || 'oto_admin_secret_key_2026',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'oTo Tours <no-reply@ototours.com>'
  }
};

module.exports = config;
