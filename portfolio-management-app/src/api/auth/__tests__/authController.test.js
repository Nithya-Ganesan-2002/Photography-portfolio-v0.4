const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../authController');

// Mock bcrypt and jwt
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Authentication Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(() => {
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('mockToken');
    });

    it('should register a new user successfully', async () => {
      req.body = validUser;

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        token: 'mockToken'
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { username: 'testuser' };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All fields are required'
      });
    });

    it('should return 400 if user already exists', async () => {
      // Register first user
      req.body = validUser;
      await authController.register(req, res);

      // Try to register same user again
      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists'
      });
    });
  });

  describe('login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(async () => {
      // Register a user first
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('mockToken');

      req.body = {
        username: 'testuser',
        ...validCredentials
      };
      await authController.register(req, res);
      jest.clearAllMocks();
    });

    it('should login user successfully with valid credentials', async () => {
      req.body = validCredentials;
      bcrypt.compare.mockResolvedValue(true);

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mockToken'
      });
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { email: 'test@example.com' };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All fields are required'
      });
    });

    it('should return 400 for invalid credentials', async () => {
      req.body = validCredentials;
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });
  });

  describe('requestPasswordReset', () => {
    beforeEach(async () => {
      // Register a user first
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      await authController.register(req, res);
      jest.clearAllMocks();
    });

    it('should generate reset token for valid email', async () => {
      req.body = { email: 'test@example.com' };

      await authController.requestPasswordReset(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Password reset token generated',
          resetToken: expect.any(String)
        })
      );
    });

    it('should return 400 if email is missing', async () => {
      req.body = {};

      await authController.requestPasswordReset(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email is required'
      });
    });

    it('should return 400 if user not found', async () => {
      req.body = { email: 'nonexistent@example.com' };

      await authController.requestPasswordReset(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });
  });

  describe('resetPassword', () => {
    let resetToken;

    beforeEach(async () => {
      // Register a user and request password reset
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      await authController.register(req, res);
      
      req.body = { email: 'test@example.com' };
      await authController.requestPasswordReset(req, res);
      resetToken = res.json.mock.calls[0][0].resetToken;
      
      jest.clearAllMocks();
    });

    it('should reset password successfully with valid token', async () => {
      req.body = {
        token: resetToken,
        newPassword: 'newpassword123'
      };

      await authController.resetPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset successful'
      });
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { token: resetToken };

      await authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All fields are required'
      });
    });

    it('should return 400 for invalid reset token', async () => {
      req.body = {
        token: 'invalid-token',
        newPassword: 'newpassword123'
      };

      await authController.resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired reset token'
      });
    });
  });
});