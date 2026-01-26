const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cookieParser = require('cookie-parser');
const adminRoutes = require('../backend/routes/admin.routes');
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
  app.use('/api/admin', adminRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Admin Routes', () => {
  test('POST /get-user-list - returns users for same business', async () => {
    const businessId = new mongoose.Types.ObjectId().toString();

    await User.create([
      {
        first_name: 'Admin',
        last_name: 'Owner',
        email: 'admin@test.com',
        password: 'Test123!',
        business_id: businessId,
        admin: true,
      },
      {
        first_name: 'User',
        last_name: 'One',
        email: 'user1@test.com',
        password: 'Test123!',
        business_id: businessId,
        admin: false,
      },
      {
        first_name: 'User',
        last_name: 'Other',
        email: 'other@test.com',
        password: 'Test123!',
        business_id: new mongoose.Types.ObjectId().toString(),
        admin: false,
      },
    ]);

    const res = await request(app)
      .post('/api/admin/get-user-list')
      .set('Cookie', [`email=admin@test.com`])
      .expect(200);

    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).not.toHaveProperty('_id');
  });

  test('POST /change-admin-status - promotes a user', async () => {
    await User.create({
      first_name: 'Target',
      last_name: 'User',
      email: 'target@test.com',
      password: 'Test123!',
      admin: false,
    });

    const res = await request(app)
      .post('/api/admin/change-admin-status')
      .send({ action: 'promote', targetEmail: 'target@test.com' })
      .expect(200);

    const updated = await User.findOne({ email: 'target@test.com' });
    expect(updated.admin).toBe(true);
  });

  test('POST /remove-user-access - clears business_id', async () => {
    const bizId = new mongoose.Types.ObjectId().toString();

    await User.create([
      {
        first_name: 'Owner',
        last_name: 'User',
        email: 'owner@test.com',
        password: 'Test123!',
        business_id: bizId,
        admin: true,
      },
      {
        first_name: 'Remove',
        last_name: 'Me',
        email: 'remove@test.com',
        password: 'Test123!',
        business_id: bizId,
        admin: false,
      },
    ]);

    const res = await request(app)
      .post('/api/admin/remove-user-access')
      .set('Cookie', [`email=owner@test.com`])
      .send({ email: 'remove@test.com' })
      .expect(200);

    const updated = await User.findOne({ email: 'remove@test.com' });
    expect(updated.business_id).toBe('');
  });

  test('POST /add-user-access - assigns business and admin', async () => {
    const bizId = new mongoose.Types.ObjectId().toString();

    await User.create([
      {
        first_name: 'Existing',
        last_name: 'Admin',
        email: 'existing@test.com',
        password: 'Test123!',
        business_id: bizId,
        admin: true,
      },
      {
        first_name: 'Target',
        last_name: 'User',
        email: 'target@test.com',
        password: 'Test123!',
        admin: false,
      },
    ]);

    const res = await request(app)
      .post('/api/admin/add-user-access')
      .set('Cookie', [`email=existing@test.com`])
      .send({ email: 'target@test.com', status: 'admin' })
      .expect(200);

    const updated = await User.findOne({ email: 'target@test.com' });
    expect(updated.business_id).toBe(bizId);
    expect(updated.admin).toBe(true);
  });

  test('POST /change-admin-status - handles invalid action', async () => {
    await User.create({
      first_name: 'Bad',
      last_name: 'Action',
      email: 'bad@test.com',
      password: 'Test123!',
      admin: false,
    });

    const res = await request(app)
      .post('/api/admin/change-admin-status')
      .send({ action: 'makeKing', targetEmail: 'bad@test.com' })
      .expect(400);

    expect(res.body.error).toMatch(/Unknown action/i);
  });
});
