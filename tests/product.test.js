const request = require('supertest');
const app = require('../app');

describe('GET /products', () => {
  it('harus menampilkan daftar produk', async () => {
    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /products/:id', () => {
  it('harus menampilkan detail produk', async () => {
    const res = await request(app).get('/products/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Laptop');
  });

  it('harus 404 kalau id tidak ditemukan', async () => {
    const res = await request(app).get('/products/999');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Produk tidak ditemukan');
  });
});

describe('POST /products', () => {
  it('harus membuat produk baru dengan status 201', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Monitor', price: 2000000 });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(4);
    expect(res.body.name).toBe('Monitor');
    expect(res.body.price).toBe(2000000);
  });

  it('harus 400 kalau data tidak lengkap', async () => {
    const res = await request(app).post('/products').send({ name: 'Headset' });

    expect(res.statusCode).toBe(400);
  });

  it('harus 400 kalau price negatif', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Headset', price: -1 });

    expect(res.statusCode).toBe(400);
  });

  it('harus 400 kalau price bukan angka', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Headset', price: 'abc' });

    expect(res.statusCode).toBe(400);
  });
});
