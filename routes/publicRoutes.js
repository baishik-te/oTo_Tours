'use strict';

const express = require('express');
const router = express.Router();
const publicController = require('../controller/publicController');
const {
  validateInquiryPayload,
  validateContactMessagePayload,
  validateRegisterPayload,
  validateLoginPayload,
  validateOtpPayload,
  validateResendOtpPayload,
  validateNewsletterPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload
} = require('../middleware/validateMiddleware');
const { requireAuth, blockSuspendedUsers } = require('../middleware/authMiddleware');

// --- Auth Router (User Registration, SMTP OTP, Login, Session) ---
const authRouter = express.Router();
authRouter.use(blockSuspendedUsers);
authRouter.post('/register', validateRegisterPayload, publicController.register.bind(publicController));
authRouter.post('/verify-otp', validateOtpPayload, publicController.verifyOtp.bind(publicController));
authRouter.post('/resend-otp', requireAuth, validateResendOtpPayload, publicController.resendOtp.bind(publicController));
authRouter.post('/forgot-password', requireAuth, validateForgotPasswordPayload, publicController.forgotPassword.bind(publicController));
authRouter.post('/reset-password', requireAuth, validateResetPasswordPayload, publicController.resetPassword.bind(publicController));
authRouter.post('/login', validateLoginPayload, publicController.login.bind(publicController));
authRouter.post('/token', publicController.issueToken.bind(publicController));
authRouter.get('/me', publicController.getMe.bind(publicController));

// --- Homepage Router (Consolidated & Granular Figma Sections) ---
const homeRouter = express.Router();
homeRouter.use(blockSuspendedUsers);
homeRouter.get('/', publicController.getHomeOverview.bind(publicController));
homeRouter.get('/overview', publicController.getHomeOverview.bind(publicController));
homeRouter.get('/hero', publicController.getHomeHero.bind(publicController));
homeRouter.get('/experiences', publicController.getHomeExperiences.bind(publicController));
homeRouter.get('/featured-tours', publicController.getHomeFeaturedTours.bind(publicController));
homeRouter.get('/stats', publicController.getHomeStats.bind(publicController));
homeRouter.get('/testimonial', publicController.getHomeTestimonial.bind(publicController));
homeRouter.get('/story', publicController.getHomeStory.bind(publicController));
homeRouter.get('/usa-craft', publicController.getHomeUsaCraft.bind(publicController));
homeRouter.get('/gear', publicController.getHomeGear.bind(publicController));
homeRouter.get('/license-program', publicController.getHomeLicenseProgram.bind(publicController));
homeRouter.get('/vehicle-specs', publicController.getHomeVehicleSpecs.bind(publicController));
homeRouter.get('/blogs', publicController.getHomeBlogs.bind(publicController));
homeRouter.get('/social-feed', publicController.getHomeSocialFeed.bind(publicController));
homeRouter.post('/newsletter', validateNewsletterPayload, publicController.subscribeNewsletter.bind(publicController));

// --- Tours Router ---
const tourRouter = express.Router();
tourRouter.use(blockSuspendedUsers);
tourRouter.get('/meta/categories', publicController.getCategories.bind(publicController));
tourRouter.get('/meta/locations', publicController.getLocations.bind(publicController));
tourRouter.get('/me', publicController.getMe.bind(publicController));
tourRouter.get('/', publicController.getTours.bind(publicController));
tourRouter.get('/:id', publicController.getTourById.bind(publicController));

// --- Events Router ---
const eventRouter = express.Router();
eventRouter.use(blockSuspendedUsers);
eventRouter.get('/meta/page-structure', publicController.getEventPageMeta.bind(publicController));
eventRouter.get('/gallery', publicController.getEventGallery.bind(publicController));
eventRouter.get('/inquiries/status', publicController.getInquiryStatus.bind(publicController));
eventRouter.post('/inquiries', validateInquiryPayload, publicController.submitInquiry.bind(publicController));
eventRouter.get('/', publicController.getEventTypes.bind(publicController));
eventRouter.get('/:identifier', publicController.getEventTypeDetails.bind(publicController));

// --- Contact Us Router ---
const contactRouter = express.Router();
contactRouter.use(blockSuspendedUsers);
contactRouter.get('/info', publicController.getContactInfo.bind(publicController));
contactRouter.get('/', publicController.getContactInfo.bind(publicController));
contactRouter.post('/messages', validateContactMessagePayload, publicController.submitContactMessage.bind(publicController));

// --- About Us Router ---
const aboutRouter = express.Router();
aboutRouter.use(blockSuspendedUsers);
aboutRouter.get('/', publicController.getAboutContent.bind(publicController));

// --- Locations Router ---
const locationRouter = express.Router();
locationRouter.use(blockSuspendedUsers);
locationRouter.get('/', publicController.getLocations.bind(publicController));
locationRouter.get('/:identifier', publicController.getLocationById.bind(publicController));

// --- Blogs Router (Read-Only for Public Users) ---
const blogRouter = express.Router();
blogRouter.use(blockSuspendedUsers);
blogRouter.get('/', publicController.getBlogs.bind(publicController));
blogRouter.get('/:identifier', publicController.getBlogById.bind(publicController));

// Mount under base router
router.use(blockSuspendedUsers);
router.get('/me', publicController.getMe.bind(publicController));
router.use('/auth', authRouter);
router.use('/home', homeRouter);
router.use('/tours', tourRouter);
router.use('/events', eventRouter);
router.use('/locations', locationRouter);
router.use('/blogs', blogRouter);
router.use('/contact', contactRouter);
router.use('/about', aboutRouter);

module.exports = router;
module.exports.authRouter = authRouter;
module.exports.homeRouter = homeRouter;
module.exports.tourRouter = tourRouter;
module.exports.eventRouter = eventRouter;
module.exports.locationRouter = locationRouter;
module.exports.blogRouter = blogRouter;
module.exports.contactRouter = contactRouter;
module.exports.aboutRouter = aboutRouter;
