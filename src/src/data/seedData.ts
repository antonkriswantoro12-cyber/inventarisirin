import {
  Equipment,
  CalibrationRecord,
  PMRecord,
  CorrectiveMaintenanceRecord,
  Sparepart,
  Vendor,
  Technician,
  Room,
  EquipmentLoan,
  AuditLog,
  UserRoleDefinition,
  AppUser,
  SystemSettings
} from '../types/inventory';

export const initialRooms: Room[] = [
  { id: 'rm-1', code: 'ICU-01', name: 'ICU Utama (Intensive Care Unit)', headName: 'dr. Hendra Wijaya, Sp.An', location: 'Gedung Maria Lt. 2', capacity: 10, equipmentCount: 24, conditionStatus: 'Sangat Baik' },
  { id: 'rm-2', code: 'HCU-01', name: 'HCU (High Dependency Unit)', headName: 'Ns. Ratna Sari, S.Kep', location: 'Gedung Maria Lt. 2', capacity: 8, equipmentCount: 16, conditionStatus: 'Baik' },
  { id: 'rm-3', code: 'NICU-01', name: 'NICU (Neonatal ICU)', headName: 'dr. Susanti, Sp.A', location: 'Gedung Joseph Lt. 3', capacity: 6, equipmentCount: 14, conditionStatus: 'Sangat Baik' },
  { id: 'rm-4', code: 'PICU-01', name: 'PICU (Pediatric ICU)', headName: 'dr. Bambang P, Sp.A', location: 'Gedung Joseph Lt. 3', capacity: 6, equipmentCount: 12, conditionStatus: 'Baik' },
  { id: 'rm-5', code: 'ISOL-01', name: 'Ruang Isolasi Tekanan Negatif IRIN', headName: 'Ns. Antonius Yudi, S.Kep', location: 'Gedung Maria Lt. 2 Wing B', capacity: 4, equipmentCount: 10, conditionStatus: 'Sangat Baik' },
  { id: 'rm-6', code: 'BENG-01', name: 'Bengkel Elektromedis IRIN', headName: 'Anton Kriswantoro, S.ST', location: 'Basement Gedung Utama', capacity: 20, equipmentCount: 8, conditionStatus: 'Baik' },
];

export const initialVendors: Vendor[] = [
  { id: 'v-1', name: 'PT Draeger Medical Indonesia', category: ['Pembelian', 'Servis', 'Kalibrasi'], picName: 'Budi Kurniawan', phone: '021-55443322', email: 'service@draeger-id.com', address: 'Jl. Jend. Sudirman No. 45, Jakarta', contractNo: 'KNT/RSMR/2025/089', contractExpiry: '2027-12-31', rating: 4.8 },
  { id: 'v-2', name: 'PT Mindray Indonesia Medika', category: ['Pembelian', 'Servis'], picName: 'Siska Amelia', phone: '021-88991122', email: 'sales@mindray.co.id', address: 'Kawasan Industri Pulogadung, Jakarta', contractNo: 'KNT/RSMR/2024/112', contractExpiry: '2026-10-15', rating: 4.6 },
  { id: 'v-3', name: 'PT BPFK / LPFK Semarang (Kalibrasi Resmi)', category: ['Kalibrasi'], picName: 'Drs. Yuniarto, M.T', phone: '024-7601234', email: 'kalibrasi@lpfk-smg.go.id', address: 'Jl. Srondol Raya No. 12, Semarang', contractNo: 'MOU/KAL/2026/004', contractExpiry: '2027-06-30', rating: 5.0 },
  { id: 'v-4', name: 'PT Terumo Indonesia', category: ['Pembelian', 'Servis'], picName: 'Rian Hidayat', phone: '021-77889900', email: 'support@terumo.co.id', address: 'Wisma 46 Kota BNI, Jakarta', contractNo: 'KNT/RSMR/2025/043', contractExpiry: '2026-11-20', rating: 4.7 },
  { id: 'v-5', name: 'PT Medika Electro Nusantara (Vendor Kalibrasi Swasta)', category: ['Kalibrasi', 'Servis'], picName: 'Agus Setiawan', phone: '024-8451122', email: 'info@medika-electro.com', address: 'Jl. Pemuda No. 88, Semarang', contractNo: 'KNT/RSMR/2026/012', contractExpiry: '2027-01-15', rating: 4.5 },
];

export const initialTechnicians: Technician[] = [
  { id: 'tech-1', name: 'Anton Kriswantoro, S.ST', employeeNo: 'EM-1001', phone: '0812-3456-7890', email: 'anton.kriswantoro@rsmardirahayu.com', certifications: ['Sertifikasi BPFK Ventilator', 'Sertifikasi Patient Monitor Mindray', 'ATEM Jateng Level III'], specializations: ['Ventilator ICU', 'Defibrillator', 'Kalibrasi Intern'], schedule: 'Senin - Sabtu (Shift Pagi)', activeWorkload: 2, completedTasksCount: 142, performanceScore: 98, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { id: 'tech-2', name: 'Budi Santoso, Amd.TEM', employeeNo: 'EM-1004', phone: '0857-1122-3344', email: 'budi.santoso@rsmardirahayu.com', certifications: ['Sertifikasi Terumo Syringe Pump', 'Maintenance ECG'], specializations: ['Infusion & Syringe Pump', 'Suction Pump', 'Suhu & Kelembaban'], schedule: 'Senin - Jumat (Shift Siang)', activeWorkload: 3, completedTasksCount: 98, performanceScore: 94, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { id: 'tech-3', name: 'Rina Electromedical, Amd.ST', employeeNo: 'EM-1008', phone: '0813-9988-7766', email: 'rina.tem@rsmardirahayu.com', certifications: ['Sertifikasi Kalibrasi BPFK', 'Sertifikasi Safety Electrical Standards IEC 60601'], specializations: ['Safety Analyzer', 'Sensor Oksigen', 'Uji Fungsi Periodik'], schedule: 'Senin - Sabtu (Shift Pagi)', activeWorkload: 1, completedTasksCount: 86, performanceScore: 96, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
];

export const initialSpareparts: Sparepart[] = [
  { id: 'sp-1', partNo: 'SP-DRG-O2S', name: 'Oxygen Sensor Capsule (Draeger Evita V500)', category: 'Sensor', stock: 8, minStock: 3, unit: 'Pcs', storageLocation: 'Lemari A-Rack 01', unitPrice: 3500000, supplierId: 'v-1', supplierName: 'PT Draeger Medical Indonesia', qrCode: 'SP-DRG-O2S', barcode: '8991002003001', lastRestockDate: '2026-06-10' },
  { id: 'sp-2', partNo: 'SP-MND-CBL', name: 'Patient Monitor 5-Lead ECG Trunk Cable', category: 'Kabel & Aksesoris', stock: 2, minStock: 5, unit: 'Pcs', storageLocation: 'Lemari B-Rack 03', unitPrice: 1200000, supplierId: 'v-2', supplierName: 'PT Mindray Indonesia Medika', qrCode: 'SP-MND-CBL', barcode: '8991002003002', lastRestockDate: '2026-05-20' },
  { id: 'sp-3', partNo: 'SP-TRM-BAT', name: 'Rechargeable Li-ion Battery 12V 2600mAh (Terumo TE-331)', category: 'Baterai', stock: 12, minStock: 4, unit: 'Pcs', storageLocation: 'Lemari C-Rack 01', unitPrice: 850000, supplierId: 'v-4', supplierName: 'PT Terumo Indonesia', qrCode: 'SP-TRM-BAT', barcode: '8991002003003', lastRestockDate: '2026-07-01' },
  { id: 'sp-4', partNo: 'SP-FLT-HEPA', name: 'HEPA Antibacterial Filter Ventilator', category: 'Filter', stock: 1, minStock: 6, unit: 'Pcs', storageLocation: 'Lemari A-Rack 04', unitPrice: 450000, supplierId: 'v-1', supplierName: 'PT Draeger Medical Indonesia', qrCode: 'SP-FLT-HEPA', barcode: '8991002003004', lastRestockDate: '2026-04-15' },
  { id: 'sp-5', partNo: 'SP-ZOL-PAD', name: 'Defibrillator Adult Pacing & Multifunction Pads', category: 'Aksesoris Consumable', stock: 15, minStock: 5, unit: 'Set', storageLocation: 'Lemari B-Rack 01', unitPrice: 650000, supplierId: 'v-5', supplierName: 'PT Medika Electro Nusantara', qrCode: 'SP-ZOL-PAD', barcode: '8991002003005', lastRestockDate: '2026-07-18' },
];

export const initialEquipment: Equipment[] = [
  {
    id: 'eq-1',
    inventoryNo: 'IRIN-VNT-2024-001',
    bmnNo: 'BMN-RSMR-99801',
    assetNo: 'AST-ICU-001',
    name: 'Ventilator Mechanical ICU (Evita V500)',
    brand: 'Draeger',
    modelNo: 'Evita V500',
    serialNo: 'DRG-EV5-883921',
    category: 'Ventilator',
    subcategory: 'Ventilator Adult & Pediatric',
    roomId: 'rm-1',
    roomName: 'ICU Utama (Intensive Care Unit)',
    status: 'Baik',
    purchaseYear: 2024,
    purchasePrice: 450000000,
    economicLifespan: 7,
    salvageValue: 45000000,
    warrantyExpiry: '2026-12-31',
    purchaseVendorId: 'v-1',
    purchaseVendorName: 'PT Draeger Medical Indonesia',
    serviceVendorId: 'v-1',
    serviceVendorName: 'PT Draeger Medical Indonesia',
    calibrationVendorId: 'v-3',
    calibrationVendorName: 'PT BPFK / LPFK Semarang (Kalibrasi Resmi)',
    lastCalibrationDate: '2026-01-15',
    nextCalibrationDate: '2027-01-15',
    calibrationStatus: 'Lulus',
    lastPMDate: '2026-07-10',
    nextPMDate: '2026-10-10',
    pmFrequencyMonths: 3,
    photos: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
    ],
    manualBookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sopUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    notes: 'Kondisi amat baik, sensor oksigen baru diganti Juli 2026',
    locationHistory: [
      { id: 'loc-1', fromRoom: 'Bengkel Elektromedis IRIN', toRoom: 'ICU Utama (Intensive Care Unit)', movedBy: 'Anton Kriswantoro', date: '2024-02-01', notes: 'Instalasi Awal' }
    ],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2026-07-10T11:30:00Z'
  },
  {
    id: 'eq-2',
    inventoryNo: 'IRIN-PMN-2025-004',
    bmnNo: 'BMN-RSMR-99804',
    assetNo: 'AST-ICU-004',
    name: 'Patient Monitor 6-Para BeneVision N15',
    brand: 'Mindray',
    modelNo: 'BeneVision N15',
    serialNo: 'MND-BVN-442190',
    category: 'Patient Monitor',
    subcategory: 'Multi-parameter Monitor Bedside',
    roomId: 'rm-1',
    roomName: 'ICU Utama (Intensive Care Unit)',
    status: 'Baik',
    purchaseYear: 2025,
    purchasePrice: 135000000,
    economicLifespan: 5,
    salvageValue: 13500000,
    warrantyExpiry: '2027-03-30',
    purchaseVendorId: 'v-2',
    purchaseVendorName: 'PT Mindray Indonesia Medika',
    serviceVendorId: 'v-2',
    serviceVendorName: 'PT Mindray Indonesia Medika',
    calibrationVendorId: 'v-3',
    calibrationVendorName: 'PT BPFK / LPFK Semarang (Kalibrasi Resmi)',
    lastCalibrationDate: '2025-09-20',
    nextCalibrationDate: '2026-09-20',
    calibrationStatus: 'Mendekati',
    lastPMDate: '2026-06-15',
    nextPMDate: '2026-09-15',
    pmFrequencyMonths: 3,
    photos: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
    ],
    manualBookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sopUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Modul SpO2 dan NIBP berfungsi normal. Jatuh tempo kalibrasi 45 hari lagi.',
    locationHistory: [
      { id: 'loc-2', fromRoom: 'HCU (High Dependency Unit)', toRoom: 'ICU Utama (Intensive Care Unit)', movedBy: 'Budi Santoso', date: '2026-03-10', notes: 'Kebutuhan Pasien Kritis' }
    ],
    createdAt: '2025-03-30T09:15:00Z',
    updatedAt: '2026-06-15T14:20:00Z'
  },
  {
    id: 'eq-3',
    inventoryNo: 'IRIN-SYP-2023-012',
    bmnNo: 'BMN-RSMR-99712',
    assetNo: 'AST-HCU-012',
    name: 'Syringe Pump Terumo TE-331',
    brand: 'Terumo',
    modelNo: 'TE-331',
    serialNo: 'TRM-TE331-90112',
    category: 'Syringe Pump',
    subcategory: 'Infusion & Syringe Control',
    roomId: 'rm-2',
    roomName: 'HCU (High Dependency Unit)',
    status: 'Dalam Perbaikan',
    purchaseYear: 2023,
    purchasePrice: 28000000,
    economicLifespan: 5,
    salvageValue: 2800000,
    warrantyExpiry: '2025-05-10',
    purchaseVendorId: 'v-4',
    purchaseVendorName: 'PT Terumo Indonesia',
    serviceVendorId: 'v-4',
    serviceVendorName: 'PT Terumo Indonesia',
    calibrationVendorId: 'v-5',
    calibrationVendorName: 'PT Medika Electro Nusantara (Vendor Kalibrasi Swasta)',
    lastCalibrationDate: '2025-08-01',
    nextCalibrationDate: '2026-08-10',
    calibrationStatus: 'Jatuh Tempo',
    lastPMDate: '2026-05-01',
    nextPMDate: '2026-08-01',
    pmFrequencyMonths: 3,
    photos: [
      'https://images.unsplash.com/photo-1583912267670-65759240432e?auto=format&fit=crop&w=600&q=80'
    ],
    manualBookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Error Occlusion Sensor, sedang dipesan kabel pengganti.',
    locationHistory: [
      { id: 'loc-3', fromRoom: 'HCU (High Dependency Unit)', toRoom: 'Bengkel Elektromedis IRIN', movedBy: 'Anton Kriswantoro', date: '2026-08-02', notes: 'Perbaikan sensor oklusi' }
    ],
    createdAt: '2023-05-10T10:00:00Z',
    updatedAt: '2026-08-02T16:45:00Z'
  },
  {
    id: 'eq-4',
    inventoryNo: 'IRIN-DEF-2024-002',
    bmnNo: 'BMN-RSMR-99882',
    assetNo: 'AST-ICU-002',
    name: 'Defibrillator Zoll R Series Biphasic',
    brand: 'Zoll',
    modelNo: 'R Series ALS',
    serialNo: 'ZOL-RSER-55102',
    category: 'Defibrillator',
    subcategory: 'Resusitasi Jantung',
    roomId: 'rm-1',
    roomName: 'ICU Utama (Intensive Care Unit)',
    status: 'Baik',
    purchaseYear: 2024,
    purchasePrice: 195000000,
    economicLifespan: 7,
    salvageValue: 19500000,
    warrantyExpiry: '2027-01-20',
    purchaseVendorId: 'v-5',
    purchaseVendorName: 'PT Medika Electro Nusantara',
    serviceVendorId: 'v-5',
    serviceVendorName: 'PT Medika Electro Nusantara',
    calibrationVendorId: 'v-3',
    calibrationVendorName: 'PT BPFK / LPFK Semarang (Kalibrasi Resmi)',
    lastCalibrationDate: '2026-02-10',
    nextCalibrationDate: '2027-02-10',
    calibrationStatus: 'Lulus',
    lastPMDate: '2026-07-05',
    nextPMDate: '2026-10-05',
    pmFrequencyMonths: 3,
    photos: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
    ],
    manualBookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sopUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Joule test 200J & 360J passed. Battery self-test OK.',
    locationHistory: [],
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2026-07-05T09:00:00Z'
  },
  {
    id: 'eq-5',
    inventoryNo: 'IRIN-INC-2022-001',
    bmnNo: 'BMN-RSMR-99501',
    assetNo: 'AST-NICU-001',
    name: 'Incubator Infant Transport Isolette C2000',
    brand: 'Draeger',
    modelNo: 'Isolette C2000',
    serialNo: 'DRG-ISO-330192',
    category: 'Incubator',
    subcategory: 'Perawatan Bayi Prematur',
    roomId: 'rm-3',
    roomName: 'NICU (Neonatal ICU)',
    status: 'Baik',
    purchaseYear: 2022,
    purchasePrice: 220000000,
    economicLifespan: 7,
    salvageValue: 22000000,
    warrantyExpiry: '2024-08-15',
    purchaseVendorId: 'v-1',
    purchaseVendorName: 'PT Draeger Medical Indonesia',
    serviceVendorId: 'v-1',
    serviceVendorName: 'PT Draeger Medical Indonesia',
    calibrationVendorId: 'v-3',
    calibrationVendorName: 'PT BPFK / LPFK Semarang (Kalibrasi Resmi)',
    lastCalibrationDate: '2025-11-12',
    nextCalibrationDate: '2026-11-12',
    calibrationStatus: 'Lulus',
    lastPMDate: '2026-05-10',
    nextPMDate: '2026-08-10',
    pmFrequencyMonths: 3,
    photos: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    ],
    notes: 'Suhu dan kelembaban stabil.',
    locationHistory: [],
    createdAt: '2022-08-15T09:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z'
  }
];

export const initialCalibrations: CalibrationRecord[] = [
  {
    id: 'cal-1',
    equipmentId: 'eq-1',
    equipmentName: 'Ventilator Mechanical ICU (Evita V500)',
    inventoryNo: 'IRIN-VNT-2024-001',
    scheduledDate: '2027-01-15',
    dueDate: '2027-01-15',
    daysRemaining: 162,
    statusBadgeColor: 'green',
    statusBadgeLabel: 'Lulus / Aktif (162 hari)',
    vendorId: 'v-3',
    vendorName: 'PT BPFK / LPFK Semarang (Kalibrasi Resmi)',
    cost: 1850000,
    result: 'Lulus',
    certificateNo: 'SERT-BPFK-2026-0192',
    certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Hasil akurasi volume tidal dan tekanan inspirasi dalam batas toleransi ISO 80601-2-12',
    technicianName: 'Anton Kriswantoro, S.ST'
  },
  {
    id: 'cal-2',
    equipmentId: 'eq-2',
    equipmentName: 'Patient Monitor 6-Para BeneVision N15',
    inventoryNo: 'IRIN-PMN-2025-004',
    scheduledDate: '2026-09-20',
    dueDate: '2026-09-20',
    daysRemaining: 45,
    statusBadgeColor: 'yellow',
    statusBadgeLabel: 'Akan Datang (45 hari)',
    vendorId: 'v-3',
    vendorName: 'PT BPFK / LPFK Semarang (Kalibrasi Resmi)',
    cost: 1200000,
    result: 'Pending',
    notes: 'Jadwal kalibrasi ulang BPFK telah dipesan',
    technicianName: 'Rina Electromedical, Amd.ST'
  },
  {
    id: 'cal-3',
    equipmentId: 'eq-3',
    equipmentName: 'Syringe Pump Terumo TE-331',
    inventoryNo: 'IRIN-SYP-2023-012',
    scheduledDate: '2026-08-10',
    dueDate: '2026-08-10',
    daysRemaining: 4,
    statusBadgeColor: 'red',
    statusBadgeLabel: 'Sangat Mendesak (4 hari)',
    vendorId: 'v-5',
    vendorName: 'PT Medika Electro Nusantara',
    cost: 750000,
    result: 'Pending',
    notes: 'Perlu kalibrasi secepatnya setelah perbaikan sensor oklusi selesai',
    technicianName: 'Budi Santoso, Amd.TEM'
  }
];

export const initialPMs: PMRecord[] = [
  {
    id: 'pm-1',
    equipmentId: 'eq-1',
    equipmentName: 'Ventilator Mechanical ICU (Evita V500)',
    inventoryNo: 'IRIN-VNT-2024-001',
    roomName: 'ICU Utama (Intensive Care Unit)',
    scheduledDate: '2026-07-10',
    actualDate: '2026-07-10',
    technicianId: 'tech-1',
    technicianName: 'Anton Kriswantoro, S.ST',
    durationHours: 2.5,
    cost: 3500000,
    status: 'Selesai',
    checklist: [
      { id: 'chk-1', task: 'Pemeriksaan fisik casing & kabel power', isPassed: true },
      { id: 'chk-2', task: 'Uji fungsi alarm high pressure & low O2', isPassed: true },
      { id: 'chk-3', task: 'Penggantian sensor oksigen kapsul', isPassed: true },
      { id: 'chk-4', task: 'Pembersihan HEPA filter & water trap', isPassed: true },
      { id: 'chk-5', task: 'Uji keleluasaan valve inspirasi/ekspirasi', isPassed: true }
    ],
    beforePhoto: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    sparepartsUsed: [
      { sparepartId: 'sp-1', name: 'Oxygen Sensor Capsule (Draeger Evita V500)', qty: 1, cost: 3500000 }
    ],
    technicianSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    headSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    notes: 'Alat berfungsi optimal pasca maintenance rutin 3 bulanan.'
  }
];

export const initialCorrective: CorrectiveMaintenanceRecord[] = [
  {
    id: 'cm-1',
    equipmentId: 'eq-3',
    equipmentName: 'Syringe Pump Terumo TE-331',
    inventoryNo: 'IRIN-SYP-2023-012',
    roomName: 'HCU (High Dependency Unit)',
    reportDate: '2026-08-02',
    reportedBy: 'Ns. Ratna Sari, S.Kep',
    priority: 'Tinggi',
    failureCause: 'Sensor oklusi tidak mendeteksi desakan spuit secara presisi, alarm berbunyi terus-menerus.',
    solution: 'Pembersihan optical encoder sensor dan pemesanan kabel pengganti.',
    technicianId: 'tech-1',
    technicianName: 'Anton Kriswantoro, S.ST',
    estimatedCompletionDate: '2026-08-08',
    sparepartsCost: 850000,
    laborCost: 200000,
    totalCost: 1050000,
    status: 'Menunggu Part',
    photos: ['https://images.unsplash.com/photo-1583912267670-65759240432e?auto=format&fit=crop&w=600&q=80'],
    documents: [],
    downtimeHours: 96
  }
];

export const initialLoans: EquipmentLoan[] = [
  {
    id: 'loan-1',
    equipmentId: 'eq-4',
    equipmentName: 'Defibrillator Zoll R Series Biphasic',
    inventoryNo: 'IRIN-DEF-2024-002',
    borrowerName: 'dr. Eko Prasetyo',
    borrowerUnit: 'Instalasi Gawat Darurat (IGD)',
    borrowerContact: '0812-9988-1122',
    loanDate: '2026-08-05',
    expectedReturnDate: '2026-08-07',
    status: 'Dipinjam',
    conditionOnLoan: 'Sangat Baik (Baterai Full 100%, Paddle Komplit)',
    notes: 'Peminjaman darurat untuk tindakan cardioversion pasien IGD'
  }
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-06 09:12:00', username: 'Anton Kriswantoro', role: 'Super Administrator', action: 'LOGIN', module: 'Autentikasi', details: 'Berhasil login ke sistem dari IP 192.168.1.10', ipAddress: '192.168.1.10' },
  { id: 'log-2', timestamp: '2026-08-06 08:30:15', username: 'Anton Kriswantoro', role: 'Super Administrator', action: 'UPDATE_MAINTENANCE', module: 'Corrective Maintenance', details: 'Memperbarui status perbaikan Syringe Pump IRIN-SYP-2023-012 ke Menunggu Part', ipAddress: '192.168.1.10' },
  { id: 'log-3', timestamp: '2026-08-05 14:00:00', username: 'Budi Santoso', role: 'Teknisi Elektromedis', action: 'PEMINJAMAN_ALAT', module: 'Peminjaman', details: 'Menyetujui peminjaman Defibrillator IRIN-DEF-2024-002 oleh dr. Eko Prasetyo (IGD)', ipAddress: '192.168.1.15' },
  { id: 'log-4', timestamp: '2026-08-04 11:20:45', username: 'Anton Kriswantoro', role: 'Super Administrator', action: 'CETAK_LABEL', module: 'QR Code & Barcode', details: 'Mencetak 5 label inventaris batch ukuran 50x30mm', ipAddress: '192.168.1.10' },
];

export const initialRoles: UserRoleDefinition[] = [
  { id: 'role-1', name: 'Super Administrator', badge: 'Akses Penuh', description: 'Akses penuh ke semua modul, pengguna, pengaturan sistem, REST API, dan backup data.', permissions: ['*'] },
  { id: 'role-2', name: 'Administrator', badge: 'Akses Admin', description: 'Pengelolaan inventaris, maintenance, kalibrasi, sparepart, dan laporan.', permissions: ['inventaris.*', 'kalibrasi.*', 'pm.*', 'cm.*', 'sparepart.*', 'laporan.*'] },
  { id: 'role-3', name: 'Kepala Instalasi IRIN', badge: 'Akses Verifikasi', description: 'Melihat dashboard KPI, menyetujui jadwal maintenance, peminjaman, dan mengekspor laporan.', permissions: ['dashboard.view', 'inventaris.view', 'laporan.export', 'peminjaman.approve'] },
  { id: 'role-4', name: 'Teknisi Elektromedis', badge: 'Akses Operasional', description: 'Input & update hasil PM, corrective maintenance, kalibrasi, serta penggunaan sparepart.', permissions: ['inventaris.view', 'pm.edit', 'cm.edit', 'kalibrasi.edit', 'sparepart.use'] },
  { id: 'role-5', name: 'Kepala Ruangan', badge: 'Akses Ruangan', description: 'Melaporkan kerusakan alat, mengajukan peminjaman, dan melihat lokasi alat di ruangannya.', permissions: ['inventaris.view', 'cm.create', 'peminjaman.create'] },
  { id: 'role-6', name: 'Petugas', badge: 'Akses Petugas', description: 'Memindai QR code alat, melihat manual book/SOP, dan mengecek status alat.', permissions: ['inventaris.view', 'qrcode.scan'] },
  { id: 'role-7', name: 'Viewer', badge: 'Read-Only', description: 'Hanya melihat data tanpa hak mengubah.', permissions: ['*.view'] },
];

export const currentUser: AppUser = {
  id: 'usr-1',
  username: 'anton.kriswantoro',
  name: 'Anton Kriswantoro, S.ST',
  email: 'AntonKriswantoro12@gmail.com',
  role: 'Super Administrator',
  department: 'Instalasi IRIN RS Mardi Rahayu',
  status: 'Aktif',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
};

export const initialSettings: SystemSettings = {
  appName: 'Aplikasi Inventaris IRIN RS Mardi Rahayu',
  hospitalName: 'RS Mardi Rahayu Kudus',
  unitName: 'Instalasi IRIN (Intensive Care Unit)',
  address: 'Jl. AKBP Agil Kusumadya No. 110, Kudus, Jawa Tengah',
  phone: '(0291) 438234 / 438235',
  email: 'irin@rsmardirahayu.com',
  logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=120&q=80',
  themeColor: '#0284c7', // Sky-600 Medical Teal/Blue
  autoInventoryPattern: 'IRIN-{CAT}-{YYYY}-{SEQ}',
  calibrationWarningDays: [90, 60, 30, 14, 7, 3, 1],
  qrLabelSize: 'standard',
  enableEmailAlerts: true,
  enableWaGateway: true,
  waApiEndpoint: 'https://api.whatsapp-gateway.rsmardirahayu.com/send-message',
  waApiKey: 'WA-KEY-RSMR-IRIN-99887766'
};
