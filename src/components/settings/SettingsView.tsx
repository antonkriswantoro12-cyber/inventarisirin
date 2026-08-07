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
            <span>Pengaturan Sistem & Cadangan (Backup / Restore)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi identitas rumah sakit, backup database JSON/SQL, dan penyusutan umur ekonomis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Database Backup & Restore */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Backup & Restore Database</span>
          </h3>

          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Unduh salinan cadangan lengkap (Inventaris, Kalibrasi, PM, Perbaikan, Sparepart, Vendor, TTD) dalam bentuk berkas `.json` atau `.sql`.
            </p>

            <button
              onClick={handleBackupClick}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Cadangan Database (.json)</span>
            </button>

            {isBackupSuccess && (
              <p className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Cadangan berhasil diunduh ke komputer Anda.</span>
              </p>
            )}

            <div className="pt-3 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-1">Pulihkan Data (Restore):</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
