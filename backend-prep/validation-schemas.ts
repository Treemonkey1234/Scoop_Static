/**
 * Input Validation Schemas for Scoop Social API
 * Custom validation system for comprehensive request validation
 * Ensures data integrity and security across all endpoints
 */

// =============================================
// Custom Validation System (No External Dependencies)
// =============================================

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

class Validator {
  public errors: ValidationError[] = [];

  // Core validation methods
  required(value: any, field: string): this {
    if (value === undefined || value === null || value === '') {
      this.errors.push({ field, message: `${field} is required` });
    }
    return this;
  }

  email(value: string, field: string): this {
    if (value && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
      this.errors.push({ field, message: 'Please provide a valid email address' });
    }
    return this;
  }

  minLength(value: string, min: number, field: string): this {
    if (value && value.length < min) {
      this.errors.push({ field, message: `${field} must be at least ${min} characters long` });
    }
    return this;
  }

  maxLength(value: string, max: number, field: string): this {
    if (value && value.length > max) {
      this.errors.push({ field, message: `${field} cannot exceed ${max} characters` });
    }
    return this;
  }

  pattern(value: string, regex: RegExp, field: string, message: string): this {
    if (value && !regex.test(value)) {
      this.errors.push({ field, message });
    }
    return this;
  }

  oneOf(value: any, allowedValues: any[], field: string): this {
    if (value && !allowedValues.includes(value)) {
      this.errors.push({ field, message: `${field} must be one of: ${allowedValues.join(', ')}` });
    }
    return this;
  }

  min(value: number, min: number, field: string): this {
    if (value !== undefined && value < min) {
      this.errors.push({ field, message: `${field} must be at least ${min}` });
    }
    return this;
  }

  max(value: number, max: number, field: string): this {
    if (value !== undefined && value > max) {
      this.errors.push({ field, message: `${field} cannot exceed ${max}` });
    }
    return this;
  }

  integer(value: any, field: string): this {
    if (value !== undefined && (!Number.isInteger(Number(value)) || Number(value) !== Math.floor(Number(value)))) {
      this.errors.push({ field, message: `${field} must be an integer` });
    }
    return this;
  }

  url(value: string, field: string): this {
    if (value) {
      try {
        new URL(value);
      } catch {
        this.errors.push({ field, message: 'Please provide a valid URL' });
      }
    }
    return this;
  }

  array(value: any, field: string): this {
    if (value !== undefined && !Array.isArray(value)) {
      this.errors.push({ field, message: `${field} must be an array` });
    }
    return this;
  }

  unique(value: any[], field: string): this {
    if (value && Array.isArray(value)) {
      const uniqueValues = new Set(value);
      if (uniqueValues.size !== value.length) {
        this.errors.push({ field, message: `${field} must contain unique values` });
      }
    }
    return this;
  }

  getResult(): ValidationResult {
    const result = {
      isValid: this.errors.length === 0,
      errors: this.errors
    };
    this.errors = []; // Reset for next validation
    return result;
  }
}

// =============================================
// Validation Schema Definitions
// =============================================

export const authSchemas = {
  signup: (data: any): ValidationResult => {
    const validator = new Validator();
    
    validator
      .required(data.auth0UserId, 'auth0UserId')
      .maxLength(data.auth0UserId, 255, 'auth0UserId');
    
    validator
      .required(data.email, 'email')
      .email(data.email, 'email')
      .maxLength(data.email, 255, 'email');
    
    validator
      .required(data.name, 'name')
      .minLength(data.name, 1, 'name')
      .maxLength(data.name, 255, 'name')
      .pattern(data.name, /^[a-zA-Z\s\-'.]+$/, 'name', 'Name can only contain letters, spaces, hyphens, apostrophes, and periods');
    
    if (data.avatar) {
      validator.url(data.avatar, 'avatar');
    }

    return validator.getResult();
  },

  updateProfile: (data: any): ValidationResult => {
    const validator = new Validator();
    
    if (data.name) {
      validator
        .minLength(data.name, 1, 'name')
        .maxLength(data.name, 255, 'name')
        .pattern(data.name, /^[a-zA-Z\s\-'.]+$/, 'name', 'Name can only contain letters, spaces, hyphens, apostrophes, and periods');
    }

    if (data.username) {
      validator
        .minLength(data.username, 3, 'username')
        .maxLength(data.username, 30, 'username')
        .pattern(data.username, /^[a-zA-Z0-9]+$/, 'username', 'Username can only contain letters and numbers');
    }

    if (data.bio) {
      validator.maxLength(data.bio, 500, 'bio');
    }

    if (data.location) {
      validator.maxLength(data.location, 255, 'location');
    }

    if (data.phone) {
      validator.pattern(data.phone, /^\+?[1-9]\d{1,14}$/, 'phone', 'Please provide a valid phone number');
    }

    if (data.interests) {
      validator
        .array(data.interests, 'interests')
        .unique(data.interests, 'interests');
      
      if (Array.isArray(data.interests)) {
        if (data.interests.length > 10) {
          validator.errors.push({ field: 'interests', message: 'Cannot have more than 10 interests' });
        }
        data.interests.forEach((interest: any, index: number) => {
          if (typeof interest !== 'string' || interest.length > 50) {
            validator.errors.push({ field: `interests[${index}]`, message: 'Each interest must be a string with max 50 characters' });
          }
        });
      }
    }

    return validator.getResult();
  },

  verifyPhone: (data: any): ValidationResult => {
    const validator = new Validator();
    
    validator
      .required(data.phone, 'phone')
      .pattern(data.phone, /^\+?[1-9]\d{1,14}$/, 'phone', 'Please provide a valid phone number');
    
    validator
      .required(data.verificationCode, 'verificationCode')
      .pattern(data.verificationCode, /^\d{6}$/, 'verificationCode', 'Verification code must be 6 digits');

    return validator.getResult();
  }
};

export const socialAccountSchemas = {
  connect: (data: any): ValidationResult => {
    const validator = new Validator();
    const validPlatforms = ['google', 'facebook', 'linkedin', 'twitter', 'instagram', 'github', 'apple', 'microsoft'];
    
    validator
      .required(data.platform, 'platform')
      .oneOf(data.platform, validPlatforms, 'platform');
    
    validator
      .required(data.oauthToken, 'oauthToken')
      .maxLength(data.oauthToken, 2048, 'oauthToken');
    
    validator
      .required(data.platformUserId, 'platformUserId')
      .maxLength(data.platformUserId, 255, 'platformUserId');
    
    validator
      .required(data.username, 'username')
      .maxLength(data.username, 255, 'username');

    if (data.displayName) {
      validator.maxLength(data.displayName, 255, 'displayName');
    }

    if (data.followerCount !== undefined) {
      validator.min(data.followerCount, 0, 'followerCount').integer(data.followerCount, 'followerCount');
    }

    if (data.followingCount !== undefined) {
      validator.min(data.followingCount, 0, 'followingCount').integer(data.followingCount, 'followingCount');
    }

    if (data.profileUrl) {
      validator.url(data.profileUrl, 'profileUrl');
    }

    if (data.avatarUrl) {
      validator.url(data.avatarUrl, 'avatarUrl');
    }

    if (data.bio) {
      validator.maxLength(data.bio, 500, 'bio');
    }

    return validator.getResult();
  }
};

export const reviewSchemas = {
  createReview: (data: any): ValidationResult => {
    const validator = new Validator();
    const validCategories = [
      'Professional', 'Social Scoop', 'Roommate Ripple', 'Service Sundae',
      'Financial Float', 'Healthcare Swirl', 'Education Cone', 'Volunteer Vanilla',
      'Neighbor Neapolitan', 'Online Transaction', 'Event Organizer', 'Sweet Other'
    ];
    
    validator
      .required(data.reviewedUserId, 'reviewedUserId')
      .integer(data.reviewedUserId, 'reviewedUserId')
      .min(data.reviewedUserId, 1, 'reviewedUserId');
    
    validator
      .required(data.content, 'content')
      .minLength(data.content, 10, 'content')
      .maxLength(data.content, 2000, 'content');
    
    validator
      .required(data.category, 'category')
      .oneOf(data.category, validCategories, 'category');

    if (data.tags) {
      validator.array(data.tags, 'tags').unique(data.tags, 'tags');
      if (Array.isArray(data.tags)) {
        if (data.tags.length > 5) {
          validator.errors.push({ field: 'tags', message: 'Cannot have more than 5 tags' });
        }
        data.tags.forEach((tag: any, index: number) => {
          if (typeof tag !== 'string' || tag.length > 30) {
            validator.errors.push({ field: `tags[${index}]`, message: 'Each tag must be a string with max 30 characters' });
          }
        });
      }
    }

    if (data.isEventReview && !data.eventId) {
      validator.errors.push({ field: 'eventId', message: 'Event ID is required for event reviews' });
    }

    if (data.eventId) {
      validator.integer(data.eventId, 'eventId').min(data.eventId, 1, 'eventId');
    }

    return validator.getResult();
  },

  voteOnReview: (data: any): ValidationResult => {
    const validator = new Validator();
    
    validator
      .required(data.reviewId, 'reviewId')
      .integer(data.reviewId, 'reviewId')
      .min(data.reviewId, 1, 'reviewId');
    
    validator
      .required(data.voteType, 'voteType')
      .oneOf(data.voteType, ['up', 'down'], 'voteType');

    return validator.getResult();
  }
};

export const eventSchemas = {
  createEvent: (data: any): ValidationResult => {
    const validator = new Validator();
    const validCategories = [
      'Networking', 'Ice Cream Social', 'Professional', 'Fitness Scoop',
      'Technology', 'Arts & Culture', 'Food & Flavor', 'Outdoors',
      'Sweet Workshop', 'Sports', 'Community Cone', 'Other'
    ];
    
    validator
      .required(data.title, 'title')
      .minLength(data.title, 5, 'title')
      .maxLength(data.title, 255, 'title');
    
    validator
      .required(data.description, 'description')
      .minLength(data.description, 20, 'description')
      .maxLength(data.description, 5000, 'description');
    
    validator
      .required(data.category, 'category')
      .oneOf(data.category, validCategories, 'category');
    
    validator.required(data.eventDate, 'eventDate');
    if (data.eventDate) {
      const eventDate = new Date(data.eventDate);
      const now = new Date();
      if (eventDate < now) {
        validator.errors.push({ field: 'eventDate', message: 'Event date cannot be in the past' });
      }
      const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      if (eventDate > oneYearFromNow) {
        validator.errors.push({ field: 'eventDate', message: 'Event date cannot be more than 1 year in the future' });
      }
    }

    validator
      .required(data.startTime, 'startTime')
      .pattern(data.startTime, /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'startTime', 'Start time must be in HH:MM format');
    
    validator
      .required(data.endTime, 'endTime')
      .pattern(data.endTime, /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'endTime', 'End time must be in HH:MM format');
    
    validator
      .required(data.locationName, 'locationName')
      .maxLength(data.locationName, 255, 'locationName');
    
    validator
      .required(data.address, 'address')
      .maxLength(data.address, 500, 'address');

    if (data.maxAttendees !== undefined) {
      validator.integer(data.maxAttendees, 'maxAttendees').min(data.maxAttendees, 2, 'maxAttendees').max(data.maxAttendees, 10000, 'maxAttendees');
    }

    if (data.priceCents !== undefined) {
      validator.integer(data.priceCents, 'priceCents').min(data.priceCents, 0, 'priceCents').max(data.priceCents, 100000000, 'priceCents');
    }

    if (data.trustRequirement !== undefined) {
      validator.integer(data.trustRequirement, 'trustRequirement').min(data.trustRequirement, 0, 'trustRequirement').max(data.trustRequirement, 100, 'trustRequirement');
    }

    return validator.getResult();
  }
};

// =============================================
// Express Middleware Functions
// =============================================

export function validateBody(schemaValidator: (data: any) => ValidationResult) {
  return (req: any, res: any, next: any) => {
    const result = schemaValidator(req.body);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: result.errors.map(e => e.message).join('; '),
          fields: result.errors
        }
      });
    }

    // Continue with validated data
    next();
  };
}

export function validateQuery(schemaValidator: (data: any) => ValidationResult) {
  return (req: any, res: any, next: any) => {
    const result = schemaValidator(req.query);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: result.errors.map(e => e.message).join('; '),
          fields: result.errors
        }
      });
    }

    next();
  };
}

export function validateParams(schemaValidator: (data: any) => ValidationResult) {
  return (req: any, res: any, next: any) => {
    const result = schemaValidator(req.params);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid route parameters',
          details: result.errors[0]?.message || 'Invalid parameters'
        }
      });
    }

    next();
  };
}

// Export validation schemas
export const validationSchemas = {
  auth: authSchemas,
  socialAccounts: socialAccountSchemas,
  reviews: reviewSchemas,
  events: eventSchemas
};

export default validationSchemas; 