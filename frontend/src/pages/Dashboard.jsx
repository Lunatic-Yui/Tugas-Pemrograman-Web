import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-100">
        {value}
      </p>
      {hint && <p className="mt-1 truncate text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getAll()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-400/30 bg-red-400/10 p-6 text-center">
        <p className="text-sm text-red-300">{error}</p>
        <p className="mt-1 text-xs text-slate-500">
          Pastikan backend jalan di port 3000.
        </p>
      </div>
    );
  }

  const total = products.length;
  const prices = products.map((p) => Number(p.price));
  const avg = total ? prices.reduce((a, b) => a + b, 0) / total : 0;
  const max = total ? Math.max(...prices) : 0;
  const min = total ? Math.min(...prices) : 0;
  const termahal = products.find((p) => Number(p.price) === max);
  const termurah = products.find((p) => Number(p.price) === min);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan data produk langsung dari backend.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-800/60" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Total produk" value={`${total} produk`} />
            <StatCard label="Harga rata-rata" value={`Rp ${avg.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`} />
            <StatCard
              label="Produk termahal"
              value={`Rp ${max.toLocaleString('id-ID')}`}
              hint={termahal ? termahal.name : null}
            />
            <StatCard
              label="Produk termurah"
              value={`Rp ${min.toLocaleString('id-ID')}`}
              hint={termurah ? termurah.name : null}
            />
          </div>

          {total > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Produk Terbaru
              </h3>
              <ul className="divide-y divide-slate-800">
                {products.slice(-4).reverse().map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/products/${p.id}`}
                      className="flex items-center justify-between py-3 transition-colors hover:text-emerald-300"
                    >
                      <span className="text-sm font-medium">{p.name}</span>
                      <span className="font-mono text-xs text-slate-400">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/products"
              className="inline-block rounded-lg bg-gradient-to-br from-emerald-300 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition-all hover:shadow-emerald-400/40"
            >
              Kelola daftar produk
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
