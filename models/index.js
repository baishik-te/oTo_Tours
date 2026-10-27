'use strict';

const { sequelize, Sequelize } = require('../config/database');
const Category = require('./Category');
const Location = require('./Location');
const Tour = require('./Tour');
const TourLocation = require('./TourLocation');
const Blog = require('./Blog');
const Role = require('./Role');
const User = require('./User');

// Initialize all models
const models = {
  Category: Category.initModel(sequelize),
  Location: Location.initModel(sequelize),
  Tour: Tour.initModel(sequelize),
  TourLocation: TourLocation.initModel(sequelize),
  Blog: Blog.initModel(sequelize),
  Role: Role.initModel(sequelize),
  User: User.initModel(sequelize),
};

// Establish associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
