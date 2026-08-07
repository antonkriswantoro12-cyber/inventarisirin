import React, { useState } from 'react';
import {
  AlertOctagon,
  Plus,
  AlertTriangle,
  Clock,
  User,
  Wrench,
  CheckCircle,
  FileSpreadsheet,
  Download,
  X
} from 'lucide-react';
import { CorrectiveMaintenanceRecord, Equipment, Technician, Sparepart } from '../../types/inventory';
import { exportToExcel, exportToPDF } from '../../lib/exportUtils';

interface CorrectiveViewProps {
  records: CorrectiveMaintenanceRecord[];
  equipment: Equipment[];
  technicians: Technician[];
  spareparts: Sparepart[];
  onAddRecord: (record: Partial<CorrectiveMaintenanceRecord>) => void;
  onUpdateRecord: (id: string, record: Partial<CorrectiveMaintenanceRecord>) => void;
}

export const CorrectiveMaintenanceView: React.FC<CorrectiveViewProps> = ({
  records,
  equipment,
  technicians,
  spareparts,
  onAddRecord,
  onUpdateRecord
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CorrectiveMaintenanceRecord>>({
    equipmentId: equipment[0]?.id || '',
    equipmentName: equipment[0]?.name || '',
    inventoryNo: equipment[0]?.inventoryNo || '',
    roomName: equipment[0]?.roomName || '',
    reportDate: new Date().toISOString().slice(0, 10),
    reportedBy: 'Ns. Ratna Sari, S.Kep',
    priority: 'Tinggi',
    failureCause: 'Sensor oklusi tidak mendeteksi desakan spuit',
    solution: 'Penggantian kabel & optical encoder',
    technicianId: technicians[0]?.id || '',
    technicianName: technicians[0]?.name || 'Anton Kriswantoro, S.ST',
    estimatedCompletionDate: '2026-08-10',
    sparepartsCost: 850000,
    laborCost: 200000,
    totalCost: 1050000,
    status: 'Dalam Perbaikan',
    photos: ['https://images.unsplash.com/photo-1583912267670-65759240432e?auto=format&fit=crop&w=600&q=80']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord(formData);
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    const data = records.map(r => ({
      'No. Inventaris': r.inventoryNo,
      'Nama Alat': r.equipmentName,
      'Ruangan': r.roomName,
      'Pelapor': r.reportedBy,
      'Prioritas': r.priority,
      'Penyebab': r.failureCause,
      'Teknisi': r.technicianName,
      'Total Biaya': r.totalCost,
      'Status': r.status
    }));
    exportToExcel(data, 'Laporan_Kerusakan_dan_Perbaikan_IRIN');
  };

  const handleExportPDF = () => {
    const cols = [
      { header: 'No. Inv', key: 'inventoryNo' },
      { header: 'Alat Medis', key: 'equipmentName' },
      { header: 'Prioritas', key: 'priority' },
      { header: 'Penyebab', key: 'failureCause' },
      { header: 'Status', key: 'status' }
    ];
    exportToPDF('Laporan Kerusakan & Corrective Maintenance IRIN', cols, records, 'Corrective_IRIN_RSMR');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            <span>Corrective Maintenance & Laporan Kerusakan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen tiket troubleshooting, analisis penyebab, kebutuhan sparepart, dan estimasi waktu penyelesaian (MTTR)
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Laporan Kerusakan</span>
          </button>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {records.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {r.inventoryNo}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.priority === 'Darurat' ? 'bg-rose-600 text-white animate-pulse' :
                    r.priority === 'Tinggi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Prioritas: {r.priority}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-1">{r.equipmentName}</h3>
                <p className="text-xs text-slate-500">Ruangan: {r.roomName} | Dilaporkan oleh: {r.reportedBy} ({r.reportDate})</p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={r.status}
                  onChange={(e) => onUpdateRecord(r.id, { status: e.target.value as any })}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="Dilaporkan">Status: Dilaporkan</option>
                  <option value="Dalam Perbaikan">Status: Dalam Perbaikan</option>
                  <option value="Menunggu Part">Status: Menunggu Part</option>
                  <option value="Selesai">Status: Selesai</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Analisis Gejala & Penyebab
                </span>
                <p className="text-slate-700 font-medium">{r.failureCause}</p>
                <span className="text-slate-400 block text-[10px] mt-2">Solusi Perbaikan:</span>
                <p className="text-slate-700 italic">{r.solution || 'Dalam proses diagnosa'}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Teknisi & Estimasi Selesai
                </span>
                <p className="font-bold text-sky-700">{r.technicianName}</p>
                <p className="text-slate-600">Estimasi Selesai: <strong>{r.estimatedCompletionDate}</strong></p>
                <p className="text-slate-500 text-[10px] mt-1">Downtime: {r.downtimeHours || 24} Jam</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Rincian Biaya Perbaikan
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Sparepart:</span>
                  <span>Rp {r.sparepartsCost.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Jasa:</span>
                  <span>Rp {r.laborCost.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1 mt-1">
                  <span>Total Biaya:</span>
                  <span className="text-rose-700">Rp {r.totalCost.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Buat Laporan Kerusakan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alat Yang Rusak:</label>
                <select
                  value={formData.equipmentId || ''}
                  onChange={(e) => {
                    const item = equipment.find(eq => eq.id === e.target.value);
                    setFormData({
                      ...formData,
                      equipmentId: e.target.value,
                      equipmentName: item?.name || '',
                      inventoryNo: item?.inventoryNo || '',
                      roomName: item?.roomName || ''
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
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Prioritas:</label>
                  <select
                    value={formData.priority || 'Tinggi'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  >
                    <option value="Darurat">Darurat (Emergency ICU)</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pelapor / Perawat:</label>
                  <input
                    type="text"
                    value={formData.reportedBy || ''}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kerusakan / Gejala:</label>
                <textarea
                  value={formData.failureCause || ''}
                  onChange={(e) => setFormData({ ...formData, failureCause: e.target.value })}
                  rows={3}
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
                  className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md shadow-rose-600/20"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
