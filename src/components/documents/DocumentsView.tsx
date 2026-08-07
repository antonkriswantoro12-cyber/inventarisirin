import React from 'react';
import { FileText, Download, Eye, Upload, BookOpen, ShieldCheck } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const docs = [
    { id: '1', title: 'SOP Pengoperasian Ventilator Hamilton C3 (No. SOP/IRIN/001)', category: 'SOP', size: '2.4 MB', date: '2026-01-15', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '2', title: 'User Manual & Service Manual Syringe Pump Terumo TE-331', category: 'Manual Book', size: '14.8 MB', date: '2025-11-20', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '3', title: 'Sertifikat Induk Kalibrasi BPFK Semarang Tahun 2026', category: 'Sertifikat', size: '5.1 MB', date: '2026-03-01', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '4', title: 'Pedoman KARS & Keselamatan Kerja Radiasi/Elektromedis RSMR', category: 'Kebijakan', size: '8.3 MB', date: '2026-02-10', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            <span>Pusat Dokumen, SOP & Manual Book PDF</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arsip digital Standar Operasional Prosedur, buku petunjuk teknis pabrikan, dan dokumen akreditasi KARS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(doc => (
          <div key={doc.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  {doc.category}
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-1 leading-tight">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Ukuran: {doc.size} | Diunggah: {doc.date}</p>
              </div>
            </div>

            <a
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-sky-200"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
