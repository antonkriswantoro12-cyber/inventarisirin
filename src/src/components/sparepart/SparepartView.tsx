import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  QrCode,
  DollarSign,
  MapPin,
  FileSpreadsheet,
  Download,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { Sparepart, Vendor } from '../../types/inventory';
import { exportToExcel, exportToPDF } from '../../lib/exportUtils';

interface SparepartViewProps {
  spareparts: Sparepart[];
  vendors: Vendor[];
  onAddSparepart: (part: Partial<Sparepart>) => void;
  onUpdateSparepart: (id: string, part: Partial<Sparepart>) => void;
  onDeleteSparepart?: (id: string) => void;
  onShowQRModal: (item: any) => void;
}

export const SparepartView: React.FC<SparepartViewProps> = ({
  spareparts,
  vendors,
  onAddSparepart,
  onUpdateSparepart,
  onDeleteSparepart,
  onShowQRModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Sparepart | null>(null);
  const [formData, setFormData] = useState<Partial<Sparepart>>({
    partNo: `SP-MED-00${spareparts.length + 1}`,
    name: '',
    category: 'Sensor',
    stock: 10,
    minStock: 3,
    unit: 'Pcs',
    storageLocation: 'Lemari A-Rack 01',
    unitPrice: 500000,
    supplierId: vendors[0]?.id || '',
    supplierName: vendors[0]?.name || '',
    qrCode: `SP-MED-00${spareparts.length + 1}`,
    barcode: '8991002003999',
    lastRestockDate: new Date().toISOString().slice(0, 10)
  });

  const filteredParts = spareparts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEdit = (part: Sparepart) => {
    setEditingPart(part);
    setFormData(part);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus sparepart ini?')) {
      if (onDeleteSparepart) onDeleteSparepart(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPart) {
      onUpdateSparepart(editingPart.id, formData);
    } else {
      onAddSparepart(formData);
    }
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    const data = spareparts.map(s => ({
      'Kode Part': s.partNo,
      'Nama Sparepart': s.name,
      'Kategori': s.category,
      'Stok Saat Ini': s.stock,
      'Min Stok': s.minStock,
      'Satuan': s.unit,
      'Lokasi Penyimpanan': s.storageLocation,
      'Harga Satuan (Rp)': s.unitPrice,
      'Supplier': s.supplierName
    }));
    exportToExcel(data, 'Master_Sparepart_IRIN');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-sky-600" />
            <span>Master Sparepart & Stok Kontrol</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen suku cadang alat medis IRIN, batas stok minimum, rak penyimpanan, dan label QR/Barcode
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                partNo: `SP-MED-00${spareparts.length + 1}`,
                name: '',
                category: 'Sensor',
                stock: 10,
                minStock: 3,
                unit: 'Pcs',
                storageLocation: 'Lemari A-Rack 01',
                unitPrice: 500000,
                supplierId: vendors[0]?.id || '',
                supplierName: vendors[0]?.name || '',
                qrCode: `SP-MED-00${spareparts.length + 1}`,
                barcode: '8991002003999',
                lastRestockDate: new Date().toISOString().slice(0, 10)
              });
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Sparepart</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari sparepart..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Part No & Nama Sparepart</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Stok Saat Ini</th>
                <th className="py-3 px-4">Lokasi Rak</th>
                <th className="py-3 px-4">Harga Satuan</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-center">Label QR</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredParts.map((item) => {
                const isLowStock = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <span className="font-mono text-[10px] text-slate-500">{item.partNo}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {item.category}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-sm ${isLowStock ? 'text-rose-600' : 'text-slate-800'}`}>
                          {item.stock} {item.unit}
                        </span>
                        {isLowStock && (
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded animate-pulse">
                            Stok Menipis
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Min Stock: {item.minStock}</span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {item.storageLocation}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {item.supplierName}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onShowQRModal({ ...item, inventoryNo: item.partNo })}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Edit Sparepart"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Sparepart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Tambah Sparepart Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Part (Part No):</label>
                  <input
                    type="text"
                    value={formData.partNo || ''}
                    onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Sparepart:</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Stok:</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stok Minimum:</label>
                  <input
                    type="number"
                    value={formData.minStock || 0}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Satuan:</label>
                  <input
                    type="text"
                    value={formData.unit || 'Pcs'}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Rak:</label>
                  <input
                    type="text"
                    value={formData.storageLocation || ''}
                    onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Satuan (Rp):</label>
                  <input
                    type="number"
                    value={formData.unitPrice || 0}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20"
                >
                  Simpan Sparepart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
