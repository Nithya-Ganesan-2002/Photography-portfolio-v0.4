import {
  validateLoginForm,
  validateRegistrationForm,
  validatePasswordResetForm,
  formatApiError,
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
  PASSWORD_REQUIREMENTS
} from '../validation';

describe('Validation Utilities', () => {
  describe('Regular Expressions', () => {
    describe('EMAIL_REGEX', () => {
      it('should validate correct email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.com',
          'user+tag@domain.co.uk'
        ];
        validEmails.forEach(email => {
          expect(EMAIL_REGEX.test(email)).toBe(true);
        });
      });

      it('should reject invalid email formats', () => {
        const invalidEmails = [
          'test@',
          '@domain.com',
          'test@domain',
          'test.domain.com',
          'test@domain.'
        ];
        invalidEmails.forEach(email => {
          expect(EMAIL_REGEX.test(email)).toBe(false);
        });
      });
    });

    describe('USERNAME_REGEX', () => {
      it('should validate correct username formats', () => {
        const validUsernames = [
          'user123',
          'user_name',
          'user-name',
          'abc123'
        ];
        validUsernames.forEach(username => {
          expect(USERNAME_REGEX.test(username)).toBe(true);
        });
      });

      it('should reject invalid username formats', () => {
        const invalidUsernames = [
          'ab', // too short
          'a'.repeat(21), // too long
          'user@name', // invalid character
          'user name', // space not allowed
          'user#name' // special character not allowed
        ];
        invalidUsernames.forEach(username => {
          expect(USERNAME_REGEX.test(username)).toBe(false);
        });
      });
    });

    describe('PASSWORD_REGEX', () => {
      it('should validate correct password formats', () => {
        const validPasswords = [
          'Password1!',
          'StrongP@ss1',
          'C0mplex!ty'
        ];
        validPasswords.forEach(password => {
          expect(PASSWORD_REGEX.test(password)).toBe(true);
        });
      });

      it('should reject invalid password formats', () => {
        const invalidPasswords = [
          'password', // no uppercase, number, or special char
          'Password', // no number or special char
          'password1', // no uppercase or special char
          'Password!', // no number
          'Pass1!' // too short
        ];
        invalidPasswords.forEach(password => {
          expect(PASSWORD_REGEX.test(password)).toBe(false);
        });
      });
    });
  });

  describe('validateLoginForm', () => {
    it('should return no errors for valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password1!'
      };
      const errors = validateLoginForm(validData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return errors for missing fields', () => {
      const errors = validateLoginForm({});
      expect(errors).toHaveProperty('email', 'Email is required');
      expect(errors).toHaveProperty('password', 'Password is required');
    });

    it('should validate email format', () => {
      const errors = validateLoginForm({
        email: 'invalid-email',
        password: 'Password1!'
      });
      expect(errors).toHaveProperty('email', 'Please enter a valid email address');
    });

    it('should validate password length', () => {
      const errors = validateLoginForm({
        email: 'test@example.com',
        password: 'short'
      });
      expect(errors).toHaveProperty('password', 'Password must be at least 8 characters long');
    });
  });

  describe('validateRegistrationForm', () => {
    it('should return no errors for valid registration data', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      };
      const errors = validateRegistrationForm(validData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return errors for missing fields', () => {
      const errors = validateRegistrationForm({});
      expect(errors).toHaveProperty('username', 'Username is required');
      expect(errors).toHaveProperty('email', 'Email is required');
      expect(errors).toHaveProperty('password', 'Password is required');
      expect(errors).toHaveProperty('confirmPassword', 'Please confirm your password');
    });

    it('should validate username length', () => {
      const errors = validateRegistrationForm({
        username: 'ab',
        email: 'test@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });
      expect(errors).toHaveProperty('username', 'Username must be at least 3 characters long');
    });

    it('should validate password match', () => {
      const errors = validateRegistrationForm({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password1!',
        confirmPassword: 'DifferentPassword1!'
      });
      expect(errors).toHaveProperty('confirmPassword', 'Passwords do not match');
    });
  });

  describe('validatePasswordResetForm', () => {
    it('should return no errors for valid email', () => {
      const errors = validatePasswordResetForm({
        email: 'test@example.com'
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return error for missing email', () => {
      const errors = validatePasswordResetForm({});
      expect(errors).toHaveProperty('email', 'Email is required');
    });

    it('should validate email format', () => {
      const errors = validatePasswordResetForm({
        email: 'invalid-email'
      });
      expect(errors).toHaveProperty('email', 'Please enter a valid email address');
    });
  });

  describe('formatApiError', () => {
    it('should handle string errors', () => {
      expect(formatApiError('Error message')).toBe('Error message');
    });

    it('should handle error objects with response data', () => {
      const error = {
        response: {
          data: {
            message: 'API error message'
          }
        }
      };
      expect(formatApiError(error)).toBe('API error message');
    });

    it('should handle error objects with message property', () => {
      const error = {
        message: 'Error message'
      };
      expect(formatApiError(error)).toBe('Error message');
    });

    it('should return default message for unknown error format', () => {
      expect(formatApiError({})).toBe('An unexpected error occurred. Please try again.');
    });
  });
});