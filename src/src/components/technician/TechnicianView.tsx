import React, { useState } from 'react';
import {
  Users,
  Award,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Wrench,
  FileCheck,
  Printer,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock,
  Search,
  Image as ImageIcon,
  CheckSquare,
  Activity
} from 'lucide-react';
import {
  Technician,
  Equipment,
  PMRecord,
  CorrectiveMaintenanceRecord,
  Sparepart
} from '../../types/inventory';
import { exportWorkOrderToPDF } from '../../lib/exportUtils';

interface TechnicianViewProps {
  technicians: Technician[];
  equipment?: Equipment[];
  pms?: PMRecord[];
  corrective?: CorrectiveMaintenanceRecord[];
  spareparts?: Sparepart[];
  onAddTechnician?: (t: Partial<Technician>) => void;
  onUpdateTechnician?: (id: string, t: Partial<Technician>) => void;
  onDeleteTechnician?: (id: string) => void;
  onAddCorrective?: (cm: Partial<CorrectiveMaintenanceRecord>) => void;
  onUpdateCorrective?: (id: string, cm: Partial<CorrectiveMaintenanceRecord>) => void;
}

export interface DailySafetyCheck {
  id: string;
  date: string;
  equipmentName: string;
  inventoryNo: string;
  roomName: string;
  groundingResistance: number; // in Ohm
  enclosureLeakage: number; // in uA
  physicalCondition: 'Baik' | 'Perlu Perbaikan' | 'Rusak';
  batteryStatus: 'Normal' | 'Lemah' | 'Ganti';
  overallResult: 'LULUS (Aman)' | 'GAGAL (Bahaya)';
  inspectedBy: string;
  notes?: string;
}

export const TechnicianView: React.FC<TechnicianViewProps> = ({
  technicians,
  equipment = [],
  pms = [],
  corrective = [],
  spareparts = [],
  onAddTechnician,
  onUpdateTechnician,
  onDeleteTechnician,
  onAddCorrective,
  onUpdateCorrective
}) => {
  const [activeTab, setActiveTab] = useState<'WORKBENCH' | 'TECHNICIANS' | 'SAFETY_INSPECTION'>('WORKBENCH');

  // Technician Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);
  const [techFormData, setTechFormData] = useState<Partial<Technician>>({
    name: '',
    employeeNo: `ATEM-2026-00${technicians.length + 1}`,
    email: '',
    phone: '',
    certifications: ['ATEM', 'STR Aktif'],
    schedule: 'Shift Pagi (07:00 - 14:00)',
    performanceScore: 95
  });

  // Work Order Execution Modal
  const [isWOModalOpen, setIsWOModalOpen] = useState(false);
  const [selectedWOType, setSelectedWOType] = useState<'CM' | 'PM'>('CM');
  const [editingCM, setEditingCM] = useState<Partial<CorrectiveMaintenanceRecord> | null>(null);

  const [woFormData, setWOFormData] = useState<{
    equipmentId: string;
    type: 'CM' | 'PM';
    reportedBy: string;
    priority: 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';
    failureCause: string;
    solution: string;
    technicianName: string;
    status: 'Dalam Perbaikan' | 'Selesai' | 'Menunggu Sparepart';
    groundingCheck: boolean;
    leakageCheck: boolean;
    cableCheck: boolean;
    alarmCheck: boolean;
    photoUrl?: string;
  }>({
    equipmentId: equipment[0]?.id || '',
    type: 'CM',
    reportedBy: 'Perawat ICU IRIN',
    priority: 'Tinggi',
    failureCause: 'Alarm berbunyi palsu / sensor tidak presisi',
    solution: 'Pembersihan konektor, kalibrasi ulang, dan pengencangan kabel grounding.',
    technicianName: technicians[0]?.name || 'Anton Kriswantoro, S.ST',
    status: 'Dalam Perbaikan',
    groundingCheck: true,
    leakageCheck: true,
    cableCheck: true,
    alarmCheck: true
  });

  // Safety Inspection Log State
  const [safetyLogs, setSafetyLogs] = useState<DailySafetyCheck[]>([
    {
      id: 'sc-1',
      date: new Date().toISOString().slice(0, 10),
      equipmentName: 'Ventilator Mechanical ICU (Hamilton C3)',
      inventoryNo: 'IRIN-VNT-2024-001',
      roomName: 'Ruang ICU Utama Bed 01',
      groundingResistance: 0.12,
      enclosureLeakage: 42,
      physicalCondition: 'Baik',
      batteryStatus: 'Normal',
      overallResult: 'LULUS (Aman)',
      inspectedBy: 'Anton Kriswantoro, S.ST',
      notes: 'Uji keselamatan listrik IEC 60601 memenuhi standar KARS.'
    },
    {
      id: 'sc-2',
      date: new Date().toISOString().slice(0, 10),
      equipmentName: 'Defibrillator Biphasic ZOLL R-Series',
      inventoryNo: 'IRIN-DEF-2023-002',
      roomName: 'Ruang ICU Bed 03',
      groundingResistance: 0.18,
      enclosureLeakage: 68,
      physicalCondition: 'Baik',
      batteryStatus: 'Normal',
      overallResult: 'LULUS (Aman)',
      inspectedBy: 'Budi Santoso, A.Md.Tem',
      notes: 'Energi discharge 200J terverifikasi akurat.'
    }
  ]);

  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [safetyFormData, setSafetyFormData] = useState<Partial<DailySafetyCheck>>({
    equipmentName: equipment[0]?.name || 'Ventilator ICU',
    inventoryNo: equipment[0]?.inventoryNo || 'IRIN-VNT-2024-001',
    roomName: 'Ruang ICU Utama',
    groundingResistance: 0.15,
    enclosureLeakage: 50,
    physicalCondition: 'Baik',
    batteryStatus: 'Normal',
    overallResult: 'LULUS (Aman)',
    inspectedBy: technicians[0]?.name || 'Anton Kriswantoro, S.ST',
    notes: 'Pemeriksaan rutin aman digunakan.'
  });

  // Technician Detail Modal
  const [viewingTech, setViewingTech] = useState<Technician | null>(null);
  const [techFilterStatus, setTechFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const handleTechAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTechFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for Technician
  const handleOpenAddTech = () => {
    setEditingTech(null);
    setTechFormData({
      name: '',
      employeeNo: `ATEM-2026-00${technicians.length + 1}`,
      email: '',
      phone: '',
      certifications: ['ATEM', 'STR Aktif'],
      schedule: 'Shift Pagi (07:00 - 14:00)',
      performanceScore: 95
    });
    setIsModalOpen(true);
  };

  const handleOpenEditTech = (t: Technician) => {
    setEditingTech(t);
    setTechFormData(t);
    setIsModalOpen(true);
  };

  const handleDeleteTech = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data teknisi ini?')) {
      if (onDeleteTechnician) onDeleteTechnician(id);
    }
  };

  const handleTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTech) {
      if (onUpdateTechnician) onUpdateTechnician(editingTech.id, techFormData);
    } else {
      if (onAddTechnician) onAddTechnician(techFormData);
    }
    setIsModalOpen(false);
  };

  // Work Order Submit
  const handleSaveWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEq = equipment.find(eq => eq.id === woFormData.equipmentId) || equipment[0];

    const newCM: Partial<CorrectiveMaintenanceRecord> = {
      equipmentId: targetEq?.id || 'eq-1',
      equipmentName: targetEq?.name || 'Alat Medis',
      inventoryNo: targetEq?.inventoryNo || 'IRIN-001',
      roomName: targetEq?.locationRoom || 'Ruang ICU',
      reportDate: new Date().toISOString().slice(0, 10),
      reportedBy: woFormData.reportedBy,
      priority: woFormData.priority,
      failureCause: woFormData.failureCause,
      solution: woFormData.solution,
      technicianName: woFormData.technicianName,
      status: woFormData.status,
      photos: woFormData.photoUrl ? [woFormData.photoUrl] : []
    };

    if (editingCM && editingCM.id && onUpdateCorrective) {
      onUpdateCorrective(editingCM.id, newCM);
    } else if (onAddCorrective) {
      onAddCorrective(newCM);
    }

    setIsWOModalOpen(false);
  };

  // Safety Check Submit
  const handleSaveSafetyCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const isPass = (safetyFormData.groundingResistance || 0) <= 0.2 && (safetyFormData.enclosureLeakage || 0) <= 100;
    const newLog: DailySafetyCheck = {
      id: `sc-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      equipmentName: safetyFormData.equipmentName || 'Alat Medis',
      inventoryNo: safetyFormData.inventoryNo || 'IRIN-001',
      roomName: safetyFormData.roomName || 'Ruang ICU',
      groundingResistance: Number(safetyFormData.groundingResistance) || 0.15,
      enclosureLeakage: Number(safetyFormData.enclosureLeakage) || 50,
      physicalCondition: safetyFormData.physicalCondition || 'Baik',
      batteryStatus: safetyFormData.batteryStatus || 'Normal',
      overallResult: isPass ? 'LULUS (Aman)' : 'GAGAL (Bahaya)',
      inspectedBy: safetyFormData.inspectedBy || 'Teknisi ATEM',
      notes: safetyFormData.notes || 'Pemeriksaan keselamatan listrik IEC 60601.'
    };
    setSafetyLogs(prev => [newLog, ...prev]);
    setIsSafetyModalOpen(false);
  };

  // Image upload handler for Work Order
  const handleWOImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setWOFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-sky-600" />
            <span>Operasional & Lembar Kerja Teknisi Elektromedis (ATEM)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Workbench penanganan Work Order perbaikan, inspeksi keselamatan listrik IEC 60601, serta daftar tenaga teknis RS Mardi Rahayu
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsWOModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Work Order Perbaikan</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-3 pt-2 rounded-t-xl">
        <button
          onClick={() => setActiveTab('WORKBENCH')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'WORKBENCH'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Work Order & Perbaikan Aktif ({corrective.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SAFETY_INSPECTION')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'SAFETY_INSPECTION'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Uji Keselamatan Listrik Harian</span>
        </button>

        <button
          onClick={() => setActiveTab('TECHNICIANS')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'TECHNICIANS'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Teknisi & Shift ({technicians.length})</span>
        </button>
      </div>

      {/* TAB 1: WORKBENCH & WORK ORDERS */}
      {activeTab === 'WORKBENCH' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400">Dalam Perbaikan Aktif</span>
                <h4 className="text-xl font-bold text-slate-800">
                  {corrective.filter(c => c.status === 'Dalam Perbaikan').length} Tugas
                </h4>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400">Perbaikan Selesai</span>
                <h4 className="text-xl font-bold text-slate-800">
                  {corrective.filter(c => c.status === 'Selesai').length} Dokumen
                </h4>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center space-x-3">
              <div className="p-3 bg-sky-100 text-sky-800 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400">Total WO Terdaftar</span>
                <h4 className="text-xl font-bold text-slate-800">{corrective.length} Tiket</h4>
              </div>
            </div>
          </div>

          {/* Work Order Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {corrective.map((cm) => (
              <div key={cm.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      cm.priority === 'Tinggi' || cm.priority === 'Darurat'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Prioritas: {cm.priority || 'Tinggi'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-1.5">{cm.equipmentName}</h3>
                    <p className="font-mono text-xs text-sky-700 font-semibold">{cm.inventoryNo}</p>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    cm.status === 'Selesai'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {cm.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <p><strong className="text-slate-600">Pelapor:</strong> {cm.reportedBy} ({cm.roomName})</p>
                  <p><strong className="text-slate-600">Uraian Kerusakan:</strong> {cm.failureCause}</p>
                  <p><strong className="text-slate-600">Tindakan Solusi:</strong> {cm.solution || 'Proses analisis teknisi'}</p>
                  <p><strong className="text-slate-600">Teknisi ATEM:</strong> {cm.technicianName}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Tgl Lapor: {cm.reportDate}</span>
                  <button
                    onClick={() => {
                      exportWorkOrderToPDF({
                        type: 'CM',
                        woNo: `WO-${cm.id}`,
                        equipmentName: cm.equipmentName,
                        inventoryNo: cm.inventoryNo,
                        roomName: cm.roomName,
                        date: cm.reportDate,
                        technicianName: cm.technicianName,
                        reportedBy: cm.reportedBy,
                        problem: cm.failureCause,
                        actionTaken: cm.solution,
                        status: cm.status
                      });
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Lembar WO PDF</span>
                  </button>
                </div>
              </div>
            ))}

            {corrective.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Belum ada Work Order perbaikan aktif saat ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SAFETY INSPECTION LOGS */}
      {activeTab === 'SAFETY_INSPECTION' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Inspeksi & Uji Keselamatan Listrik Harian (IEC 60601)</h3>
              <p className="text-xs text-slate-500">Pengukuran arus bocor, resistansi pentanahan, dan kelaikan fisik ICU/IRIN</p>
            </div>
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Uji Keselamatan</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Tanggal & Alat</th>
                  <th className="p-3">Lokasi Ruangan</th>
                  <th className="p-3">Grounding (Ω) ≤0.2</th>
                  <th className="p-3">Arus Bocor (µA) ≤100</th>
                  <th className="p-3">Kondisi Baterai</th>
                  <th className="p-3">Hasil Kelaikan</th>
                  <th className="p-3">Teknisi Penguji</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {safetyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{log.equipmentName}</div>
                      <div className="font-mono text-[10px] text-sky-700">{log.inventoryNo}</div>
                    </td>
                    <td className="p-3">{log.roomName}</td>
                    <td className="p-3 font-mono font-bold text-slate-800">{log.groundingResistance} Ω</td>
                    <td className="p-3 font-mono font-bold text-slate-800">{log.enclosureLeakage} µA</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {log.batteryStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        log.overallResult.includes('LULUS')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.overallResult}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-600">{log.inspectedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TECHNICIANS DIRECTORY */}
      {activeTab === 'TECHNICIANS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-800">Daftar Tenaga Elektromedis & Shift Kerja</h3>
            <button
              onClick={handleOpenAddTech}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Teknisi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((t) => (
              <div key={t.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-500/30 shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{t.name}</h3>
                      <span className="font-mono text-xs text-sky-700 font-semibold">{t.employeeNo}</span>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Kinerja: {t.performanceScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditTech(t)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      title="Edit Teknisi"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTech(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Teknisi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-semibold">Jadwal Kerja:</span>
                    <span className="font-medium">{t.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-semibold">Beban Tugas Aktif:</span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {t.activeWorkload || 0} Perbaikan / PM
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Sertifikasi & Keahlian:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(t.certifications || []).map((cert, idx) => (
                      <span key={idx} className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL WORK ORDER FORM */}
      {isWOModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Buat Work Order / Lembar Kerja Perbaikan
              </h3>
              <button onClick={() => setIsWOModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Alat Medis:</label>
                <select
                  value={woFormData.equipmentId}
                  onChange={(e) => setWOFormData({ ...woFormData, equipmentId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-semibold"
                >
                  {equipment.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.inventoryNo}) - {e.locationRoom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prioritas Pekerjaan:</label>
                  <select
                    value={woFormData.priority}
                    onChange={(e) => setWOFormData({ ...woFormData, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-bold"
                  >
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Darurat">Darurat / Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Perbaikan:</label>
                  <select
                    value={woFormData.status}
                    onChange={(e) => setWOFormData({ ...woFormData, status: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-bold"
                  >
                    <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                    <option value="Selesai">Selesai (Siap Pakai)</option>
                    <option value="Menunggu Sparepart">Menunggu Sparepart</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian Kerusakan / Masalah:</label>
                <textarea
                  value={woFormData.failureCause}
                  onChange={(e) => setWOFormData({ ...woFormData, failureCause: e.target.value })}
                  rows={2}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tindakan & Solusi Perbaikan:</label>
                <textarea
                  value={woFormData.solution}
                  onChange={(e) => setWOFormData({ ...woFormData, solution: e.target.value })}
                  rows={2}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWOModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20"
                >
                  Simpan Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SAFETY INSPECTION */}
      {isSafetyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Input Uji Keselamatan Listrik</h3>
              <button onClick={() => setIsSafetyModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSafetyCheck} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Alat Medis:</label>
                <input
                  type="text"
                  value={safetyFormData.equipmentName || ''}
                  onChange={(e) => setSafetyFormData({ ...safetyFormData, equipmentName: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resistansi Pentanahan (Ω):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={safetyFormData.groundingResistance || 0.15}
                    onChange={(e) => setSafetyFormData({ ...safetyFormData, groundingResistance: parseFloat(e.target.value) })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Batas Maks: 0.2 Ω</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Arus Bocor (µA):</label>
                  <input
                    type="number"
                    value={safetyFormData.enclosureLeakage || 50}
                    onChange={(e) => setSafetyFormData({ ...safetyFormData, enclosureLeakage: parseFloat(e.target.value) })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Batas Maks: 100 µA</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Uji / Catatan Teknis:</label>
                <textarea
                  value={safetyFormData.notes || ''}
                  onChange={(e) => setSafetyFormData({ ...safetyFormData, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSafetyModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20"
                >
                  Simpan Uji Keselamatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD / EDIT TECHNICIAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingTech ? 'Edit Data Teknisi' : 'Tambah Teknisi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTechSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>Upload Foto Profil Teknisi:</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTechAvatarUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
                {techFormData.avatar && (
                  <img src={techFormData.avatar} alt="Preview" className="w-12 h-12 mt-2 object-cover rounded-full ring-2 ring-sky-500" />
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar:</label>
                <input
                  type="text"
                  value={techFormData.name || ''}
                  onChange={(e) => setTechFormData({ ...techFormData, name: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP / No. Anggota ATEM:</label>
                  <input
                    type="text"
                    value={techFormData.employeeNo || ''}
                    onChange={(e) => setTechFormData({ ...techFormData, employeeNo: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan / Spesialisasi:</label>
                  <input
                    type="text"
                    value={techFormData.roleTitle || 'Teknisi Elektromedis'}
                    onChange={(e) => setTechFormData({ ...techFormData, roleTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Telp / WA:</label>
                  <input
                    type="text"
                    value={techFormData.phone || ''}
                    onChange={(e) => setTechFormData({ ...techFormData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email:</label>
                  <input
                    type="email"
                    value={techFormData.email || ''}
                    onChange={(e) => setTechFormData({ ...techFormData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jadwal Shift Kerja:</label>
                <input
                  type="text"
                  value={techFormData.schedule || ''}
                  onChange={(e) => setTechFormData({ ...techFormData, schedule: e.target.value })}
                  placeholder="mis. Shift Pagi (07:00 - 14:00)"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sertifikasi & Keahlian (pisahkan dengan koma):</label>
                <input
                  type="text"
                  value={Array.isArray(techFormData.certifications) ? techFormData.certifications.join(', ') : (techFormData.certifications || '')}
                  onChange={(e) => setTechFormData({
                    ...techFormData,
                    certifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="mis. ATEM, STR Aktif, Servis Ventilator"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={techFormData.isActive !== false}
                  onChange={(e) => setTechFormData({ ...techFormData, isActive: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300"
                />
                <label htmlFor="isActive" className="font-bold text-slate-700 cursor-pointer">
                  Status Teknisi Aktif (Dapat menerima penugasan work order)
                </label>
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
