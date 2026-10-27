'use strict';

const crypto = require('crypto');
const { Op } = require('sequelize');
const { EventType, EventInquiry } = require('../models/eventsDb');

/**
 * Helper: Generate URL-friendly slug
 */
function generateSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Helper: Generate unique Inquiry Reference Code (e.g., EVT-2026-A1B2C)
 */
function generateInquiryCode() {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `EVT-${year}-${randomPart}`;
}

/**
 * Event Service Layer
 * Fully strictly architected based on Figma design (nodes 666:902 & 802:165)
 */
class EventService {
  // ==========================================
  // PUBLIC EVENT METHODS
  // ==========================================

  /**
   * Get all active event types with their sub-offerings, features, and image assets
   */
  async getEventTypes(query = {}) {
    const where = {};
    if (query.active !== undefined) {
      where.isActive = query.active === 'true' || query.active === true;
    } else {
      where.isActive = true;
    }

    const eventTypes = await EventType.findAll({
      where,
      order: [['display_order', 'ASC'], ['created_at', 'ASC']]
    });

    return {
      count: eventTypes.length,
      data: eventTypes.map(item => this._formatEventTypeResponse(item))
    };
  }

  /**
   * Get complete details of a single event type by UUID, eventCode, or slug
   */
  async getEventTypeDetails(identifier) {
    if (!identifier) {
      const error = new Error('Event identifier is required');
      error.statusCode = 400;
      throw error;
    }

    const eventType = await this._findEventTypeByIdentifier(identifier);
    if (!eventType) {
      const error = new Error(`Event type '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return this._formatEventTypeResponse(eventType);
  }

  /**
   * Get Figma Landing Page Structure, Process Workflow, and Value Pillars
   */
  async getEventPageMeta() {
    return {
      hero: {
        badge: 'Events',
        title: 'Private Events & Group Experience',
        tagline: 'We create unforgettable private events and group experiences that bring people closer through fun, exploration, and connection. From seamless planning to expert guidance, every detail is designed to make your event extraordinary.',
        actions: [
          { label: 'Request a Quote', action: 'open_inquiry_form' },
          { label: 'Contact Us', action: 'navigate_contact' }
        ]
      },
      whyChooseUs: {
        sectionTitle: 'Why Choose us',
        headline: 'Experience that brings people together',
        description: 'We create unforgettable private events and group experiences that bring people closer through fun, exploration, and connection. From seamless planning to expert guidance, every detail is designed to make your event extraordinary.',
        pillars: [
          {
            key: 'capacity',
            title: 'Up to 80+ Riders Accommodated',
            detail: 'Flexible fleet size capable of handling large corporate teams and gatherings.'
          },
          {
            key: 'coordinator',
            title: 'Dedicated Event coordinator',
            detail: 'Single point of contact assisting you from inquiry to event completion.'
          },
          {
            key: 'scheduling',
            title: 'Flexible Scheduling to meet your needs',
            detail: 'Custom departure times and tailored durations to suit your agenda.'
          },
          {
            key: 'guides',
            title: 'Experienced and Fun Guides',
            detail: 'Engaging, certified local leaders providing historical insights and entertainment.'
          },
          {
            key: 'custom_routes',
            title: 'Custom tour routes designed for your group',
            detail: 'Bespoke paths visiting your chosen landmarks and stopovers.'
          },
          {
            key: 'safety',
            title: 'Safety First Approach',
            detail: 'Complete orientation, top-tier safety gear, and vigilant support staff.'
          }
        ]
      },
      workProcess: {
        sectionTitle: 'How it Works',
        category: 'Work Process',
        headline: 'Simple steps to create unforgettable Experience Together',
        banner: 'We handle the details. you enjoy the moment!',
        steps: [
          {
            stepNumber: 1,
            title: 'Submit Inquiry',
            description: 'Tell us about your group & event needs'
          },
          {
            stepNumber: 2,
            title: 'Discuss Requirements',
            description: 'We will connect to understand your goals and preference'
          },
          {
            stepNumber: 3,
            title: 'Customize Tour',
            description: 'We create the perfect experience for your group'
          },
          {
            stepNumber: 4,
            title: 'Confirm Booking',
            description: 'Review and confirm all the details'
          },
          {
            stepNumber: 5,
            title: 'Enjoy Your Events',
            description: 'Show up, have fun and make memories'
          }
        ]
      },
      callToAction: {
        headline: 'Ready to Plan Your Events',
        subheadline: 'Let’s Create an Unforgettable Experience Together',
        buttons: ['Request a Quote', 'Contact Us']
      }
    };
  }

  /**
   * Get Event Photo Gallery (Powers Figma "View More Photos" grid)
   */
  async getEventGallery(query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = query.limit !== undefined ? Math.max(1, parseInt(query.limit, 10)) : 12;

    const eventTypes = await EventType.findAll({
      where: { isActive: true },
      attributes: ['id', 'title', 'eventCode', 'coverImage', 'galleryImages'],
      order: [['displayOrder', 'ASC']]
    });

    const photos = [];
    eventTypes.forEach(event => {
      if (event.coverImage) {
        photos.push({
          url: event.coverImage,
          caption: `${event.title} - Highlight`,
          eventCode: event.eventCode,
          eventTitle: event.title
        });
      }
      if (Array.isArray(event.galleryImages)) {
        event.galleryImages.forEach((imgUrl, idx) => {
          photos.push({
            url: imgUrl,
            caption: `${event.title} - Experience ${idx + 1}`,
            eventCode: event.eventCode,
            eventTitle: event.title
          });
        });
      }
    });

    const total = photos.length;
    const paginated = photos.slice((page - 1) * limit, page * limit);

    return {
      photos: paginated,
      meta: {
        total,
        count: paginated.length,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  /**
   * Submit an Event Inquiry / Quote Request (Figma "Request a Quote" / "Submit Inquiry")
   */
  async submitInquiry(payload) {
    let eventType = null;
    let eventTypeName = payload.eventTypeName || 'Custom Event';

    if (payload.eventTypeId || payload.eventCode) {
      eventType = await this._findEventTypeByIdentifier(payload.eventTypeId || payload.eventCode);
      if (eventType) {
        eventTypeName = eventType.title;
      }
    }

    const inquiryCode = generateInquiryCode();

    const newInquiry = await EventInquiry.create({
      id: crypto.randomUUID(),
      inquiryCode,
      eventTypeId: eventType ? eventType.id : null,
      eventTypeName,
      contactName: payload.contactName.trim(),
      email: payload.email.toLowerCase().trim(),
      phone: payload.phone.trim(),
      organizationName: payload.organizationName ? payload.organizationName.trim() : null,
      estimatedRiders: Math.max(1, parseInt(payload.estimatedRiders || '1', 10)),
      preferredDate: payload.preferredDate,
      alternateDate: payload.alternateDate || null,
      preferredTimeSlot: payload.preferredTimeSlot || null,
      selectedHighlights: Array.isArray(payload.selectedHighlights) ? payload.selectedHighlights : [],
      locationPreference: payload.locationPreference || null,
      specialRequests: payload.specialRequests || null,
      status: 'pending'
    });

    return {
      inquiryCode: newInquiry.inquiryCode,
      contactName: newInquiry.contactName,
      eventTypeName: newInquiry.eventTypeName,
      estimatedRiders: newInquiry.estimatedRiders,
      preferredDate: newInquiry.preferredDate,
      status: newInquiry.status,
      message: 'Inquiry received successfully. Our dedicated event coordinator will connect with you shortly.'
    };
  }

  /**
   * Customer Quote/Inquiry Status Lookup
   */
  async getInquiryStatus(inquiryCode, email) {
    if (!inquiryCode || !email) {
      const error = new Error('Both inquiry code and email are required to check status');
      error.statusCode = 400;
      throw error;
    }

    const inquiry = await EventInquiry.findOne({
      where: {
        inquiryCode: inquiryCode.trim().toUpperCase(),
        email: email.trim().toLowerCase()
      },
      include: [
        {
          model: EventType,
          as: 'eventType',
          attributes: ['id', 'title', 'slug', 'coverImage']
        }
      ]
    });

    if (!inquiry) {
      const error = new Error(`Inquiry '${inquiryCode}' not found with the provided email`);
      error.statusCode = 404;
      throw error;
    }

    return {
      inquiryCode: inquiry.inquiryCode,
      status: inquiry.status,
      eventTypeName: inquiry.eventTypeName,
      contactName: inquiry.contactName,
      estimatedRiders: inquiry.estimatedRiders,
      preferredDate: inquiry.preferredDate,
      quoteAmount: inquiry.quoteAmount,
      createdAt: inquiry.createdAt
    };
  }

  // ==========================================
  // ADMIN EVENT MANAGEMENT METHODS
  // ==========================================

  /**
   * Admin: Get all event types including inactive
   */
  async getAdminEventTypes() {
    const eventTypes = await EventType.findAll({
      order: [['display_order', 'ASC'], ['created_at', 'DESC']]
    });

    return eventTypes.map(t => this._formatEventTypeResponse(t));
  }

  /**
   * Admin: Create a new event type
   */
  async createEventType(payload) {
    const title = payload.title ? payload.title.trim() : '';
    const slug = payload.slug ? generateSlug(payload.slug) : generateSlug(title);
    const eventCode = payload.eventCode ? payload.eventCode.toLowerCase().trim() : slug;

    const existing = await EventType.findOne({
      where: {
        [Op.or]: [{ eventCode }, { slug }]
      }
    });

    if (existing) {
      const error = new Error(`Event type with code '${eventCode}' or slug '${slug}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    const newEvent = await EventType.create({
      id: crypto.randomUUID(),
      eventCode,
      title,
      slug,
      tagline: payload.tagline || '',
      description: payload.description || '',
      subOfferings: Array.isArray(payload.subOfferings) ? payload.subOfferings : [],
      features: Array.isArray(payload.features) ? payload.features : [],
      maxRidersCapacity: payload.maxRidersCapacity ? parseInt(payload.maxRidersCapacity, 10) : 80,
      coverImage: payload.coverImage || null,
      galleryImages: Array.isArray(payload.galleryImages) ? payload.galleryImages : [],
      displayOrder: payload.displayOrder !== undefined ? parseInt(payload.displayOrder, 10) : 0,
      isActive: payload.isActive !== undefined ? payload.isActive : true
    });

    return this._formatEventTypeResponse(newEvent);
  }

  /**
   * Admin: Update an event type
   */
  async updateEventType(id, payload) {
    const eventType = await this._findEventTypeByIdentifier(id);
    if (!eventType) {
      const error = new Error(`Event type '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const updateFields = {};
    if (payload.title !== undefined) updateFields.title = payload.title.trim();
    if (payload.tagline !== undefined) updateFields.tagline = payload.tagline.trim();
    if (payload.description !== undefined) updateFields.description = payload.description;
    if (payload.subOfferings !== undefined) updateFields.subOfferings = payload.subOfferings;
    if (payload.features !== undefined) updateFields.features = payload.features;
    if (payload.maxRidersCapacity !== undefined) updateFields.maxRidersCapacity = parseInt(payload.maxRidersCapacity, 10);
    if (payload.coverImage !== undefined) updateFields.coverImage = payload.coverImage;
    if (payload.galleryImages !== undefined) updateFields.galleryImages = payload.galleryImages;
    if (payload.displayOrder !== undefined) updateFields.displayOrder = parseInt(payload.displayOrder, 10);
    if (payload.isActive !== undefined) updateFields.isActive = payload.isActive;

    await eventType.update(updateFields);
    return this._formatEventTypeResponse(eventType);
  }

  /**
   * Admin: Delete an event type
   */
  async deleteEventType(id) {
    const eventType = await this._findEventTypeByIdentifier(id);
    if (!eventType) {
      const error = new Error(`Event type '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    await eventType.destroy();
    return { id: eventType.id, title: eventType.title, message: 'Event type deleted successfully' };
  }

  /**
   * Admin: Get all inquiries with filtering and pagination
   */
  async getAdminInquiries(query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = query.limit !== undefined ? Math.max(1, parseInt(query.limit, 10)) : 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (query.status) {
      where.status = query.status.trim();
    }
    if (query.eventTypeId) {
      where.eventTypeId = query.eventTypeId.trim();
    }
    if (query.search) {
      const searchTerm = `%${query.search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { contactName: { [Op.iLike]: searchTerm } },
        { email: { [Op.iLike]: searchTerm } },
        { organizationName: { [Op.iLike]: searchTerm } },
        { inquiryCode: { [Op.iLike]: searchTerm } }
      ];
    }

    const { count: total, rows: inquiries } = await EventInquiry.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: EventType,
          as: 'eventType',
          attributes: ['id', 'title', 'eventCode', 'slug']
        }
      ]
    });

    return {
      inquiries,
      meta: {
        total,
        count: inquiries.length,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  /**
   * Admin: Get single inquiry by ID or code
   */
  async getInquiryById(idOrCode) {
    const clean = String(idOrCode).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

    const where = isUUID ? { id: clean } : { inquiryCode: clean.toUpperCase() };

    const inquiry = await EventInquiry.findOne({
      where,
      include: [
        {
          model: EventType,
          as: 'eventType'
        }
      ]
    });

    if (!inquiry) {
      const error = new Error(`Inquiry '${idOrCode}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return inquiry;
  }

  /**
   * Admin: Update inquiry status and quote details
   */
  async updateInquiryStatus(id, updateData) {
    const inquiry = await this.getInquiryById(id);

    const allowedStatuses = ['pending', 'under_review', 'quoted', 'confirmed', 'completed', 'cancelled'];
    if (updateData.status && !allowedStatuses.includes(updateData.status)) {
      const error = new Error(`Invalid status '${updateData.status}'. Allowed: ${allowedStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const fields = {};
    if (updateData.status) fields.status = updateData.status;
    if (updateData.quoteAmount !== undefined) fields.quoteAmount = updateData.quoteAmount;
    if (updateData.internalNotes !== undefined) fields.internalNotes = updateData.internalNotes;

    await inquiry.update(fields);
    return inquiry;
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  async _findEventTypeByIdentifier(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    if (isUUID) {
      const event = await EventType.findByPk(cleanId);
      if (event) return event;
    }

    const lower = cleanId.toLowerCase();
    return EventType.findOne({
      where: {
        [Op.or]: [
          { eventCode: lower },
          { slug: lower }
        ]
      }
    });
  }

  _formatEventTypeResponse(item) {
    const plain = item.toJSON ? item.toJSON() : item;
    return {
      id: plain.id,
      eventCode: plain.eventCode,
      title: plain.title,
      slug: plain.slug,
      tagline: plain.tagline,
      description: plain.description,
      subOfferings: plain.subOfferings || [],
      features: plain.features || [],
      maxRidersCapacity: plain.maxRidersCapacity || 80,
      coverImage: plain.coverImage,
      galleryImages: plain.galleryImages || [],
      displayOrder: plain.displayOrder,
      isActive: plain.isActive,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }
}

module.exports = new EventService();
