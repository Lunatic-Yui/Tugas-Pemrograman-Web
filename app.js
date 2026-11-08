const express = require('express');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/products', productRoutes);

module.exports = app;
