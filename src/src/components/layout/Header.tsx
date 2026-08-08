import React, { useState } from 'react';
import {
  Activity,
  Bell,
  Search,
  QrCode,
  Shield,
  User,
  ChevronDown,
  LogOut,
  Hospital,
  AlertTriangle,
  CheckCircle2,
  Menu,
  Sparkles,
  Plus,
  Camera
} from 'lucide-react';
import { AppUser, SystemSettings } from '../../types/inventory';

interface HeaderProps {
  user: AppUser;
  settings: SystemSettings;
  onOpenScanner: () => void;
  onSelectModule: (module: string) => void;
  onToggleSidebar: () => void;
  onUpdateUserPhoto?: (photoUrl: string) => void;
  notificationCount: number;
  unreadNotifications: { id: string; title: string; time: string; type: 'warning' | 'info' | 'error' }[];
}

export const Header: React.FC<HeaderProps> = ({
  user,
  settings,
  onOpenScanner,
  onSelectModule,
  onToggleSidebar,
  onUpdateUserPhoto,
  notificationCount,
  unreadNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUserPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectModule('inventaris');
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-6 shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumb Badges */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-100 text-sky-800 text-xs font-bold">
            <Hospital className="w-3.5 h-3.5 text-sky-600" />
            <span>RS MARDI RAHAYU KUDUS</span>
          </div>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-700">Instalasi IRIN (ICU / NICU / PICU)</span>
        </div>

        <div className="sm:hidden text-xs font-extrabold text-slate-800 tracking-tight flex items-center space-x-1.5">
          <Hospital className="w-4 h-4 text-sky-600" />
          <span>RS MARDI RAHAYU</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-sm mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari alat medis, no. inventaris, BMN, merk..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-4 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-2xs"
          />
        </form>
      </div>

      {/* Right: Actions, Notifications, User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectModule('inventaris')}
            className="flex items-center space-x-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-sky-600/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Inventaris</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
            title="Scan Label QR / Barcode Alat"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        </div>

        {/* Date Display */}
        <div className="hidden xl:flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {currentDateFormatted}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Pemberitahuan Sistem"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full font-bold flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-4 shadow-2xl border border-slate-100 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Bell className="w-3.5 h-3.5 text-sky-600" />
                  <span>Pemberitahuan System</span>
                </span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                  {unreadNotifications.length} Baru
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                {unreadNotifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">Tidak ada notifikasi baru</p>
                ) : (
                  unreadNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                      onClick={() => {
                        setShowNotifications(false);
                        onSelectModule('kalibrasi');
                      }}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg ${
                        notif.type === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800 leading-tight">{notif.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Dropdown */}
        <div className="relative border-l border-slate-200/80 pl-3">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100/80 transition-colors group"
          >
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/40 shadow-2xs group-hover:ring-sky-500 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
              <span className="text-[10px] font-semibold text-sky-700">{user.role}</span>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2.5 shadow-2xl border border-slate-100 z-50 animate-fade-in">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="relative group/avatar cursor-pointer">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500 shadow-2xs"
                    />
                    <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <Camera className="w-3.5 h-3.5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoChange}
                      />
                    </label>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <label className="flex items-center justify-center space-x-1.5 w-full py-1.5 px-2 bg-white hover:bg-sky-50 text-sky-700 text-[11px] font-bold rounded-lg border border-sky-200 cursor-pointer transition-colors shadow-2xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ubah Foto Profil Saya</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                </label>

                <div className="flex items-center space-x-1.5 mt-2">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                    {user.role}
                  </span>
                  <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                    {user.department || 'Instalasi IRIN'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onSelectModule('roles');
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors"
              >
                <Shield className="w-4 h-4 text-sky-600" />
                <span>Hak Akses & Roles</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onSelectModule('settings');
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Pengaturan Sistem</span>
              </button>

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={() => alert('Sesi Anton Kriswantoro dikonfirmasi aman dan aktif.')}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Kunci Sesi / Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
