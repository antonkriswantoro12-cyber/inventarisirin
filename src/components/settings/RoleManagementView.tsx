import React from 'react';
import { Shield, UserCheck, Key, Lock, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types/inventory';

export const RoleManagementView: React.FC = () => {
  const roles = [
    {
      role: 'Super Admin',
      badge: 'Akses Penuh',
      users: ['Anton Kriswantoro, S.ST'],
      permissions: ['Tambah / Edit / Hapus Alat', 'Input Kalibrasi & PM', 'Ekspor / Impor Excel', 'Backup Database', 'Pengaturan Hak Akses']
    },
    {
      role: 'Teknisi Elektromedis (ATEM)',
      badge: 'Akses Operasional',
      users: ['Budi Santoso, A.Md.Tem', 'Dewi Rahmawati, ST'],
      permissions: ['Input Kalibrasi & PM', 'Buat Laporan Kerusakan', 'Input Sparepart', 'Cetak Label QR']
    },
    {
      role: 'Kepala Ruangan (Ka. Ru)',
      badge: 'Akses Verifikasi',
      users: ['Ns. Ratna Sari, S.Kep (ICU)', 'Ns. Bambang H, S.Kep (NICU)'],
      permissions: ['Verifikasi Tanda Tangan Digital', 'Permohonan Perbaikan', 'Peminjaman Alat']
    },
    {
      role: 'Direksi / Manajemen',
      badge: 'Akses Read-Only',
      users: ['dr. H. Purnomo, Sp.B (Direktur)'],
      permissions: ['Lihat Dashboard & Laporan', 'Cetak Rekap PDF / Excel']
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-sky-600" />
            <span>Manajemen Pengguna & Hak Akses (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control untuk Super Admin, Teknisi, Kepala Ruangan, dan Manajemen RS Mardi Rahayu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r, i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">{r.role}</h3>
              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full">
                {r.badge}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-semibold block">Pengguna Terdaftar:</span>
              <div className="flex flex-wrap gap-1">
                {r.users.map((u, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-medium">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-400 font-semibold block">Izin Modul:</span>
              {r.permissions.map((p, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700">{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
