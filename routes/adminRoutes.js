'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controller/adminController');
const {
  validateTourPayload,
  validateCategoryPayload,
  validateEventTypePayload,
  validateInquiryStatusPayload,
  validateLocationPayload,
  validateBlogPayload,
  validateBlogVisibilityPayload,
  validateAdminLoginPayload,
  validateAdminCreateUserPayload,
  validateUserStatusPayload
} = require('../middleware/validateMiddleware');

// ==========================================
// PUBLIC ADMIN ROUTE (UNAUTHENTICATED)
// ==========================================
// Admin Login - can login only (not register)
router.post('/login', validateAdminLoginPayload, adminController.adminLogin.bind(adminController));

// ==========================================
// PROTECTED ADMIN ROUTES (REQUIRE ADMIN AUTH)
// ==========================================
router.use(authMiddleware);

// Admin User Management
router.get('/users', adminController.getUsers.bind(adminController));
router.post('/users', validateAdminCreateUserPayload, adminController.createUser.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.patch('/users/:id/suspend', adminController.suspendUser.bind(adminController));
router.patch('/users/:id/status', validateUserStatusPayload, adminController.updateUserStatus.bind(adminController));

// Admin Tours
router.get('/tours', adminController.getTours.bind(adminController));
router.post('/tours', validateTourPayload(false), adminController.createTour.bind(adminController));
router.get('/tours/:id', adminController.getTourById.bind(adminController));
router.put('/tours/:id', validateTourPayload(false), adminController.updateTour.bind(adminController));
router.patch('/tours/:id', validateTourPayload(true), adminController.updateTour.bind(adminController));
router.delete('/tours/:id', adminController.deleteTour.bind(adminController));

// Admin Categories
router.get('/categories', adminController.getCategories.bind(adminController));
router.post('/categories', validateCategoryPayload(false), adminController.createCategory.bind(adminController));
router.get('/categories/:id', adminController.getCategoryById.bind(adminController));
router.put('/categories/:id', validateCategoryPayload(false), adminController.updateCategory.bind(adminController));
router.patch('/categories/:id', validateCategoryPayload(true), adminController.updateCategory.bind(adminController));
router.delete('/categories/:id', adminController.deleteCategory.bind(adminController));

// Admin Locations
router.get('/locations', adminController.getLocations.bind(adminController));
router.post('/locations', validateLocationPayload(false), adminController.createLocation.bind(adminController));
router.get('/locations/:id', adminController.getLocationById.bind(adminController));
router.put('/locations/:id', validateLocationPayload(false), adminController.updateLocation.bind(adminController));
router.patch('/locations/:id', validateLocationPayload(true), adminController.updateLocation.bind(adminController));
router.delete('/locations/:id', adminController.deleteLocation.bind(adminController));

// Admin Blogs (Create, Read, Update, Delete, Hide)
router.get('/blogs', adminController.getBlogs.bind(adminController));
router.post('/blogs', validateBlogPayload(false), adminController.createBlog.bind(adminController));
router.get('/blogs/:id', adminController.getBlogById.bind(adminController));
router.put('/blogs/:id', validateBlogPayload(false), adminController.updateBlog.bind(adminController));
router.patch('/blogs/:id', validateBlogPayload(true), adminController.updateBlog.bind(adminController));
router.patch('/blogs/:id/visibility', validateBlogVisibilityPayload, adminController.toggleBlogVisibility.bind(adminController));
router.delete('/blogs/:id', adminController.deleteBlog.bind(adminController));

// Admin Events
router.get('/events', adminController.getEventTypes.bind(adminController));
router.post('/events', validateEventTypePayload(false), adminController.createEventType.bind(adminController));
router.put('/events/:id', validateEventTypePayload(true), adminController.updateEventType.bind(adminController));
router.delete('/events/:id', adminController.deleteEventType.bind(adminController));

// Admin Event Inquiries
router.get('/events/inquiries', adminController.getInquiries.bind(adminController));
router.get('/events/inquiries/:id', adminController.getInquiryById.bind(adminController));
router.patch('/events/inquiries/:id/status', validateInquiryStatusPayload, adminController.updateInquiryStatus.bind(adminController));

// Admin Contact Messages
router.get('/contact/messages', adminController.getContactMessages.bind(adminController));
router.get('/contact/messages/:id', adminController.getContactMessageById.bind(adminController));
router.patch('/contact/messages/:id/status', adminController.updateContactMessageStatus.bind(adminController));

// Admin Site Content (Contact Info & About Us)
router.put('/contact/info', adminController.updateContactInfo.bind(adminController));
router.put('/about', adminController.updateAboutContent.bind(adminController));

// Admin Homepage Content CMS
router.get('/home/sections', adminController.getHomeSections.bind(adminController));
router.get('/home/sections/:sectionKey', adminController.getHomeSectionByKey.bind(adminController));
router.put('/home/sections/:sectionKey', adminController.updateHomeSection.bind(adminController));
router.put('/home', adminController.bulkUpdateHomeSections.bind(adminController));

module.exports = router;
