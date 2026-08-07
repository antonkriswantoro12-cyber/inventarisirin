import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  PenTool,
  FileSpreadsheet,
  Download,
  Check,
  X
} from 'lucide-react';
import { PMRecord, Equipment, Technician, Sparepart } from '../../types/inventory';
import { DigitalSignatureModal } from '../common/DigitalSignatureModal';
import { exportToExcel, exportToPDF } from '../../lib/exportUtils';

interface PMViewProps {
  pms: PMRecord[];
  equipment: Equipment[];
  technicians: Technician[];
  spareparts: Sparepart[];
  onAddPM: (record: Partial<PMRecord>) => void;
  onUpdatePM: (id: string, record: Partial<PMRecord>) => void;
}

export const PreventiveMaintenanceView: React.FC<PMViewProps> = ({
  pms,
  equipment,
  technicians,
  spareparts,
  onAddPM,
  onUpdatePM
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPMForSign, setSelectedPMForSign] = useState<{ pmId: string; target: 'tech' | 'head' } | null>(null);

  const [formData, setFormData] = useState<Partial<PMRecord>>({
    equipmentId: equipment[0]?.id || '',
    equipmentName: equipment[0]?.name || '',
    inventoryNo: equipment[0]?.inventoryNo || '',
    roomName: equipment[0]?.roomName || '',
    scheduledDate: new Date().toISOString().slice(0, 10),
    actualDate: new Date().toISOString().slice(0, 10),
    technicianId: technicians[0]?.id || '',
    technicianName: technicians[0]?.name || 'Anton Kriswantoro, S.ST',
    durationHours: 2,
    cost: 500000,
    status: 'Selesai',
    checklist: [
      { id: '1', task: 'Inspeksi Fisik & Kebersihan Unit', isPassed: true },
      { id: '2', task: 'Uji Fungsi Kelistrikan & Grounding IEC 60601', isPassed: true },
      { id: '3', task: 'Cek Baterai Cadangan & Aliran Daya', isPassed: true },
      { id: '4', task: 'Kalibrasi Internal Sensor & Self-Test', isPassed: true }
    ],
    beforePhoto: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    sparepartsUsed: [],
    notes: 'Pemeliharaan rutin terencana berjalan lancar.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPM(formData);
    setIsModalOpen(false);
  };

  const handleSignatureSaved = (signatureUrl: string) => {
    if (selectedPMForSign) {
      const pm = pms.find(p => p.id === selectedPMForSign.pmId);
      if (pm) {
        if (selectedPMForSign.target === 'tech') {
          onUpdatePM(pm.id, { technicianSignature: signatureUrl });
        } else {
          onUpdatePM(pm.id, { headSignature: signatureUrl });
        }
      }
    }
  };

  const handleExportExcel = () => {
    const data = pms.map(p => ({
      'No. Inventaris': p.inventoryNo,
      'Nama Alat': p.equipmentName,
      'Ruangan': p.roomName,
      'Tgl PM': p.actualDate || p.scheduledDate,
      'Teknisi': p.technicianName,
      'Durasi (Jam)': p.durationHours,
      'Biaya (Rp)': p.cost,
      'Status': p.status
    }));
    exportToExcel(data, 'Laporan_Preventive_Maintenance_IRIN');
  };

  const handleExportPDF = () => {
    const cols = [
      { header: 'No. Inv', key: 'inventoryNo' },
      { header: 'Alat Medis', key: 'equipmentName' },
      { header: 'Tgl PM', key: 'actualDate' },
      { header: 'Teknisi', key: 'technicianName' },
      { header: 'Status', key: 'status' }
    ];
    exportToPDF('Laporan Pemeliharaan Rutin Preventif (PM)', cols, pms, 'PM_IRIN_RSMR');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-sky-600" />
            <span>Preventive Maintenance (PM)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwal inspeksi berkala, checklist pemeliharaan, foto sebelum/sesudah, dan pengesahan tanda tangan digital
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
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input PM Baru</span>
          </button>
        </div>
      </div>

      {/* PM List Cards */}
      <div className="space-y-4">
        {pms.map((pm) => (
          <div key={pm.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {pm.inventoryNo}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pm.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {pm.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-1">{pm.equipmentName}</h3>
                <p className="text-xs text-slate-500">Lokasi: {pm.roomName} | Teknisi: {pm.technicianName}</p>
              </div>

              <div className="text-left md:text-right text-xs">
                <span className="text-slate-400 block font-semibold">Tanggal Pelaksanaan:</span>
                <span className="font-bold text-slate-800">{pm.actualDate || pm.scheduledDate}</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Durasi: {pm.durationHours} Jam | Biaya: Rp {pm.cost.toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Checklist & Signatures Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              {/* Checklist */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-1">
                  Checklist Pekerjaan PM
                </span>
                {pm.checklist.map((chk) => (
                  <div key={chk.id} className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-4 h-4 ${chk.isPassed ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span className="text-slate-700">{chk.task}</span>
                  </div>
                ))}
              </div>

              {/* Photos */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Sebelum PM</span>
                  <img src={pm.beforePhoto || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=200&q=80'} alt="Before" className="w-full h-20 rounded-lg object-cover ring-1 ring-slate-200" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Sesudah PM</span>
                  <img src={pm.afterPhoto || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80'} alt="After" className="w-full h-20 rounded-lg object-cover ring-1 ring-slate-200" />
                </div>
              </div>

              {/* Digital Signatures */}
              <div className="bg-slate-50 p-3 rounded-xl flex flex-col justify-between">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-2">
                  Pengesahan Tanda Tangan
                </span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Teknisi</span>
                    {pm.technicianSignature ? (
                      <div className="h-12 bg-white rounded border border-slate-200 flex items-center justify-center">
                        <span className="text-[10px] text-emerald-600 font-bold">TTD Terverifikasi</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedPMForSign({ pmId: pm.id, target: 'tech' })}
                        className="w-full py-2 bg-sky-50 text-sky-700 rounded border border-sky-200 font-semibold text-[10px] hover:bg-sky-100"
                      >
                        + TTD Teknisi
                      </button>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Kepala Ruangan</span>
                    {pm.headSignature ? (
                      <div className="h-12 bg-white rounded border border-slate-200 flex items-center justify-center">
                        <span className="text-[10px] text-emerald-600 font-bold">TTD Terverifikasi</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedPMForSign({ pmId: pm.id, target: 'head' })}
                        className="w-full py-2 bg-sky-50 text-sky-700 rounded border border-sky-200 font-semibold text-[10px] hover:bg-sky-100"
                      >
                        + TTD Ka. Ruangan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signature Modal */}
      {selectedPMForSign && (
        <DigitalSignatureModal
          isOpen={!!selectedPMForSign}
          onClose={() => setSelectedPMForSign(null)}
          onSave={handleSignatureSaved}
          title={selectedPMForSign.target === 'tech' ? 'Tanda Tangan Teknisi' : 'Tanda Tangan Kepala Ruangan'}
        />
      )}

      {/* Add PM Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Catat Pekerjaan PM Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alat Kesehatan:</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal PM:</label>
                  <input
                    type="date"
                    value={formData.actualDate || ''}
                    onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Durasi Pengerjaan (Jam):</label>
                  <input
                    type="number"
                    value={formData.durationHours || 2}
                    onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teknisi Penanggung Jawab:</label>
                <select
                  value={formData.technicianId || ''}
                  onChange={(e) => {
                    const t = technicians.find(tech => tech.id === e.target.value);
                    setFormData({ ...formData, technicianId: e.target.value, technicianName: t?.name || '' });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                >
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
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
                  Simpan PM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
