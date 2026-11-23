import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center">
      <p className="bg-gradient-to-b from-slate-200 to-slate-500 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
        404
      </p>
      <p className="mt-4 font-medium text-slate-300">Halaman tidak ditemukan</p>
      <p className="mt-1 text-sm text-slate-500">
        Alamat yang kamu buka tidak terdaftar di aplikasi ini.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/dashboard"
          className="rounded-lg bg-gradient-to-br from-emerald-300 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition-all hover:shadow-emerald-400/40"
        >
          Ke halaman utama
        </Link>
        <Link
          to="/products"
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 ring-1 ring-slate-700 transition-colors hover:text-slate-200"
        >
          Ke daftar produk
        </Link>
      </div>
    </div>
  );
}
