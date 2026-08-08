import React, { useState } from 'react';
import { Terminal, Send, Copy, Check, Code2, Server } from 'lucide-react';

export const RestApiExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/equipment');
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [responseJson, setResponseJson] = useState<string>('// Klik "Kirim Request HTTP" untuk menguji API...');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { path: '/api/dashboard', method: 'GET', desc: 'Summary ringkasan KPI & grafik inventaris' },
    { path: '/api/equipment', method: 'GET', desc: 'Daftar seluruh inventaris alat medis' },
    { path: '/api/calibration', method: 'GET', desc: 'Jadwal & riwayat sertifikat kalibrasi' },
    { path: '/api/pm', method: 'GET', desc: 'Catatan Preventive Maintenance (PM)' },
    { path: '/api/corrective', method: 'GET', desc: 'Laporan kerusakan & perbaikan' },
    { path: '/api/spareparts', method: 'GET', desc: 'Katalog stok sparepart & rak' },
    { path: '/api/vendors', method: 'GET', desc: 'Direktori vendor & kontrak' },
    { path: '/api/technicians', method: 'GET', desc: 'Daftar teknisi elektromedis' },
    { path: '/api/rooms', method: 'GET', desc: 'Daftar ruangan ICU/HCU/NICU' },
    { path: '/api/loans', method: 'GET', desc: 'Riwayat peminjaman alat' },
    { path: '/api/backup', method: 'GET', desc: 'Backup database JSON & SQL' }
  ];

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(selectedEndpoint);
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-sky-600" />
            <span>Penguji & Dokumentasi REST API Mobile Android</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrasi API JSON standar untuk aplikasi Android (Kotlin/Flutter), Webhook, dan integrasi SIRS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            PILIH ENDPOINT REST API
          </h3>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                onClick={() => setSelectedEndpoint(ep.path)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedEndpoint === ep.path
                    ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-400'
                    : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">{ep.path}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Console / Output Tester */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-800 text-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2 font-mono text-xs text-sky-400">
                <Server className="w-4 h-4" />
                <span>http://localhost:3000{selectedEndpoint}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-sky-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Mengirim...' : 'Kirim Request HTTP'}</span>
                </button>
              </div>
            </div>

            <pre className="font-mono text-xs text-emerald-400 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-[420px] leading-relaxed">
              {responseJson}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>Header: Content-Type: application/json</span>
            <span>Auth: Bearer token_mardi_rahayu_2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
