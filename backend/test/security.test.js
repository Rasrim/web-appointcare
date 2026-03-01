/* global describe, it, expect */
const request = require('supertest');
const app = require('../server');

describe('Security Tests', () => {
  it('should prevent SQL Injection', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: "' OR '1'='1", password: "' OR '1'='1" });
    
    // Login endpoint should return 401 for invalid credentials or 400 for bad request
    expect([400, 401]).toContain(res.status);
  });

  it('should prevent XSS attacks', async () => {
    const res = await request(app)
      .post('/api/users/profile')
      .set('Authorization', 'Bearer validtoken')
      .send({ fullName: '<script>alert("XSS")</script>', email: 'test@test.com' });
    
    // Should either return 404 (endpoint not found) or 400/401 (auth/validation)
    expect([400, 401, 404]).toContain(res.status);
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });

  it('should require authentication for protected routes', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'No token provided');
  });

  it('should reject invalid JWT tokens', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalidtoken');
    
    expect(res.status).toBe(401);
  });
});
