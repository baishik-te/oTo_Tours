'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class Tour extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        tourCode: {
          type: DataTypes.STRING(100),
          field: 'tour_code',
          allowNull: false,
          unique: true
        },
        slug: {
          type: DataTypes.STRING(255),
          unique: true,
          allowNull: false
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        categoryId: {
          type: DataTypes.UUID,
          field: 'category_id',
          allowNull: false,
          references: {
            model: 'categories',
            key: 'id'
          }
        },
        badge: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        duration: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        durationMinutes: {
          type: DataTypes.INTEGER,
          field: 'duration_minutes',
          allowNull: true,
          defaultValue: 0
        },
        isSignature: {
          type: DataTypes.BOOLEAN,
          field: 'is_signature',
          allowNull: false,
          defaultValue: true
        },
        shortDescription: {
          type: DataTypes.TEXT,
          field: 'short_description',
          allowNull: true
        },
        pricing: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        heroSection: {
          type: DataTypes.JSONB,
          field: 'hero_section',
          allowNull: true
        },
        overview: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        keyFeatures: {
          type: DataTypes.JSONB,
          field: 'key_features',
          allowNull: true
        },
        highlights: {
          type: DataTypes.JSONB,
          field: 'highlights',
          allowNull: true
        },
        included: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        sidebarImage: {
          type: DataTypes.TEXT,
          field: 'sidebar_image',
          allowNull: true
        },
        imageUrl: {
          type: DataTypes.TEXT,
          field: 'image_url',
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Tour',
        tableName: 'tours',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'categoryDetails',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    this.belongsToMany(models.Location, {
      through: models.TourLocation,
      foreignKey: 'tourId',
      otherKey: 'locationId',
      as: 'locations',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    this.hasMany(models.TourLocation, {
      foreignKey: 'tourId',
      as: 'tourLocations',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

module.exports = Tour;
