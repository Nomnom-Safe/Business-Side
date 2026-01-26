const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const businessRoutes = require('../backend/routes/businessRoutes');
const Business = require('../backend/schemas/Business');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use('/api/businesses', businessRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Business.deleteMany({});
});

describe('Business Routes', () => {
  test('POST /api/businesses - creates a new business', async () => {
    const businessData = {
      name: 'Test Business',
      url: 'http://test.com',
      address: '123 Test St',
      allergens: ['peanuts'],
      diets: ['vegan']
    };

    const res = await request(app)
      .post('/api/businesses')
      .send(businessData)
      .expect(201);

    expect(res.body.name).toBe('Test Business');
    expect(res.body.allergens).toContain('peanuts');
  });

  test('GET /api/businesses - returns all businesses', async () => {
    await Business.create({ name: 'One Biz' });

    const res = await request(app)
      .get('/api/businesses')
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('One Biz');
  });

  test('GET /api/businesses/:id - returns a business by ID', async () => {
    const biz = await Business.create({ name: 'Detail Biz' });

    const res = await request(app)
      .get(`/api/businesses/${biz._id}`)
      .expect(200);

    expect(res.body.name).toBe('Detail Biz');
  });

  test('PUT /api/businesses/:id - updates a business', async () => {
    const biz = await Business.create({ name: 'Old Name' });

    const res = await request(app)
      .put(`/api/businesses/${biz._id}`)
      .send({ name: 'New Name' })
      .expect(200);

    expect(res.body.name).toBe('New Name');
  });

  test('DELETE /api/businesses/:id - deletes a business', async () => {
    const biz = await Business.create({ name: 'To Delete' });

    await request(app)
      .delete(`/api/businesses/${biz._id}`)
      .expect(200);

    const deleted = await Business.findById(biz._id);
    expect(deleted).toBeNull();
  });

  test('POST /api/businesses - fails with duplicate name', async () => {
    await Business.create({ name: 'Duplicate' });

    const res = await request(app)
      .post('/api/businesses')
      .send({ name: 'Duplicate' })
      .expect(400);

    expect(res.body.error).toMatch(/already exists/i);
  });

  test('PUT /api/businesses/:id - fails with duplicate name', async () => {
    const first = await Business.create({ name: 'Biz One' });
    const second = await Business.create({ name: 'Biz Two' });

    const res = await request(app)
      .put(`/api/businesses/${second._id}`)
      .send({ name: 'Biz One' })
      .expect(400);

    expect(res.body.error).toMatch(/already exists/i);
  });

  test('GET /api/businesses/:id - returns 404 if not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    await request(app)
      .get(`/api/businesses/${fakeId}`)
      .expect(404);
  });
});
