const request = require('supertest');
const app = require('../index'); // Assuming your main app file is index.js

describe('User API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  // Add more test cases for login, logout, etc.
});
