import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  QrCode,
  FileText,
  MapPin,
  History,
  FileSpreadsheet,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Wrench,
  ChevronRight,
  ExternalLink,
  DollarSign,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { Equipment, Room, Vendor, CategoryType, LocationHistory } from '../../types/inventory';
import { exportToExcel, exportToPDF, generateLabelsPDF } from '../../lib/exportUtils';

interface InventoryViewProps {
  equipment: Equipment[];
  rooms: Room[];
  vendors: Vendor[];
  onAddEquipment: (newItem: Partial<Equipment>) => void;
  onUpdateEquipment: (id: string, updated: Partial<Equipment>) => void;
  onDeleteEquipment: (id: string) => void;
  onRelocateEquipment: (id: string, newRoomId: string, notes: string) => void;
  onShowQRModal: (item: Equipment) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  equipment,
  rooms,
  vendors,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  onRelocateEquipment,
  onShowQRModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRoom, setSelectedRoom] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Equipment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [relocateModalItem, setRelocateModalItem] = useState<Equipment | null>(null);
  const [targetRoomId, setTargetRoomId] = useState('');
  const [relocateNotes, setRelocateNotes] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Equipment>>({
    inventoryNo: `IRIN-MED-2026-00${equipment.length + 1}`,
    assetNo: `AST-IRIN-00${equipment.length + 1}`,
    name: '',
    brand: '',
    modelNo: '',
    serialNo: '',
    category: 'Ventilator',
    subcategory: 'Perawatan Intensif',
    roomId: rooms[0]?.id || '',
    roomName: rooms[0]?.name || '',
    status: 'Baik',
    purchaseYear: 2026,
    purchasePrice: 150000000,
    economicLifespan: 5,
    salvageValue: 15000000,
    warrantyExpiry: '2028-12-31',
    purchaseVendorId: vendors[0]?.id || '',
    purchaseVendorName: vendors[0]?.name || '',
    serviceVendorId: vendors[0]?.id || '',
    serviceVendorName: vendors[0]?.name || '',
    calibrationVendorId: vendors[2]?.id || vendors[0]?.id || '',
    calibrationVendorName: vendors[2]?.name || vendors[0]?.name || '',
    nextCalibrationDate: '2027-08-01',
    calibrationStatus: 'Lulus',
    nextPMDate: '2026-11-01',
    pmFrequencyMonths: 3,
    photos: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'],
    notes: ''
  });

  // Filter Logic
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inventoryNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesRoom = selectedRoom === 'ALL' || item.roomId === selectedRoom;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesRoom && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      inventoryNo: `IRIN-MED-2026-00${equipment.length + 1}`,
      assetNo: `AST-IRIN-00${equipment.length + 1}`,
      name: '',
      brand: '',
      modelNo: '',
      serialNo: '',
      category: 'Ventilator',
      subcategory: 'Perawatan Intensif',
      roomId: rooms[0]?.id || '',
      roomName: rooms[0]?.name || '',
      status: 'Baik',
      purchaseYear: 2026,
      purchasePrice: 150000000,
      economicLifespan: 5,
      salvageValue: 15000000,
      warrantyExpiry: '2028-12-31',
      purchaseVendorId: vendors[0]?.id || '',
      purchaseVendorName: vendors[0]?.name || '',
      serviceVendorId: vendors[0]?.id || '',
      serviceVendorName: vendors[0]?.name || '',
      calibrationVendorId: vendors[2]?.id || vendors[0]?.id || '',
      calibrationVendorName: vendors[2]?.name || vendors[0]?.name || '',
      nextCalibrationDate: '2027-08-01',
      calibrationStatus: 'Lulus',
      nextPMDate: '2026-11-01',
      pmFrequencyMonths: 3,
      photos: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'],
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData(item);
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find(r => r.id === formData.roomId);
    const pVendor = vendors.find(v => v.id === formData.purchaseVendorId);
    const cVendor = vendors.find(v => v.id === formData.calibrationVendorId);

    const payload = {
      ...formData,
      roomName: room?.name || formData.roomName || 'ICU Utama',
      purchaseVendorName: pVendor?.name || formData.purchaseVendorName || 'PT Medika',
      calibrationVendorName: cVendor?.name || formData.calibrationVendorName || 'BPFK Semarang'
    };

    if (editingItem) {
      onUpdateEquipment(editingItem.id, payload);
    } else {
      onAddEquipment(payload);
    }

    setIsAddModalOpen(false);
  };

  const handleExecuteRelocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (relocateModalItem && targetRoomId) {
      onRelocateEquipment(relocateModalItem.id, targetRoomId, relocateNotes);
      setRelocateModalItem(null);
      setTargetRoomId('');
      setRelocateNotes('');
    }
  };

  const handleExportExcel = () => {
    const dataToExport = filteredEquipment.map(item => ({
      'No. Inventaris': item.inventoryNo,
      'No. Aset RS': item.assetNo,
      'Nama Alat': item.name,
      'Merk': item.brand,
      'Model': item.modelNo,
      'No. Seri': item.serialNo,
      'Kategori': item.category,
      'Ruangan': item.roomName,
      'Status': item.status,
      'Thn Beli': item.purchaseYear,
      'Harga Beli': item.purchasePrice,
      'Jatuh Tempo Kalibrasi': item.nextCalibrationDate,
      'Status Kalibrasi': item.calibrationStatus
    }));
    exportToExcel(dataToExport, 'Inventaris_Alat_RS_Mardi_Rahayu_IRIN');
  };

  const handleExportPDF = () => {
    const cols = [
      { header: 'No. Inv', key: 'inventoryNo' },
      { header: 'Nama Alat', key: 'name' },
      { header: 'Merk & Model', key: 'brandModel' },
      { header: 'No. Seri', key: 'serialNo' },
      { header: 'Ruangan', key: 'roomName' },
      { header: 'Status', key: 'status' },
      { header: 'Next Kalibrasi', key: 'nextCalibrationDate' }
    ];
    const data = filteredEquipment.map(item => ({
      inventoryNo: item.inventoryNo,
      name: item.name,
      brandModel: `${item.brand} ${item.modelNo}`,
      serialNo: item.serialNo,
      roomName: item.roomName,
      status: item.status,
      nextCalibrationDate: item.nextCalibrationDate
    }));
    exportToPDF('Laporan Daftar Inventaris Alat Kesehatan IRIN', cols, data, 'Inventaris_IRIN_RSMR');
  };

  const handleEquipmentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const photoUrl = reader.result;
          setFormData(prev => ({
            ...prev,
            photos: [photoUrl, ...(prev.photos || [])]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Stethoscope className="w-6 h-6 text-sky-600" />
            <span>Manajemen Inventaris Alat Medis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola master alat kesehatan, dokumen pendukung, lokasi ruangan, dan riwayat perpindahan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => generateLabelsPDF(filteredEquipment)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Cetak Batch Label</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Alat Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, merk, no. seri, no inv..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Ventilator">Ventilator</option>
            <option value="Patient Monitor">Patient Monitor</option>
            <option value="Syringe Pump">Syringe Pump</option>
            <option value="Infusion Pump">Infusion Pump</option>
            <option value="Defibrillator">Defibrillator</option>
            <option value="ECG Machine">ECG Machine</option>
            <option value="Suction Pump">Suction Pump</option>
            <option value="Incubator">Incubator</option>
          </select>
        </div>

        <div>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500"
          >
            <option value="ALL">Semua Ruangan</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500"
          >
            <option value="ALL">Semua Status Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
            <option value="Dalam Kalibrasi">Dalam Kalibrasi</option>
            <option value="Afkir">Afkir</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Info Alat & No. Inv</th>
                <th className="py-3 px-4">Merk & Model</th>
                <th className="py-3 px-4">Lokasi Ruangan</th>
                <th className="py-3 px-4">Status Alat</th>
                <th className="py-3 px-4">Jatuh Tempo Kalibrasi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">
                    Tidak ada alat medis yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.photos[0] || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=150&q=80'}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800 hover:text-sky-600 cursor-pointer" onClick={() => setSelectedItemForDetail(item)}>
                            {item.name}
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">{item.inventoryNo}</span>
                            <span>•</span>
                            <span>Aset: {item.assetNo}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{item.brand}</p>
                      <p className="text-[11px] text-slate-500">{item.modelNo} (SN: {item.serialNo})</p>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{item.roomName}</span>
                      </div>
                      <button
                        onClick={() => {
                          setRelocateModalItem(item);
                          setTargetRoomId(item.roomId);
                        }}
                        className="text-[10px] text-sky-600 hover:underline flex items-center mt-1"
                      >
                        <ArrowRightLeft className="w-3 h-3 mr-1" />
                        Pindahkan Lokasi
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' :
                        item.status === 'Dalam Perbaikan' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{item.nextCalibrationDate}</p>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                        item.calibrationStatus === 'Lulus' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.calibrationStatus === 'Mendekati' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.calibrationStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setSelectedItemForDetail(item)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Lihat Detail & Dokumen PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onShowQRModal(item)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Tampilkan QR Code Label"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Data"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEquipment(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Alat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItemForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full uppercase">
                  {selectedItemForDetail.category}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-1">{selectedItemForDetail.name}</h3>
                <p className="text-xs text-slate-500 font-mono">No. Inv: {selectedItemForDetail.inventoryNo} | No. Aset: {selectedItemForDetail.assetNo}</p>
              </div>
              <button onClick={() => setSelectedItemForDetail(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photos & Docs */}
              <div className="space-y-4">
                <img
                  src={selectedItemForDetail.photos[0]}
                  alt={selectedItemForDetail.name}
                  className="w-full h-48 rounded-xl object-cover ring-1 ring-slate-200 shadow-sm"
                />

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dokumen Pendukung</h4>
                  {selectedItemForDetail.manualBookUrl && (
                    <a
                      href={selectedItemForDetail.manualBookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-sky-700 font-medium"
                    >
                      <span className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <span>Manual Book (PDF)</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedItemForDetail.sopUrl && (
                    <a
                      href={selectedItemForDetail.sopUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-emerald-700 font-medium"
                    >
                      <span className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>SOP Penggunaan (PDF)</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 font-semibold block">Merk / Pabrikan:</span>
                    <span className="font-bold text-slate-800">{selectedItemForDetail.brand}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 font-semibold block">Model & Seri:</span>
                    <span className="font-bold text-slate-800">{selectedItemForDetail.modelNo} ({selectedItemForDetail.serialNo})</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 font-semibold block">Lokasi Ruangan:</span>
                    <span className="font-bold text-sky-700">{selectedItemForDetail.roomName}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 font-semibold block">Tahun & Harga Beli:</span>
                    <span className="font-bold text-slate-800">{selectedItemForDetail.purchaseYear} — Rp {selectedItemForDetail.purchasePrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 font-semibold block">Umur Ekonomis:</span>
                    <span className="font-bold text-slate-800">{selectedItemForDetail.economicLifespan} Tahun</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 font-semibold block">Vendor Kalibrasi:</span>
                    <span className="font-bold text-slate-800">{selectedItemForDetail.calibrationVendorName}</span>
                  </div>
                </div>

                {/* Location Movement History */}
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <History className="w-4 h-4 text-sky-600" />
                    <span>Riwayat Perpindahan Lokasi Alat</span>
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedItemForDetail.locationHistory.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Belum ada riwayat perpindahan.</p>
                    ) : (
                      selectedItemForDetail.locationHistory.map((hist) => (
                        <div key={hist.id} className="p-2 rounded bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{hist.fromRoom} &rarr; {hist.toRoom}</span>
                            <span className="text-[10px] text-slate-400">{hist.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">Dipindahkan oleh: {hist.movedBy} ({hist.notes})</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Relocate Modal */}
      {relocateModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Pindahkan Lokasi Alat</h3>
            <p className="text-xs text-slate-500 mb-4">
              Pindahkan <strong>{relocateModalItem.name}</strong> ({relocateModalItem.inventoryNo}) dari ruangan saat ini (<strong>{relocateModalItem.roomName}</strong>).
            </p>

            <form onSubmit={handleExecuteRelocation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Ruangan Tujuan:</label>
                <select
                  value={targetRoomId}
                  onChange={(e) => setTargetRoomId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500"
                >
                  <option value="">-- Pilih Ruangan --</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Alasan Perpindahan:</label>
                <input
                  type="text"
                  value={relocateNotes}
                  onChange={(e) => setRelocateNotes(e.target.value)}
                  placeholder="Contoh: Kebutuhan darurat penanganan pasien ICU"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRelocateModalItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20 transition-all"
                >
                  Simpan Perpindahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingItem ? 'Edit Data Alat Kesehatan' : 'Tambah Inventaris Alat Kesehatan Baru'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Inventaris (Otomatis)</label>
                  <input
                    type="text"
                    value={formData.inventoryNo || ''}
                    onChange={(e) => setFormData({ ...formData, inventoryNo: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Aset Rumah Sakit</label>
                  <input
                    type="text"
                    value={formData.assetNo || ''}
                    onChange={(e) => setFormData({ ...formData, assetNo: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Alat Medis</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ventilator ICU Evita V500"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Merk / Brand</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Model</label>
                  <input
                    type="text"
                    value={formData.modelNo || ''}
                    onChange={(e) => setFormData({ ...formData, modelNo: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Seri (Serial No)</label>
                  <input
                    type="text"
                    value={formData.serialNo || ''}
                    onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Alat</label>
                  <select
                    value={formData.category || 'Ventilator'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  >
                    <option value="Ventilator">Ventilator</option>
                    <option value="Patient Monitor">Patient Monitor</option>
                    <option value="Syringe Pump">Syringe Pump</option>
                    <option value="Infusion Pump">Infusion Pump</option>
                    <option value="Defibrillator">Defibrillator</option>
                    <option value="ECG Machine">ECG Machine</option>
                    <option value="Suction Pump">Suction Pump</option>
                    <option value="Incubator">Incubator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Ruangan</label>
                  <select
                    value={formData.roomId || ''}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Beli (Rp)</label>
                  <input
                    type="number"
                    value={formData.purchasePrice || 0}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Pembelian</label>
                  <input
                    type="number"
                    value={formData.purchaseYear || 2026}
                    onChange={(e) => setFormData({ ...formData, purchaseYear: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Umur Ekonomis (Thn)</label>
                  <input
                    type="number"
                    value={formData.economicLifespan || 5}
                    onChange={(e) => setFormData({ ...formData, economicLifespan: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1">Upload Foto / Gambar Alat Medis:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEquipmentImageUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
                {formData.photos && formData.photos.length > 0 && (
                  <div className="flex items-center space-x-2 mt-2 overflow-x-auto pb-1">
                    {formData.photos.map((p, idx) => (
                      <img key={idx} src={p} alt="Alat" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20 transition-all"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Alat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
