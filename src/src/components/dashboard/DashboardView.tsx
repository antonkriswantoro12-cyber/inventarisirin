import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Calendar,
  Layers,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  QrCode,
  FileText,
  Building2,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  Info,
  Zap,
  Boxes,
  Users,
  Handshake,
  BarChart3
} from 'lucide-react';
import {
  Equipment,
  CalibrationRecord,
  PMRecord,
  CorrectiveMaintenanceRecord,
  Sparepart,
  Room,
  AuditLog,
  EquipmentLoan
} from '../../types/inventory';

interface DashboardViewProps {
  equipment: Equipment[];
  calibrations: CalibrationRecord[];
  pms: PMRecord[];
  corrective: CorrectiveMaintenanceRecord[];
  spareparts: Sparepart[];
  rooms: Room[];
  loans?: EquipmentLoan[];
  auditLogs: AuditLog[];
  onSelectModule: (module: string) => void;
  onOpenScanner: () => void;
  onAddNewEquipment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  equipment,
  calibrations,
  pms,
  corrective,
  spareparts,
  rooms,
  loans = [],
  auditLogs,
  onSelectModule,
  onOpenScanner,
  onAddNewEquipment
}) => {
  // Calculate Totals
  const totalEquip = equipment.length;
  const goodCount = equipment.filter(e => e.status === 'Baik').length;
  const minorCount = equipment.filter(e => e.status === 'Rusak Ringan').length;
  const heavyCount = equipment.filter(e => e.status === 'Rusak Berat').length;
  const repairCount = equipment.filter(e => e.status === 'Dalam Perbaikan').length;

  const totalMaintenance = pms.length;
  const totalCalibration = calibrations.length;
  const activeLoansCount = loans.filter(l => l.status === 'Dipinjam' || l.status === 'Disetujui').length;
  const totalDamageCount = corrective.length;
  const totalRooms = rooms.length;

  // KPI calculations
  const passedCalibrationCount = equipment.filter(e => e.calibrationStatus === 'Lulus').length;
  const compliancePct = totalEquip ? Math.round((passedCalibrationCount / totalEquip) * 100) : 100;

  // Alerts calculations
  const urgentCalibrations = calibrations.filter(c => c.daysRemaining <= 30);

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Quick Operational Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-6 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Sistem Manajemen Inventaris Alat Medis (SIM-IRIN) RS Mardi Rahayu</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Dashboard Realtime Operasional & Kelaikan Alat Medis
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Monitoring realtime data inventaris, pemeliharaan preventif, kalibrasi BPFK, peminjaman antar unit, serta penanganan kerusakan alat medis IRIN.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onAddNewEquipment}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah Alat Medis</span>
            </button>
            <button
              onClick={onOpenScanner}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/20 transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4 text-sky-300" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Inventaris */}
        <div onClick={() => onSelectModule('inventaris')} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Inventaris</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{totalEquip}</span>
            <span className="text-[10px] block font-bold text-emerald-600 mt-0.5">Unit Medis</span>
          </div>
        </div>

        {/* Total Maintenance */}
        <div onClick={() => onSelectModule('pm')} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Maintenance</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-indigo-900 font-mono">{totalMaintenance}</span>
            <span className="text-[10px] block font-bold text-indigo-600 mt-0.5">PM Selesai / PM</span>
          </div>
        </div>

        {/* Total Kalibrasi */}
        <div onClick={() => onSelectModule('kalibrasi')} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Kalibrasi</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-900 font-mono">{totalCalibration}</span>
            <span className="text-[10px] block font-bold text-emerald-600 mt-0.5">Sertifikat Aktif</span>
          </div>
        </div>

        {/* Total Peminjaman */}
        <div onClick={() => onSelectModule('peminjaman')} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Peminjaman</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-900 font-mono">{activeLoansCount}</span>
            <span className="text-[10px] block font-bold text-amber-600 mt-0.5">Dipinjam Unit</span>
          </div>
        </div>

        {/* Total Kerusakan */}
        <div onClick={() => onSelectModule('corrective')} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Kerusakan</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-900 font-mono">{totalDamageCount}</span>
            <span className="text-[10px] block font-bold text-rose-600 mt-0.5">Perlu Solusi/WO</span>
          </div>
        </div>

        {/* Total Ruangan */}
        <div onClick={() => onSelectModule('ruangan')} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Ruangan</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-purple-900 font-mono">{totalRooms}</span>
            <span className="text-[10px] block font-bold text-purple-600 mt-0.5">Unit ICU/HCU</span>
          </div>
        </div>
      </div>

      {/* 3 Analytics Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Grafik Status Kondisi Inventaris */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span>Grafik Kondisi Inventaris</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{totalEquip} Unit</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Baik / Siap Pakai</span>
                <span className="font-bold text-emerald-600">{goodCount} ({totalEquip ? Math.round((goodCount/totalEquip)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalEquip ? (goodCount/totalEquip)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Dalam Perbaikan</span>
                <span className="font-bold text-amber-600">{repairCount} ({totalEquip ? Math.round((repairCount/totalEquip)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalEquip ? (repairCount/totalEquip)*100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Rusak Ringan / Berat</span>
                <span className="font-bold text-rose-600">{minorCount + heavyCount} ({totalEquip ? Math.round(((minorCount+heavyCount)/totalEquip)*100) : 0}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${totalEquip ? ((minorCount+heavyCount)/totalEquip)*100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Grafik Status Maintenance (PM) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Wrench className="w-4 h-4 text-indigo-600" />
              <span>Grafik Status Maintenance</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{totalMaintenance} Jadwal</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Selesai Terverifikasi</span>
                <span className="font-bold text-emerald-600">{pms.filter(p => p.status === 'Selesai').length} Log</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pms.length ? (pms.filter(p => p.status === 'Selesai').length/pms.length)*100 : 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Work Order Perbaikan Aktif</span>
                <span className="font-bold text-amber-600">{corrective.filter(c => c.status === 'Dalam Perbaikan').length} Tiket</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${corrective.length ? (corrective.filter(c => c.status === 'Dalam Perbaikan').length/corrective.length)*100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Grafik Status Kalibrasi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Grafik Kelaikan Kalibrasi</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{compliancePct}% Lulus</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Sertifikat BPFK Aktif</span>
                <span className="font-bold text-emerald-600">{passedCalibrationCount} Unit</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${compliancePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Mendekati Expired (≤30 Hari)</span>
                <span className="font-bold text-amber-600">{urgentCalibrations.length} Unit</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalEquip ? (urgentCalibrations.length/totalEquip)*100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Room Distribution & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Distribution by Room */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Sebaran & Kondisi Alat per Ruangan IRIN</span>
              </h3>
              <p className="text-xs text-slate-500">Distribusi unit medis aktif di ICU, NICU, PICU, HCU, dan Ruang Operasi</p>
            </div>
            <button
              onClick={() => onSelectModule('ruangan')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
            >
              Lihat Ruangan →
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {rooms.slice(0, 5).map((room) => {
              const roomEquipCount = equipment.filter(e => e.roomId === room.id).length;
              const percentage = Math.round((roomEquipCount / (totalEquip || 1)) * 100);
              return (
                <div key={room.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>{room.name}</span>
                    </span>
                    <span className="font-mono text-sky-800">{roomEquipCount} Unit ({percentage}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Calibration Status Summary */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-emerald-600" />
                <span>Status Kelaikan Alat</span>
              </h3>
              <p className="text-xs text-slate-500">Hasil pengujian fisik & kalibrasi terverifikasi</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="flex items-center font-bold text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></div> Baik & Lulus Kalibrasi
                </span>
                <span className="font-mono font-extrabold text-slate-900">{goodCount} Unit</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="flex items-center font-bold text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></div> Mendekati Expired
                </span>
                <span className="font-mono font-extrabold text-amber-700">{urgentCalibrations.length} Unit</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="flex items-center font-bold text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2"></div> Rusak Ringan / Berat
                </span>
                <span className="font-mono font-extrabold text-rose-700">{minorCount + heavyCount} Unit</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="flex items-center font-bold text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-600 mr-2"></div> Sedang Dalam Perbaikan
                </span>
                <span className="font-mono font-extrabold text-sky-800">{repairCount} Unit</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <div className="w-28 h-28 mx-auto rounded-full border-8 border-emerald-500 flex items-center justify-center shadow-inner">
              <div>
                <div className="text-2xl font-black font-mono text-slate-900">{compliancePct}%</div>
                <div className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase">COMPLIANT</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">Standar Akreditasi KARS & Permenkes</p>
          </div>
        </div>
      </div>

      {/* Activity Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Aktivitas Inventaris & Maintenance Terbaru</span>
            </h3>
            <p className="text-xs text-slate-500">Pembaruan status alat medis dan catatan teknisi</p>
          </div>
          <button
            onClick={() => onSelectModule('audit')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            Lihat Audit Log →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">No. Inventaris</th>
                <th className="p-3.5">Nama Alat Medis</th>
                <th className="p-3.5">Ruangan</th>
                <th className="p-3.5">Sertifikasi / Status</th>
                <th className="p-3.5">Merk / Model</th>
                <th className="p-3.5 text-center">Status Alat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {equipment.slice(0, 6).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-sky-700">{item.inventoryNo}</td>
                  <td className="p-3.5 font-bold text-slate-800">{item.name}</td>
                  <td className="p-3.5 font-medium">{item.locationRoom}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      {item.calibrationStatus || 'Lulus'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{item.brand} {item.model}</td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'Baik'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Dalam Perbaikan'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
