const prisma = require('../lib/prisma');

const handle = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res)).catch(next);

const parseId = (value) => {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const validateBody = ({ name, price } = {}) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'name wajib diisi';
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
    return 'price harus angka lebih dari 0';
  }
  return null;
};

const getAllProducts = handle(async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  res.status(200).json(products);
});

const getProductById = handle(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'id harus angka bulat positif' });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.status(200).json(product);
});

const createProduct = handle(async (req, res) => {
  const error = validateBody(req.body);
  if (error) return res.status(400).json({ message: error });

  const product = await prisma.product.create({
    data: { name: req.body.name.trim(), price: req.body.price }
  });

  res.status(201).json(product);
});

const updateProduct = handle(async (req, res) => {
  const body = req.body || {};
  const id = parseId(req.params.id !== undefined ? req.params.id : body.id);
  if (id === null) {
    return res.status(400).json({ message: 'id harus angka bulat positif' });
  }

  const error = validateBody(body);
  if (error) return res.status(400).json({ message: error });

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name: body.name.trim(), price: body.price }
    });
    res.status(200).json(product);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    throw err;
  }
});

const deleteProduct = handle(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'id harus angka bulat positif' });
  }

  try {
    const product = await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Produk berhasil dihapus', product });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    throw err;
  }
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
