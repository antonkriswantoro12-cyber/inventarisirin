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
  Info
} from 'lucide-react';
import {
  Equipment,
  CalibrationRecord,
  PMRecord,
  CorrectiveMaintenanceRecord,
  Sparepart,
  Room,
  AuditLog,
  KPIStats
} from '../../types/inventory';

interface DashboardViewProps {
  equipment: Equipment[];
  calibrations: CalibrationRecord[];
  pms: PMRecord[];
  corrective: CorrectiveMaintenanceRecord[];
  spareparts: Sparepart[];
  rooms: Room[];
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
  auditLogs,
  onSelectModule,
  onOpenScanner,
  onAddNewEquipment
}) => {
  const [selectedCalendarTab, setSelectedCalendarTab] = useState<'kalibrasi' | 'pm'>('kalibrasi');

  // Calculate Status Totals
  const totalEquip = equipment.length;
  const goodCount = equipment.filter(e => e.status === 'Baik').length;
  const minorCount = equipment.filter(e => e.status === 'Rusak Ringan').length;
  const heavyCount = equipment.filter(e => e.status === 'Rusak Berat').length;
  const repairCount = equipment.filter(e => e.status === 'Dalam Perbaikan').length;

  // KPI calculations
  const passedCalibrationCount = equipment.filter(e => e.calibrationStatus === 'Lulus').length;
  const compliancePct = totalEquip ? Math.round((passedCalibrationCount / totalEquip) * 100) : 100;
  const mttrHours = 18.4;
  const mtbfDays = 124;
  const uptimePct = 98.6;

  // Alerts calculations
  const urgentCalibrations = calibrations.filter(c => c.daysRemaining <= 30);
  const lowStockParts = spareparts.filter(s => s.stock <= s.minStock);

  return (
    <div className="grid grid-cols-12 gap-4 flex-1 font-sans text-slate-900">
      
      {/* Top Metrics Row */}
      <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white border border-slate-200 p-3 flex flex-col justify-between">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Aset Inventaris</div>
        <div className="flex items-end justify-between mt-2">
          <span className="text-3xl font-mono font-bold text-slate-900">{totalEquip}</span>
          <span className="text-xs font-medium text-emerald-600">+2.4% ↑</span>
        </div>
        <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
          <div className="w-3/4 h-full bg-blue-500"></div>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white border border-slate-200 p-3 flex flex-col justify-between">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Menunggu Kalibrasi</div>
        <div className="flex items-end justify-between mt-2">
          <span className="text-3xl font-mono font-bold text-amber-600">{urgentCalibrations.length}</span>
          <span className="text-[10px] py-0.5 px-1.5 bg-amber-50 text-amber-600 rounded border border-amber-200 font-semibold">Warning</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 truncate">Jatuh tempo dalam 30 hari ke depan</div>
      </div>

      <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white border border-slate-200 p-3 flex flex-col justify-between">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Alat Status Rusak</div>
        <div className="flex items-end justify-between mt-2">
          <span className="text-3xl font-mono font-bold text-red-600">{repairCount + minorCount + heavyCount}</span>
          <span className="text-[10px] py-0.5 px-1.5 bg-red-50 text-red-600 rounded border border-red-200 font-semibold">Critical</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 truncate">Sedang dalam perbaikan teknisi</div>
      </div>

      <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-white border border-slate-200 p-3 flex flex-col justify-between">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Kepatuhan PM</div>
        <div className="flex items-end justify-between mt-2">
          <span className="text-3xl font-mono font-bold text-emerald-600">{compliancePct}%</span>
          <span className="text-xs text-slate-400">Target: 95%</span>
        </div>
        <div className="mt-2 h-1 bg-slate-100 rounded overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${compliancePct}%` }}></div>
        </div>
      </div>

      {/* Charts & Distribution Row */}
      <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 flex flex-col">
        <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">Sebaran & Maintenance Alat per Ruangan</h3>
          <button
            onClick={() => onSelectModule('ruangan')}
            className="text-[10px] text-blue-600 font-semibold hover:underline"
          >
            Lihat Semua Ruangan →
          </button>
        </div>
        <div className="p-4 flex-1 space-y-3">
          {rooms.slice(0, 5).map((room) => {
            const roomEquipCount = equipment.filter(e => e.roomId === room.id).length;
            const percentage = Math.round((roomEquipCount / (totalEquip || 1)) * 100);
            return (
              <div key={room.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{room.name}</span>
                  </div>
                  <span className="font-mono text-slate-500">{roomEquipCount} Unit ({percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded transition-all duration-300"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 flex flex-col">
        <div className="px-4 py-2 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">Status Kalibrasi Alat</h3>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center text-slate-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Lulus Kalibrasi
              </span>
              <span className="font-mono font-bold text-slate-800">{goodCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center text-slate-700">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Mendekati Expired
              </span>
              <span className="font-mono font-bold text-slate-800">{urgentCalibrations.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center text-slate-700">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div> Tidak Lulus / Rusak
              </span>
              <span className="font-mono font-bold text-slate-800">{minorCount + heavyCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center text-slate-700">
                <div className="w-2 h-2 rounded-full bg-slate-900 mr-2"></div> Dalam Perbaikan
              </span>
              <span className="font-mono font-bold text-slate-800">{repairCount}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="w-28 h-28 mx-auto rounded-full border-8 border-emerald-500 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold font-mono text-slate-900">{compliancePct}%</div>
                <div className="text-[8px] text-slate-400 tracking-wider">COMPLIANCE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table Section */}
      <div className="col-span-12 bg-white border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">Aktivitas Inventaris Terbaru</h3>
          <button
            onClick={() => onSelectModule('audit')}
            className="text-[10px] text-blue-600 font-semibold hover:underline"
          >
            Lihat Semua →
          </button>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="px-4 py-2 font-semibold text-slate-500">ID ALAT</th>
                <th className="px-4 py-2 font-semibold text-slate-500">NAMA ALAT</th>
                <th className="px-4 py-2 font-semibold text-slate-500">LOKASI</th>
                <th className="px-4 py-2 font-semibold text-slate-500">KEGIATAN</th>
                <th className="px-4 py-2 font-semibold text-slate-500">TEKNISI</th>
                <th className="px-4 py-2 font-semibold text-slate-500 text-right">TANGGAL</th>
                <th className="px-4 py-2 font-semibold text-slate-500 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equipment.slice(0, 5).map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-4 py-2 font-mono text-slate-800 font-semibold">{item.inventoryNo || item.partNo}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-2 text-slate-600">{item.roomName}</td>
                  <td className="px-4 py-2 text-slate-600">Pemeliharaan Rutin</td>
                  <td className="px-4 py-2 text-slate-600">Anton Kriswantoro</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-500">12/10/26 09:15</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold ${
                      item.status === 'Baik'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'Dalam Perbaikan'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
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
