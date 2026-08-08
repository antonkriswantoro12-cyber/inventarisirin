import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Upload,
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Trash2,
  X,
  FileCheck,
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';
import { DocumentSOP, SOPStep } from '../../types/inventory';
import { exportSOPToPDF } from '../../lib/exportUtils';

export const initialDocumentsSOP: DocumentSOP[] = [
  {
    id: 'sop-1',
    docNo: 'SOP/IRIN/2026/001',
    title: 'Pengoperasian Ventilator ICU Hamilton C3 & Evita V500',
    category: 'SOP',
    equipmentCategory: 'Ventilator',
    revision: 'Rev. 02',
    effectiveDate: '2026-01-15',
    author: 'Anton Kriswantoro, S.ST',
    approver: 'Kepala Instalasi IRIN RSMR',
    purpose: 'Sebagai acuan standar operasional pengoperasian mesin ventilator untuk menjaga ventilasi mekanis pasien dalam kondisi kritis secara aman dan sesuai standar KARS.',
    scope: 'Instalasi IRIN, Ruang ICU, HCU, ICCU, dan Instalasi Gawat Darurat (IGD) RS Mardi Rahayu.',
    prerequisites: [
      'Mesin Ventilator terkalibrasi BPFK & memiliki stiker LULUS aktif',
      'Breathing circuit steril & bacterial filter baru',
      'Catu daya terhubung ke UPS & Gas Medik O2/Air Kompresor terpasang',
      'Kantung Resusitator (Ambubag) siap di samping bed'
    ],
    steps: [
      {
        stepNo: 1,
        title: 'Pemeriksaan Pra-Pengoperasian (Pre-Operational Test)',
        description: 'Hubungkan kabel power ke stopkontak darurat (Merah/UPS). Pasang sirkuit pernapasan steril. Nyalakan switch Power di bagian belakang mesin.',
        warning: 'Pastikan tes kebocoran (Leakage Test) dan tes sirkuit (Self Test) menunjukkan hasil PASSED.'
      },
      {
        stepNo: 2,
        title: 'Pengaturan Parameter Modus Ventilasi',
        description: 'Pilih jenis pasien (Dewasa/Anak/Neonatus). Tentukan mode ventilasi sesuai instruksi dokter DPJP (misal: CMV, SIMV, PSV, BiPAP). Atur FiO2, PEEP, Tidal Volume, dan Frekuensi Nafas.',
        warning: 'Batas Alarm Pressure High harus diset 10-15 cmH2O di atas Peak Pressure terukur.'
      },
      {
        stepNo: 3,
        title: 'Koneksi ke Pasien & Observasi Respon',
        description: 'Hubungkan Y-piece sirkuit ke Endotracheal Tube (ETT) pasien. Amati pergerakan dada, kurva gelombang pada layar monitor, dan SPO2 pasien.',
        warning: 'Bila alarm berbunyi kencang (High Pressure / Apnea), segera gunakan Ambubag manual dan periksa jalur ETT.'
      },
      {
        stepNo: 4,
        title: 'Pengakhiran & Pembongkaran Sterilisasi',
        description: 'Matikan mesin setelah pemutusan mode (Standby). Lepas sirkuit bekas pakai ke kantong infeksius kuning. Bersihkan permukaan layar dengan kain micro-fiber alcohol 70%.',
        warning: 'Dilarang menyemprotkan cairan desinfektan secara langsung ke lubang ventilasi mesin.'
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    fileSize: '2.4 MB',
    uploadDate: '2026-01-15'
  },
  {
    id: 'sop-2',
    docNo: 'SOP/IRIN/2026/002',
    title: 'SOP Pengoperasian & Kalibrasi Harian Syringe Pump Terumo TE-331',
    category: 'SOP',
    equipmentCategory: 'Syringe Pump',
    revision: 'Rev. 01',
    effectiveDate: '2026-02-01',
    author: 'Budi Santoso, A.Md.Tem',
    approver: 'Kepala Instalasi IRIN RSMR',
    purpose: 'Memastikan pemberian obat-obatan High Alert (Inotropik, Sedatif) melalui Syringe Pump berjalan secara akurat dan presisi.',
    scope: 'Seluruh unit perawatan dan ruang inap RS Mardi Rahayu Kudus.',
    prerequisites: [
      'Spuit syringe terkonfirmasi kompatibel (Terumo / BD 10ml, 20ml, 50ml)',
      'Baterai cadangan terisi penuh (Minimal indikator 3 bar)',
      'Kabel ekstensi terpasang rapat tanpa tekukan'
    ],
    steps: [
      {
        stepNo: 1,
        title: 'Pemasangan Spuit Obat',
        description: 'Tarik penjepit spuit (Flange Clamp) dan putar 90 derajat. Masukkan spuit berisi obat hingga kuping spuit masuk ke celah pengunci.',
        warning: 'Pastikan ukuran spuit yang terdeteksi di layar sesuai dengan spuit fisik yang dipasang.'
      },
      {
        stepNo: 2,
        title: 'Setting Laju Aliran (Flow Rate ml/jam)',
        description: 'Tekan tombol angka untuk menentukan kecepatan aliran obat dalam ml/jam sesuai Dosis Order Dokter.',
        warning: 'Lakukan verifikasi ganda (Double Check) bersama perawat lain sebelum menekan tombol START.'
      },
      {
        stepNo: 3,
        title: 'Penanganan Alarm Oklusi (Sumbatan)',
        description: 'Bila alarm OCCLUSIVE berbunyi, tekan SILENCE. Periksa klem IV line atau pembuluh darah pasien dari tekukan.',
        warning: 'Jangan menekan tombol PURGE saat saluran masih terhubung ke IV catheter pasien.'
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1583912267670-65759240432e?auto=format&fit=crop&w=600&q=80',
    fileSize: '1.8 MB',
    uploadDate: '2026-02-01'
  },
  {
    id: 'sop-3',
    docNo: 'MNL/TERUMO/TE331-01',
    title: 'User Manual & Service Maintenance Manual Syringe Pump Terumo TE-331',
    category: 'Manual Book',
    equipmentCategory: 'Syringe Pump',
    revision: 'Rev. 00',
    effectiveDate: '2025-11-20',
    author: 'Terumo Corporation Japan',
    approver: 'Vendor PT Terumo Indonesia',
    purpose: 'Panduan teknis perbaikan, skema sirkuit elektronik, dan daftar suku cadang resmi pabrikan Terumo.',
    scope: 'Teknisi Elektromedis RSMR.',
    fileSize: '14.8 MB',
    uploadDate: '2025-11-20'
  },
  {
    id: 'sop-4',
    docNo: 'SRT/BPFK/2026/99',
    title: 'Sertifikat Induk Kalibrasi BPFK Semarang Tahun 2026',
    category: 'Sertifikat',
    equipmentCategory: 'Lain-lain',
    revision: 'Rev. 00',
    effectiveDate: '2026-03-01',
    author: 'BPFK Semarang',
    approver: 'Direktur BPFK',
    purpose: 'Dokumen keabsahan kalibrasi fasilitas kesehatan dan pemenuhan standar regulasi Kemenkes RI.',
    scope: 'Instalasi IRIN & Sarpras RSMR.',
    fileSize: '5.1 MB',
    uploadDate: '2026-03-01'
  }
];

interface DocumentsViewProps {
  documents?: DocumentSOP[];
  onAddDocument?: (doc: DocumentSOP) => void;
  onDeleteDocument?: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents: externalDocs,
  onAddDocument,
  onDeleteDocument
}) => {
  const [localDocs, setLocalDocs] = useState<DocumentSOP[]>(initialDocumentsSOP);
  const documents = externalDocs || localDocs;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');

  // Modal States
  const [selectedDocForView, setSelectedDocForView] = useState<DocumentSOP | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Form State
  const [formData, setFormData] = useState<Partial<DocumentSOP>>({
    docNo: `SOP/IRIN/2026/00${documents.length + 1}`,
    title: '',
    category: 'SOP',
    equipmentCategory: 'Ventilator',
    revision: 'Rev. 01',
    effectiveDate: new Date().toISOString().slice(0, 10),
    author: 'Teknisi Elektromedis RSMR',
    approver: 'Kepala Instalasi IRIN RSMR',
    purpose: '',
    scope: 'Instalasi IRIN RS Mardi Rahayu Kudus',
    prerequisites: ['Peralatan terkalibrasi', 'Kabel grounding aman'],
    steps: [
      { stepNo: 1, title: 'Persiapan Alat', description: 'Pastikan catu daya terhubung ke stopkontak UPS dan kabel terpasang rapat.', warning: 'Periksa fisik kabel dari keretakan.' },
      { stepNo: 2, title: 'Pengoperasian Utama', description: 'Nyalakan switch power, tunggu self-test selesai, lalu atur parameter.', warning: 'Jangan merubah nilai tanpa instruksi DPJP.' }
    ],
    coverImage: '',
    fileSize: '1.5 MB'
  });

  const [stepInputs, setStepInputs] = useState<SOPStep[]>([
    { stepNo: 1, title: 'Persiapan Alat', description: 'Pastikan catu daya terhubung ke stopkontak UPS dan kabel terpasang rapat.', warning: 'Periksa fisik kabel dari keretakan.' },
    { stepNo: 2, title: 'Pengoperasian Utama', description: 'Nyalakan switch power, tunggu self-test selesai, lalu atur parameter.', warning: 'Jangan merubah nilai tanpa instruksi DPJP.' }
  ]);

  const [prereqInput, setPrereqInput] = useState<string>('Peralatan terkalibrasi, Kabel grounding aman, APD Lengkap');

  // Filtered list
  const filteredDocs = documents.filter(doc => {
    const matchSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.docNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'SEMUA' || doc.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // Handle Cover Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Attachment File Upload
  const handleAttachmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({
            ...prev,
            fileUrl: reader.result as string,
            fileSize: fileSizeMB
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStep = () => {
    setStepInputs(prev => [
      ...prev,
      { stepNo: prev.length + 1, title: '', description: '', warning: '' }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    setStepInputs(prev => prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stepNo: idx + 1 })));
  };

  const handleSaveSOP = (e: React.FormEvent) => {
    e.preventDefault();
    const prereqArray = prereqInput.split(',').map(s => s.trim()).filter(Boolean);

    const newDoc: DocumentSOP = {
      id: `sop-${Date.now()}`,
      docNo: formData.docNo || `SOP/IRIN/${Date.now()}`,
      title: formData.title || 'Dokumen SOP Baru',
      category: formData.category as any || 'SOP',
      equipmentCategory: formData.equipmentCategory || 'Ventilator',
      revision: formData.revision || 'Rev. 01',
      effectiveDate: formData.effectiveDate || new Date().toISOString().slice(0, 10),
      author: formData.author || 'Teknisi ATEM RSMR',
      approver: formData.approver || 'Kepala Instalasi IRIN RSMR',
      purpose: formData.purpose || 'Pedoman standar penggunaan alat medis.',
      scope: formData.scope || 'Seluruh Ruangan RS Mardi Rahayu.',
      prerequisites: prereqArray,
      steps: stepInputs.filter(s => s.title.trim() !== ''),
      coverImage: formData.coverImage,
      fileUrl: formData.fileUrl,
      fileSize: formData.fileSize || '1.2 MB',
      uploadDate: new Date().toISOString().slice(0, 10)
    };

    if (onAddDocument) {
      onAddDocument(newDoc);
    } else {
      setLocalDocs(prev => [newDoc, ...prev]);
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteDoc = (id: string, title: string) => {
    if (window.confirm(`Hapus dokumen "${title}"?`)) {
      if (onDeleteDocument) {
        onDeleteDocument(id);
      } else {
        setLocalDocs(prev => prev.filter(d => d.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            <span>Pusat Dokumen, SOP & Manual Book PDF</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arsip digital Standar Operasional Prosedur, buku petunjuk teknis pabrikan, dan cetak dokumen PDF resmi RS Mardi Rahayu
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah / Upload Dokumen & SOP</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul SOP, nomor dokumen, atau kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
          {['SEMUA', 'SOP', 'Manual Book', 'Sertifikat', 'Kebijakan'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    doc.category === 'SOP'
                      ? 'bg-sky-100 text-sky-800'
                      : doc.category === 'Manual Book'
                      ? 'bg-indigo-100 text-indigo-800'
                      : doc.category === 'Sertifikat'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    {doc.docNo}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteDoc(doc.id, doc.title)}
                  className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start space-x-3">
                {doc.coverImage ? (
                  <img
                    src={doc.coverImage}
                    alt={doc.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl flex-shrink-0">
                    <FileText className="w-7 h-7" />
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-tight">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.purpose}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Diunggah: {doc.uploadDate}</span>
                <span>Ukuran: {doc.fileSize || '2 MB'}</span>
                <span className="font-semibold text-slate-600">{doc.revision}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setSelectedDocForView(doc)}
                className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200"
              >
                <Eye className="w-4 h-4" />
                <span>Baca & Lihat SOP</span>
              </button>

              <button
                onClick={() => exportSOPToPDF(doc)}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-md shadow-sky-600/20"
                title="Cetak/Download PDF SOP Resmi"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak PDF</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Tidak ada dokumen/SOP ditemukan untuk kriteria pencarian ini.
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW FULL SOP DETAIL & PRINT */}
      {selectedDocForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {selectedDocForView.category} - {selectedDocForView.revision}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-0.5">
                    {selectedDocForView.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedDocForView(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Metadata Table */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 font-semibold block">Nomor Dokumen:</span>
                <span className="font-mono font-bold text-slate-800">{selectedDocForView.docNo}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Tanggal Terbit:</span>
                <span className="font-semibold text-slate-800">{selectedDocForView.effectiveDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Disusun Oleh:</span>
                <span className="font-semibold text-slate-800">{selectedDocForView.author}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Disetujui Oleh:</span>
                <span className="font-semibold text-slate-800">{selectedDocForView.approver}</span>
              </div>
            </div>

            {/* Purpose & Scope */}
            <div className="space-y-3 text-xs">
              <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                <h4 className="font-bold text-sky-900 mb-1 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>1. Tujuan & Pengertian:</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">{selectedDocForView.purpose}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-1">2. Ruang Lingkup:</h4>
                <p className="text-slate-600">{selectedDocForView.scope}</p>
              </div>

              {selectedDocForView.prerequisites && selectedDocForView.prerequisites.length > 0 && (
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>3. Prasyarat Peralatan & APD:</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {selectedDocForView.prerequisites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Diagram / Photo */}
            {selectedDocForView.coverImage && (
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center space-x-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>Diagram / Foto Referensi Alat:</span>
                </h4>
                <img
                  src={selectedDocForView.coverImage}
                  alt={selectedDocForView.title}
                  className="w-full max-h-64 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
              </div>
            )}

            {/* Step-by-Step Instructions */}
            {selectedDocForView.steps && selectedDocForView.steps.length > 0 && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 text-sm">4. Prosedur Kerja Langkah-demi-Langkah:</h4>
                <div className="space-y-3">
                  {selectedDocForView.steps.map((step) => (
                    <div key={step.stepNo} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                          {step.stepNo}
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs">{step.title}</h5>
                      </div>
                      <p className="text-slate-600 pl-8 leading-relaxed">{step.description}</p>
                      {step.warning && (
                        <div className="ml-8 text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>Penting: {step.warning}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">RS Mardi Rahayu Kudus - IRIN</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocForView(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => exportSOPToPDF(selectedDocForView)}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20 flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak PDF Resmi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / UPLOAD NEW SOP & DOCUMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Tambah / Buat Dokumen SOP Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSOP} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Dokumen SOP:</label>
                  <input
                    type="text"
                    value={formData.docNo || ''}
                    onChange={(e) => setFormData({ ...formData, docNo: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Dokumen:</label>
                  <select
                    value={formData.category || 'SOP'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-bold"
                  >
                    <option value="SOP">SOP (Standar Operasional Prosedur)</option>
                    <option value="Manual Book">Manual Book Pabrikan</option>
                    <option value="Sertifikat">Sertifikat Kalibrasi</option>
                    <option value="Kebijakan">Kebijakan / Pedoman KARS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen / Nama SOP:</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="mis. SOP Pengoperasian Patient Monitor Mindray uMEC12"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Revisi:</label>
                  <input
                    type="text"
                    value={formData.revision || 'Rev. 01'}
                    onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Terbit:</label>
                  <input
                    type="date"
                    value={formData.effectiveDate || ''}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Alat Medis:</label>
                  <select
                    value={formData.equipmentCategory || 'Ventilator'}
                    onChange={(e) => setFormData({ ...formData, equipmentCategory: e.target.value })}
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
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tujuan & Pengertian SOP:</label>
                <textarea
                  value={formData.purpose || ''}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  rows={2}
                  placeholder="Jelaskan tujuan utama diterbitkannya SOP ini..."
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prasyarat Alat & APD (pisahkan koma):</label>
                <input
                  type="text"
                  value={prereqInput}
                  onChange={(e) => setPrereqInput(e.target.value)}
                  placeholder="mis. Mesin terkalibrasi, APD Masker, Grounding aman"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800"
                />
              </div>

              {/* Upload Foto Diagram & Upload File PDF */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <span>Upload Foto / Diagram SOP (PNG/JPG):</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                  {formData.coverImage && (
                    <img src={formData.coverImage} alt="Preview" className="w-16 h-16 mt-2 object-cover rounded-lg border" />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>Upload File PDF Manual / Dokumen:</span>
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleAttachmentFileChange}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                  {formData.fileUrl && (
                    <span className="text-[10px] font-bold text-emerald-600 mt-2 block">
                      ✓ File PDF terlampir ({formData.fileSize})
                    </span>
                  )}
                </div>
              </div>

              {/* Steps builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Langkah Prosedur Kerja:</label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="text-[11px] font-bold text-sky-600 hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Langkah</span>
                  </button>
                </div>

                {stepInputs.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-800 text-[11px]">Langkah {step.stepNo}:</span>
                      {stepInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Judul langkah (mis. Persiapan Kabel Power)"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...stepInputs];
                        updated[idx].title = e.target.value;
                        setStepInputs(updated);
                      }}
                      className="w-full rounded border border-slate-200 p-1.5 text-xs bg-white"
                    />
                    <textarea
                      placeholder="Deskripsi langkah kerja..."
                      value={step.description}
                      onChange={(e) => {
                        const updated = [...stepInputs];
                        updated[idx].description = e.target.value;
                        setStepInputs(updated);
                      }}
                      rows={2}
                      className="w-full rounded border border-slate-200 p-1.5 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md shadow-sky-600/20"
                >
                  Simpan & Buat SOP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
