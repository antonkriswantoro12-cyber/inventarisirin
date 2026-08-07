import React, { useState } from 'react';
import { Truck, Plus, Phone, Mail, MapPin, Star, Calendar, FileText, X } from 'lucide-react';
import { Vendor } from '../../types/inventory';

interface VendorViewProps {
  vendors: Vendor[];
  onAddVendor: (v: Partial<Vendor>) => void;
}

export const VendorView: React.FC<VendorViewProps> = ({ vendors, onAddVendor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    category: ['Pembelian', 'Servis'],
    picName: '',
    phone: '',
    email: '',
    address: '',
    contractNo: `KNT/RSMR/2026/00${vendors.length + 1}`,
    contractExpiry: '2027-12-31',
    rating: 4.5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVendor(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Truck className="w-6 h-6 text-sky-600" />
            <span>Vendor Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Direktori penyedia alat medis, vendor servis resmi, BPFK kalibrasi, kontrak, dan evaluasi kinerja
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Vendor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <div key={v.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">{v.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {v.category.map((cat, idx) => (
                    <span key={idx} className="text-[9px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-100">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{v.rating}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2 text-slate-700 font-medium">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>PIC: {v.picName} ({v.phone})</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>{v.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="line-clamp-1">{v.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Kontrak: <strong className="text-slate-700">{v.contractNo}</strong></span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                s/d {v.contractExpiry}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Tambah Vendor Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Perusahaan / Vendor:</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama PIC:</label>
                  <input
                    type="text"
                    value={formData.picName || ''}
                    onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / HP:</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Vendor:</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Berlaku Kontrak s/d:</label>
                  <input
                    type="date"
                    value={formData.contractExpiry || ''}
                    onChange={(e) => setFormData({ ...formData, contractExpiry: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap:</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
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
                  Simpan Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
