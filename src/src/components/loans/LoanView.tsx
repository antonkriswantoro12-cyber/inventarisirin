import React, { useState } from 'react';
import { Handshake, Plus, Clock, CheckCircle, AlertTriangle, FileSpreadsheet, Download, X, Pencil, Trash2 } from 'lucide-react';
import { EquipmentLoan, Equipment } from '../../types/inventory';
import { DigitalSignatureModal } from '../common/DigitalSignatureModal';
import { exportToExcel, exportToPDF } from '../../lib/exportUtils';

interface LoanViewProps {
  loans: EquipmentLoan[];
  equipment: Equipment[];
  onAddLoan: (loan: Partial<EquipmentLoan>) => void;
  onUpdateLoan?: (id: string, loan: Partial<EquipmentLoan>) => void;
  onDeleteLoan?: (id: string) => void;
  onReturnLoan: (id: string, condition: string) => void;
}

export const LoanView: React.FC<LoanViewProps> = ({
  loans,
  equipment,
  onAddLoan,
  onUpdateLoan,
  onDeleteLoan,
  onReturnLoan
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<EquipmentLoan | null>(null);
  const [formData, setFormData] = useState<Partial<EquipmentLoan>>({
    equipmentId: equipment[0]?.id || '',
    equipmentName: equipment[0]?.name || '',
    inventoryNo: equipment[0]?.inventoryNo || '',
    borrowerName: 'dr. Eko Prasetyo',
    borrowerUnit: 'IGD (Instalasi Gawat Darurat)',
    borrowerContact: '0812-9988-1122',
    loanDate: new Date().toISOString().slice(0, 10),
    expectedReturnDate: '2026-08-08',
    status: 'Dipinjam',
    conditionOnLoan: 'Sangat Baik (Baterai Full 100%)',
    notes: 'Peminjaman darurat'
  });

  const handleOpenEdit = (item: EquipmentLoan) => {
    setEditingLoan(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data peminjaman ini?')) {
      if (onDeleteLoan) onDeleteLoan(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLoan) {
      if (onUpdateLoan) onUpdateLoan(editingLoan.id, formData);
    } else {
      onAddLoan(formData);
    }
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    const data = loans.map(l => ({
      'No. Inventaris': l.inventoryNo,
      'Nama Alat': l.equipmentName,
      'Peminjam': l.borrowerName,
      'Unit Peminjam': l.borrowerUnit,
      'Tgl Pinjam': l.loanDate,
      'Tgl Kembali Plan': l.expectedReturnDate,
      'Status': l.status
    }));
    exportToExcel(data, 'Riwayat_Peminjaman_Alat_IRIN');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Handshake className="w-6 h-6 text-sky-600" />
            <span>Peminjaman & Pengembalian Alat Medis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lacak peminjaman alat kesehatan antar unit/ruangan, pengingat keterlambatan, dan tanda tangan digital
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Form Peminjaman Baru</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Alat & No Inv</th>
                <th className="py-3 px-4">Nama Peminjam & Unit</th>
                <th className="py-3 px-4">Tgl Pinjam</th>
                <th className="py-3 px-4">Batas Pengembalian</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loans.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{item.equipmentName}</p>
                    <span className="font-mono text-[10px] text-slate-500">{item.inventoryNo}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{item.borrowerName}</p>
                    <p className="text-[10px] text-slate-500">{item.borrowerUnit} ({item.borrowerContact})</p>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{item.loanDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.expectedReturnDate}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Dipinjam' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      {item.status === 'Dipinjam' && (
                        <button
                          onClick={() => onReturnLoan(item.id, 'Dikembalikan Kondisi Baik')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] hover:bg-emerald-700"
                        >
                          Pengembalian
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Edit Peminjaman"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Peminjaman"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Formulir Peminjaman Alat</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alat Yang Dipinjam:</label>
                <select
                  value={formData.equipmentId || ''}
                  onChange={(e) => {
                    const item = equipment.find(eq => eq.id === e.target.value);
                    setFormData({
                      ...formData,
                      equipmentId: e.target.value,
                      equipmentName: item?.name || '',
                      inventoryNo: item?.inventoryNo || ''
                    });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                >
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name} ({eq.inventoryNo})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Peminjam:</label>
                  <input
                    type="text"
                    value={formData.borrowerName || ''}
                    onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit / Departemen:</label>
                  <input
                    type="text"
                    value={formData.borrowerUnit || ''}
                    onChange={(e) => setFormData({ ...formData, borrowerUnit: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tgl Peminjaman:</label>
                  <input
                    type="date"
                    value={formData.loanDate || ''}
                    onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Tgl Kembalikannya:</label>
                  <input
                    type="date"
                    value={formData.expectedReturnDate || ''}
                    onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
                    required
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
                  Simpan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
