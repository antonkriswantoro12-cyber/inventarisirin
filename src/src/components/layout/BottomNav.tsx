import React from 'react';
import {
  LayoutDashboard,
  Stethoscope,
  QrCode,
  Wrench,
  FileBarChart2
} from 'lucide-react';

interface BottomNavProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  onOpenScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenScanner
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventaris', label: 'Inventaris', icon: Stethoscope },
    { id: 'scan', label: 'Scan QR', icon: QrCode, isAction: true },
    { id: 'pm', label: 'Maintenance', icon: Wrench },
    { id: 'laporan', label: 'Laporan', icon: FileBarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md lg:hidden shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;

        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={onOpenScanner}
              className="-mt-5 flex flex-col items-center justify-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/30 ring-4 ring-white active:scale-95 transition-all">
                <Icon className="w-6 h-6" />
              </div>
              <span className="mt-1 text-[10px] font-bold text-sky-700">Scan QR</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelectModule(item.id)}
            className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600 stroke-[2.5]' : 'text-slate-400'}`} />
            <span className="mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
