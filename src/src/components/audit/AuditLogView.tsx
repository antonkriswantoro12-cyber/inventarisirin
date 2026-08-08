import React from 'react';
import { History, Shield, User, Clock, HardDrive } from 'lucide-react';
import { AuditLog } from '../../types/inventory';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <History className="w-6 h-6 text-sky-600" />
            <span>Audit Log & Sistem Jejak Aktivitas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log mencatat seluruh perubahan data inventaris, kalibrasi, PM, IP address, dan pengguna penanggung jawab
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Waktu & Timestamp</th>
                <th className="py-3 px-4">Pengguna / User</th>
                <th className="py-3 px-4">Aksi / Tindakan</th>
                <th className="py-3 px-4">Modul Target</th>
                <th className="py-3 px-4">Rincian Perubahan</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{log.userName}</p>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                      log.action === 'UPDATE' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{log.module}</td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs">{log.details}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
