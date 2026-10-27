'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class TourLocation extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        tourId: {
          type: DataTypes.UUID,
          field: 'tour_id',
          allowNull: false,
          references: {
            model: 'tours',
            key: 'id'
          }
        },
        locationId: {
          type: DataTypes.UUID,
          field: 'location_id',
          allowNull: false,
          references: {
            model: 'locations',
            key: 'id'
          }
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        isPrimary: {
          type: DataTypes.BOOLEAN,
          field: 'is_primary',
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        modelName: 'TourLocation',
        tableName: 'tour_locations',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Tour, {
      foreignKey: 'tourId',
      as: 'tour',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    this.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

module.exports = TourLocation;
