'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class EventInquiry extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        inquiryCode: {
          type: DataTypes.STRING(50),
          field: 'inquiry_code',
          allowNull: false,
          unique: true
        },
        eventTypeId: {
          type: DataTypes.UUID,
          field: 'event_type_id',
          allowNull: true
        },
        eventTypeName: {
          type: DataTypes.STRING(150),
          field: 'event_type_name',
          allowNull: false
        },
        contactName: {
          type: DataTypes.STRING(150),
          field: 'contact_name',
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
        organizationName: {
          type: DataTypes.STRING(150),
          field: 'organization_name',
          allowNull: true
        },
        estimatedRiders: {
          type: DataTypes.INTEGER,
          field: 'estimated_riders',
          allowNull: false,
          defaultValue: 1
        },
        preferredDate: {
          type: DataTypes.DATEONLY,
          field: 'preferred_date',
          allowNull: false
        },
        alternateDate: {
          type: DataTypes.DATEONLY,
          field: 'alternate_date',
          allowNull: true
        },
        preferredTimeSlot: {
          type: DataTypes.STRING(50),
          field: 'preferred_time_slot',
          allowNull: true
        },
        selectedHighlights: {
          type: DataTypes.JSONB,
          field: 'selected_highlights',
          allowNull: false,
          defaultValue: []
        },
        locationPreference: {
          type: DataTypes.STRING(150),
          field: 'location_preference',
          allowNull: true
        },
        specialRequests: {
          type: DataTypes.TEXT,
          field: 'special_requests',
          allowNull: true
        },
        status: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: 'pending' // pending, under_review, quoted, confirmed, completed, cancelled
        },
        quoteAmount: {
          type: DataTypes.DECIMAL(10, 2),
          field: 'quote_amount',
          allowNull: true
        },
        internalNotes: {
          type: DataTypes.TEXT,
          field: 'internal_notes',
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'EventInquiry',
        tableName: 'event_inquiries',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    if (models.EventType) {
      this.belongsTo(models.EventType, {
        foreignKey: 'eventTypeId',
        as: 'eventType',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }
}

module.exports = EventInquiry;
