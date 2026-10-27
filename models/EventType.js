'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class EventType extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        eventCode: {
          type: DataTypes.STRING(50),
          field: 'event_code',
          allowNull: false,
          unique: true
        },
        title: {
          type: DataTypes.STRING(150),
          allowNull: false
        },
        slug: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true
        },
        tagline: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        subOfferings: {
          type: DataTypes.JSONB,
          field: 'sub_offerings',
          allowNull: false,
          defaultValue: []
        },
        features: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: []
        },
        maxRidersCapacity: {
          type: DataTypes.INTEGER,
          field: 'max_riders_capacity',
          allowNull: false,
          defaultValue: 80
        },
        coverImage: {
          type: DataTypes.TEXT,
          field: 'cover_image',
          allowNull: true
        },
        galleryImages: {
          type: DataTypes.JSONB,
          field: 'gallery_images',
          allowNull: false,
          defaultValue: []
        },
        displayOrder: {
          type: DataTypes.INTEGER,
          field: 'display_order',
          allowNull: false,
          defaultValue: 0
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          field: 'is_active',
          allowNull: false,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'EventType',
        tableName: 'event_types',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    if (models.EventInquiry) {
      this.hasMany(models.EventInquiry, {
        foreignKey: 'eventTypeId',
        as: 'inquiries',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
}

module.exports = EventType;
