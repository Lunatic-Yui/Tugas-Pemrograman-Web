const products = require('../data/products');

const getAllProducts = (req, res) => {
  res.status(200).json(products);
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.status(200).json(product);
};

const createProduct = (req, res) => {
  const { name, price } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'name wajib diisi' });
  }

  if (typeof price !== 'number' || isNaN(price) || price <= 0) {
    return res.status(400).json({ message: 'price harus angka lebih dari 0' });
  }

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name: name.trim(),
    price: price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

module.exports = { getAllProducts, getProductById, createProduct };
