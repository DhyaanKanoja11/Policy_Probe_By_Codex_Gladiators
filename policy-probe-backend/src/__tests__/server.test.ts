import request from 'supertest';
import { app } from '../app';
import http from 'http';

// Mock fetch to prevent open handles when it attempts a network request
global.fetch = jest.fn() as jest.Mock;

describe('POST /api/analyze', () => {
  let server: http.Server;

  beforeAll((done) => {
    server = app.listen(0, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for an invalid URL format', async () => {
    const response = await request(server)
      .post('/api/analyze')
      .send({ url: 'not-a-valid-url' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid URL format.' });
  });

  it('should return 400 for a valid URL but fetch failure', async () => {
    // Mock the fetch to reject (simulate fetch failure)
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const response = await request(server)
      .post('/api/analyze')
      .send({ url: 'http://localhost:5001/this-does-not-exist' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Could not fetch URL. Please paste the text directly.');
  });

  it('should return 400 if provide nothing', async () => {
    const response = await request(server)
      .post('/api/analyze')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Provide an app name, URL, or policy text.' });
  });
});
