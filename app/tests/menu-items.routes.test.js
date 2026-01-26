const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const menuItemsRoutes = require('../backend/routes/menuItemsRoutes');
const MenuItem = require('../backend/schemas/MenuItem');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/menuitems', menuItemsRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await MenuItem.deleteMany({});
});

describe('MenuItems Routes', () => {
  test('POST /add-menu-item - creates a new menu item', async () => {
    const res = await request(app)
      .post('/api/menuitems/add-menu-item')
      .send({
        name: 'Veggie Burger',
        description: 'Plant-based patty with lettuce and tomato',
        ingredients: ['Lettuce', 'Tomato', 'Vegan Patty'],
        allergens: ['Soy'],
        menuIDs: ['menu123']
      })
      .expect(201);

    expect(res.body.name).toBe('Veggie Burger');
    expect(res.body.allergens).toContain('Soy');
  });

  test('GET / - returns all menu items', async () => {
    await MenuItem.create({ name: 'Fries', menuIDs: ['menu1'] });

    const res = await request(app)
      .get('/api/menuitems')
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Fries');
  });

  test('PUT /:id - updates a menu item', async () => {
    const item = await MenuItem.create({ name: 'Pasta', allergens: [] });

    const res = await request(app)
      .put(`/api/menuitems/${item._id}`)
      .send({ name: 'Spaghetti', allergens: ['Gluten'] })
      .expect(200);

    expect(res.body.name).toBe('Spaghetti');
    expect(res.body.allergens).toContain('Gluten');
  });

  test('DELETE /:id - deletes a menu item', async () => {
    const item = await MenuItem.create({ name: 'Soup' });

    await request(app)
      .delete(`/api/menuitems/${item._id}`)
      .expect(200);

    const deleted = await MenuItem.findById(item._id);
    expect(deleted).toBeNull();
  });
});
