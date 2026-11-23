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
      <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <input
        type="number"
        className="num"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn sm primary" style={{ padding: '6px 14px' }}>
        Simpan
      </button>
      <button type="button" className="btn sm ghost" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default function ProductList({ products, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (products.length === 0) {
    return (
      <div className="empty">
        Belum ada produk. Tambahkan lewat form di atas.
      </div>
    );
  }

  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: '52px' }}>ID</th>
            <th>Nama</th>
            <th>Harga</th>
            <th style={{ width: '150px' }}></th>
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
                <td className="pid">{p.id}</td>
                <td className="pname">{p.name}</td>
                <td className="price">
                  Rp {Number(p.price).toLocaleString('id-ID')}
                </td>
                <td>
                  <div className="actions">
                    <button className="btn sm ghost" onClick={() => setEditingId(p.id)}>
                      Edit
                    </button>
                    <button className="btn sm danger" onClick={() => onDelete(p.id)}>
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
  );
}
