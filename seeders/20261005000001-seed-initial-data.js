'use strict';

const crypto = require('crypto');
const { toursData, categoriesData, locationsData } = require('./data/toursData');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Clear existing seed data in reverse dependency order
    await queryInterface.bulkDelete('tour_locations', null, {});
    await queryInterface.bulkDelete('tours', null, {});
    await queryInterface.bulkDelete('locations', null, {});
    await queryInterface.bulkDelete('categories', null, {});

    // Maps to preserve relational integrity with UUIDs
    const categoryUUIDMap = {};
    const locationUUIDMap = {};
    const tourUUIDMap = {};

    // 1. Seed categories
    const categoriesToInsert = categoriesData.map(c => {
      const uuid = crypto.randomUUID();
      categoryUUIDMap[c.id] = uuid;
      return {
        id: uuid,
        category_code: c.id,
        name: c.name,
        badge: c.badge || c.name,
        description: c.description || null,
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    await queryInterface.bulkInsert('categories', categoriesToInsert, {});

    // 2. Seed canonical locations
    const locationsToInsert = locationsData.map(l => {
      const uuid = crypto.randomUUID();
      locationUUIDMap[l.id] = uuid;
      return {
        id: uuid,
        location_code: l.id,
        name: l.name,
        city: l.city || null,
        state: l.state || null,
        country: l.country || 'USA',
        latitude: l.latitude || null,
        longitude: l.longitude || null,
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    await queryInterface.bulkInsert('locations', locationsToInsert, {});

    // 3. Seed tours
    const toursToInsert = toursData.map(t => {
      const uuid = crypto.randomUUID();
      tourUUIDMap[t.id] = uuid;
      return {
        id: uuid,
        tour_code: t.id,
        slug: t.slug,
        title: t.title,
        category_id: categoryUUIDMap[t.categoryId] || null,
        badge: t.badge,
        duration: t.duration,
        duration_minutes: t.durationMinutes || 0,
        is_signature: t.isSignature !== undefined ? t.isSignature : true,
        short_description: t.shortDescription,
        pricing: JSON.stringify(t.pricing),
        hero_section: JSON.stringify(t.heroSection),
        overview: JSON.stringify(t.overview),
        key_features: JSON.stringify(t.keyFeatures || []),
        highlights: JSON.stringify(t.highlights || []),
        included: JSON.stringify(t.included || []),
        sidebar_image: t.sidebarImage || t.imageUrl,
        image_url: t.imageUrl,
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    await queryInterface.bulkInsert('tours', toursToInsert, {});

    // 4. Seed tour_locations junction rows
    const tourLocationsToInsert = [];
    for (const t of toursData) {
      const tourId = tourUUIDMap[t.id];
      if (t.locations && Array.isArray(t.locations)) {
        for (const locItem of t.locations) {
          const locationId = locationUUIDMap[locItem.locationCode];
          if (tourId && locationId) {
            tourLocationsToInsert.push({
              id: crypto.randomUUID(),
              tour_id: tourId,
              location_id: locationId,
              sequence: locItem.sequence || 1,
              is_primary: locItem.isPrimary !== undefined ? locItem.isPrimary : false,
              created_at: new Date(),
              updated_at: new Date()
            });
          }
        }
      }
    }

    if (tourLocationsToInsert.length > 0) {
      await queryInterface.bulkInsert('tour_locations', tourLocationsToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tour_locations', null, {});
    await queryInterface.bulkDelete('tours', null, {});
    await queryInterface.bulkDelete('locations', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};
