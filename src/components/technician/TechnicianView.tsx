import React from 'react';
import { Users, Award, Calendar, CheckCircle, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Technician } from '../../types/inventory';

interface TechnicianViewProps {
  technicians: Technician[];
}

export const TechnicianView: React.FC<TechnicianViewProps> = ({ technicians }) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span>Manajemen Teknisi Elektromedis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar tenaga elektromedis profesional RS Mardi Rahayu, sertifikasi ATEM, beban kerja aktif, dan skor kinerja
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow">
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

            <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-400 font-semibold">Jadwal Kerja:</span>
                <span className="font-medium">{t.schedule}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-400 font-semibold">Beban Tugas Aktif:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {t.activeWorkload} Perbaikan / PM
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-400 font-semibold">Total Pekerjaan Selesai:</span>
                <span className="font-bold text-emerald-700">{t.completedTasksCount} Tugas</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sertifikasi & Keahlian:
              </span>
              <div className="flex flex-wrap gap-1">
                {t.certifications.map((cert, idx) => (
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
  );
};
