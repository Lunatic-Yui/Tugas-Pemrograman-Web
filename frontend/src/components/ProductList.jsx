import { useState } from 'react';

function EditRow({ product, onSave, onCancel }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  return (
    <form
      className="edit-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(product.id, { name, price });
      }}
    >
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ maxWidth: '110px' }}
      />
      <button type="submit" className="btn-save">Simpan</button>
      <button type="button" className="btn-cancel" onClick={onCancel}>Batal</button>
    </form>
  );
}

export default function ProductList({ products, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (products.length === 0) {
    return <div className="empty">Belum ada produk. Tambahkan lewat form di atas.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Harga</th>
          <th style={{ width: '90px' }}></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) =>
          editingId === p.id ? (
            <tr key={p.id}>
              <td colSpan="4">
                <EditRow
                  product={p}
                  onSave={(id, data) => {
                    onUpdate(id, data);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </td>
            </tr>
          ) : (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td className="price">Rp {Number(p.price).toLocaleString('id-ID')}</td>
              <td>
                <button className="btn-del" onClick={() => setEditingId(p.id)}>
                  Edit
                </button>{' '}
                <button className="btn-del" onClick={() => onDelete(p.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
