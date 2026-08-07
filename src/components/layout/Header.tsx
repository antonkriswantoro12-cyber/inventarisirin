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
  CheckCircle,
  Menu
} from 'lucide-react';
import { AppUser, SystemSettings } from '../../types/inventory';

interface HeaderProps {
  user: AppUser;
  settings: SystemSettings;
  onOpenScanner: () => void;
  onSelectModule: (module: string) => void;
  onToggleSidebar: () => void;
  notificationCount: number;
  unreadNotifications: { id: string; title: string; time: string; type: 'warning' | 'info' | 'error' }[];
}

export const Header: React.FC<HeaderProps> = ({
  user,
  settings,
  onOpenScanner,
  onSelectModule,
  onToggleSidebar,
  notificationCount,
  unreadNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectModule('inventaris');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded border border-slate-200 hover:bg-slate-50"
          title="Toggle Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="hidden sm:flex items-center space-x-3 text-xs">
          <span className="text-slate-400">Home / Dashboard</span>
          <span className="h-3.5 w-px bg-slate-200"></span>
          <span className="font-semibold text-slate-800">System Overview</span>
        </div>
        <div className="sm:hidden text-xs font-bold text-slate-800">
          RS MARDI RAHAYU — IRIN
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-xs mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari alat, no. inventaris, BMN..."
            className="w-full rounded border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          />
        </form>
      </div>

      {/* Right: Quick Actions, Notifications, User Profile */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectModule('inventaris')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            + Tambah Alat
          </button>
          <button
            onClick={() => onSelectModule('qrcode')}
            className="hidden sm:inline-block px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Cetak Label
          </button>
          <button
            onClick={onOpenScanner}
            className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded transition-colors flex items-center space-x-1"
            title="Scan QR Code / Barcode Alat"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-500">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center hover:text-slate-900 cursor-pointer"
            >
              <span className="mr-1">🔔</span>
              {notificationCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  {notificationCount}
                </span>
              )}
            </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white p-3 shadow-xl border border-slate-100 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-800">Pemberitahuan Sistem</span>
                <span className="text-[10px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                  {unreadNotifications.length} Baru
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {unreadNotifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-4">Tidak ada notifikasi baru</p>
                ) : (
                  unreadNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        onSelectModule('kalibrasi');
                      }}
                    >
                      <div className={`mt-0.5 p-1 rounded-md ${
                        notif.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-800 leading-tight">{notif.title}</p>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <span className="hidden md:inline-block font-mono text-[11px] text-slate-500">
          📅 12 Oct 2026
        </span>

        {/* User Profile Badge */}
        <div className="relative border-l border-slate-200 pl-2 sm:pl-3">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/30"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
              <span className="text-[10px] font-medium text-sky-700">{user.role}</span>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onSelectModule('settings');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Pengaturan Akun</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onSelectModule('api');
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span>REST API Tokens</span>
              </button>
              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={() => alert('Sesi Anton Kriswantoro dikonfirmasi aman.')}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar / Lock Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};
