'use strict';

const crypto = require('crypto');

/**
 * Seeder: Seed initial Figma Event Types
 * Strictly based on Figma Design (nodes 666:902 & 802:165)
 */
module.exports = {
  async up(queryInterface) {
    const defaultFeatures = [
      'Up to 80+ Riders Accommodated',
      'Dedicated Event coordinator',
      'Flexible Scheduling to meet your needs',
      'Experienced and Fun Guides',
      'Custom tour routes designed for your group',
      'Safety First Approach'
    ];

    const eventTypes = [
      {
        id: crypto.randomUUID(),
        event_code: 'corporate-event',
        title: 'Corporate Event',
        slug: 'corporate-event',
        tagline: 'Team building and executive entertainment',
        description: 'Elevate team dynamics and impress clients with an immersive, guided city tour tailored for corporate retreats, milestones, and networking.',
        sub_offerings: JSON.stringify(['Team Building', 'Client Entertainment', 'Company Outing']),
        features: JSON.stringify(defaultFeatures),
        max_riders_capacity: 80,
        cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600',
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600'
        ]),
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: crypto.randomUUID(),
        event_code: 'school-groups',
        title: 'School Groups',
        slug: 'school-groups',
        tagline: 'Educational and fun city excursions',
        description: 'Safe, educational, and engaging outdoor group adventures designed for students, classes, summer camps, and educational field trips.',
        sub_offerings: JSON.stringify(['Educational City Tours', 'Students Activities', 'Field Trips']),
        features: JSON.stringify(defaultFeatures),
        max_riders_capacity: 80,
        cover_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600',
          'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600'
        ]),
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: crypto.randomUUID(),
        event_code: 'private-celebration',
        title: 'Private Celebration',
        slug: 'private-celebration',
        tagline: 'Memorable milestones with family & friends',
        description: 'Celebrate special milestones in style. Perfect for birthdays, bachelor/bachelorette parties, and family reunions craving fun and excitement.',
        sub_offerings: JSON.stringify(['Birth Days', 'Bachelor Parties', 'Family Reunions']),
        features: JSON.stringify(defaultFeatures),
        max_riders_capacity: 80,
        cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600',
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600'
        ]),
        display_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: crypto.randomUUID(),
        event_code: 'special-events',
        title: 'Special Events',
        slug: 'special-events',
        tagline: 'Customized large-scale group experiences',
        description: 'From city-wide conferences and festivals to fully customized bespoke routes, we design one-of-a-kind adventures tailored to your exact vision.',
        sub_offerings: JSON.stringify(['Conference', 'Festivals', 'Custom Experience']),
        features: JSON.stringify(defaultFeatures),
        max_riders_capacity: 80,
        cover_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600'
        ]),
        display_order: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('event_types', eventTypes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('event_types', null, {});
  }
};
