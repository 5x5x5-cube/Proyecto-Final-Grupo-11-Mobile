jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

import { httpClient } from '../httpClient';

const mockFetch = jest.fn();
(global as unknown as { fetch: jest.Mock }).fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe('httpClient', () => {
  describe('GET requests', () => {
    it('sends GET request to the correct URL with /api/v1 prefix', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await httpClient.get('/bookings');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/bookings'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('appends query params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await httpClient.get('/bookings', { params: { userId: 'abc', status: 'pending' } });

      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain('userId=abc');
      expect(calledUrl).toContain('status=pending');
    });
  });

  describe('POST requests', () => {
    it('sends POST with JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 'new', status: 'pending' }),
      });

      const result = await httpClient.post('/bookings', {
        body: { roomId: '123', guests: 2 },
      });

      expect(result).toEqual({ id: 'new', status: 'pending' });
      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toHaveProperty('roomId', '123');
    });
  });

  describe('error handling', () => {
    it('throws on non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: async () => ({ code: 'ROOM_HELD', message: 'Room is held' }),
      });

      await expect(httpClient.post('/bookings', { body: {} })).rejects.toMatchObject({
        status: 409,
        code: 'ROOM_HELD',
      });
    });

    it('handles 204 No Content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await httpClient.delete('/bookings/123');
      expect(result).toBeUndefined();
    });
  });

  describe('HTTP methods', () => {
    it.each([
      ['put', 'PUT'],
      ['patch', 'PATCH'],
      ['delete', 'DELETE'],
    ] as const)('httpClient.%s sends %s method', async (method, httpMethod) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient[method]('/test');

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe(httpMethod);
    });
  });
});
