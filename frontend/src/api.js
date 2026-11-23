const BASE = '/products';

async function getAll() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Gagal memuat daftar produk');
  return res.json();
}

async function create({ name, price }) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price: Number(price) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menambah produk');
  return data;
}

async function update(id, { name, price }) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price: Number(price) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengubah produk');
  return data;
}

async function remove(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus produk');
  return data;
}

export { getAll, create, update, remove };
