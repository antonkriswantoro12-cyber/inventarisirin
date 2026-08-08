import React, { useState } from 'react';
import { Settings, Database, Download, RefreshCw, CheckCircle, Hospital, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  onTriggerBackup: () => void;
  onRestoreBackup: (jsonData: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onTriggerBackup, onRestoreBackup }) => {
  const [hospitalName, setHospitalName] = useState('RS Mardi Rahayu Kudus');
  const [unitName, setUnitName] = useState('Instalasi IRIN (Intensive Care)');
  const [address, setAddress] = useState('Jl. AKBP Agil Kusumadya No. 110, Kudus, Jawa Tengah');
  const [isBackupSuccess, setIsBackupSuccess] = useState(false);

  const handleBackupClick = () => {
    onTriggerBackup();
    setIsBackupSuccess(true);
    setTimeout(() => setIsBackupSuccess(false), 3000);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        onRestoreBackup(content);
        alert('Database berhasil dipulihkan dari cadangan JSON!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-sky-600" />
            <span>Pengaturan Sistem & Identitas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi identitas rumah sakit dan kop laporan resmi
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Hospital Identity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <Hospital className="w-4 h-4 text-sky-600" />
            <span>Identitas Rumah Sakit & Kop Laporan</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Rumah Sakit:</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Unit / Instalasi:</label>
              <input
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
