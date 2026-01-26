const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const menuRoutes = require('../backend/routes/menuRoutes');
const Menu = require('../backend/schemas/Menu');
const Business = require('../backend/schemas/Business');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/menus', menuRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Menu.deleteMany({});
  await Business.deleteMany({});
});

describe('Menu Routes', () => {
  test('POST / - creates a new menu and updates business', async () => {
    const business = await Business.create({
      name: 'Test Biz',
      url: 'http://biz.com',
      address: '123 Main St',
      allergens: [],
      menus: [],
      diets: []
    });

    const res = await request(app)
      .post('/api/menus')
      .send({
        title: 'Brunch Menu',
        description: 'Late morning items',
        restaurant: business._id
      })
      .expect(201);

    expect(res.body.title).toBe('Brunch Menu');

    const updatedBusiness = await Business.findById(business._id);
    expect(updatedBusiness.menus.length).toBe(1);
  });

  test('GET / - returns all menus with Master Menu first', async () => {
    await Menu.create([
      { title: 'Dinner Menu', restaurant: new mongoose.Types.ObjectId() },
      { title: 'Master Menu', restaurant: new mongoose.Types.ObjectId() }
    ]);

    const res = await request(app).get('/api/menus').expect(200);
    expect(res.body[0].title).toBe('Master Menu');
  });

  test('PUT /update-title-description - updates the latest menu title/description', async () => {
    const business = await Business.create({
      name: 'Editor Biz',
      url: 'http://editor.com',
      address: '456 Edit St',
      allergens: [],
      menus: [],
      diets: []
    });

    const menu = await Menu.create({
      title: 'Old Title',
      description: 'Old desc',
      restaurant: business._id
    });

    business.menus.push(menu._id);
    await business.save();

    const res = await request(app)
      .put('/api/menus/update-title-description')
      .send({
        businessId: business._id,
        title: 'New Title',
        description: 'New desc'
      })
      .expect(200);

    expect(res.body.title).toBe('New Title');
    expect(res.body.description).toBe('New desc');
  });

  test('DELETE /:id - deletes a menu and updates business', async () => {
    const business = await Business.create({
      name: 'DeleteMe',
      url: 'http://delete.com',
      address: '789 Bye St',
      allergens: [],
      menus: [],
      diets: []
    });

    const menu = await Menu.create({
      title: 'Delete Menu',
      restaurant: business._id
    });

    business.menus.push(menu._id);
    await business.save();

    await request(app)
      .delete(`/api/menus/${menu._id}`)
      .expect(200);

    const deleted = await Menu.findById(menu._id);
    expect(deleted).toBeNull();

    const updatedBiz = await Business.findById(business._id);
    expect(updatedBiz.menus.includes(menu._id)).toBe(false);
  });
});
