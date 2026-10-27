'use strict';

const config = require('../config/app');
const tourService = require('../services/tourService');
const eventService = require('../services/eventService');
const contentService = require('../services/contentService');
const blogService = require('../services/blogService');
const authService = require('../services/authService');
const homeService = require('../services/homeService');

class PublicController {
  // --- Public Tours & Categories ---
  async getTours(req, res, next) {
    try {
      const { tours, meta } = await tourService.getTours(req.query);
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

  async getLocations(req, res, next) {
    try {
      const locations = await tourService.getLocations(req.query);
      return res.status(200).json({
        success: true,
        count: locations.length,
        data: locations
      });
    } catch (error) {
      next(error);
    }
  }

  async getLocationById(req, res, next) {
    try {
      const location = await tourService.getLocationDetails(req.params.identifier);
      return res.status(200).json({
        success: true,
        data: location
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Session & Caller Identity (Single User Details Only) ---
  async getMe(req, res, next) {
    try {
      const userDetails = await authService.getSingleUserDetails(req.headers);
      return res.status(200).json({
        success: true,
        data: userDetails
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Public Events & Inquiries ---
  async getEventTypes(req, res, next) {
    try {
      const result = await eventService.getEventTypes(req.query);
      return res.status(200).json({
        success: true,
        count: result.count,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventTypeDetails(req, res, next) {
    try {
      const eventType = await eventService.getEventTypeDetails(req.params.identifier);
      return res.status(200).json({ success: true, data: eventType });
    } catch (error) {
      next(error);
    }
  }

  async getEventPageMeta(req, res, next) {
    try {
      const meta = await eventService.getEventPageMeta();
      return res.status(200).json({ success: true, data: meta });
    } catch (error) {
      next(error);
    }
  }

  async getEventGallery(req, res, next) {
    try {
      const result = await eventService.getEventGallery(req.query);
      return res.status(200).json({
        success: true,
        count: result.meta.count,
        total: result.meta.total,
        page: result.meta.page,
        totalPages: result.meta.totalPages,
        meta: result.meta,
        data: result.photos
      });
    } catch (error) {
      next(error);
    }
  }

  async submitInquiry(req, res, next) {
    try {
      const result = await eventService.submitInquiry(req.body);
      return res.status(201).json({
        success: true,
        message: 'Event inquiry submitted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getInquiryStatus(req, res, next) {
    try {
      const { code, email } = req.query;
      const result = await eventService.getInquiryStatus(code, email);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // --- Public Contact Us & About Us ---
  async getContactInfo(req, res, next) {
    try {
      const info = await contentService.getContactInfo();
      return res.status(200).json({ success: true, data: info });
    } catch (error) {
      next(error);
    }
  }

  async submitContactMessage(req, res, next) {
    try {
      const result = await contentService.submitContactMessage(req.body);
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAboutContent(req, res, next) {
    try {
      const about = await contentService.getAboutContent();
      return res.status(200).json({ success: true, data: about });
    } catch (error) {
      next(error);
    }
  }

  // --- Public Blogs (Read-Only) ---
  async getBlogs(req, res, next) {
    try {
      const { blogs, meta } = await blogService.getPublicBlogs(req.query);
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
      const blog = await blogService.getPublicBlogBySlugOrId(req.params.identifier);
      return res.status(200).json({
        success: true,
        data: blog
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // USER AUTHENTICATION & OTP LIFECYCLE
  // ==========================================

  async register(req, res, next) {
    try {
      const result = await authService.registerUser(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, otp, otpCode } = req.body;
      const result = await authService.verifyOtp(email, otp || otpCode);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const caller = req.user ? { authenticated: true, user: req.user } : await authService.parseSessionIdentity(req.headers);
      const result = await authService.resendOtp(email, caller);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const caller = req.user ? { authenticated: true, user: req.user } : await authService.parseSessionIdentity(req.headers);
      const result = await authService.forgotPassword(email, caller);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const caller = req.user ? { authenticated: true, user: req.user } : await authService.parseSessionIdentity(req.headers);
      const result = await authService.resetPassword(req.body, caller);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async issueToken(req, res, next) {
    try {
      const payload = req.body || {};
      const token = authService.generateToken({
        id: payload.id || 'dev-user-id',
        email: payload.email || 'user@example.com',
        name: payload.name || 'Test User',
        role: payload.role || 'user',
        status: payload.status || 'active'
      });
      return res.status(200).json({
        success: true,
        token,
        data: payload
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // HOMEPAGE FINAL VERSION METHODS
  // ==========================================

  async getHomeOverview(req, res, next) {
    try {
      const homeData = await homeService.getHomeOverview();
      return res.status(200).json({
        success: true,
        data: homeData
      });
    } catch (error) {
      next(error);
    }
  }

  async getHomeHero(req, res, next) {
    try {
      const data = await homeService.getHeroData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeExperiences(req, res, next) {
    try {
      const data = await homeService.getExperienceData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeFeaturedTours(req, res, next) {
    try {
      const data = await homeService.getFeaturedTravelExperiences();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeStats(req, res, next) {
    try {
      const data = await homeService.getStatsData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeTestimonial(req, res, next) {
    try {
      const data = await homeService.getTestimonialData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeStory(req, res, next) {
    try {
      const data = await homeService.getStoryData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeUsaCraft(req, res, next) {
    try {
      const data = await homeService.getUsaCraftData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeGear(req, res, next) {
    try {
      const data = await homeService.getGearData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeLicenseProgram(req, res, next) {
    try {
      const data = await homeService.getLicenseProgramData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeVehicleSpecs(req, res, next) {
    try {
      const data = await homeService.getVehicleSpecsData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeBlogs(req, res, next) {
    try {
      const data = await homeService.getRecentBlogPosts();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getHomeSocialFeed(req, res, next) {
    try {
      const data = await homeService.getSocialFeedData();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async subscribeNewsletter(req, res, next) {
    try {
      const result = await homeService.subscribeNewsletter(req.body.email);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicController();
