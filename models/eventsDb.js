'use strict';

const { sequelize, Sequelize } = require('../config/database');
const EventType = require('./EventType');
const EventInquiry = require('./EventInquiry');

// Initialize event models
const eventModels = {
  EventType: EventType.initModel(sequelize),
  EventInquiry: EventInquiry.initModel(sequelize)
};

// Establish associations
Object.values(eventModels).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(eventModels);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...eventModels
};
