'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tours', {
      id: {
        type: Sequelize.STRING(100),
        primaryKey: true,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      category_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      category_tag: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      badge: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      is_signature: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      short_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pricing: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      hero_section: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      overview: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      key_features: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      highlights: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      included: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      sidebar_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Indexes
    await queryInterface.addIndex('tours', ['slug'], { name: 'idx_tours_slug' });
    await queryInterface.addIndex('tours', ['category_id'], { name: 'idx_tours_category_id' });
    await queryInterface.addIndex('tours', ['is_signature'], { name: 'idx_tours_is_signature' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tours');
  }
};
