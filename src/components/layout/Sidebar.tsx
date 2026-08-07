import React from 'react';
import {
  LayoutDashboard,
  Stethoscope,
  CalendarCheck,
  Wrench,
  AlertOctagon,
  Boxes,
  Truck,
  Users,
  Building2,
  Handshake,
  QrCode,
  FileBarChart2,
  FileSpreadsheet,
  Download,
  FolderArchive,
  History,
  Code2,
  UserCheck,
  Settings,
  Server,
  X
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpen,
  onCloseMobile
}) => {
  const menuSections = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventaris', label: 'Manajemen Inventaris', icon: Stethoscope },
        { id: 'kalibrasi', label: 'Manajemen Kalibrasi', icon: CalendarCheck, badge: 'Aktif' },
      ]
    },
    {
      title: 'PEMELIHARAAN',
      items: [
        { id: 'pm', label: 'Preventive Maintenance', icon: Wrench },
        { id: 'corrective', label: 'Corrective Maintenance', icon: AlertOctagon, badgeText: 'Kerusakan' },
        { id: 'sparepart', label: 'Master Sparepart', icon: Boxes },
        { id: 'vendor', label: 'Vendor Management', icon: Truck },
      ]
    },
    {
      title: 'OPERASIONAL',
      items: [
        { id: 'teknisi', label: 'Manajemen Teknisi', icon: Users },
        { id: 'ruangan', label: 'Manajemen Ruangan', icon: Building2 },
        { id: 'peminjaman', label: 'Peminjaman Alat', icon: Handshake },
        { id: 'qrcode', label: 'Barcode & QR Code', icon: QrCode },
      ]
    },
    {
      title: 'LAPORAN & DOKUMEN',
      items: [
        { id: 'laporan', label: 'Laporan & Analytics', icon: FileBarChart2 },
        { id: 'import', label: 'Import Data', icon: FileSpreadsheet },
        { id: 'dokumen', label: 'Dokumen Center', icon: FolderArchive },
      ]
    },
    {
      title: 'SISTEM & KEAMANAN',
      items: [
        { id: 'audit', label: 'Audit Log System', icon: History },
        { id: 'api', label: 'REST API Explorer', icon: Code2 },
        { id: 'roles', label: 'Hak Akses & Roles', icon: UserCheck },
        { id: 'settings', label: 'Pengaturan Sistem', icon: Settings },
        { id: 'infinityfree', label: 'InfinityFree Export Kit', icon: Server, highlight: true },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-56 transform bg-slate-900 flex-shrink-0 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest">SIM-IRIN</h1>
            <div className="text-lg font-serif italic text-white">RS Mardi Rahayu</div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          <nav className="space-y-4">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="px-4 py-2 text-slate-500 uppercase font-semibold text-[10px]">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectModule(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white font-medium'
                            : item.highlight
                            ? 'text-emerald-400 hover:bg-slate-800'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badgeText && !isActive && (
                          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                            {item.badgeText}
                          </span>
                        )}
                        {item.highlight && !isActive && (
                          <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                            PHP
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Admin User Info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              AK
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-semibold text-white truncate">Anton Kriswantoro</p>
              <p className="text-[10px] text-slate-400 truncate">Super Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
