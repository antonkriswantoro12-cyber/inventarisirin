import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Camera,
  Printer,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { Equipment, Sparepart } from '../../types/inventory';
import { generateLabelsPDF, generateQRCodeDataUrl, generateBarcodeDataUrl } from '../../lib/exportUtils';

interface QRCodeViewProps {
  equipment: Equipment[];
  spareparts: Sparepart[];
  selectedItemForQR?: Equipment | Sparepart | null;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  equipment,
  spareparts,
  selectedItemForQR
}) => {
  const [activeTab, setActiveTab] = useState<'label' | 'scanner'>('label');
  const [selectedLabelSize, setSelectedLabelSize] = useState<'standard' | 'small' | 'large'>('standard');
  const [selectedItems, setSelectedItems] = useState<string[]>(equipment.map(e => e.id));
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>('');
  const [previewItem, setPreviewItem] = useState<Equipment | null>(equipment[0] || null);

  // Camera Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<Equipment | null>(null);
  const [scanInput, setScanInput] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (selectedItemForQR && 'inventoryNo' in selectedItemForQR) {
      const found = equipment.find(e => e.inventoryNo === selectedItemForQR.inventoryNo);
      if (found) setPreviewItem(found);
    }
  }, [selectedItemForQR]);

  useEffect(() => {
    if (previewItem) {
      generateQRCodeDataUrl(previewItem.inventoryNo).then(url => setQrDataUrl(url));
    }
  }, [previewItem]);

  // Start Camera Stream Simulation / Real Video Feed
  const startCameraScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access fallback simulation active:', err);
    }
  };

  const stopCameraScan = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const found = equipment.find(
      e => e.inventoryNo.toLowerCase() === scanInput.trim().toLowerCase() ||
           e.assetNo.toLowerCase() === scanInput.trim().toLowerCase() ||
           e.serialNo.toLowerCase() === scanInput.trim().toLowerCase()
    );

    if (found) {
      setScanResult(found);
    } else {
      alert(`Alat dengan kode "${scanInput}" tidak ditemukan dalam database.`);
    }
  };

  const handleBatchPrintPDF = () => {
    const itemsToPrint = equipment.filter(e => selectedItems.includes(e.id));
    generateLabelsPDF(itemsToPrint, selectedLabelSize);
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === equipment.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(equipment.map(e => e.id));
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Barcode & QR Code Generator / Scanner</h2>
            <p className="text-xs text-slate-500">Cetak label aset medis standar RS & pindai QR melalui kamera HP / scanner</p>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('label');
              stopCameraScan();
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'label' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Cetak Label Barcode / QR
          </button>
          <button
            onClick={() => {
              setActiveTab('scanner');
              startCameraScan();
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'scanner' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Camera className="w-4 h-4 text-sky-600" />
            <span>Kamera Scanner</span>
          </button>
        </div>
      </div>

      {activeTab === 'label' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preview Label Box */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                PRATINJAU STIKER LABEL ASET (STANDAR RS)
              </h3>

              {previewItem ? (
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="bg-sky-600 text-white p-2 rounded-lg text-center font-bold text-xs uppercase tracking-wider">
                    RS MARDI RAHAYU — INSTALASI IRIN
                  </div>

                  <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200">
                    {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-20 h-20" />}
                    <div className="space-y-0.5 text-xs">
                      <p className="font-bold text-slate-800 leading-tight">{previewItem.name}</p>
                      <p className="font-mono text-[11px] text-sky-700 font-bold">{previewItem.inventoryNo}</p>
                      <p className="text-[10px] text-slate-500">Aset: {previewItem.assetNo}</p>
                      <p className="text-[10px] text-slate-500">Lokasi: {previewItem.roomName}</p>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-400 text-center font-mono">
                    Scan QR ini untuk melihat SOP & status kalibrasi
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Pilih alat untuk melihat pratinjau label.</p>
              )}

              {/* Label Settings */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ukuran Stiker Label:</label>
                  <select
                    value={selectedLabelSize}
                    onChange={(e) => setSelectedLabelSize(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  >
                    <option value="standard">Standard (50 x 30 mm)</option>
                    <option value="small">Kecil / Compact (40 x 25 mm)</option>
                    <option value="large">Besar / Tag Asset (70 x 40 mm)</option>
                  </select>
                </div>

                <button
                  onClick={handleBatchPrintPDF}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak {selectedItems.length} Label Ke PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Batch Item Selection Table */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Daftar Alat Untuk Cetak Label Massal</h3>
              <button
                onClick={toggleSelectAll}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                {selectedItems.length === equipment.length ? 'Batal Pilih Semua' : 'Pilih Semua Alat'}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
              {equipment.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setPreviewItem(item);
                      toggleSelectItem(item.id);
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(item.id)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <span className="font-mono text-[10px] text-slate-500">{item.inventoryNo} | {item.roomName}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {item.assetNo}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Camera Scanner Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camera Viewfinder */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Camera className="w-5 h-5 text-sky-600" />
              <span>Pindai QR Code dengan Kamera</span>
            </h3>

            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border-2 border-sky-500">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-dashed border-sky-400/80 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-sky-300 text-xs font-bold bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-md">
                  Arahkan QR Label Alat ke Kotak
                </span>
              </div>
            </div>

            {/* Manual Barcode Input Fallback */}
            <form onSubmit={handleManualScanSubmit} className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">Atau Ketik Kode Inventaris / Seri Manual:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Contoh: IRIN-VNT-2024-001"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700"
                >
                  Cari Alat
                </button>
              </div>
            </form>
          </div>

          {/* Scan Result Overlay */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Hasil Informasi Alat Terpindai</h3>

            {scanResult ? (
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-sky-200">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">
                      {scanResult.inventoryNo}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 mt-1">{scanResult.name}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400">Lokasi:</span>
                    <p className="font-bold text-sky-700">{scanResult.roomName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Status Alat:</span>
                    <p className="font-bold text-slate-800">{scanResult.status}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Jatuh Tempo Kalibrasi:</span>
                    <p className="font-bold text-amber-700">{scanResult.nextCalibrationDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Tahun Beli:</span>
                    <p className="font-bold text-slate-800">{scanResult.purchaseYear}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
                <QrCode className="w-12 h-12 text-slate-300" />
                <p className="text-xs">Arahkan kamera atau ketik kode inventaris di samping untuk melihat info alat.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
