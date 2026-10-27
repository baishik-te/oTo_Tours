'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class Category extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        categoryCode: {
          type: DataTypes.STRING(100),
          field: 'category_code',
          allowNull: false,
          unique: true
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        badge: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Tour, {
      foreignKey: 'categoryId',
      as: 'tours',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

module.exports = Category;
