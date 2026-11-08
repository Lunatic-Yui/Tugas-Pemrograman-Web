const request = require('supertest');
const app = require('../app');
const prisma = require('../lib/prisma');

let seeded;

beforeEach(async () => {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { name: 'Laptop', price: 7500000 },
      { name: 'Mouse', price: 150000 },
      { name: 'Keyboard', price: 350000 }
    ]
  });
  seeded = await prisma.product.findMany({ orderBy: { id: 'asc' } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /products', () => {
  it('harus menampilkan seluruh data', async () => {
    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].name).toBe('Laptop');
  });
});

describe('GET /products/:id', () => {
  it('harus menampilkan detail produk', async () => {
    const res = await request(app).get('/products/' + seeded[0].id);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Laptop');
  });

  it('harus 404 kalau id tidak ditemukan', async () => {
    const res = await request(app).get('/products/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Produk tidak ditemukan');
  });
});

describe('POST /products', () => {
  it('harus membuat data baru dengan status 201', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Monitor', price: 2000000 });

    expect(res.statusCode).toBe(201);
    expect(typeof res.body.id).toBe('number');
    expect(res.body.name).toBe('Monitor');
    expect(res.body.price).toBe(2000000);

    const count = await prisma.product.count();
    expect(count).toBe(4);
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

describe('PUT /products', () => {
  it('harus mengupdate data lewat id di body', async () => {
    const res = await request(app)
      .put('/products')
      .send({ id: seeded[1].id, name: 'Mouse Gaming', price: 250000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(seeded[1].id);
    expect(res.body.name).toBe('Mouse Gaming');
    expect(res.body.price).toBe(250000);
  });

  it('harus mengupdate data lewat id di URL', async () => {
    const res = await request(app)
      .put('/products/' + seeded[2].id)
      .send({ name: 'Keyboard Mekanik', price: 600000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Keyboard Mekanik');
  });

  it('harus 404 kalau id tidak ditemukan', async () => {
    const res = await request(app)
      .put('/products')
      .send({ id: 999999, name: 'X', price: 1000 });
    expect(res.statusCode).toBe(404);
  });

  it('harus 400 kalau id tidak dikirim', async () => {
    const res = await request(app)
      .put('/products')
      .send({ name: 'X', price: 1000 });
    expect(res.statusCode).toBe(400);
  });

  it('harus 400 kalau data tidak valid', async () => {
    const res = await request(app)
      .put('/products')
      .send({ id: seeded[0].id, name: '', price: 1000 });
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /products/:id', () => {
  it('harus menghapus data berdasarkan id', async () => {
    const res = await request(app).delete('/products/' + seeded[0].id);

    expect(res.statusCode).toBe(200);
    expect(res.body.product.id).toBe(seeded[0].id);

    const check = await request(app).get('/products/' + seeded[0].id);
    expect(check.statusCode).toBe(404);
  });

  it('harus 404 kalau id tidak ditemukan', async () => {
    const res = await request(app).delete('/products/999999');
    expect(res.statusCode).toBe(404);
  });
});
