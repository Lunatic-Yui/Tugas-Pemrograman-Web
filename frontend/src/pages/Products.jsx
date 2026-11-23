import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

function ProductForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !price) {
      setError('Nama dan harga wajib diisi');
      return;
    }
    if (Number(price) <= 0) {
      setError('Harga harus lebih dari 0');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), price });
      setName('');
      setPrice('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="pf-name" className="mb-1.5 block text-sm text-slate-400">
          Nama produk
        </label>
        <input
          id="pf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="cth: Kopi Robusta"
          autoComplete="off"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>
      <div>
        <label htmlFor="pf-price" className="mb-1.5 block text-sm text-slate-400">
          Harga (Rp)
        </label>
        <input
          id="pf-price"
          type="number"
          min="0"
          step="any"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="cth: 25000"
          autoComplete="off"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>
      <button
        disabled={saving}
        className="rounded-lg bg-gradient-to-br from-emerald-300 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition-all hover:shadow-emerald-400/40 disabled:cursor-wait disabled:opacity-50 disabled:shadow-none"
      >
        {saving ? 'Menyimpan...' : 'Tambah produk'}
      </button>
      {error && (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}

function EditRow({ product, onSave, onCancel }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(product.id, { name, price });
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none sm:w-28"
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-emerald-400/15 px-3.5 py-2 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-400/25">
          Simpan
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-400 ring-1 ring-slate-700 hover:text-slate-200">
          Batal
        </button>
      </div>
    </form>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const notify = useCallback((type, text) => setMessage({ type, text }), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await api.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Daftar Produk</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tambah, ubah, hapus produk. Data tersimpan di backend lewat API.
        </p>
      </div>

      {message && (
        <p
          className={`rounded-lg border px-3.5 py-2.5 text-sm ${
            message.type === 'ok'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
              : 'border-red-400/30 bg-red-400/10 text-red-300'
          }`}
        >
          {message.text}
        </p>
      )}

      {error ? (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-5 text-center">
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={load}
            className="mt-3 rounded-lg px-4 py-2 text-xs font-semibold text-red-300 ring-1 ring-red-400/40 hover:bg-red-400/10"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <>
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Tambah Produk
            </h3>
            <ProductForm onSubmit={handleCreate} />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Daftar Produk
            </h3>

            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-800/60" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="py-6 text-center text-sm italic text-slate-500">
                Belum ada produk. Tambahkan lewat form di atas.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/60 text-left text-[0.7rem] uppercase tracking-widest text-slate-500">
                      <th className="px-3 py-2.5">ID</th>
                      <th className="px-3 py-2.5">Nama</th>
                      <th className="px-3 py-2.5">Harga</th>
                      <th className="px-3 py-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) =>
                      editingId === p.id ? (
                        <tr key={p.id}>
                          <td colSpan="4" className="px-3 py-3">
                            <EditRow
                              product={p}
                              onSave={(id, data) => {
                                handleUpdate(id, data);
                                setEditingId(null);
                              }}
                              onCancel={() => setEditingId(null)}
                            />
                          </td>
                        </tr>
                      ) : (
                        <tr key={p.id} className="border-b border-slate-800/50 transition-colors last:border-0 hover:bg-slate-800/25">
                          <td className="px-3 py-3 font-mono text-xs text-slate-500">{p.id}</td>
                          <td className="px-3 py-3 font-medium">
                            <Link
                              to={`/products/${p.id}`}
                              className="transition-colors hover:text-emerald-300"
                            >
                              {p.name}
                            </Link>
                          </td>
                          <td className="px-3 py-3 font-mono text-xs text-emerald-300">
                            Rp {Number(p.price).toLocaleString('id-ID')}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingId(p.id)}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-700 hover:text-slate-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 ring-1 ring-red-400/40 hover:bg-red-400/10"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
