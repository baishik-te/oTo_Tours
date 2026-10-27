'use strict';

const crypto = require('crypto');
const { Op } = require('sequelize');
const { ContactMessage, SiteContent } = require('../models/contentDb');

function generateMessageRef() {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `MSG-${year}-${rand}`;
}

class ContentService {
  async getContactInfo() {
    const row = await SiteContent.findOne({ where: { sectionKey: 'contact_info' } });
    if (row && row.data) return row.data;

    return {
      hero: {
        badge: 'CONTACT',
        title: 'CONTACT US',
        heroImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
      },
      getInTouch: {
        title: 'GET IN TOUCH',
        subtitle: 'Have questions or Need assistance? Reach out to our team - We are happy to help',
        email: 'michelle.rivera@example.com',
        phone: '(319) 555-0115',
        address: '3517 W. Gray St. Utica, Pennsylvania 57867',
        businessHours: 'Open 24 Hours'
      },
      formSubjects: [
        'General Inquiry',
        'Tour Booking & Reservation',
        'Private Events & Group Tours',
        'Partnerships & Media',
        'Customer Feedback'
      ],
      mapLocation: {
        locationName: 'OTO Tours',
        address: '3517 W. Gray St. Utica, Pennsylvania 57867',
        city: 'Utica',
        state: 'Pennsylvania',
        postalCode: '57867',
        latitude: 40.6300,
        longitude: -73.9700
      }
    };
  }

  async submitContactMessage(payload) {
    const referenceCode = generateMessageRef();

    const record = await ContactMessage.create({
      id: crypto.randomUUID(),
      referenceCode,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.toLowerCase().trim(),
      phone: payload.phone.trim(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      status: 'new'
    });

    return {
      referenceCode: record.referenceCode,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      subject: record.subject,
      status: record.status,
      message: 'Your message has been sent successfully. Our team will contact you shortly.'
    };
  }

  async getAboutContent() {
    const row = await SiteContent.findOne({ where: { sectionKey: 'about_story' } });
    if (row && row.data) return row.data;

    return {
      hero: {
        badge: 'ABOUT US',
        title: 'OUR STORY',
        heroImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
      },
      story: {
        headline: 'LOCAL ROOTS. UNFORGETTABLE EXPERIENCES.',
        paragraphs: [
          'OTO Tours was founded with a simple idea: combine the thrill of riding a Segway with the power of storytelling.',
          'What started as a small team of passionate locals has grown into one of the most trusted names in guided city tours.',
          'We take pride in showcasing the real stories, hidden gems, and iconic landmarks that make each city unique.'
        ],
        cta: {
          label: 'MEET OUR TEAM',
          action: 'view_team'
        },
        storefrontImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
        teamPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600'
      }
    };
  }


  // --- Admin Methods ---
  async getAdminContactMessages(query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = query.limit !== undefined ? Math.max(1, parseInt(query.limit, 10)) : 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (query.status) {
      where.status = query.status.trim();
    }
    if (query.search) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { firstName: { [Op.iLike]: term } },
        { lastName: { [Op.iLike]: term } },
        { email: { [Op.iLike]: term } },
        { subject: { [Op.iLike]: term } },
        { referenceCode: { [Op.iLike]: term } }
      ];
    }

    const { count: total, rows: messages } = await ContactMessage.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      messages,
      meta: {
        total,
        count: messages.length,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  async getAdminContactMessageById(idOrRef) {
    const clean = String(idOrRef).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
    const where = isUUID ? { id: clean } : { referenceCode: clean.toUpperCase() };

    const message = await ContactMessage.findOne({ where });
    if (!message) {
      const err = new Error(`Contact message '${idOrRef}' not found`);
      err.statusCode = 404;
      throw err;
    }
    return message;
  }

  async updateContactMessageStatus(id, updateData) {
    const message = await this.getAdminContactMessageById(id);
    const allowed = ['new', 'in_progress', 'responded', 'archived'];

    if (updateData.status && !allowed.includes(updateData.status)) {
      const err = new Error(`Invalid status '${updateData.status}'. Allowed: ${allowed.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const fields = {};
    if (updateData.status) fields.status = updateData.status;
    if (updateData.internalNotes !== undefined) fields.internalNotes = updateData.internalNotes;

    await message.update(fields);
    return message;
  }

  async updateContactInfo(data) {
    const [row] = await SiteContent.findOrCreate({
      where: { sectionKey: 'contact_info' },
      defaults: { id: crypto.randomUUID(), sectionKey: 'contact_info', data }
    });
    await row.update({ data });
    return row.data;
  }

  async updateAboutContent(data) {
    const [row] = await SiteContent.findOrCreate({
      where: { sectionKey: 'about_story' },
      defaults: { id: crypto.randomUUID(), sectionKey: 'about_story', data }
    });
    await row.update({ data });
  }
}

module.exports = new ContentService();
