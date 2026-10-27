'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class Location extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        locationCode: {
          type: DataTypes.STRING(100),
          field: 'location_code',
          allowNull: false,
          unique: true
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        city: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        state: {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        country: {
          type: DataTypes.STRING(100),
          allowNull: true,
          defaultValue: 'USA'
        },
        latitude: {
          type: DataTypes.DECIMAL(10, 7),
          allowNull: true
        },
        longitude: {
          type: DataTypes.DECIMAL(10, 7),
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        imageUrl: {
          type: DataTypes.STRING(500),
          field: 'image_url',
          allowNull: true
        },
        isFeatured: {
          type: DataTypes.BOOLEAN,
          field: 'is_featured',
          allowNull: false,
          defaultValue: true
        },
        displayOrder: {
          type: DataTypes.INTEGER,
          field: 'display_order',
          allowNull: false,
          defaultValue: 0
        }
      },
      {
        sequelize,
        modelName: 'Location',
        tableName: 'locations',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Tour, {
      through: models.TourLocation,
      foreignKey: 'locationId',
      otherKey: 'tourId',
      as: 'tours',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    this.hasMany(models.TourLocation, {
      foreignKey: 'locationId',
      as: 'tourLocations',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

module.exports = Location;
