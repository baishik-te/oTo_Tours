'use strict';

const crypto = require('crypto');

module.exports = {
  async up(queryInterface) {
    const contactInfo = {
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

    const aboutStory = {
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

    const rows = [
      {
        id: crypto.randomUUID(),
        section_key: 'contact_info',
        data: JSON.stringify(contactInfo),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: crypto.randomUUID(),
        section_key: 'about_story',
        data: JSON.stringify(aboutStory),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('site_content', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('site_content', null, {});
  }
};
