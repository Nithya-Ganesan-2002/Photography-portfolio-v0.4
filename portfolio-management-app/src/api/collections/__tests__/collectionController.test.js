const {
  createCollection,
  getUserCollections,
  updateCollection,
  deleteCollection
} = require('../collectionController');

describe('Collection Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      user: { id: 'test-user-id' },
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('createCollection', () => {
    it('should create a new collection with valid input', async () => {
      mockReq.body = {
        title: 'Test Collection',
        description: 'Test Description',
        privacy: 'public'
      };

      await createCollection(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Collection',
          description: 'Test Description',
          privacy: 'public',
          userId: 'test-user-id'
        })
      );
    });

    it('should return 400 if title is missing', async () => {
      mockReq.body = {
        description: 'Test Description'
      };

      await createCollection(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });

  describe('getUserCollections', () => {
    it('should return user collections', async () => {
      await getUserCollections(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
      expect(Array.isArray(mockRes.json.mock.calls[0][0])).toBeTruthy();
    });
  });

  describe('updateCollection', () => {
    it('should return 404 for non-existent collection', async () => {
      mockReq.params = { id: 'non-existent-id' };
      mockReq.body = { title: 'Updated Title' };

      await updateCollection(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });

  describe('deleteCollection', () => {
    it('should return 404 for non-existent collection', async () => {
      mockReq.params = { id: 'non-existent-id' };

      await deleteCollection(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });
});