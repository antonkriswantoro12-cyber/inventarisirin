import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  Key,
  Lock,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Search,
  UserPlus,
  X,
  AlertCircle,
  Sliders,
  CheckSquare,
  Square,
  User,
  Building,
  Mail,
  Phone,
  Tag
} from 'lucide-react';
import { AppUser, UserRoleDefinition } from '../../types/inventory';

interface RoleManagementViewProps {
  users: AppUser[];
  roleDefinitions: UserRoleDefinition[];
  activeUser: AppUser;
  onChangeActiveUser: (user: AppUser) => void;
  onAddUser: (u: Partial<AppUser>) => void;
  onUpdateUser: (id: string, u: Partial<AppUser>) => void;
  onDeleteUser: (id: string) => void;
  onUpdateRolePermissions: (roleId: string, permissions: string[]) => void;
  onAddRoleDefinition: (role: Partial<UserRoleDefinition>) => void;
}

export const ALL_PERMISSIONS = [
  { id: 'inventory_view', name: 'Lihat Daftar Inventaris Alat', category: 'Inventaris & Peralatan' },
  { id: 'inventory_add', name: 'Tambah Alat Kesehatan Baru', category: 'Inventaris & Peralatan' },
  { id: 'inventory_edit', name: 'Edit Detail & Lokasi Alat', category: 'Inventaris & Peralatan' },
  { id: 'inventory_delete', name: 'Hapus / Afkir Alat', category: 'Inventaris & Peralatan' },
  { id: 'calibration_manage', name: 'Input Sertifikat & Jadwal Kalibrasi', category: 'Kalibrasi & PM' },
  { id: 'pm_manage', name: 'Input & Eksekusi PM (Pemeliharaan Preventif)', category: 'Kalibrasi & PM' },
  { id: 'corrective_manage', name: 'Buat Laporan & Eksekusi Perbaikan (WO)', category: 'Laporan Kerusakan' },
  { id: 'sparepart_manage', name: 'Kelola Stok & Transaksi Sparepart', category: 'Sparepart & Vendor' },
  { id: 'vendor_manage', name: 'Kelola Vendor & Kontrak Servis', category: 'Sparepart & Vendor' },
  { id: 'loan_manage', name: 'Input & Proses Pengembalian Peminjaman Alat', category: 'Peminjaman Alat' },
  { id: 'sign_verification', name: 'Verifikasi Tanda Tangan Digital Ka. Ru', category: 'Verifikasi & Laporan' },
  { id: 'reports_export', name: 'Cetak Laporan Rekap PDF / Excel', category: 'Verifikasi & Laporan' },
  { id: 'rbac_manage', name: 'Kelola Pengguna & Matriks Hak Akses (RBAC)', category: 'Pengaturan Sistem' },
  { id: 'backup_manage', name: 'Backup & Restore Database System', category: 'Pengaturan Sistem' }
];

export const RoleManagementView: React.FC<RoleManagementViewProps> = ({
  users,
  roleDefinitions,
  activeUser,
  onChangeActiveUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onUpdateRolePermissions,
  onAddRoleDefinition
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'matrix' | 'roles'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<AppUser>>({
    name: '',
    username: '',
    email: '',
    nip: '',
    phone: '',
    role: 'Teknisi Elektromedis',
    department: 'ATEM / Pemeliharaan',
    status: 'Aktif'
  });

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleFormData, setRoleFormData] = useState<Partial<UserRoleDefinition>>({
    name: '',
    badge: 'Akses Khusus',
    description: '',
    permissions: ['inventory_view', 'reports_export']
  });

  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.nip && u.nip.includes(searchTerm));
    const matchRole = roleFilter === 'Semua' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleUserAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      username: '',
      email: '',
      nip: '',
      phone: '',
      role: 'Teknisi Elektromedis',
      department: 'ATEM / Pemeliharaan',
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: AppUser) => {
    setEditingUser(u);
    setUserFormData(u);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser.id, userFormData);
    } else {
      onAddUser({
        ...userFormData,
        username: userFormData.username || userFormData.email?.split('@')[0] || `user_${Date.now()}`
      });
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUserClick = (id: string, name: string) => {
    if (users.length <= 1) {
      alert('Tidak dapat menghapus pengguna terakhir.');
      return;
    }
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${name}"?`)) {
      onDeleteUser(id);
    }
  };

  const handleTogglePermission = (role: UserRoleDefinition, permId: string) => {
    const hasPerm = role.permissions.includes(permId);
    let updated: string[];
    if (hasPerm) {
      updated = role.permissions.filter(p => p !== permId);
    } else {
      updated = [...role.permissions, permId];
    }
    onUpdateRolePermissions(role.id, updated);
  };

  const handleSaveNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormData.name) return;
    onAddRoleDefinition(roleFormData);
    setIsRoleModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-sky-600" />
            <span>Manajemen Pengguna & Hak Akses (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control untuk Super Admin, Teknisi Elektromedis (ATEM), Kepala Ruangan, dan Manajemen RS Mardi Rahayu
          </p>
        </div>

        {/* Active Session Simulation Switcher */}
        <div className="flex items-center space-x-2 bg-sky-50 p-2 rounded-xl border border-sky-100 text-xs">
          <UserCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span className="font-semibold text-slate-600 hidden sm:inline">Sesi Aktif:</span>
          <select
            value={activeUser.id}
            onChange={(e) => {
              const selected = users.find(u => u.id === e.target.value);
              if (selected) onChangeActiveUser(selected);
            }}
            className="bg-white border border-sky-200 rounded-lg px-2.5 py-1 text-xs font-bold text-sky-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'users'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Daftar Pengguna ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'matrix'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Matriks Hak Akses (Permissions)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'roles'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Peran & Role System ({roleDefinitions.length})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR PENGGUNA (USERS CRUD) */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-1 items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, NIP, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700"
              >
                <option value="Semua">Semua Role</option>
                {roleDefinitions.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddUser}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20 w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Pengguna Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Pengguna</th>
                    <th className="py-3 px-4">NIP / Username</th>
                    <th className="py-3 px-4">Jabatan / Role</th>
                    <th className="py-3 px-4">Departemen / Unit</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.map((u) => {
                    const isCurrent = u.id === activeUser.id;
                    return (
                      <tr key={u.id} className={`hover:bg-slate-50/60 transition-colors ${isCurrent ? 'bg-sky-50/40' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/30 border border-sky-200 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm border border-sky-200 flex-shrink-0">
                                {u.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-slate-800 flex items-center space-x-1">
                                <span>{u.name}</span>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                                    Aktif Ini
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 block">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-slate-700">
                          <div>{u.nip || '-'}</div>
                          <span className="text-[10px] text-slate-400">@{u.username}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-sky-100 text-sky-800 rounded-full">
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {u.department}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onUpdateUser(u.id, { status: u.status === 'Aktif' ? 'Nonaktif' : 'Aktif' })}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors ${
                              u.status === 'Aktif'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Klik untuk ubah status"
                          >
                            {u.status}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Edit Pengguna"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUserClick(u.id, u.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATRIKS HAK AKSES INTERAKTIF */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Pengaturan Hak Akses Real-Time (RBAC)</span>
              Semua centang di bawah ini menentukan modul apa saja yang dapat diakses oleh masing-masing Peran / Role.
              Perubahan langsung tersimpan di sistem.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-700">
                    <th className="py-3 px-4 min-w-[240px]">Izin / Modul Operasional</th>
                    {roleDefinitions.map(r => (
                      <th key={r.id} className="py-3 px-4 text-center min-w-[140px]">
                        <span className="block font-bold text-slate-800">{r.name}</span>
                        <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-mono block mt-1">
                          {r.permissions.length} Izin
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {ALL_PERMISSIONS.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{p.name}</div>
                        <span className="text-[10px] text-slate-400">{p.category}</span>
                      </td>

                      {roleDefinitions.map(role => {
                        const hasPerm = role.permissions.includes(p.id);
                        return (
                          <td key={role.id} className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleTogglePermission(role, p.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                hasPerm
                                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                  : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                              }`}
                              title={hasPerm ? `Cabut izin ${p.name}` : `Berikan izin ${p.name}`}
                            >
                              {hasPerm ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAFTAR ROLE SYSTEM */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Daftar peran/jabatan sistem dengan lencana akses dan jumlah perizinan modul.
            </p>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Peran (Role Custom)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleDefinitions.map((r) => {
              const assignedUsersCount = users.filter(u => u.role === r.name).length;
              return (
                <div key={r.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{r.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{r.description}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full flex-shrink-0">
                      {r.badge}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-slate-400 font-semibold block">Pengguna Terdaftar ({assignedUsersCount}):</span>
                    <div className="flex flex-wrap gap-1">
                      {users
                        .filter(u => u.role === r.name)
                        .map((u, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-medium text-[11px]">
                            {u.name}
                          </span>
                        ))}
                      {assignedUsersCount === 0 && (
                        <span className="text-slate-400 italic">Belum ada pengguna dengan role ini</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Cakupan Izin ({r.permissions.length} Modul):</span>
                      <button
                        onClick={() => setActiveSubTab('matrix')}
                        className="text-[10px] font-bold text-sky-600 hover:underline"
                      >
                        Atur Matriks →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                      {r.permissions.map((permId) => {
                        const permInfo = ALL_PERMISSIONS.find(p => p.id === permId);
                        return (
                          <div key={permId} className="flex items-center space-x-1.5 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{permInfo?.name || permId}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: TAMBAH / EDIT PENGGUNA */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              {/* Profile Photo Upload */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>Foto Profil Pengguna (Dapat diakses & diedit):</span>
                </label>
                <div className="flex items-center space-x-3">
                  {userFormData.avatar ? (
                    <img
                      src={userFormData.avatar}
                      alt="Preview Avatar"
                      className="w-12 h-12 object-cover rounded-full ring-2 ring-sky-500 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-base border border-sky-200 flex-shrink-0">
                      {userFormData.name ? userFormData.name.charAt(0) : '?'}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUserAvatarUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar:</label>
                <input
                  type="text"
                  value={userFormData.name || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="mis. Budi Santoso, A.Md.Tem"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP / No. Anggota:</label>
                  <input
                    type="text"
                    value={userFormData.nip || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, nip: e.target.value })}
                    placeholder="19900823..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username System:</label>
                  <input
                    type="text"
                    value={userFormData.username || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    placeholder="budi.atem"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email:</label>
                  <input
                    type="email"
                    value={userFormData.email || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="budi@mardirahayu.com"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp:</label>
                  <input
                    type="text"
                    value={userFormData.phone || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Peran Akses:</label>
                  <select
                    value={userFormData.role || roleDefinitions[0]?.name}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-bold"
                  >
                    {roleDefinitions.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Pengguna:</label>
                  <select
                    value={userFormData.status || 'Aktif'}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Departemen / Unit Kerja:</label>
                <input
                  type="text"
                  value={userFormData.department || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                  placeholder="mis. ATEM / Pemeliharaan, Ruang ICU"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUAT ROLE CUSTOM BARU */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Buat Peran / Role Baru</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Peran / Role:</label>
                <input
                  type="text"
                  value={roleFormData.name || ''}
                  onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  placeholder="mis. Auditor Internal"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Label Akses (Badge):</label>
                <input
                  type="text"
                  value={roleFormData.badge || ''}
                  onChange={(e) => setRoleFormData({ ...roleFormData, badge: e.target.value })}
                  placeholder="mis. Akses Khusus Audit"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Ringkas:</label>
                <textarea
                  value={roleFormData.description || ''}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  rows={2}
                  placeholder="Deskripsikan wewenang peran ini..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20"
                >
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
