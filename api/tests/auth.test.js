const request = require('supertest');
const app = require('../server');
const { getPool } = require('../config/database');

describe('Authentication API', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'password123',
    full_name: 'Test User'
  };
  
  let authToken;
  
  beforeAll(async () => {
    const pool = getPool();
    await pool.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
  });
  
  afterAll(async () => {
    const pool = getPool();
    await pool.execute('DELETE FROM users WHERE email = ?', [testUser.email]);
  });
  
  // Register tests
  test('POST /auth/register - should register successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser)
      .expect(201);
    
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });
  
  test('POST /auth/register - should fail with duplicate email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser)
      .expect(409);
    
    expect(res.body.success).toBe(false);
  });
  
  test('POST /auth/register - should fail with invalid data', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'invalid', password: 'short', full_name: 'T' })
      .expect(400);
  });
  
  // Login tests
  test('POST /auth/login - should login successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);
    
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });
  
  test('POST /auth/login - should fail with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: 'wrong' })
      .expect(401);
    
    expect(res.body.success).toBe(false);
  });
  
  // Profile tests
  test('GET /users/me - should get profile with token', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email);
  });
  
  test('GET /users/me - should fail without token', async () => {
    await request(app)
      .get('/users/me')
      .expect(401);
  });
  
  // Logout test
  test('POST /auth/logout - should logout successfully', async () => {
    await request(app)
      .post('/auth/logout')
      .expect(200);
  });
});
