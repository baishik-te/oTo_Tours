'use strict';

/**
 * Migration: Create Event Types and Event Inquiries tables
 * Strictly architected from Figma Design (nodes 666:902 & 802:165):
 * - 4 Event Types: Corporate Event, School Groups, Private Celebration, Special Events
 * - Sub-offerings / Highlights
 * - Capacity (Up to 80+ riders)
 * - Work Process / Steps
 * - Event Inquiries / Quote Requests
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create event_types table
    await queryInterface.createTable('event_types', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      event_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      tagline: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Array of sub-offerings (e.g., ["Team Building", "Client Entertainment", "Company Outing"])
      sub_offerings: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      // Highlights & features (e.g., ["Dedicated Event coordinator", "Custom tour routes", "Safety First Approach"])
      features: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      // Rider capacity accommodated (Figma: "Up to 80+ Riders Accommodated")
      max_riders_capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 80
      },
      cover_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      gallery_images: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Indexes for event_types
    await queryInterface.addIndex('event_types', ['event_code'], {
      name: 'idx_event_types_event_code',
      unique: true
    });
    await queryInterface.addIndex('event_types', ['slug'], {
      name: 'idx_event_types_slug',
      unique: true
    });
    await queryInterface.addIndex('event_types', ['is_active', 'display_order'], {
      name: 'idx_event_types_active_order'
    });

    // 2. Create event_inquiries table (Handles Figma "Request a Quote" / "Submit Inquiry")
    await queryInterface.createTable('event_inquiries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      inquiry_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      event_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'event_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      event_type_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      contact_name: {
        type: Sequelize.STRING(150),
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
      organization_name: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      estimated_riders: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      preferred_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      alternate_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      preferred_time_slot: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      selected_highlights: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      location_preference: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      special_requests: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'pending' // pending, under_review, quoted, confirmed, completed, cancelled
      },
      quote_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
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

    // Indexes for event_inquiries
    await queryInterface.addIndex('event_inquiries', ['inquiry_code'], {
      name: 'idx_event_inquiries_code',
      unique: true
    });
    await queryInterface.addIndex('event_inquiries', ['status'], {
      name: 'idx_event_inquiries_status'
    });
    await queryInterface.addIndex('event_inquiries', ['email'], {
      name: 'idx_event_inquiries_email'
    });
    await queryInterface.addIndex('event_inquiries', ['created_at'], {
      name: 'idx_event_inquiries_created_at'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('event_inquiries');
    await queryInterface.dropTable('event_types');
  }
};
