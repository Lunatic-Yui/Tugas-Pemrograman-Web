import { useCallback, useEffect, useState } from 'react';
import * as api from './api';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const notify = useCallback((type, text) => {
    setMessage({ type, text });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await api.getAll());
    } catch (err) {
      notify('err', err.message);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(data) {
    const product = await api.create(data);
    setProducts((prev) => [...prev, product].sort((a, b) => a.id - b.id));
    notify('ok', `Produk "${product.name}" berhasil ditambahkan`);
  }

  async function handleUpdate(id, data) {
    const product = await api.update(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    notify('ok', `Produk "${product.name}" berhasil diperbarui`);
  }

  async function handleDelete(id) {
    try {
      await api.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      notify('ok', 'Produk berhasil dihapus');
    } catch (err) {
      notify('err', err.message);
    }
  }

  return (
    <div className="container">
      <header className="hero">
        <div className="badge">Product Manager</div>
        <h1>Daftar Produk</h1>
        <p className="subtitle">
          Frontend React untuk Tugas Pemrograman Web, terhubung ke API{' '}
          <code>/products</code> milik backend Express + Prisma
        </p>
      </header>

      {message && <div className={`msg ${message.type}`}>{message.text}</div>}

      <section className="card">
        <h2>Tambah Produk</h2>
        <ProductForm onSubmit={handleCreate} />
      </section>

      <section className="card">
        <h2>Daftar Produk</h2>
        {loading ? (
          <div className="loading">Memuat data</div>
        ) : (
          <ProductList
            products={products}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </section>

      <footer className="foot">
        Dibuat dengan React + Vite, data dari SQLite lewat Prisma
      </footer>
    </div>
  );
}
