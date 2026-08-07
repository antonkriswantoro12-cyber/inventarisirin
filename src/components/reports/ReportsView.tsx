import React, { useState } from 'react';
import { FileBarChart2, Download, FileSpreadsheet, Calendar, Filter, CheckCircle } from 'lucide-react';
import { Equipment, CalibrationRecord, PMRecord, CorrectiveMaintenanceRecord, Sparepart, Vendor } from '../../types/inventory';
import { exportToExcel, exportToPDF, exportToCSV } from '../../lib/exportUtils';

interface ReportsViewProps {
  equipment: Equipment[];
  calibrations: CalibrationRecord[];
  pms: PMRecord[];
  corrective: CorrectiveMaintenanceRecord[];
  spareparts: Sparepart[];
  vendors: Vendor[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  equipment,
  calibrations,
  pms,
  corrective,
  spareparts,
  vendors
}) => {
  const [reportType, setReportType] = useState<'inventaris' | 'kalibrasi' | 'pm' | 'kerusakan' | 'sparepart' | 'vendor'>('inventaris');

  const handleExportExcel = () => {
    if (reportType === 'inventaris') {
      exportToExcel(equipment, 'Rekap_Laporan_Inventaris_Alat_IRIN');
    } else if (reportType === 'kalibrasi') {
      exportToExcel(calibrations, 'Rekap_Laporan_Kalibrasi_IRIN');
    } else if (reportType === 'pm') {
      exportToExcel(pms, 'Rekap_Laporan_PM_IRIN');
    } else if (reportType === 'kerusakan') {
      exportToExcel(corrective, 'Rekap_Laporan_Kerusakan_IRIN');
    } else if (reportType === 'sparepart') {
      exportToExcel(spareparts, 'Rekap_Laporan_Sparepart_IRIN');
    } else {
      exportToExcel(vendors, 'Rekap_Laporan_Vendor_IRIN');
    }
  };

  const handleExportCSV = () => {
    if (reportType === 'inventaris') {
      exportToCSV(equipment, 'Rekap_Inventaris');
    } else if (reportType === 'kalibrasi') {
      exportToCSV(calibrations, 'Rekap_Kalibrasi');
    } else if (reportType === 'pm') {
      exportToCSV(pms, 'Rekap_PM');
    } else {
      exportToCSV(corrective, 'Rekap_Kerusakan');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <FileBarChart2 className="w-6 h-6 text-sky-600" />
            <span>Pusat Laporan & Ekspor Data RS Mardi Rahayu</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cetak rekap tahunan, bulanan, harian untuk audit KARS & BPFK ke Excel (.xlsx), PDF, dan CSV
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Select Report Type */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {[
          { id: 'inventaris', label: 'Inventaris Alat' },
          { id: 'kalibrasi', label: 'Kalibrasi' },
          { id: 'pm', label: 'Preventive PM' },
          { id: 'kerusakan', label: 'Kerusakan' },
          { id: 'sparepart', label: 'Stok Sparepart' },
          { id: 'vendor', label: 'Vendor Directory' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setReportType(item.id as any)}
            className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all border ${
              reportType === item.id
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Pratinjau Tabel Laporan: {reportType.toUpperCase()}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Item / Nama</th>
                <th className="py-2.5 px-3">Kode / No. Inv</th>
                <th className="py-2.5 px-3">Parameter / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {reportType === 'inventaris' && equipment.map(e => (
                <tr key={e.id}>
                  <td className="py-2 px-3 font-bold">{e.name}</td>
                  <td className="py-2 px-3 font-mono">{e.inventoryNo}</td>
                  <td className="py-2 px-3">{e.status} ({e.roomName})</td>
                </tr>
              ))}
              {reportType === 'kalibrasi' && calibrations.map(c => (
                <tr key={c.id}>
                  <td className="py-2 px-3 font-bold">{c.equipmentName}</td>
                  <td className="py-2 px-3 font-mono">{c.inventoryNo}</td>
                  <td className="py-2 px-3">{c.result} — {c.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
