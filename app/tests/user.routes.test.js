const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('../backend/routes/user.routes');
const User = require('../backend/schemas/User');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', userRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Auth Routes', () => {
  test('POST /signup - creates a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'Test123!'
      })
      .expect(201);

    expect(res.body.email).toBe('jane@example.com');

    const userInDb = await User.findOne({ email: 'jane@example.com' });
    expect(userInDb).not.toBeNull();
  });

  test('POST /signin - logs in existing user', async () => {
    // First sign up the user
    await request(app).post('/api/auth/signup').send({
      first_name: 'John',
      last_name: 'Smith',
      email: 'john@example.com',
      password: 'Passw0rd!'
    });

    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'john@example.com', password: 'Passw0rd!' })
      .expect(200);

    expect(res.body.email).toBe('john@example.com');
  });

  test('POST /signin - rejects bad password', async () => {
    await request(app).post('/api/auth/signup').send({
      first_name: 'Rick',
      last_name: 'Sanchez',
      email: 'rick@example.com',
      password: 'PortalGun123'
    });

    await request(app)
      .post('/api/auth/signin')
      .send({ email: 'rick@example.com', password: 'WrongPass' })
      .expect(401);
  });

  test('POST /logout - clears cookies', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .expect(200);

    expect(res.body.message).toMatch(/logged out/i);
  });
});
