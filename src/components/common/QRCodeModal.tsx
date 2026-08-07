import React, { useEffect, useState } from 'react';
import { X, Printer, Download, QrCode } from 'lucide-react';
import { generateQRCodeDataUrl } from '../../lib/exportUtils';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, item }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (item) {
      const code = item.inventoryNo || item.partNo || item.id;
      generateQRCodeDataUrl(code).then(url => setQrUrl(url));
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <QrCode className="w-4 h-4 text-sky-600" />
            <span>Label Barcode / QR Code Aset</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-4 space-y-3 text-center">
          <div className="bg-sky-700 text-white p-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
            RS MARDI RAHAYU — KUDUS
          </div>

          <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-slate-200 space-y-2">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-32 h-32" />
            ) : (
              <div className="w-32 h-32 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
                Memuat QR...
              </div>
            )}
            <p className="font-mono text-xs font-bold text-sky-800">{item.inventoryNo || item.partNo}</p>
          </div>

          <div className="text-left text-xs space-y-0.5 pt-1 border-t border-slate-200">
            <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
            <p className="text-[10px] text-slate-500">No. Aset: {item.assetNo || '-'}</p>
            <p className="text-[10px] text-slate-500">Ruangan: {item.roomName || item.storageLocation || '-'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Label</span>
          </button>
          <a
            href={qrUrl}
            download={`QR_${item.inventoryNo || item.partNo}.png`}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>PNG</span>
          </a>
        </div>
      </div>
    </div>
  );
};
