import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  Download,
  FileSpreadsheet,
  Building,
  DollarSign,
  Award,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { CalibrationRecord, Equipment, Vendor } from '../../types/inventory';
import { exportToExcel, exportToPDF } from '../../lib/exportUtils';

interface CalibrationViewProps {
  calibrations: CalibrationRecord[];
  equipment: Equipment[];
  vendors: Vendor[];
  onAddCalibration: (record: Partial<CalibrationRecord>) => void;
  onUpdateCalibration: (id: string, record: Partial<CalibrationRecord>) => void;
  onDeleteCalibration?: (id: string) => void;
}

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  calibrations,
  equipment,
  vendors,
  onAddCalibration,
  onUpdateCalibration,
  onDeleteCalibration
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CalibrationRecord | null>(null);

  const [formData, setFormData] = useState<Partial<CalibrationRecord>>({
    equipmentId: equipment[0]?.id || '',
    equipmentName: equipment[0]?.name || '',
    inventoryNo: equipment[0]?.inventoryNo || '',
    scheduledDate: '2026-09-01',
    dueDate: '2026-09-01',
    daysRemaining: 26,
    statusBadgeColor: 'yellow',
    statusBadgeLabel: 'Akan Datang (26 Hari)',
    vendorId: vendors[2]?.id || vendors[0]?.id || '',
    vendorName: vendors[2]?.name || vendors[0]?.name || 'LPFK Semarang',
    cost: 1500000,
    result: 'Lulus',
    certificateNo: 'SERT-BPFK-2026-089',
    certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Akurasi sensor presisi',
    technicianName: 'Anton Kriswantoro, S.ST'
  });

  const filteredCalibrations = calibrations.filter((item) => {
    const matchesSearch =
      item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inventoryNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'Lulus' && item.result === 'Lulus') ||
      (selectedStatusFilter === 'Urgent' && item.daysRemaining <= 14);

    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData({
      equipmentId: equipment[0]?.id || '',
      equipmentName: equipment[0]?.name || '',
      inventoryNo: equipment[0]?.inventoryNo || '',
      scheduledDate: new Date().toISOString().slice(0, 10),
      dueDate: '2027-08-01',
      daysRemaining: 360,
      statusBadgeColor: 'green',
      statusBadgeLabel: 'Lulus / Aktif',
      vendorId: vendors[2]?.id || vendors[0]?.id || '',
      vendorName: vendors[2]?.name || vendors[0]?.name || 'BPFK Semarang',
      cost: 1500000,
      result: 'Lulus',
      certificateNo: `SERT-RSMR-${Date.now().toString().slice(-4)}`,
      certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      notes: '',
      technicianName: 'Anton Kriswantoro, S.ST'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CalibrationRecord) => {
    setEditingRecord(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data kalibrasi ini?')) {
      if (onDeleteCalibration) onDeleteCalibration(id);
    }
  };

  const handleSelectEquipment = (eqId: string) => {
    const item = equipment.find(e => e.id === eqId);
    if (item) {
      setFormData(prev => ({
        ...prev,
        equipmentId: item.id,
        equipmentName: item.name,
        inventoryNo: item.inventoryNo
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      onUpdateCalibration(editingRecord.id, formData);
    } else {
      onAddCalibration(formData);
    }
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    const data = filteredCalibrations.map(c => ({
      'No. Inventaris': c.inventoryNo,
      'Nama Alat': c.equipmentName,
      'Jadwal Kalibrasi': c.scheduledDate,
      'Jatuh Tempo': c.dueDate,
      'Sisa Hari': c.daysRemaining,
      'Vendor Kalibrasi': c.vendorName,
      'Hasil Kalibrasi': c.result,
      'No. Sertifikat': c.certificateNo || '-',
      'Biaya (Rp)': c.cost
    }));
    exportToExcel(data, 'Jadwal_dan_Riwayat_Kalibrasi_IRIN');
  };

  const handleExportPDF = () => {
    const cols = [
      { header: 'No. Inv', key: 'inventoryNo' },
      { header: 'Nama Alat Medis', key: 'equipmentName' },
      { header: 'Jatuh Tempo', key: 'dueDate' },
      { header: 'Vendor', key: 'vendorName' },
      { header: 'Hasil', key: 'result' },
      { header: 'No. Sertifikat', key: 'certificateNo' }
    ];
    exportToPDF('Laporan Jadwal & Sertifikat Kalibrasi IRIN', cols, filteredCalibrations, 'Kalibrasi_IRIN_RSMR');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <CalendarCheck className="w-6 h-6 text-sky-600" />
            <span>Manajemen & Schedule Kalibrasi Alat</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengingat jatuh tempo otomatis 90/60/30/14/7/3/1 hari & manajemen sertifikat LPFK / BPFK
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
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Hasil Kalibrasi</span>
          </button>
        </div>
      </div>

      {/* Status Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-semibold">
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Hijau (&gt;90 Hari): Lulus / Aktif</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Kuning (30-90 Hari): Akan Datang</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-orange-50 text-orange-800 border border-orange-200">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Oranye (7-30 Hari): Mendekati</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
          <div className="w-3 h-3 rounded-full bg-rose-600" />
          <span>Merah (1-7 Hari): Sangat Mendesak</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-900 text-white border border-slate-800">
          <div className="w-3 h-3 rounded-full bg-black ring-2 ring-white" />
          <span>Hitam: Tidak Lulus / Stop</span>
        </div>
      </div>

      {/* Filter & Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari alat atau vendor kalibrasi..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:bg-white"
            >
              <option value="ALL">Semua Filter Status</option>
              <option value="Lulus">Lulus Saja</option>
              <option value="Urgent">Mendesak (&lt;14 Hari)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Alat & No. Inventaris</th>
                <th className="py-3 px-4">Tgl Kalibrasi</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4">Status & Sisa Hari</th>
                <th className="py-3 px-4">Vendor & Sertifikat</th>
                <th className="py-3 px-4">Hasil Test</th>
                <th className="py-3 px-4 text-center">Sertifikat</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCalibrations.map((item) => {
                const isGreen = item.daysRemaining > 90;
                const isYellow = item.daysRemaining > 30 && item.daysRemaining <= 90;
                const isOrange = item.daysRemaining > 7 && item.daysRemaining <= 30;
                const isRed = item.daysRemaining >= 0 && item.daysRemaining <= 7;
                const isBlack = item.result === 'Tidak Lulus';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{item.equipmentName}</p>
                      <span className="font-mono text-[10px] text-slate-500">{item.inventoryNo}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {item.scheduledDate}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      {item.dueDate}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isBlack ? 'bg-black text-white' :
                        isRed ? 'bg-rose-100 text-rose-800 animate-pulse' :
                        isOrange ? 'bg-orange-100 text-orange-800' :
                        isYellow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.result === 'Tidak Lulus' ? 'TIDAK LULUS' : `${item.daysRemaining} Hari Lagi`}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{item.vendorName}</p>
                      <p className="text-[10px] text-slate-500">{item.certificateNo || 'No Sertifikat -'}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded ${
                        item.result === 'Lulus' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.result}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.certificateUrl ? (
                        <a
                          href={item.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Edit Record Kalibrasi"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Record Kalibrasi"
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

      {/* Add / Edit Calibration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Input Hasil & Sertifikat Kalibrasi</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Alat Kesehatan:</label>
                <select
                  value={formData.equipmentId || ''}
                  onChange={(e) => handleSelectEquipment(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                >
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name} ({eq.inventoryNo})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Kalibrasi:</label>
                  <input
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jatuh Tempo Berikutnya:</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hasil Kalibrasi:</label>
                  <select
                    value={formData.result || 'Lulus'}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value as 'Lulus' | 'Tidak Lulus' })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  >
                    <option value="Lulus">LULUS (Sesuai Standar)</option>
                    <option value="Tidak Lulus">TIDAK LULUS (Gagal Akurasi)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Sertifikat:</label>
                  <input
                    type="text"
                    value={formData.certificateNo || ''}
                    onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
                    placeholder="Contoh: SERT-BPFK-2026-091"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor Pelaksana Kalibrasi:</label>
                <select
                  value={formData.vendorId || ''}
                  onChange={(e) => {
                    const v = vendors.find(ven => ven.id === e.target.value);
                    setFormData({ ...formData, vendorId: e.target.value, vendorName: v?.name || '' });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Biaya Kalibrasi (Rp):</label>
                <input
                  type="number"
                  value={formData.cost || 0}
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
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
                  Simpan Kalibrasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
