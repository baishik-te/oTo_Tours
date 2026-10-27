'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create contact_messages table (strictly based on Contact Us form)
    await queryInterface.createTable('contact_messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      reference_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'new' // new, in_progress, responded, archived
      },
      internal_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('contact_messages', ['reference_code'], { unique: true });
    await queryInterface.addIndex('contact_messages', ['status']);
    await queryInterface.addIndex('contact_messages', ['email']);
    await queryInterface.addIndex('contact_messages', ['created_at']);

    // 2. Create site_content table for About Us story & Contact Us configurable information
    await queryInterface.createTable('site_content', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      section_key: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('site_content', ['section_key'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('site_content');
    await queryInterface.dropTable('contact_messages');
  }
};
