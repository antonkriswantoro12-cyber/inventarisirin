import React, { useState } from 'react';
import { FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Equipment } from '../../types/inventory';

interface ImportViewProps {
  onImportEquipmentBatch: (batch: Partial<Equipment>[]) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onImportEquipmentBatch }) => {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setParsedData(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        inventoryNo: 'IRIN-VNT-2026-999',
        assetNo: 'AST-ICU-999',
        name: 'Ventilator Portable ICU',
        brand: 'Hamilton',
        modelNo: 'Hamilton C3',
        serialNo: 'HML-C3-1122',
        category: 'Ventilator',
        roomName: 'ICU Utama',
        status: 'Baik',
        purchaseYear: 2026,
        purchasePrice: 380000000,
        nextCalibrationDate: '2027-08-01'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Template_Import_Inventaris_IRIN_RSMR.xlsx');
  };

  const handleCommitImport = () => {
    if (!parsedData.length) return;
    const batch = parsedData.map((row, idx) => ({
      inventoryNo: row.inventoryNo || `IRIN-IMP-2026-${idx + 1}`,
      assetNo: row.assetNo || `AST-IMP-${idx + 1}`,
      name: row.name || 'Alat Impor',
      brand: row.brand || 'Generic',
      modelNo: row.modelNo || 'M-01',
      serialNo: row.serialNo || 'SN-000',
      category: row.category || 'Lain-lain',
      roomName: row.roomName || 'ICU Utama',
      status: row.status || 'Baik',
      purchaseYear: row.purchaseYear || 2026,
      purchasePrice: row.purchasePrice || 10000000,
      nextCalibrationDate: row.nextCalibrationDate || '2027-08-01',
      photos: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80']
    }));

    onImportEquipmentBatch(batch);
    setIsSuccess(true);
    setTimeout(() => {
      setParsedData([]);
      setFileName('');
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <span>Import Data Inventaris via Excel (.xlsx / .csv)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh template import standar, unggah berkas Excel, lalu lakukan pra-validasi sebelum disimpan
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 transition-colors shadow-2xs"
        >
          <Download className="w-4 h-4 text-sky-600" />
          <span>Unduh Template Import Excel</span>
        </button>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center space-y-4 shadow-2xs">
        <div className="max-w-md mx-auto border-2 border-dashed border-sky-300 rounded-2xl p-8 bg-sky-50/50 hover:bg-sky-50 transition-colors">
          <Upload className="w-12 h-12 text-sky-600 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">Pilih Berkas Excel atau CSV</p>
          <p className="text-[11px] text-slate-400 mt-1 mb-4">Format disupport: .xlsx, .xls, .csv</p>

          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="hidden"
            id="excel-file-input"
          />
          <label
            htmlFor="excel-file-input"
            className="px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl cursor-pointer hover:bg-sky-700 shadow-md shadow-sky-600/20"
          >
            Pilih File Excel
          </label>
          {fileName && <p className="text-xs font-semibold text-emerald-700 mt-3">File dipilih: {fileName}</p>}
        </div>
      </div>

      {/* Data Preview before Import */}
      {parsedData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">
              Pratinjau Data Terbaca ({parsedData.length} Baris Data)
            </h3>
            <button
              onClick={handleCommitImport}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20"
            >
              Komit & Impor Ke Database
            </button>
          </div>

          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                  <th className="p-2">No. Inv</th>
                  <th className="p-2">Nama Alat</th>
                  <th className="p-2">Merk & Model</th>
                  <th className="p-2">Ruangan</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-2 font-mono font-bold text-slate-800">{r.inventoryNo || '-'}</td>
                    <td className="p-2 font-semibold text-slate-800">{r.name || '-'}</td>
                    <td className="p-2 text-slate-600">{r.brand} {r.modelNo}</td>
                    <td className="p-2 text-slate-600">{r.roomName || 'ICU'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Berhasil mengimpor {parsedData.length} data alat medis baru ke sistem!</span>
        </div>
      )}
    </div>
  );
};
