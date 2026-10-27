'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');
const { sequelize } = require('../config/database');

class ContactMessage extends Model {}

ContactMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => crypto.randomUUID()
    },
    referenceCode: {
      type: DataTypes.STRING(50),
      field: 'reference_code',
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING(100),
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      field: 'last_name',
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'new'
    },
    internalNotes: {
      type: DataTypes.TEXT,
      field: 'internal_notes',
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'contact_messages',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

class SiteContent extends Model {}

SiteContent.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => crypto.randomUUID()
    },
    sectionKey: {
      type: DataTypes.STRING(50),
      field: 'section_key',
      allowNull: false,
      unique: true
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'SiteContent',
    tableName: 'site_content',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = {
  ContactMessage,
  SiteContent
};
