'use strict';

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidDate(dateStr) {
  if (typeof dateStr !== 'string') return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim());
}

function validateTourPayload(isUpdate = false) {
  return (req, res, next) => {
    const data = req.body;
    const errors = [];

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        error: { message: 'Request body must be a valid JSON object', statusCode: 400 }
      });
    }

    if (!isUpdate) {
      if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
        errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
      }
      if (!data.categoryId && !data.category) {
        errors.push({ field: 'categoryId', message: 'categoryId (or category) is required' });
      }
      if (!data.duration || typeof data.duration !== 'string' || !data.duration.trim()) {
        errors.push({ field: 'duration', message: 'Duration is required (e.g. "2.5 Hours")' });
      }

      const hasLocation =
        (data.location && typeof data.location === 'string' && data.location.trim()) ||
        (Array.isArray(data.locations) && data.locations.length > 0) ||
        (Array.isArray(data.locationIds) && data.locationIds.length > 0) ||
        (data.locationId && typeof data.locationId === 'string' && data.locationId.trim());

      if (!hasLocation) {
        errors.push({
          field: 'location',
          message: 'At least one location (location string, locationId, or locations array) is required'
        });
      }
    } else {
      if (data.title !== undefined && (typeof data.title !== 'string' || !data.title.trim())) {
        errors.push({ field: 'title', message: 'Title must be a non-empty string' });
      }
      if (data.duration !== undefined && (typeof data.duration !== 'string' || !data.duration.trim())) {
        errors.push({ field: 'duration', message: 'Duration must be a non-empty string' });
      }
      if (data.locations !== undefined && !Array.isArray(data.locations)) {
        errors.push({ field: 'locations', message: 'Locations must be an array of location objects or IDs' });
      }
    }

    if (data.pricing !== undefined) {
      if (typeof data.pricing !== 'object' || data.pricing === null) {
        errors.push({ field: 'pricing', message: 'Pricing must be an object' });
      } else if (data.pricing.startingFrom !== undefined) {
        const priceNum = Number(data.pricing.startingFrom);
        if (isNaN(priceNum) || priceNum < 0) {
          errors.push({ field: 'pricing.startingFrom', message: 'Price startingFrom must be a non-negative number' });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', statusCode: 400, details: errors }
      });
    }
    next();
  };
}

function validateCategoryPayload(isUpdate = false) {
  return (req, res, next) => {
    const data = req.body;
    const errors = [];

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        error: { message: 'Request body must be a valid JSON object', statusCode: 400 }
      });
    }

    if (!isUpdate) {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        errors.push({ field: 'name', message: 'Category name is required' });
      }
    } else {
      if (data.name !== undefined && (typeof data.name !== 'string' || !data.name.trim())) {
        errors.push({ field: 'name', message: 'Category name cannot be empty' });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', statusCode: 400, details: errors }
      });
    }
    next();
  };
}

function validateInquiryPayload(req, res, next) {
  const errors = [];
  const body = req.body || {};

  if (!body.contactName || typeof body.contactName !== 'string' || !body.contactName.trim()) {
    errors.push('contactName is required and must be a non-empty string');
  }
  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length < 7) {
    errors.push('phone is required and must be at least 7 characters');
  }
  if (!body.preferredDate || !isValidDate(body.preferredDate)) {
    errors.push('preferredDate is required and must be in YYYY-MM-DD format');
  }
  if (body.alternateDate && !isValidDate(body.alternateDate)) {
    errors.push('alternateDate must be in YYYY-MM-DD format');
  }
  if (body.estimatedRiders !== undefined) {
    const riders = Number(body.estimatedRiders);
    if (!Number.isInteger(riders) || riders < 1) {
      errors.push('estimatedRiders must be an integer greater than 0');
    }
  }
  if (body.selectedHighlights !== undefined && !Array.isArray(body.selectedHighlights)) {
    errors.push('selectedHighlights must be an array of strings');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for event inquiry',
      errors
    });
  }
  next();
}

function validateEventTypePayload(isUpdate = false) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body || {};

    if (!isUpdate && (!body.title || typeof body.title !== 'string' || !body.title.trim())) {
      errors.push('title is required and must be a non-empty string');
    }
    if (body.subOfferings !== undefined && !Array.isArray(body.subOfferings)) {
      errors.push('subOfferings must be an array of strings');
    }
    if (body.maxRidersCapacity !== undefined) {
      const cap = Number(body.maxRidersCapacity);
      if (!Number.isInteger(cap) || cap < 1) {
        errors.push('maxRidersCapacity must be a positive integer');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for event type',
        errors
      });
    }
    next();
  };
}

function validateInquiryStatusPayload(req, res, next) {
  const errors = [];
  const body = req.body || {};
  const allowed = ['pending', 'under_review', 'quoted', 'confirmed', 'completed', 'cancelled'];

  if (body.status !== undefined && !allowed.includes(body.status)) {
    errors.push(`status must be one of: ${allowed.join(', ')}`);
  }
  if (body.quoteAmount !== undefined) {
    const amt = Number(body.quoteAmount);
    if (isNaN(amt) || amt < 0) {
      errors.push('quoteAmount must be a non-negative number');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for inquiry status update',
      errors
    });
  }
  next();
}

function validateContactMessagePayload(req, res, next) {
  const errors = [];
  const body = req.body || {};

  if (!body.firstName || typeof body.firstName !== 'string' || !body.firstName.trim()) {
    errors.push('firstName is required and must be a non-empty string');
  }
  if (!body.lastName || typeof body.lastName !== 'string' || !body.lastName.trim()) {
    errors.push('lastName is required and must be a non-empty string');
  }
  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length < 7) {
    errors.push('phone is required and must be at least 7 characters');
  }
  if (!body.subject || typeof body.subject !== 'string' || !body.subject.trim()) {
    errors.push('subject is required and must be a non-empty string');
  }
  if (!body.message || typeof body.message !== 'string' || !body.message.trim()) {
    errors.push('message is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for contact message',
      errors
    });
  }
  next();
}

function validateLocationPayload(isUpdate = false) {
  return (req, res, next) => {
    const data = req.body || {};
    const errors = [];

    if (!isUpdate) {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        errors.push({ field: 'name', message: 'Location name is required and must be a non-empty string' });
      }
      if (!data.city || typeof data.city !== 'string' || !data.city.trim()) {
        errors.push({ field: 'city', message: 'City is required and must be a non-empty string' });
      }
      if (!data.state || typeof data.state !== 'string' || !data.state.trim()) {
        errors.push({ field: 'state', message: 'State is required and must be a non-empty string' });
      }
    } else {
      if (data.name !== undefined && (typeof data.name !== 'string' || !data.name.trim())) {
        errors.push({ field: 'name', message: 'Location name must be a non-empty string' });
      }
    }

    if (data.latitude !== undefined && data.latitude !== null && isNaN(Number(data.latitude))) {
      errors.push({ field: 'latitude', message: 'Latitude must be a valid number' });
    }
    if (data.longitude !== undefined && data.longitude !== null && isNaN(Number(data.longitude))) {
      errors.push({ field: 'longitude', message: 'Longitude must be a valid number' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for location payload',
        errors
      });
    }
    next();
  };
}

function validateBlogPayload(isUpdate = false) {
  return (req, res, next) => {
    const data = req.body || {};
    const errors = [];

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        error: { message: 'Request body must be a valid JSON object', statusCode: 400 }
      });
    }

    if (!isUpdate) {
      if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
        errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
      }
      const hasContent = (data.content && typeof data.content === 'string' && data.content.trim()) ||
                         (data.details && typeof data.details === 'string' && data.details.trim());
      if (!hasContent) {
        errors.push({ field: 'content', message: 'Blog content or details is required' });
      }
    } else {
      if (data.title !== undefined && (typeof data.title !== 'string' || !data.title.trim())) {
        errors.push({ field: 'title', message: 'Title must be a non-empty string' });
      }
      if (data.content !== undefined && (typeof data.content !== 'string' || !data.content.trim())) {
        errors.push({ field: 'content', message: 'Content cannot be empty' });
      }
    }

    if (data.publishedAt !== undefined && data.publishedAt !== null) {
      const d = new Date(data.publishedAt);
      if (isNaN(d.getTime())) {
        errors.push({ field: 'publishedAt', message: 'publishedAt must be a valid date/time string' });
      }
    }

    if (data.isHidden !== undefined && typeof data.isHidden !== 'boolean') {
      errors.push({ field: 'isHidden', message: 'isHidden must be a boolean' });
    }

    if (data.isPublished !== undefined && typeof data.isPublished !== 'boolean') {
      errors.push({ field: 'isPublished', message: 'isPublished must be a boolean' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for blog payload',
        errors
      });
    }
    next();
  };
}

function validateBlogVisibilityPayload(req, res, next) {
  const data = req.body || {};
  if (data.isHidden !== undefined && typeof data.isHidden !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'isHidden must be a boolean'
    });
  }
  if (data.hide !== undefined && typeof data.hide !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'hide must be a boolean'
    });
  }
  next();
}

function validateRegisterPayload(req, res, next) {
  const errors = [];
  const body = req.body || {};

  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }
  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for user registration',
      errors
    });
  }
  next();
}

function validateLoginPayload(req, res, next) {
  const errors = [];
  const body = req.body || {};

  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.password || typeof body.password !== 'string' || !body.password.trim()) {
    errors.push('password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for login',
      errors
    });
  }
  next();
}

function validateOtpPayload(req, res, next) {
  const errors = [];
  const body = req.body || {};

  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.otp && !body.otpCode) {
    errors.push('otp code is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for OTP verification',
      errors
    });
  }
  next();
}

function validateResendOtpPayload(req, res, next) {
  const body = req.body || {};
  if (!body.email || !isValidEmail(body.email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email is required to resend OTP'
    });
  }
  next();
}

function validateNewsletterPayload(req, res, next) {
  const body = req.body || {};
  if (!body.email || !isValidEmail(body.email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required to subscribe to newsletter'
    });
  }
  next();
}

function validateHomeSectionPayload(req, res, next) {
  const body = req.body || {};
  if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) {
    return res.status(400).json({
      success: false,
      message: 'data field is required and must be an object'
    });
  }
  next();
}

function validateForgotPasswordPayload(req, res, next) {
  const body = req.body || {};
  if (!body.email || !isValidEmail(body.email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email is required for forgot password request'
    });
  }
  next();
}

function validateResetPasswordPayload(req, res, next) {
  const body = req.body || {};
  const errors = [];

  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.currentPassword || typeof body.currentPassword !== 'string' || !body.currentPassword.trim()) {
    errors.push('currentPassword is required');
  }
  if (!body.newPassword || typeof body.newPassword !== 'string' || body.newPassword.length < 6) {
    errors.push('newPassword is required and must be at least 6 characters');
  }
  if (body.confirmPassword && body.newPassword !== body.confirmPassword) {
    errors.push('newPassword and confirmPassword do not match');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for password reset',
      errors
    });
  }
  next();
}

function validateAdminLoginPayload(req, res, next) {
  const body = req.body || {};
  const errors = [];

  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.password || typeof body.password !== 'string' || !body.password.trim()) {
    errors.push('password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for admin login',
      errors
    });
  }
  next();
}

function validateAdminCreateUserPayload(req, res, next) {
  const body = req.body || {};
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }
  if (!body.email || !isValidEmail(body.email)) {
    errors.push('email is required and must be a valid email address');
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }
  if (body.role && !['user', 'guest', 'admin'].includes(body.role.toLowerCase().trim())) {
    errors.push("role must be 'user', 'guest', or 'admin'");
  }
  if (body.status && !['active', 'inactive', 'suspended'].includes(body.status.toLowerCase().trim())) {
    errors.push("status must be 'active', 'inactive', or 'suspended'");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for creating user',
      errors
    });
  }
  next();
}

function validateUserStatusPayload(req, res, next) {
  const body = req.body || {};
  if (!body.status || !['active', 'inactive', 'suspended'].includes(String(body.status).toLowerCase().trim())) {
    return res.status(400).json({
      success: false,
      message: "Valid status ('active', 'inactive', 'suspended') is required"
    });
  }
  next();
}

module.exports = {
  validateTourPayload,
  validateCategoryPayload,
  validateInquiryPayload,
  validateEventTypePayload,
  validateInquiryStatusPayload,
  validateContactMessagePayload,
  validateLocationPayload,
  validateBlogPayload,
  validateBlogVisibilityPayload,
  validateRegisterPayload,
  validateLoginPayload,
  validateOtpPayload,
  validateResendOtpPayload,
  validateNewsletterPayload,
  validateHomeSectionPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload,
  validateAdminLoginPayload,
  validateAdminCreateUserPayload,
  validateUserStatusPayload
};
