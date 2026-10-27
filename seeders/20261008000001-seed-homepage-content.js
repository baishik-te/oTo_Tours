'use strict';

const crypto = require('crypto');

module.exports = {
  async up(queryInterface) {
    const sections = [
      {
        sectionKey: 'homepage_hero',
        data: {
          badge: 'RATED #1 CITY TOUR EXPERIENCE',
          headline: 'RIDE THE FUTURE, EXPERIENCE THE CITY',
          subheadline: 'Guided Segway & electric fleet adventures giving you unmatched access to city skyline and waterfront views.',
          ctaPrimary: { label: 'Book Tours', url: '/tours' },
          ctaSecondary: { label: 'Explore Fleet', url: '#fleet' },
          backgroundUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
        }
      },
      {
        sectionKey: 'homepage_quote',
        data: {
          quote: 'The perfect way to learn an incredible city afternoon',
          author: 'MICHELLE R.',
          designation: 'Verified Rider, Chicago Riverfront Tour',
          rating: 5.0
        }
      },
      {
        sectionKey: 'homepage_stats',
        data: {
          title: 'SAFETY FIRST. EXPERIENCE ALWAYS.',
          description: 'Every tour starts with a one-on-one orientation and hands-on practice session. We provide top-of-the-line helmets and certified safety equipment.',
          metrics: [
            { value: '50k+', label: 'Happy Riders', key: 'riders' },
            { value: '100+', label: 'Expert Certified Guides', key: 'guides' },
            { value: '100%', label: 'Safety Record', key: 'safety' },
            { value: '4.9/5', label: 'Average Customer Rating', key: 'rating' }
          ]
        }
      },
      {
        sectionKey: 'homepage_story',
        data: {
          badge: 'SINCE 2003',
          title: '23 YEARS OF CREATING UNFORGETTABLE EXPERIENCES',
          description: "Since 2003, OTO Tours has guided travelers, locals, and corporate teams through America's most dynamic streets and historical landmarks.",
          cta: { label: 'Learn More', url: '/about' },
          teamImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600',
          foundedYear: 2003
        }
      },
      {
        sectionKey: 'homepage_usa_craft',
        data: {
          badge: 'MADE IN USA',
          title: 'DESIGNED, ENGINEERED & BUILT IN THE USA',
          description: 'Our vehicles are custom engineered for maximum rider comfort, intuitive balance, and zero emissions in urban environments.',
          imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200'
        }
      },
      {
        sectionKey: 'homepage_gear',
        data: {
          title: 'GEAR UP FOR YOUR ADVENTURE',
          subtitle: 'Official OTO Tours merchandise, travel essentials, and safety apparel.',
          cta: { label: 'Shop All Gear', url: '/shop' },
          products: [
            {
              id: 'gear-1',
              name: 'OTO Classic Tour Tee',
              price: 25.00,
              currency: 'USD',
              currencySymbol: '$',
              imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
              category: 'Apparel'
            },
            {
              id: 'gear-2',
              name: 'Adventure Canvas Tote',
              price: 15.00,
              currency: 'USD',
              currencySymbol: '$',
              imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600',
              category: 'Accessories'
            },
            {
              id: 'gear-3',
              name: 'Insulated Thermal Water Bottle',
              price: 20.00,
              currency: 'USD',
              currencySymbol: '$',
              imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600',
              category: 'Drinkware'
            }
          ]
        }
      },
      {
        sectionKey: 'homepage_license_program',
        data: {
          badge: 'CERTIFIED RIDER',
          title: "WHY DRIVER'S LICENSE PROGRAM",
          description: 'Complete our quick 15-minute training during any guided tour to earn your official OTO Tours Certified Rider License. Unlock discounted rentals and self-guided exploration across all our locations.',
          cta: { label: 'Learn More', url: '/programs/license' },
          imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200'
        }
      },
      {
        sectionKey: 'homepage_vehicle_specs',
        data: {
          title: 'INSIDE THE OTO TOURS SEGWAY',
          subtitle: 'Aerospace-grade gyroscopic stability and dual-redundant safety engineering.',
          vehicleModel: 'Segway i2 SE Urban Transporter',
          vehicleImageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200',
          hotspots: [
            {
              id: 'hotspot-1',
              title: 'Smart LeanSteer™ Handlebar',
              description: 'Intuitive steering that reacts dynamically to subtle shifts in your center of gravity.',
              position: 'top'
            },
            {
              id: 'hotspot-2',
              title: 'Dual Lithium-Ion Battery Pack',
              description: 'Up to 24 miles of range per charge with high-efficiency regenerative braking on declines.',
              position: 'center'
            },
            {
              id: 'hotspot-3',
              title: 'All-Terrain Pneumatic Tires',
              description: 'Shock-absorbing deep tread delivering effortless glide over cobblestone, pavement, and bridge decks.',
              position: 'bottom'
            },
            {
              id: 'hotspot-4',
              title: 'Integrated High-Lumen LED Safety Lighting',
              description: 'Front spotlight and rear safety light for crystal-clear daytime and twilight visibility.',
              position: 'front'
            },
            {
              id: 'hotspot-5',
              title: 'Dual Redundant Propulsion & Gyroscopes',
              description: 'Aerospace-grade sensors ensure steady upright balance even in unexpected transitions.',
              position: 'core'
            }
          ]
        }
      },
      {
        sectionKey: 'homepage_social_feed',
        data: {
          title: 'FOLLOW US @OTO_TOURS',
          handle: '@oto_tours',
          instagramUrl: 'https://instagram.com/oto_tours',
          photos: [
            { id: 'social-1', imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600', caption: 'Rolling into sunset along the waterfront' },
            { id: 'social-2', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600', caption: 'Our tour guides ready for the 10 AM dispatch!' },
            { id: 'social-3', imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600', caption: 'Visiting the famous city landmark rooster statue' },
            { id: 'social-4', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600', caption: 'Segway adventures in the historic district' },
            { id: 'social-5', imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=600', caption: 'Skyline views on two wheels' }
          ]
        }
      }
    ];

    const rows = sections.map(s => ({
      id: crypto.randomUUID(),
      section_key: s.sectionKey,
      data: JSON.stringify(s.data),
      created_at: new Date(),
      updated_at: new Date()
    }));

    for (const row of rows) {
      const existing = await queryInterface.rawSelect(
        'site_content',
        { where: { section_key: row.section_key } },
        ['id']
      );
      if (!existing) {
        await queryInterface.bulkInsert('site_content', [row]);
      }
    }
  },

  async down(queryInterface) {
    const keys = [
      'homepage_hero',
      'homepage_quote',
      'homepage_stats',
      'homepage_story',
      'homepage_usa_craft',
      'homepage_gear',
      'homepage_license_program',
      'homepage_vehicle_specs',
      'homepage_social_feed'
    ];
    await queryInterface.bulkDelete('site_content', {
      section_key: keys
    });
  }
};
