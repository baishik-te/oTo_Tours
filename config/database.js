const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const env = process.env.NODE_ENV || 'development';

const dbConfig = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'bp1234',
    database: process.env.DB_NAME || 'oto_tours',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'bp1234',
    database: process.env.DB_NAME || 'oto_tours',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'bp1234',
    database: process.env.DB_NAME || 'oto_tours',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 30,
      min: 5,
      acquire: 60000,
      idle: 10000
    }
  }
};

const currentConfig = dbConfig[env];
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  currentConfig
);

module.exports = dbConfig;
module.exports.sequelize = sequelize;
