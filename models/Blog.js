'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class Blog extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        slug: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        excerpt: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        imageUrl: {
          type: DataTypes.STRING(500),
          field: 'image_url',
          allowNull: true
        },
        category: {
          type: DataTypes.STRING(100),
          allowNull: true,
          defaultValue: 'Insights'
        },
        author: {
          type: DataTypes.STRING(100),
          allowNull: true,
          defaultValue: 'OTO Tours'
        },
        readTime: {
          type: DataTypes.STRING(50),
          field: 'read_time',
          allowNull: true,
          defaultValue: '5 min read'
        },
        publishedAt: {
          type: DataTypes.DATE,
          field: 'published_at',
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        isPublished: {
          type: DataTypes.BOOLEAN,
          field: 'is_published',
          allowNull: false,
          defaultValue: true
        },
        isHidden: {
          type: DataTypes.BOOLEAN,
          field: 'is_hidden',
          allowNull: false,
          defaultValue: false
        },
        displayOrder: {
          type: DataTypes.INTEGER,
          field: 'display_order',
          allowNull: false,
          defaultValue: 0
        },
        viewsCount: {
          type: DataTypes.INTEGER,
          field: 'views_count',
          allowNull: false,
          defaultValue: 0
        },
        tags: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: []
        }
      },
      {
        sequelize,
        modelName: 'Blog',
        tableName: 'blogs',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    // Associations if any in the future
  }
}

module.exports = Blog;
