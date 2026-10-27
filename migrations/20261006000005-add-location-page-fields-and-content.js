'use strict';

const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Add fields to `locations` table if not present
      const [existingCols] = await queryInterface.sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'locations';`,
        { transaction }
      );
      const colNames = existingCols.map(c => c.column_name);

      if (!colNames.includes('description')) {
        await queryInterface.addColumn('locations', 'description', {
          type: Sequelize.TEXT,
          allowNull: true
        }, { transaction });
      }

      if (!colNames.includes('image_url')) {
        await queryInterface.addColumn('locations', 'image_url', {
          type: Sequelize.STRING(500),
          allowNull: true
        }, { transaction });
      }

      if (!colNames.includes('is_featured')) {
        await queryInterface.addColumn('locations', 'is_featured', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }, { transaction });
      }

      if (!colNames.includes('display_order')) {
        await queryInterface.addColumn('locations', 'display_order', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }, { transaction });
      }

      // 2. Seed the 4 Figma New England tour locations
      const figmaLocations = [
        {
          id: crypto.randomUUID(),
          location_code: 'boston-ma',
          name: 'Boston, MA',
          city: 'Boston',
          state: 'MA',
          country: 'USA',
          description: 'Historic sites, iconic landmarks, and waterfront views.',
          image_url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200',
          latitude: 42.3601,
          longitude: -71.0589,
          is_featured: true,
          display_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          location_code: 'providence-ri',
          name: 'Providence, RI',
          city: 'Providence',
          state: 'RI',
          country: 'USA',
          description: "Explore the capital city's rich history and vibrant culture.",
          image_url: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?q=80&w=1200',
          latitude: 41.8240,
          longitude: -71.4128,
          is_featured: true,
          display_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          location_code: 'newport-ri',
          name: 'Newport, RI',
          city: 'Newport',
          state: 'RI',
          country: 'USA',
          description: 'Coastal beauty, Gilded Age mansions, and scenic ocean views.',
          image_url: 'https://images.unsplash.com/photo-1569428034239-f9565e32e224?q=80&w=1200',
          latitude: 41.4901,
          longitude: -71.3128,
          is_featured: true,
          display_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          location_code: 'salem-ma',
          name: 'Salem, MA',
          city: 'Salem',
          state: 'MA',
          country: 'USA',
          description: 'Witch history, haunted tales, and charming New England streets.',
          image_url: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?q=80&w=1200',
          latitude: 42.5195,
          longitude: -70.8967,
          is_featured: true,
          display_order: 4,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      for (const loc of figmaLocations) {
        const [existing] = await queryInterface.sequelize.query(
          `SELECT id FROM locations WHERE location_code = :code;`,
          { replacements: { code: loc.location_code }, transaction }
        );

        if (existing.length === 0) {
          await queryInterface.bulkInsert('locations', [loc], { transaction });
        } else {
          await queryInterface.sequelize.query(
            `UPDATE locations SET 
               description = :description, 
               image_url = :image_url, 
               is_featured = :is_featured, 
               display_order = :display_order,
               latitude = :latitude,
               longitude = :longitude,
               city = :city,
               state = :state,
               updated_at = NOW()
             WHERE location_code = :code;`,
            {
              replacements: {
                description: loc.description,
                image_url: loc.image_url,
                is_featured: loc.is_featured,
                display_order: loc.display_order,
                latitude: loc.latitude,
                longitude: loc.longitude,
                city: loc.city,
                state: loc.state,
                code: loc.location_code
              },
              transaction
            }
          );
        }
      }

      // 3. Seed site_content row for 'locations_page'
      const locationsPageData = {
        hero: {
          badge: 'EXPLORE MORE',
          title: 'OUR TOUR LOCATION',
          subtitle: 'Discover amazing cities with OTO Tours. Our locations offer the perfect blend of history, culture and adventure on two wheels',
          heroImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
        },
        whyTheseLocations: {
          badge: 'WHY THESE LOCATIONS',
          title: 'EXPERIENCE THE BEST OF NEW ENGLAND',
          subtitle: 'Each city offers a unique adventure with unforgettable sights, rich history, and stories that come to life on our Segway tours.',
          features: [
            {
              id: 'expert-local-guides',
              title: 'Expert local guides',
              description: 'Passionate and knowledgeable storytellers leading every route.',
              icon: 'compass'
            },
            {
              id: 'curated-routes',
              title: 'Curated routes and hidden gems',
              description: 'Thoughtfully designed paths uncovering secret spots and historic vistas.',
              icon: 'route'
            },
            {
              id: 'all-skill-levels',
              title: 'Perfect for all skill levels',
              description: 'Comprehensive 1-on-1 rider training before every tour departure.',
              icon: 'gauge'
            },
            {
              id: 'memorable-experiences',
              title: 'Memorable experiences in every city',
              description: 'Fun, smooth, and unforgettable adventures for families, couples, and groups.',
              icon: 'smile'
            }
          ],
          mapIllustration: {
            region: 'New England',
            states: ['Massachusetts', 'Rhode Island', 'Connecticut', 'New Hampshire'],
            mapImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200',
            pinnedCities: [
              { name: 'Boston', state: 'MA', coordinates: { lat: 42.3601, lng: -71.0589 } },
              { name: 'Providence', state: 'RI', coordinates: { lat: 41.8240, lng: -71.4128 } },
              { name: 'Newport', state: 'RI', coordinates: { lat: 41.4901, lng: -71.3128 } },
              { name: 'Salem', state: 'MA', coordinates: { lat: 42.5195, lng: -70.8967 } }
            ]
          }
        },
        highlights: {
          badge: 'WHAT YOU WILL SEE',
          title: 'HIGH LIGHTS ACROSS OUR LOCATIONS',
          items: [
            {
              id: 'historic-landmarks',
              title: 'HISTORIC LANDMARKS',
              description: 'Historic landmarks walk through living history in every city.',
              icon: 'landmark'
            },
            {
              id: 'scenic-views',
              title: 'SCENIC VIEWS',
              description: 'From waterfronts to skyline views.',
              icon: 'camera'
            },
            {
              id: 'local-culture',
              title: 'LOCAL CULTURE',
              description: 'Discover local stories, art, and architecture.',
              icon: 'theater'
            },
            {
              id: 'hidden-gems',
              title: 'HIDDEN GEMS',
              description: 'Explore off-the-beaten-path stops.',
              icon: 'map-pin'
            }
          ]
        },
        ctaBanner: {
          title: 'READY TO EXPLORE',
          subtitle: 'Choose your location and book your unforgettable adventure today.',
          buttonText: 'BOOK YOUR TOUR',
          buttonLink: '/tours',
          bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600'
        }
      };

      const [existingContent] = await queryInterface.sequelize.query(
        `SELECT id FROM site_content WHERE section_key = 'locations_page';`,
        { transaction }
      );

      if (existingContent.length === 0) {
        await queryInterface.bulkInsert('site_content', [{
          id: crypto.randomUUID(),
          section_key: 'locations_page',
          data: JSON.stringify(locationsPageData),
          created_at: new Date(),
          updated_at: new Date()
        }], { transaction });
      } else {
        await queryInterface.sequelize.query(
          `UPDATE site_content SET data = :data, updated_at = NOW() WHERE section_key = 'locations_page';`,
          {
            replacements: { data: JSON.stringify(locationsPageData) },
            transaction
          }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM site_content WHERE section_key = 'locations_page';`
    );
    await queryInterface.removeColumn('locations', 'display_order').catch(() => {});
    await queryInterface.removeColumn('locations', 'is_featured').catch(() => {});
    await queryInterface.removeColumn('locations', 'image_url').catch(() => {});
    await queryInterface.removeColumn('locations', 'description').catch(() => {});
  }
};
