// Validation rules for authentication forms
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Password strength requirements
export const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, message: 'At least 8 characters long' },
  { regex: /[A-Z]/, message: 'At least one uppercase letter' },
  { regex: /[a-z]/, message: 'At least one lowercase letter' },
  { regex: /[0-9]/, message: 'At least one number' },
  { regex: /[@$!%*#?&]/, message: 'At least one special character (@$!%*#?&)' }
];

// Field-specific error messages
export const ERROR_MESSAGES = {
  username: {
    required: 'Username is required',
    invalid: 'Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens'
  },
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    invalid: 'Password must meet all requirements',
    mismatch: 'Passwords do not match'
  }
};

// PUBLIC_INTERFACE
/**
 * Validates login form data
 * @param {Object} data - The form data to validate
 * @param {string} data.email - The email to validate
 * @param {string} data.password - The password to validate
 * @returns {Object} Object containing validation errors if any
 */
export const validateLoginForm = (data) => {
  const errors = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return errors;
};

// PUBLIC_INTERFACE
/**
 * Validates registration form data
 * @param {Object} data - The form data to validate
 * @param {string} data.username - The username to validate
 * @param {string} data.email - The email to validate
 * @param {string} data.password - The password to validate
 * @param {string} data.confirmPassword - The password confirmation to validate
 * @returns {Object} Object containing validation errors if any
 */
export const validateRegistrationForm = (data) => {
  const errors = {};

  // Username validation
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!PASSWORD_REGEX.test(data.password)) {
    errors.password = 'Password must be at least 8 characters long and include numbers and special characters';
  }

  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

// PUBLIC_INTERFACE
/**
 * Validates password reset form data
 * @param {Object} data - The form data to validate
 * @param {string} data.email - The email to validate
 * @returns {Object} Object containing validation errors if any
 */
export const validatePasswordResetForm = (data) => {
  const errors = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
};

// PUBLIC_INTERFACE
/**
 * Formats API error messages for display
 * @param {Error|string} error - The error to format
 * @returns {string} Formatted error message
 */
export const formatApiError = (error) => {
  if (typeof error === 'string') return error;
  
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};
