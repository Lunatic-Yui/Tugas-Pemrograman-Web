const express = require('express');
const path = require('path');
const fs = require('fs');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());

// API dulu, biar gak kena catch-all static di bawah
app.use('/products', productRoutes);

// di production, Express nge-serve hasil build React (frontend/dist).
// di dev tetap pakai public/index.html + vite dev server.
const frontendDist = path.join(__dirname, 'frontend', 'dist');
const hasFrontendBuild = fs.existsSync(path.join(frontendDist, 'index.html'));

if (hasFrontendBuild) {
  app.use(express.static(frontendDist));

  // SPA fallback: semua route lain yang bukan API balikin index.html,
  // biar refresh di dalam aplikasi gak langsung 404.
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

module.exports = app;
