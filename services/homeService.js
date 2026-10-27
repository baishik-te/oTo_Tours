'use strict';

const crypto = require('crypto');
const { SiteContent } = require('../models/contentDb');
const tourService = require('./tourService');
const blogService = require('./blogService');
const contentService = require('./contentService');

const DEFAULT_HOMEPAGE_SECTIONS = {
  homepage_hero: {
    badge: 'RATED #1 CITY TOUR EXPERIENCE',
    headline: 'RIDE THE FUTURE, EXPERIENCE THE CITY',
    subheadline: 'Guided Segway & electric fleet adventures giving you unmatched access to city skyline and waterfront views.',
    ctaPrimary: { label: 'Book Tours', url: '/tours' },
    ctaSecondary: { label: 'Explore Fleet', url: '#fleet' },
    backgroundUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
  },
  homepage_quote: {
    quote: 'The perfect way to learn an incredible city afternoon',
    author: 'MICHELLE R.',
    designation: 'Verified Rider, Chicago Riverfront Tour',
    rating: 5.0
  },
  homepage_stats: {
    title: 'SAFETY FIRST. EXPERIENCE ALWAYS.',
    description: 'Every tour starts with a one-on-one orientation and hands-on practice session. We provide top-of-the-line helmets and certified safety equipment.',
    metrics: [
      { value: '50k+', label: 'Happy Riders', key: 'riders' },
      { value: '100+', label: 'Expert Certified Guides', key: 'guides' },
      { value: '100%', label: 'Safety Record', key: 'safety' },
      { value: '4.9/5', label: 'Average Customer Rating', key: 'rating' }
    ]
  },
  homepage_story: {
    badge: 'SINCE 2003',
    title: '23 YEARS OF CREATING UNFORGETTABLE EXPERIENCES',
    description: "Since 2003, OTO Tours has guided travelers, locals, and corporate teams through America's most dynamic streets and historical landmarks.",
    cta: { label: 'Learn More', url: '/about' },
    teamImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600',
    foundedYear: 2003
  },
  homepage_usa_craft: {
    badge: 'MADE IN USA',
    title: 'DESIGNED, ENGINEERED & BUILT IN THE USA',
    description: 'Our vehicles are custom engineered for maximum rider comfort, intuitive balance, and zero emissions in urban environments.',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200'
  },
  homepage_gear: {
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
  },
  homepage_license_program: {
    badge: 'CERTIFIED RIDER',
    title: "WHY DRIVER'S LICENSE PROGRAM",
    description: 'Complete our quick 15-minute training during any guided tour to earn your official OTO Tours Certified Rider License. Unlock discounted rentals and self-guided exploration across all our locations.',
    cta: { label: 'Learn More', url: '/programs/license' },
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200'
  },
  homepage_vehicle_specs: {
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
  },
  homepage_social_feed: {
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
};

class HomeService {
  /**
   * Helper: Retrieve content section from PostgreSQL site_content with default fallback
   */
  async _getSectionData(sectionKey) {
    try {
      const row = await SiteContent.findOne({ where: { sectionKey } });
      if (row && row.data) {
        return row.data;
      }
    } catch (_) {
      // In case table query fails, fallback gracefully to defaults
    }
    return DEFAULT_HOMEPAGE_SECTIONS[sectionKey] || {};
  }

  /**
   * Helper: Update or persist content section in PostgreSQL site_content
   */
  async updateSectionData(sectionKey, data) {
    const [row] = await SiteContent.findOrCreate({
      where: { sectionKey },
      defaults: {
        id: crypto.randomUUID(),
        sectionKey,
        data
      }
    });

    await row.update({ data });
    return row.data;
  }

  // --- Granular Section Getters ---

  async getHeroData() {
    return this._getSectionData('homepage_hero');
  }

  async getTestimonialData() {
    return this._getSectionData('homepage_quote');
  }

  async getStatsData() {
    return this._getSectionData('homepage_stats');
  }

  async getStoryData() {
    return this._getSectionData('homepage_story');
  }

  async getUsaCraftData() {
    return this._getSectionData('homepage_usa_craft');
  }

  async getGearData() {
    return this._getSectionData('homepage_gear');
  }

  async getLicenseProgramData() {
    return this._getSectionData('homepage_license_program');
  }

  async getVehicleSpecsData() {
    return this._getSectionData('homepage_vehicle_specs');
  }

  async getSocialFeedData() {
    return this._getSectionData('homepage_social_feed');
  }

  /**
   * Section 3: Explore Experiences (Categories & Filterable Carousel Tours)
   */
  async getExperienceData() {
    const categories = await tourService.getCategories();
    const signatureToursResult = await tourService.getTours({ isSignature: true, limit: 6 });

    return {
      title: 'EXPLORE EXPERIENCES',
      subtitle: 'Discover our top curated tours tailored to your style and pace.',
      categoryTabs: [
        { key: 'all', label: 'All', active: true },
        ...categories.map(c => ({
          key: c.categoryCode,
          label: c.name,
          badge: c.badge,
          count: c.tourCount
        }))
      ],
      tours: signatureToursResult.tours
    };
  }

  /**
   * Section 4: Unforgettable Travel Experiences (3 Curated Tour Cards Grid)
   */
  async getFeaturedTravelExperiences() {
    const toursResult = await tourService.getTours({ limit: 3, sortBy: 'newest' });
    return {
      title: 'UNFORGETTABLE TRAVEL EXPERIENCES',
      subtitle: 'Hand-picked premier guided tours offering thrilling views and rich history.',
      cta: { label: 'View All Tours', url: '/tours' },
      tours: toursResult.tours
    };
  }

  /**
   * Section 12: Recent Blog Posts (Top 3 published articles)
   */
  async getRecentBlogPosts() {
    const blogResult = await blogService.getPublicBlogs({ limit: 3, sort: 'newest' });
    return {
      title: 'RECENT BLOG POSTS',
      subtitle: 'Latest insights, rider tips, and local landmark stories from our veteran guides.',
      cta: { label: 'View All Posts', url: '/blogs' },
      blogs: blogResult.blogs
    };
  }

  /**
   * Consolidated Homepage Payload:
   * Returns all 14 visual sections of the Figma homepage in one high-performance payload.
   */
  async getHomeOverview() {
    const [
      hero,
      experiences,
      featuredExperiences,
      quote,
      stats,
      story,
      usaCraft,
      gear,
      licenseProgram,
      vehicleSpecs,
      recentBlogs,
      socialFeed,
      contactInfo
    ] = await Promise.all([
      this.getHeroData(),
      this.getExperienceData(),
      this.getFeaturedTravelExperiences(),
      this.getTestimonialData(),
      this.getStatsData(),
      this.getStoryData(),
      this.getUsaCraftData(),
      this.getGearData(),
      this.getLicenseProgramData(),
      this.getVehicleSpecsData(),
      this.getRecentBlogPosts(),
      this.getSocialFeedData(),
      contentService.getContactInfo()
    ]);

    return {
      brand: {
        name: 'oTo Tours',
        tagline: 'Ride The Future, Experience The City',
        logoText: 'oTo TOURS'
      },
      hero,
      experiences,
      featuredExperiences,
      testimonial: quote,
      stats,
      story,
      usaCraft,
      gear,
      licenseProgram,
      vehicleSpecs,
      recentBlogs,
      socialFeed,
      footer: {
        contact: contactInfo.getInTouch,
        links: {
          places: ['Chicago', 'Utica', 'Boston', 'Twin Cities', 'Denver', 'Austin'],
          services: ['Segway Tours', 'E-Bike Rentals', 'Private Events', 'Official Gear'],
          info: ['Our Story', 'Safety Briefing', 'Driver License Program', 'Recent Blogs', 'Careers']
        },
        copyright: `© ${new Date().getFullYear()} oTo Tours. All rights reserved.`
      }
    };
  }

  /**
   * Newsletter Subscription
   */
  async subscribeNewsletter(emailRaw) {
    const email = (emailRaw || '').toLowerCase().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const err = new Error('A valid email address is required');
      err.statusCode = 400;
      throw err;
    }

    // Retrieve or create newsletter list in site_content
    const [row] = await SiteContent.findOrCreate({
      where: { sectionKey: 'newsletter_subscribers' },
      defaults: {
        id: crypto.randomUUID(),
        sectionKey: 'newsletter_subscribers',
        data: { subscribers: [] }
      }
    });

    const currentData = row.data || { subscribers: [] };
    const subscribers = Array.isArray(currentData.subscribers) ? currentData.subscribers : [];

    const existing = subscribers.find(s => (s.email || '').toLowerCase() === email);
    if (!existing) {
      subscribers.push({
        email,
        subscribedAt: new Date().toISOString()
      });
      await row.update({ data: { subscribers } });
    }

    return {
      success: true,
      message: 'Thank you for subscribing to oTo Tours updates!',
      email
    };
  }

  /**
   * Admin: Get all homepage configurable sections
   */
  async getAdminHomeSections() {
    const sectionKeys = Object.keys(DEFAULT_HOMEPAGE_SECTIONS);
    const result = {};

    for (const key of sectionKeys) {
      result[key] = await this._getSectionData(key);
    }

    return result;
  }
}

module.exports = new HomeService();
