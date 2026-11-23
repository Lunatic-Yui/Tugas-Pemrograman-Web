import { useState } from 'react';

export default function ProductForm({ onSubmit }) {
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
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="pf-name">Nama produk</label>
        <input
          id="pf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="cth: Kopi Robusta"
          autoComplete="off"
        />
      </div>
      <div className="field">
        <label htmlFor="pf-price">Harga (Rp)</label>
        <input
          id="pf-price"
          type="number"
          min="0"
          step="any"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="cth: 25000"
          autoComplete="off"
        />
      </div>
      <button className="btn primary" disabled={saving}>
        {saving ? 'Menyimpan...' : 'Tambah produk'}
      </button>
      {error && <div className="msg err">{error}</div>}
    </form>
  );
}
