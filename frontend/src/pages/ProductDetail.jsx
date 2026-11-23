import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    api
      .getAll()
      .then((products) => {
        if (cancelled) return;
        const found = products.find((p) => String(p.id) === String(id));
        if (found) {
          setProduct(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-800/60" />
        <div className="h-40 animate-pulse rounded-xl bg-slate-800/60" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-amber-400/30 bg-amber-400/10 p-8 text-center">
        <p className="text-4xl">🔍</p>
        <p className="mt-3 font-medium text-amber-300">Produk tidak ditemukan</p>
        <p className="mt-1 text-sm text-slate-500">
          Produk dengan id {id} tidak ada di dalam daftar.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-block rounded-lg bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-300 ring-1 ring-amber-400/40 hover:bg-amber-400/25"
        >
          Kembali ke daftar produk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-emerald-300"
        >
          ← Kembali ke daftar produk
        </Link>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Detail Produk #{product.id}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">{product.name}</h2>

        <dl className="mt-6 divide-y divide-slate-800">
          <div className="flex items-center justify-between py-3.5">
            <dt className="text-sm text-slate-500">ID</dt>
            <dd className="font-mono text-sm text-slate-300">{product.id}</dd>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <dt className="text-sm text-slate-500">Nama</dt>
            <dd className="text-sm font-medium">{product.name}</dd>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <dt className="text-sm text-slate-500">Harga</dt>
            <dd className="font-mono text-lg font-semibold text-emerald-300">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
