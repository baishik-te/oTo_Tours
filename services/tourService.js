'use strict';

const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize, Tour, Category, Location, TourLocation } = require('../models');

// Helper: Generate URL-friendly slug
function generateSlug(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

class TourService {
  async getTours(query = {}) {
    const isLimitAll = query.limit === 'all' || query.limit === '0' || query.limit === 0 || query.all === 'true' || query.all === true;

    let page = 1;
    let limit = undefined;
    let offset = undefined;

    if (!isLimitAll) {
      if (query.page !== undefined || query.limit !== undefined) {
        page = Math.max(1, parseInt(query.page || '1', 10) || 1);
        limit = query.limit !== undefined ? Math.max(1, parseInt(query.limit, 10) || 10) : 10;
        offset = (page - 1) * limit;
      }
    }

    const tourWhere = [];
    let categoryWhere = null;
    let locationWhere = null;

    // --- CATEGORY FILTERING ---
    if (query.categoryId) {
      const catIdClean = String(query.categoryId).trim();
      const catIdLower = catIdClean.toLowerCase();
      const isAll = catIdLower === 'all' || catIdLower === 'all-tours' || catIdLower === 'all tours';

      if (!isAll && catIdClean !== '') {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(catIdClean);

        if (isUUID) {
          tourWhere.push({ categoryId: catIdClean });
        } else {
          const cat = await Category.findOne({
            where: {
              [Op.or]: [
                sequelize.where(sequelize.fn('LOWER', sequelize.col('category_code')), catIdLower),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), catIdLower),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('badge')), catIdLower)
              ]
            }
          });
          if (cat) {
            tourWhere.push({ categoryId: cat.id });
          } else {
            tourWhere.push({ categoryId: null });
          }
        }
      }
    }

    if (query.category) {
      const catTrimmed = String(query.category).trim();
      const catLower = catTrimmed.toLowerCase();
      const isAll = catLower === 'all' || catLower === 'all-tours' || catLower === 'all tours';

      if (!isAll && catTrimmed !== '') {
        const catSearch = `%${catLower}%`;
        const normalizedSearch = `%${catLower.replace(/[-\s]/g, '')}%`;
        categoryWhere = {
          [Op.or]: [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('categoryDetails.name')), { [Op.like]: catSearch }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('categoryDetails.category_code')), { [Op.like]: catSearch }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('categoryDetails.badge')), { [Op.like]: catSearch }),
            sequelize.where(
              sequelize.fn('REPLACE', sequelize.fn('LOWER', sequelize.col('categoryDetails.name')), '-', ''),
              { [Op.like]: normalizedSearch }
            ),
            sequelize.where(
              sequelize.fn('REPLACE', sequelize.fn('LOWER', sequelize.col('categoryDetails.category_code')), '-', ''),
              { [Op.like]: normalizedSearch }
            ),
            sequelize.where(
              sequelize.fn('REPLACE', sequelize.fn('LOWER', sequelize.col('categoryDetails.badge')), '-', ''),
              { [Op.like]: normalizedSearch }
            )
          ]
        };
      }
    }

    // --- LOCATION FILTERING ---
    if (query.locationId) {
      const locIdClean = String(query.locationId).trim();
      const locIdLower = locIdClean.toLowerCase();
      const isAll = locIdLower === 'all' || locIdLower === 'all-locations' || locIdLower === 'all locations';

      if (!isAll && locIdClean !== '') {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(locIdClean);

        if (isUUID) {
          locationWhere = { id: locIdClean };
        } else {
          locationWhere = sequelize.where(
            sequelize.fn('LOWER', sequelize.col('locations.location_code')),
            locIdLower
          );
        }
      }
    }

    if (query.location) {
      const locTrimmed = String(query.location).trim();
      const locLower = locTrimmed.toLowerCase();
      const isAll = locLower === 'all' || locLower === 'all-locations' || locLower === 'all locations';

      if (!isAll && locTrimmed !== '') {
        const locSearch = `%${locLower}%`;
        locationWhere = {
          [Op.or]: [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('locations.name')), { [Op.like]: locSearch }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('locations.city')), { [Op.like]: locSearch }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('locations.state')), { [Op.like]: locSearch }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('locations.location_code')), { [Op.like]: locSearch })
          ]
        };
      }
    }

    // --- GENERAL SEARCH FILTER ---
    if (query.search) {
      const search = `%${query.search.toLowerCase().trim()}%`;
      tourWhere.push({
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('Tour.title')), { [Op.like]: search }),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('Tour.short_description')), { [Op.like]: search })
        ]
      });
    }

    if (query.isSignature !== undefined) {
      tourWhere.push({
        isSignature: query.isSignature === 'true' || query.isSignature === true
      });
    }

    const where = tourWhere.length > 0 ? { [Op.and]: tourWhere } : {};

    // Build includes
    const categoryInclude = {
      model: Category,
      as: 'categoryDetails',
      where: categoryWhere || undefined,
      required: Boolean(categoryWhere)
    };

    const locationInclude = {
      model: Location,
      as: 'locations',
      through: {
        attributes: ['sequence', 'isPrimary', 'is_primary']
      },
      where: locationWhere || undefined,
      required: Boolean(locationWhere)
    };

    // Sorting options
    let order = [['created_at', 'ASC'], ['id', 'ASC']];
    if (query.sortBy) {
      switch (query.sortBy) {
        case 'price_asc':
          order = [[sequelize.literal("(pricing->>'startingFrom')::numeric"), 'ASC']];
          break;
        case 'price_desc':
          order = [[sequelize.literal("(pricing->>'startingFrom')::numeric"), 'DESC']];
          break;
        case 'duration_asc':
          order = [['durationMinutes', 'ASC']];
          break;
        case 'duration_desc':
          order = [['durationMinutes', 'DESC']];
          break;
        case 'title_asc':
          order = [['title', 'ASC']];
          break;
        case 'title_desc':
          order = [['title', 'DESC']];
          break;
        case 'newest':
          order = [['created_at', 'DESC']];
          break;
      }
    }

    // If filtering by location, find matching tour IDs first so we can then fetch all locations for those tours
    let matchingTourIds = null;
    if (locationWhere) {
      const matchingTours = await Tour.findAll({
        attributes: ['id'],
        include: [{
          model: Location,
          as: 'locations',
          attributes: [],
          through: { attributes: [] },
          where: locationWhere,
          required: true
        }]
      });
      matchingTourIds = matchingTours.map(t => t.id);
      if (matchingTourIds.length === 0) {
        return {
          tours: [],
          meta: { total: 0, count: 0, page: page || 1, limit: limit !== undefined ? limit : 0, totalPages: 1 }
        };
      }
      tourWhere.push({ id: { [Op.in]: matchingTourIds } });
    }

    const finalWhere = tourWhere.length > 0 ? { [Op.and]: tourWhere } : {};

    const { count: total, rows: tours } = await Tour.findAndCountAll({
      where: finalWhere,
      include: [
        categoryInclude,
        {
          model: Location,
          as: 'locations',
          through: {
            attributes: ['sequence', 'isPrimary', 'is_primary']
          },
          required: false
        }
      ],
      distinct: true,
      col: 'id',
      limit,
      offset,
      order
    });

    const formattedTours = tours.map(tour => this._formatTourResponse(tour));

    return {
      tours: formattedTours,
      meta: {
        total,
        count: formattedTours.length,
        page: page || 1,
        limit: limit !== undefined ? limit : total,
        totalPages: limit ? (Math.ceil(total / limit) || 1) : 1
      }
    };
  }

  /**
   * Get complete details of a single tour by UUID, tourCode, or Slug
   */
  async getTourDetails(identifier) {
    if (!identifier) {
      const error = new Error('Tour identifier is required');
      error.statusCode = 400;
      throw error;
    }

    const cleanId = String(identifier).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    const includeOptions = [
      {
        model: Category,
        as: 'categoryDetails'
      },
      {
        model: Location,
        as: 'locations',
        through: {
          attributes: ['sequence', 'isPrimary', 'is_primary']
        }
      }
    ];

    let tour;
    if (isUUID) {
      tour = await Tour.findByPk(cleanId, { include: includeOptions });
    }

    if (!tour) {
      const lowerCleanId = cleanId.toLowerCase();
      tour = await Tour.findOne({
        where: {
          [Op.or]: [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('Tour.tour_code')), lowerCleanId),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('Tour.slug')), lowerCleanId)
          ]
        },
        include: includeOptions
      });
    }

    if (!tour) {
      const error = new Error(`Tour with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return this._formatTourResponse(tour, { includeFullDetails: true });
  }

  // ==========================================
  // ADMIN TOUR CRUD METHODS
  // ==========================================

  /**
   * Admin: Get all tours with pagination and filters
   */
  async getAdminTours(query = {}) {
    return this.getTours(query);
  }

  /**
   * Admin: Create a new tour
   */
  async createTour(tourData) {
    const title = tourData.title ? tourData.title.trim() : '';
    const slug = tourData.slug ? generateSlug(tourData.slug) : generateSlug(title);
    const tourCode = tourData.tourCode
      ? tourData.tourCode.toLowerCase().trim()
      : (tourData.id ? tourData.id.toLowerCase().trim() : slug);

    // Check for tourCode / slug uniqueness
    const existing = await Tour.findOne({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('tour_code')), tourCode),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('slug')), slug)
        ]
      }
    });

    if (existing) {
      const error = new Error(`A tour with tourCode/slug '${tourCode}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    // Resolve category information
    let categoryUUID = null;
    let badge = tourData.badge || null;

    const categoryIdentifier = tourData.categoryId ? tourData.categoryId.trim() : (tourData.category ? tourData.category.trim() : null);

    if (categoryIdentifier) {
      const cat = await this._findCategoryByIdentifier(categoryIdentifier);
      if (!cat) {
        const error = new Error(`Category with identifier '${categoryIdentifier}' does not exist`);
        error.statusCode = 400;
        throw error;
      }
      categoryUUID = cat.id;
      if (!badge) {
        badge = cat.badge || cat.name;
      }
    } else {
      const error = new Error('Category is required');
      error.statusCode = 400;
      throw error;
    }

    const pricing = tourData.pricing || {
      startingFrom: 89.00,
      currency: 'USD',
      currencySymbol: '$',
      unit: 'per person',
      displayLabel: 'From, $89 / person'
    };

    const heroSection = tourData.heroSection || {
      tag: tourData.categoryTag || badge || 'Tour',
      title,
      duration: tourData.duration || '2 Hours',
      location: tourData.location || '',
      heroBackgroundUrl: tourData.imageUrl || ''
    };

    const overview = tourData.overview || {
      heading: `Explore ${title}`,
      description: tourData.shortDescription || ''
    };

    const tourId = crypto.randomUUID();

    const createdTour = await Tour.create({
      id: tourId,
      tourCode,
      slug,
      title,
      categoryId: categoryUUID,
      badge: badge || 'Tour',
      duration: tourData.duration || '2 Hours',
      durationMinutes: tourData.durationMinutes || 120,
      isSignature: tourData.isSignature !== undefined ? Boolean(tourData.isSignature) : true,
      shortDescription: tourData.shortDescription || '',
      pricing,
      heroSection,
      overview,
      keyFeatures: Array.isArray(tourData.keyFeatures) ? tourData.keyFeatures : [],
      highlights: Array.isArray(tourData.highlights) ? tourData.highlights : [],
      included: Array.isArray(tourData.included) ? tourData.included : [],
      sidebarImage: tourData.sidebarImage || tourData.imageUrl || '',
      imageUrl: tourData.imageUrl || ''
    });

    // Handle Locations linking
    await this._syncTourLocations(createdTour.id, tourData);

    // Fetch newly created tour with full relations
    return this.getTourDetails(createdTour.id);
  }

  /**
   * Admin: Update an existing tour
   */
  async updateTour(identifier, updateData) {
    const existingTour = await this._findTourByIdentifier(identifier);

    if (!existingTour) {
      const error = new Error(`Tour with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    let categoryId = existingTour.categoryId;
    let badge = updateData.badge !== undefined ? updateData.badge : existingTour.badge;

    if (updateData.categoryId !== undefined || updateData.category !== undefined) {
      const catIdentifier = updateData.categoryId || updateData.category;
      if (catIdentifier) {
        const cat = await this._findCategoryByIdentifier(catIdentifier);
        if (!cat) {
          const error = new Error(`Category with identifier '${catIdentifier}' does not exist`);
          error.statusCode = 400;
          throw error;
        }
        categoryId = cat.id;
        if (updateData.badge === undefined) {
          badge = cat.badge || cat.name;
        }
      }
    }

    const updatedPricing = updateData.pricing ? {
      ...existingTour.pricing,
      ...updateData.pricing
    } : existingTour.pricing;

    const updatedHero = updateData.heroSection ? {
      ...existingTour.heroSection,
      ...updateData.heroSection
    } : existingTour.heroSection;

    const updatedOverview = updateData.overview ? {
      ...existingTour.overview,
      ...updateData.overview
    } : existingTour.overview;

    const title = updateData.title !== undefined ? updateData.title : existingTour.title;
    let slug = existingTour.slug;
    if (updateData.slug) {
      slug = generateSlug(updateData.slug);
    } else if (updateData.title && updateData.title !== existingTour.title) {
      slug = generateSlug(updateData.title);
    }

    await existingTour.update({
      title,
      slug,
      tourCode: updateData.tourCode !== undefined ? updateData.tourCode : existingTour.tourCode,
      categoryId,
      badge,
      duration: updateData.duration !== undefined ? updateData.duration : existingTour.duration,
      durationMinutes: updateData.durationMinutes !== undefined ? updateData.durationMinutes : existingTour.durationMinutes,
      isSignature: updateData.isSignature !== undefined ? Boolean(updateData.isSignature) : existingTour.isSignature,
      shortDescription: updateData.shortDescription !== undefined ? updateData.shortDescription : existingTour.shortDescription,
      pricing: updatedPricing,
      heroSection: updatedHero,
      overview: updatedOverview,
      keyFeatures: updateData.keyFeatures !== undefined ? updateData.keyFeatures : existingTour.keyFeatures,
      highlights: updateData.highlights !== undefined ? updateData.highlights : existingTour.highlights,
      included: updateData.included !== undefined ? updateData.included : existingTour.included,
      sidebarImage: updateData.sidebarImage !== undefined ? updateData.sidebarImage : existingTour.sidebarImage,
      imageUrl: updateData.imageUrl !== undefined ? updateData.imageUrl : existingTour.imageUrl
    });

    // Update locations if specified in payload
    if (updateData.locations !== undefined || updateData.locationIds !== undefined || updateData.location !== undefined) {
      await this._syncTourLocations(existingTour.id, updateData);
    }

    return this.getTourDetails(existingTour.id);
  }

  /**
   * Admin: Delete a tour
   */
  async deleteTour(identifier) {
    const existingTour = await this._findTourByIdentifier(identifier);

    if (!existingTour) {
      const error = new Error(`Tour with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const tourData = await this.getTourDetails(existingTour.id);
    await existingTour.destroy();
    return tourData;
  }

  // ==========================================
  // CATEGORIES CRUD METHODS (WITH CASCADING)
  // ==========================================

  /**
   * Get all categories with dynamic count of associated tours
   */
  async getCategories() {
    const categories = await Category.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*) FROM tours AS t
              WHERE t.category_id = "Category"."id"
            )`),
            'tourCount'
          ]
        ]
      },
      order: [['created_at', 'ASC'], ['id', 'ASC']]
    });

    return categories.map(cat => ({
      id: cat.id,
      categoryCode: cat.categoryCode,
      name: cat.name,
      badge: cat.badge,
      description: cat.description || '',
      tourCount: parseInt(cat.get('tourCount') || '0', 10)
    }));
  }

  async getCategoryDetails(identifier) {
    const category = await this._findCategoryByIdentifier(identifier);

    if (!category) {
      const error = new Error(`Category with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const tours = await this.findToursByCategoryId(category.id);

    return {
      id: category.id,
      categoryCode: category.categoryCode,
      name: category.name,
      badge: category.badge,
      description: category.description || '',
      tourCount: tours.length,
      tours: tours.map(t => ({
        id: t.id,
        tourCode: t.tourCode,
        slug: t.slug,
        title: t.title,
        duration: t.duration,
        location: t.location,
        price: t.pricing ? t.pricing.startingFrom : null
      }))
    };
  }

  /**
   * Find all tours assigned to a specific category (by UUID)
   */
  async findToursByCategoryId(categoryId) {
    const category = await Category.findByPk(categoryId);

    if (!category) return [];

    const tours = await Tour.findAll({
      where: { categoryId: category.id },
      include: [
        { model: Category, as: 'categoryDetails' },
        { model: Location, as: 'locations' }
      ],
      order: [['created_at', 'ASC']]
    });

    return tours.map(t => this._formatTourResponse(t));
  }

  /**
   * Admin: Create a category
   */
  async createCategory(categoryData) {
    const name = categoryData.name ? categoryData.name.trim() : '';
    const categoryCode = categoryData.categoryCode
      ? categoryData.categoryCode.toLowerCase().trim()
      : (categoryData.id ? categoryData.id.toLowerCase().trim() : generateSlug(name));
    const badge = categoryData.badge ? categoryData.badge.trim() : name;

    const existing = await Category.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('category_code')), categoryCode)
    });

    if (existing) {
      const error = new Error(`Category with code '${categoryCode}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    const newCategory = await Category.create({
      id: crypto.randomUUID(),
      categoryCode,
      name,
      badge,
      description: categoryData.description || ''
    });

    return {
      ...newCategory.toJSON(),
      tourCount: 0
    };
  }

  /**
   * Admin: Update category
   */
  async updateCategory(identifier, updateData) {
    const existingCat = await this._findCategoryByIdentifier(identifier);

    if (!existingCat) {
      const error = new Error(`Category with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const newName = updateData.name !== undefined ? updateData.name.trim() : existingCat.name;
    const newBadge = updateData.badge !== undefined ? updateData.badge.trim() : existingCat.badge;
    const newDesc = updateData.description !== undefined ? updateData.description : existingCat.description;

    await existingCat.update({
      name: newName,
      badge: newBadge,
      description: newDesc
    });

    const affectedToursCount = await Tour.count({ where: { categoryId: existingCat.id } });

    return {
      category: {
        id: existingCat.id,
        categoryCode: existingCat.categoryCode,
        name: existingCat.name,
        badge: existingCat.badge,
        description: existingCat.description || '',
        tourCount: affectedToursCount
      },
      affectedToursCount
    };
  }

  /**
   * Admin: Delete category with automatic CASCADE deletion of corresponding tours
   */
  async deleteCategory(identifier) {
    const existingCat = await this._findCategoryByIdentifier(identifier);

    if (!existingCat) {
      const error = new Error(`Category with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const deletedCategory = existingCat.toJSON();

    // Count linked tours before deletion
    const deletedToursCount = await Tour.count({
      where: { categoryId: existingCat.id }
    });

    // Destroying the category will trigger DB CASCADE deletion for corresponding tours
    await existingCat.destroy();

    return {
      deletedCategory,
      deletedToursCount
    };
  }

  // ==========================================
  // LOCATIONS (PUBLIC & ADMIN)
  // ==========================================

  async _findLocationByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

    if (isUUID) {
      return await Location.findByPk(clean);
    }

    return await Location.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('location_code')), clean.toLowerCase())
    });
  }

  /**
   * Format a Location instance into API response
   */
  _formatLocationResponse(loc, tourCount = 0) {
    const l = loc.toJSON ? loc.toJSON() : loc;
    return {
      id: l.id,
      locationCode: l.locationCode,
      name: l.name,
      city: l.city,
      state: l.state,
      country: l.country || 'USA',
      description: l.description || null,
      imageUrl: l.imageUrl || null,
      isFeatured: Boolean(l.isFeatured !== undefined ? l.isFeatured : true),
      displayOrder: Number(l.displayOrder || 0),
      latitude: l.latitude !== null && l.latitude !== undefined ? Number(l.latitude) : null,
      longitude: l.longitude !== null && l.longitude !== undefined ? Number(l.longitude) : null,
      bookingUrl: `/tours?location=${encodeURIComponent(l.city || l.name)}`,
      toursCount: tourCount
    };
  }

  /**
   * Public: Get active tour locations with optional filtering
   */
  async getLocations(query = {}) {
    const where = {};

    if (query.featured === 'true' || query.featured === true) {
      where.isFeatured = true;
    } else if (query.featured === 'false' || query.featured === false) {
      where.isFeatured = false;
    }

    if (query.state) {
      where.state = { [Op.iLike]: `%${query.state.trim()}%` };
    }

    if (query.search) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: term } },
        { city: { [Op.iLike]: term } },
        { state: { [Op.iLike]: term } },
        { locationCode: { [Op.iLike]: term } }
      ];
    }

    const locations = await Location.findAll({
      where,
      order: [
        ['display_order', 'ASC'],
        ['created_at', 'ASC'],
        ['id', 'ASC']
      ]
    });

    const locationIds = locations.map(l => l.id);
    const tourCounts = await TourLocation.findAll({
      attributes: ['locationId', [sequelize.fn('COUNT', sequelize.col('tour_id')), 'count']],
      where: { locationId: locationIds },
      group: ['locationId']
    });

    const countMap = {};
    tourCounts.forEach(tc => {
      const row = tc.toJSON ? tc.toJSON() : tc;
      countMap[row.locationId] = parseInt(row.count, 10) || 0;
    });

    return locations.map(l => this._formatLocationResponse(l, countMap[l.id] || 0));
  }

  /**
   * Public: Get location details with associated tours
   */
  async getLocationDetails(identifier) {
    const location = await this._findLocationByIdentifier(identifier);

    if (!location) {
      const error = new Error(`Location with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    // Find tours associated with this location
    const junctionRows = await TourLocation.findAll({
      where: { locationId: location.id },
      attributes: ['tourId']
    });
    const tourIds = junctionRows.map(j => j.tourId);

    let tours = [];
    if (tourIds.length > 0) {
      const tourRecords = await Tour.findAll({
        where: { id: tourIds },
        include: [
          { model: Category, as: 'categoryDetails' },
          { model: Location, as: 'locations' }
        ],
        order: [['created_at', 'ASC']]
      });
      tours = tourRecords.map(t => this._formatTourResponse(t));
    }

    return {
      ...this._formatLocationResponse(location, tours.length),
      tours
    };
  }

  /**
   * Admin: Get paginated list of locations
   */
  async getAdminLocations(query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = query.limit !== undefined ? Math.max(1, parseInt(query.limit, 10)) : 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (query.search) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: term } },
        { city: { [Op.iLike]: term } },
        { state: { [Op.iLike]: term } },
        { locationCode: { [Op.iLike]: term } }
      ];
    }

    if (query.featured !== undefined) {
      where.isFeatured = query.featured === 'true' || query.featured === true;
    }

    const { count: total, rows: locations } = await Location.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['display_order', 'ASC'],
        ['created_at', 'ASC']
      ]
    });

    const locationIds = locations.map(l => l.id);
    const tourCounts = await TourLocation.findAll({
      attributes: ['locationId', [sequelize.fn('COUNT', sequelize.col('tour_id')), 'count']],
      where: { locationId: locationIds },
      group: ['locationId']
    });

    const countMap = {};
    tourCounts.forEach(tc => {
      const row = tc.toJSON ? tc.toJSON() : tc;
      countMap[row.locationId] = parseInt(row.count, 10) || 0;
    });

    const formatted = locations.map(l => this._formatLocationResponse(l, countMap[l.id] || 0));

    return {
      locations: formatted,
      meta: {
        total,
        count: formatted.length,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  /**
   * Admin: Create location
   */
  async createLocation(payload) {
    const name = payload.name ? payload.name.trim() : '';
    const city = payload.city ? payload.city.trim() : '';
    const state = payload.state ? payload.state.trim() : '';
    const locationCode = payload.locationCode
      ? payload.locationCode.toLowerCase().trim()
      : generateSlug(`${city || name}-${state}`);

    const existing = await Location.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('location_code')), locationCode)
    });

    if (existing) {
      const error = new Error(`Location with code '${locationCode}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    const created = await Location.create({
      id: crypto.randomUUID(),
      locationCode,
      name,
      city,
      state,
      country: payload.country ? payload.country.trim() : 'USA',
      description: payload.description ? payload.description.trim() : null,
      imageUrl: payload.imageUrl ? payload.imageUrl.trim() : null,
      isFeatured: payload.isFeatured !== undefined ? Boolean(payload.isFeatured) : true,
      displayOrder: payload.displayOrder !== undefined ? parseInt(payload.displayOrder, 10) : 0,
      latitude: payload.latitude !== undefined && payload.latitude !== null ? Number(payload.latitude) : null,
      longitude: payload.longitude !== undefined && payload.longitude !== null ? Number(payload.longitude) : null
    });

    return this._formatLocationResponse(created, 0);
  }

  /**
   * Admin: Update location
   */
  async updateLocation(identifier, payload) {
    const location = await this._findLocationByIdentifier(identifier);

    if (!location) {
      const error = new Error(`Location with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const fields = {};
    if (payload.name !== undefined) fields.name = payload.name.trim();
    if (payload.city !== undefined) fields.city = payload.city.trim();
    if (payload.state !== undefined) fields.state = payload.state.trim();
    if (payload.country !== undefined) fields.country = payload.country.trim();
    if (payload.description !== undefined) fields.description = payload.description ? payload.description.trim() : null;
    if (payload.imageUrl !== undefined) fields.imageUrl = payload.imageUrl ? payload.imageUrl.trim() : null;
    if (payload.isFeatured !== undefined) fields.isFeatured = Boolean(payload.isFeatured);
    if (payload.displayOrder !== undefined) fields.displayOrder = parseInt(payload.displayOrder, 10);
    if (payload.latitude !== undefined) fields.latitude = payload.latitude !== null ? Number(payload.latitude) : null;
    if (payload.longitude !== undefined) fields.longitude = payload.longitude !== null ? Number(payload.longitude) : null;

    if (payload.locationCode !== undefined) {
      const newCode = payload.locationCode.toLowerCase().trim();
      if (newCode !== location.locationCode.toLowerCase()) {
        const existing = await Location.findOne({
          where: sequelize.where(sequelize.fn('LOWER', sequelize.col('location_code')), newCode)
        });
        if (existing) {
          const error = new Error(`Location with code '${newCode}' already exists`);
          error.statusCode = 409;
          throw error;
        }
        fields.locationCode = newCode;
      }
    }

    await location.update(fields);

    const tourCount = await TourLocation.count({ where: { locationId: location.id } });
    return this._formatLocationResponse(location, tourCount);
  }

  /**
   * Admin: Delete location
   */
  async deleteLocation(identifier) {
    const location = await this._findLocationByIdentifier(identifier);

    if (!location) {
      const error = new Error(`Location with identifier '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const tourCount = await TourLocation.count({ where: { locationId: location.id } });
    if (tourCount > 0) {
      const error = new Error(`Cannot delete location '${location.name}' because it is linked to ${tourCount} tour(s). Unlink tours first.`);
      error.statusCode = 400;
      throw error;
    }

    await location.destroy();

    return {
      id: location.id,
      locationCode: location.locationCode,
      name: location.name,
      deleted: true
    };
  }

  _formatTourResponse(tour, { includeFullDetails = false } = {}) {
    const t = tour.toJSON ? tour.toJSON() : tour;
    const category = t.categoryDetails || null;

    // Format locations array sorted by sequence
    const locationsList = (t.locations || []).map(loc => {
      const tl = loc.TourLocation || {};
      return {
        id: loc.id,
        locationCode: loc.locationCode,
        name: loc.name,
        city: loc.city,
        state: loc.state,
        country: loc.country || 'USA',
        latitude: loc.latitude !== null && loc.latitude !== undefined ? Number(loc.latitude) : null,
        longitude: loc.longitude !== null && loc.longitude !== undefined ? Number(loc.longitude) : null,
        sequence: tl.sequence !== undefined ? tl.sequence : 1,
        isPrimary: Boolean(tl.isPrimary || tl.is_primary)
      };
    }).sort((a, b) => a.sequence - b.sequence);

    // Identify primary location
    const primaryLoc = locationsList.find(l => l.isPrimary) || locationsList[0] || null;

    const baseResponse = {
      id: t.id,
      tourCode: t.tourCode,
      slug: t.slug,
      title: t.title,
      categoryId: t.categoryId,
      category: category ? category.name : '',
      categoryCode: category ? category.categoryCode : '',
      categoryTag: category ? (category.badge || category.name) : '',
      badge: t.badge || (category ? category.badge : 'Tour'),
      duration: t.duration,
      durationMinutes: t.durationMinutes || 0,
      location: primaryLoc ? primaryLoc.name : '',
      city: primaryLoc ? primaryLoc.city : '',
      state: primaryLoc ? primaryLoc.state : '',
      country: primaryLoc ? primaryLoc.country : 'USA',
      locations: locationsList,
      primaryLocation: primaryLoc,
      shortDescription: t.shortDescription || '',
      price: t.pricing ? t.pricing.startingFrom : null,
      pricing: t.pricing || null,
      currency: t.pricing ? t.pricing.currency : 'USD',
      priceUnit: t.pricing ? t.pricing.unit : 'per person',
      imageUrl: t.imageUrl,
      isSignature: Boolean(t.isSignature),
      categoryDetails: category ? {
        id: category.id,
        categoryCode: category.categoryCode,
        name: category.name,
        badge: category.badge,
        description: category.description || ''
      } : null
    };

    if (includeFullDetails) {
      return {
        ...baseResponse,
        heroSection: t.heroSection,
        overview: t.overview,
        keyFeatures: t.keyFeatures || [],
        highlights: t.highlights || [],
        included: t.included || [],
        sidebarImage: t.sidebarImage || t.imageUrl
      };
    }

    return baseResponse;
  }

  async _syncTourLocations(tourId, payload) {
    let locationEntries = [];

    if (Array.isArray(payload.locations) && payload.locations.length > 0) {
      locationEntries = payload.locations;
    } else if (Array.isArray(payload.locationIds) && payload.locationIds.length > 0) {
      locationEntries = payload.locationIds.map((id, index) => ({
        locationId: id,
        sequence: index + 1,
        isPrimary: index === 0
      }));
    } else if (payload.locationId) {
      locationEntries = [{ locationId: payload.locationId, sequence: 1, isPrimary: true }];
    } else if (payload.location) {
      const locName = payload.location.trim();
      let loc = await Location.findOne({
        where: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), locName.toLowerCase())
      });

      if (!loc) {
        loc = await Location.create({
          id: crypto.randomUUID(),
          locationCode: generateSlug(locName),
          name: locName,
          city: payload.city || null,
          state: payload.state || null,
          country: payload.country || 'USA'
        });
      }

      locationEntries = [{ locationId: loc.id, sequence: 1, isPrimary: true }];
    }

    if (locationEntries.length > 0) {
      // Delete existing tour_locations for this tour
      await TourLocation.destroy({ where: { tourId } });

      const insertedLocationIds = new Set();

      for (let i = 0; i < locationEntries.length; i++) {
        const item = locationEntries[i];
        let locIdentifier = item.locationCode || item.locationId || item.id || item.name;

        // Resolve location with prioritization
        let location = await this._findLocationByIdentifier(locIdentifier);
        if (location && !insertedLocationIds.has(location.id)) {
          insertedLocationIds.add(location.id);
          await TourLocation.create({
            id: crypto.randomUUID(),
            tourId,
            locationId: location.id,
            sequence: item.sequence !== undefined ? item.sequence : (i + 1),
            isPrimary: item.isPrimary !== undefined ? Boolean(item.isPrimary) : (i === 0)
          });
        }
      }
    }
  }

  /**
   * Find a category by UUID, category_code, or name (case-insensitive)
   */
  async _findCategoryByIdentifier(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    if (isUUID) {
      const cat = await Category.findByPk(cleanId);
      if (cat) return cat;
    }

    const lowerCleanId = cleanId.toLowerCase();

    // 1. Prioritize category_code
    let cat = await Category.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('category_code')), lowerCleanId)
    });
    if (cat) return cat;

    // 2. Exact or partial match on name
    return Category.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), lowerCleanId)
    });
  }

  /**
   * Find a location by UUID, location_code, or name (case-insensitive) with strict prioritization
   */
  async _findLocationByIdentifier(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    if (isUUID) {
      const loc = await Location.findByPk(cleanId);
      if (loc) return loc;
    }

    const lowerCleanId = cleanId.toLowerCase();

    // 1. Check exact match on location_code first
    let loc = await Location.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('location_code')), lowerCleanId)
    });
    if (loc) return loc;

    // 2. Check exact match on name
    loc = await Location.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), lowerCleanId)
    });
    if (loc) return loc;

    // 3. Check exact match on city
    return Location.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('city')), lowerCleanId)
    });
  }

  /**
   * Find a tour by UUID, tour_code, or slug (case-insensitive)
   */
  async _findTourByIdentifier(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    if (isUUID) {
      const tour = await Tour.findByPk(cleanId, {
        include: [
          { model: Category, as: 'categoryDetails' },
          { model: Location, as: 'locations' }
        ]
      });
      if (tour) return tour;
    }

    const lowerCleanId = cleanId.toLowerCase();
    return Tour.findOne({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('Tour.tour_code')), lowerCleanId),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('Tour.slug')), lowerCleanId)
        ]
      },
      include: [
        { model: Category, as: 'categoryDetails' },
        { model: Location, as: 'locations' }
      ]
    });
  }
}

module.exports = new TourService();
