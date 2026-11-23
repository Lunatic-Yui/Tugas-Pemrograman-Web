import { useCallback, useEffect, useState } from 'react';
import * as api from './api';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { type: 'ok' | 'err', text }

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
    notify('ok', `Berhasil menambah "${product.name}"`);
  }

  async function handleUpdate(id, data) {
    const product = await api.update(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    notify('ok', `Produk "${product.name}" berhasil diubah`);
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
      <h1>Products Manager</h1>
      <p className="subtitle">
        Tugas Pengaplikasian React untuk Development Frontend — mengonsumsi API
        Express + Prisma di <code>/products</code>
      </p>

      {message && <div className={`msg ${message.type}`}>{message.text}</div>}

      <div className="card">
        <h2>Tambah produk</h2>
        <ProductForm onSubmit={handleCreate} />
      </div>

      <div className="card">
        <h2>Daftar produk</h2>
        {loading ? (
          <div className="loading">Memuat...</div>
        ) : (
          <ProductList
            products={products}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
