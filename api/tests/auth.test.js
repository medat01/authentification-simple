const request = require('supertest');
const app = require('../server');
const { getPool } = require('../config/database');

describe('Authentication API', () => {
  let testUser = {
    email: 'testuser@example.com',
    password: 'password123',
    full_name: 'Test User'
  };
  
  let authToken;
  
  beforeAll(async () => {
    // Clean up test user if exists
    const pool = getPool();
    await pool.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
  });
  
  afterAll(async () => {
    // Clean up test user
    const pool = getPool();
    await pool.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
  });
  
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.full_name).toBe(testUser.full_name);
    });
    
    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(409);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already registered');
    });
    
    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          full_name: 'Test User'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should fail with short password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'short',
          full_name: 'Test User'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('POST /auth/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });
    
    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });
    
    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /users/me', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(testUser.email);
    });
    
    it('should fail without token', async () => {
      const response = await request(app)
        .get('/users/me')
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .expect(200);
      
      expect(response.body.success).toBe(true);
    });
  });
});

