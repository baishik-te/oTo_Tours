'use strict';

const tourService = require('../services/tourService');
const eventService = require('../services/eventService');
const contentService = require('../services/contentService');
const blogService = require('../services/blogService');
const homeService = require('../services/homeService');
const authService = require('../services/authService');
const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');

class AdminController {
  // --- Admin Tours ---
  async getTours(req, res, next) {
    try {
      const { tours, meta } = await tourService.getAdminTours(req.query);
      return res.status(200).json({
        success: true,
        count: meta.count,
        total: meta.total,
        page: meta.page,
        totalPages: meta.totalPages,
        data: tours
      });
    } catch (error) {
      next(error);
    }
  }

  async getTourById(req, res, next) {
    try {
      const tour = await tourService.getTourDetails(req.params.id);
      return res.status(200).json({ success: true, data: tour });
    } catch (error) {
      next(error);
    }
  }

  async createTour(req, res, next) {
    try {
      const newTour = await tourService.createTour(req.body);
      return res.status(201).json({
        success: true,
        message: 'Tour created successfully',
        data: newTour
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTour(req, res, next) {
    try {
      const updatedTour = await tourService.updateTour(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Tour updated successfully',
        data: updatedTour
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTour(req, res, next) {
    try {
      const deletedTour = await tourService.deleteTour(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Tour deleted successfully',
        data: {
          id: deletedTour.id,
          tourCode: deletedTour.tourCode,
          title: deletedTour.title
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Categories ---
  async getCategories(req, res, next) {
    try {
      const categories = await tourService.getCategories();
      return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const category = await tourService.getCategoryDetails(req.params.id);
      return res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const category = await tourService.createCategory(req.body);
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { category, affectedToursCount } = await tourService.updateCategory(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        affectedToursCount,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { deletedCategory, deletedToursCount } = await tourService.deleteCategory(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Category and its corresponding tours deleted successfully',
        deletedToursCount,
        data: {
          id: deletedCategory.id,
          categoryCode: deletedCategory.categoryCode,
          name: deletedCategory.name
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Events & Inquiries ---
  async getEventTypes(req, res, next) {
    try {
      const eventTypes = await eventService.getAdminEventTypes();
      return res.status(200).json({
        success: true,
        count: eventTypes.length,
        data: eventTypes
      });
    } catch (error) {
      next(error);
    }
  }

  async createEventType(req, res, next) {
    try {
      const newEvent = await eventService.createEventType(req.body);
      return res.status(201).json({
        success: true,
        message: 'Event type created successfully',
        data: newEvent
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEventType(req, res, next) {
    try {
      const updated = await eventService.updateEventType(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Event type updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEventType(req, res, next) {
    try {
      const result = await eventService.deleteEventType(req.params.id);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: { id: result.id, title: result.title }
      });
    } catch (error) {
      next(error);
    }
  }

  async getInquiries(req, res, next) {
    try {
      const result = await eventService.getAdminInquiries(req.query);
      return res.status(200).json({
        success: true,
        count: result.meta.count,
        total: result.meta.total,
        page: result.meta.page,
        totalPages: result.meta.totalPages,
        data: result.inquiries
      });
    } catch (error) {
      next(error);
    }
  }

  async getInquiryById(req, res, next) {
    try {
      const inquiry = await eventService.getInquiryById(req.params.id);
      return res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async updateInquiryStatus(req, res, next) {
    try {
      const updated = await eventService.updateInquiryStatus(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Inquiry status updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Contact Messages & Site Content ---
  async getContactMessages(req, res, next) {
    try {
      const result = await contentService.getAdminContactMessages(req.query);
      return res.status(200).json({
        success: true,
        count: result.meta.count,
        total: result.meta.total,
        page: result.meta.page,
        totalPages: result.meta.totalPages,
        data: result.messages
      });
    } catch (error) {
      next(error);
    }
  }

  async getContactMessageById(req, res, next) {
    try {
      const message = await contentService.getAdminContactMessageById(req.params.id);
      return res.status(200).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async updateContactMessageStatus(req, res, next) {
    try {
      const updated = await contentService.updateContactMessageStatus(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Contact message status updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async updateContactInfo(req, res, next) {
    try {
      const updated = await contentService.updateContactInfo(req.body);
      return res.status(200).json({
        success: true,
        message: 'Contact information updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAboutContent(req, res, next) {
    try {
      const updated = await contentService.updateAboutContent(req.body);
      return res.status(200).json({
        success: true,
        message: 'About Us story updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Locations ---
  async getLocations(req, res, next) {
    try {
      const { locations, meta } = await tourService.getAdminLocations(req.query);
      return res.status(200).json({
        success: true,
        count: meta.count,
        total: meta.total,
        page: meta.page,
        totalPages: meta.totalPages,
        data: locations
      });
    } catch (error) {
      next(error);
    }
  }

  async getLocationById(req, res, next) {
    try {
      const location = await tourService.getLocationDetails(req.params.id);
      return res.status(200).json({ success: true, data: location });
    } catch (error) {
      next(error);
    }
  }

  async createLocation(req, res, next) {
    try {
      const newLoc = await tourService.createLocation(req.body);
      return res.status(201).json({
        success: true,
        message: 'Location created successfully',
        data: newLoc
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLocation(req, res, next) {
    try {
      const updated = await tourService.updateLocation(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(req, res, next) {
    try {
      const result = await tourService.deleteLocation(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Location deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Blogs (CRUD + Visibility / Hide) ---
  async getBlogs(req, res, next) {
    try {
      const { blogs, meta } = await blogService.getAdminBlogs(req.query);
      return res.status(200).json({
        success: true,
        count: meta.count,
        total: meta.total,
        page: meta.page,
        totalPages: meta.totalPages,
        data: blogs
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogById(req, res, next) {
    try {
      const blog = await blogService.getAdminBlogById(req.params.id);
      return res.status(200).json({
        success: true,
        data: blog
      });
    } catch (error) {
      next(error);
    }
  }

  async createBlog(req, res, next) {
    try {
      const created = await blogService.createBlog(req.body);
      return res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: created
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req, res, next) {
    try {
      const updated = await blogService.updateBlog(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleBlogVisibility(req, res, next) {
    try {
      const result = await blogService.toggleBlogVisibility(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req, res, next) {
    try {
      const result = await blogService.deleteBlog(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Blog deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Homepage CMS Methods ---
  async getHomeSections(req, res, next) {
    try {
      const sections = await homeService.getAdminHomeSections();
      return res.status(200).json({
        success: true,
        data: sections
      });
    } catch (error) {
      next(error);
    }
  }

  async getHomeSectionByKey(req, res, next) {
    try {
      const data = await homeService._getSectionData(req.params.sectionKey);
      return res.status(200).json({
        success: true,
        sectionKey: req.params.sectionKey,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateHomeSection(req, res, next) {
    try {
      const updated = await homeService.updateSectionData(req.params.sectionKey, req.body.data);
      return res.status(200).json({
        success: true,
        message: `Homepage section '${req.params.sectionKey}' updated successfully`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateHomeSections(req, res, next) {
    try {
      const payload = req.body || {};
      const results = {};
      for (const [key, data] of Object.entries(payload)) {
        results[key] = await homeService.updateSectionData(key, data);
      }
      return res.status(200).json({
        success: true,
        message: 'Homepage sections updated successfully',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================

  async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.adminLogin(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ADMIN USER MANAGEMENT
  // ==========================================

  async getUsers(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
      const offset = (page - 1) * limit;

      const where = {};
      if (req.query.role) {
        where.role = req.query.role.toLowerCase().trim();
      }
      if (req.query.status) {
        where.status = req.query.status.toLowerCase().trim();
      }
      if (req.query.search) {
        const s = `%${req.query.search.trim()}%`;
        where[Op.or] = [
          { name: { [Op.iLike]: s } },
          { email: { [Op.iLike]: s } }
        ];
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        include: [{ model: Role, as: 'roleDetails', required: false }],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        count: rows.length,
        total: count,
        page,
        totalPages: Math.ceil(count / limit) || 1,
        data: rows.map(u => u.toSafeJSON())
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: Role, as: 'roleDetails', required: false }]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: `User with ID '${req.params.id}' not found`, statusCode: 404 }
        });
      }

      return res.status(200).json({
        success: true,
        data: user.toSafeJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { name, email, password, phone, role, status } = req.body;
      const cleanEmail = (email || '').toLowerCase().trim();

      const existing = await User.findOne({ where: { email: cleanEmail } });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: { message: `User with email '${cleanEmail}' already exists`, statusCode: 409 }
        });
      }

      const userRoleName = (role || 'user').toLowerCase().trim();
      const userStatus = (status || 'active').toLowerCase().trim();

      const roleRecord = await authService.getRoleByName(userRoleName);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        id: crypto.randomUUID(),
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: userRoleName,
        roleId: roleRecord ? roleRecord.id : null,
        status: userStatus,
        emailVerified: userStatus === 'active'
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser.toSafeJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  async suspendUser(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: Role, as: 'roleDetails', required: false }]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: `User with ID '${req.params.id}' not found`, statusCode: 404 }
        });
      }

      const isSuspended = req.body.suspended !== undefined ? Boolean(req.body.suspended) : true;
      const newStatus = isSuspended ? 'suspended' : 'active';

      await user.update({ status: newStatus });

      return res.status(200).json({
        success: true,
        message: isSuspended ? 'User suspended successfully' : 'User unsuspended successfully',
        data: user.toSafeJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: Role, as: 'roleDetails', required: false }]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: `User with ID '${req.params.id}' not found`, statusCode: 404 }
        });
      }

      const status = req.body.status.toLowerCase().trim();
      await user.update({
        status,
        emailVerified: status === 'active' ? true : user.emailVerified
      });

      return res.status(200).json({
        success: true,
        message: `User status updated to '${status}' successfully`,
        data: user.toSafeJSON()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
