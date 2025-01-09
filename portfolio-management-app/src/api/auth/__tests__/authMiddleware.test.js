const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../authMiddleware');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock request, response, and next function
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should authenticate valid token and call next', () => {
    const mockDecodedToken = { id: 1, username: 'testuser' };
    jwt.verify.mockReturnValue(mockDecodedToken);
    
    req.headers['authorization'] = 'Bearer valid-token';

    authenticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(req.user).toEqual(mockDecodedToken);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authentication token required'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header is malformed', () => {
    req.headers['authorization'] = 'invalid-format';

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authentication token required'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    req.headers['authorization'] = 'Bearer invalid-token';

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid token'
    });
    expect(next).not.toHaveBeenCalled();
  });
});