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
  FolderArchive,
  History,
  Code2,
  UserCheck,
  Settings,
  Server,
  X,
  Hospital,
  Activity
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
        { id: 'inventaris', label: 'Inventaris Alat Medis', icon: Stethoscope },
        { id: 'kalibrasi', label: 'Jadwal & Sertifikat Kalibrasi', icon: CalendarCheck, badgeText: 'IRIN' },
      ]
    },
    {
      title: 'PEMELIHARAAN & SPAREPART',
      items: [
        { id: 'pm', label: 'Preventive Maintenance', icon: Wrench },
        { id: 'corrective', label: 'Work Order Perbaikan (CM)', icon: AlertOctagon, badgeText: 'WO' },
        { id: 'sparepart', label: 'Master Sparepart', icon: Boxes },
        { id: 'vendor', label: 'Manajemen Vendor', icon: Truck },
      ]
    },
    {
      title: 'OPERASIONAL ELEKTROMEDIS',
      items: [
        { id: 'teknisi', label: 'Teknisi ATEM & Workstation', icon: Users },
        { id: 'ruangan', label: 'Lokasi & Ruangan IRIN', icon: Building2 },
        { id: 'peminjaman', label: 'Peminjaman Alat Medis', icon: Handshake },
        { id: 'qrcode', label: 'Barcode & QR Code Center', icon: QrCode },
      ]
    },
    {
      title: 'LAPORAN & DOKUMEN',
      items: [
        { id: 'laporan', label: 'Laporan & Analytics', icon: FileBarChart2 },
        { id: 'import', label: 'Import & Export Excel', icon: FileSpreadsheet },
        { id: 'dokumen', label: 'Dokumen & SOP Center', icon: FolderArchive },
      ]
    },
    {
      title: 'SISTEM & MANAJEMEN',
      items: [
        { id: 'audit', label: 'Audit Log System', icon: History },
        { id: 'roles', label: 'Hak Akses & Roles', icon: UserCheck },
        { id: 'settings', label: 'Pengaturan System', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 transform bg-slate-900 text-slate-200 flex-shrink-0 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-slate-800/80 shadow-xl ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/90 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-wide">SIM-IRIN</h1>
              <p className="text-[10px] font-semibold text-sky-400">RS Mardi Rahayu Kudus</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-2 space-y-4">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="px-3 py-1.5 text-slate-400 uppercase font-extrabold text-[9px] tracking-wider">
                {section.title}
              </div>
              <div className="space-y-0.5 mt-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-bold'
                          : item.highlight
                          ? 'text-emerald-400 hover:bg-slate-800/80 hover:text-emerald-300'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-emerald-400'
                            : 'text-slate-400 group-hover:text-sky-400'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badgeText && !isActive && (
                        <span className="text-[9px] font-bold bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                          {item.badgeText}
                        </span>
                      )}
                      {item.highlight && !isActive && (
                        <span className="text-[9px] font-extrabold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                          PHP
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Admin Info */}
        <div className="p-3.5 bg-slate-950/80 border-t border-slate-800/80">
          <div className="flex items-center space-x-3 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 shadow-sm">
              AK
            </div>
            <div className="overflow-hidden text-left flex-1">
              <p className="text-xs font-bold text-white truncate">Anton Kriswantoro</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[10px] font-medium text-slate-400 truncate">Super Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
