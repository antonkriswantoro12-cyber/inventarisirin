export type EquipmentStatus = 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Dalam Perbaikan' | 'Dalam Kalibrasi' | 'Dipinjam' | 'Afkir';

export type CategoryType = 'Ventilator' | 'Patient Monitor' | 'Syringe Pump' | 'Infusion Pump' | 'Defibrillator' | 'ECG Machine' | 'Suction Pump' | 'Incubator' | 'Respirator' | 'Lain-lain';

export interface LocationHistory {
  id: string;
  fromRoom: string;
  toRoom: string;
  movedBy: string;
  date: string;
  notes?: string;
}

export interface Equipment {
  id: string;
  inventoryNo: string; // e.g. IRIN-VNT-2026-001
  bmnNo?: string;
  assetNo: string;
  name: string;
  brand: string;
  modelNo: string;
  serialNo: string;
  category: CategoryType;
  subcategory: string;
  roomId: string;
  roomName: string;
  status: EquipmentStatus;
  purchaseYear: number;
  purchasePrice: number;
  economicLifespan: number; // in years
  salvageValue?: number;
  warrantyExpiry: string; // YYYY-MM-DD
  purchaseVendorId: string;
  purchaseVendorName: string;
  serviceVendorId: string;
  serviceVendorName: string;
  calibrationVendorId: string;
  calibrationVendorName: string;
  lastCalibrationDate?: string;
  nextCalibrationDate: string; // YYYY-MM-DD
  calibrationStatus: 'Lulus' | 'Tidak Lulus' | 'Mendekati' | 'Jatuh Tempo' | 'Belum Kalibrasi';
  lastPMDate?: string;
  nextPMDate: string; // YYYY-MM-DD
  pmFrequencyMonths: number; // e.g., 3, 6, 12
  photos: string[];
  manualBookUrl?: string;
  sopUrl?: string;
  videoUrl?: string;
  notes?: string;
  locationHistory: LocationHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface CalibrationRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  inventoryNo: string;
  scheduledDate: string;
  actualDate?: string;
  dueDate: string;
  daysRemaining: number;
  statusBadgeColor: 'green' | 'yellow' | 'orange' | 'red' | 'black';
  statusBadgeLabel: string;
  vendorId: string;
  vendorName: string;
  cost: number;
  result: 'Lulus' | 'Tidak Lulus' | 'Pending';
  certificateNo?: string;
  certificateUrl?: string;
  notes?: string;
  technicianName: string;
}

export interface PMChecklistItem {
  id: string;
  task: string;
  isPassed: boolean;
  notes?: string;
}

export interface PMRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  inventoryNo: string;
  roomName: string;
  scheduledDate: string;
  actualDate?: string;
  technicianId: string;
  technicianName: string;
  durationHours: number;
  cost: number;
  status: 'Jadwal' | 'Proses' | 'Selesai' | 'Tertunda';
  checklist: PMChecklistItem[];
  beforePhoto?: string;
  afterPhoto?: string;
  sparepartsUsed: { sparepartId: string; name: string; qty: number; cost: number }[];
  technicianSignature?: string;
  headSignature?: string;
  notes?: string;
}

export interface CorrectiveMaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  inventoryNo: string;
  roomName: string;
  reportDate: string;
  reportedBy: string;
  priority: 'Darurat' | 'Tinggi' | 'Sedang' | 'Rendah';
  failureCause: string;
  solution?: string;
  technicianId: string;
  technicianName: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  sparepartsCost: number;
  laborCost: number;
  totalCost: number;
  status: 'Dilaporkan' | 'Dalam Perbaikan' | 'Menunggu Part' | 'Selesai';
  photos: string[];
  documents: string[];
  downtimeHours?: number;
  technicianSignature?: string;
}

export interface Sparepart {
  id: string;
  partNo: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string; // e.g. Pcs, Roll, Set
  storageLocation: string; // e.g. Rak A-02
  unitPrice: number;
  supplierId: string;
  supplierName: string;
  qrCode: string;
  barcode: string;
  lastRestockDate: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: ('Pembelian' | 'Servis' | 'Kalibrasi')[];
  picName: string;
  phone: string;
  email: string;
  address: string;
  contractNo: string;
  contractExpiry: string;
  rating: number; // 1 to 5
  notes?: string;
}

export interface Technician {
  id: string;
  name: string;
  employeeNo: string;
  phone: string;
  email: string;
  roleTitle?: string; // Jabatan
  certifications: string[];
  specializations?: string[];
  schedule: string;
  activeWorkload: number; // count of assigned active tasks
  completedTasksCount: number;
  performanceScore: number; // percentage e.g. 96%
  avatar?: string;
  isActive?: boolean;
  workHistory?: { id: string; date: string; task: string; status: string; room?: string }[];
}

export interface Room {
  id: string;
  code: string;
  name: string;
  building?: string; // Gedung
  floor?: string; // Lantai
  headName: string; // Kepala Ruangan / Penanggung Jawab
  headPhone?: string;
  location: string;
  capacity: number;
  equipmentCount: number;
  conditionStatus: 'Sangat Baik' | 'Baik' | 'Perlu Pemeliharaan' | 'Steril / Siap';
  notes?: string; // Keterangan
}

export interface EquipmentLoan {
  id: string;
  equipmentId: string;
  equipmentName: string;
  inventoryNo: string;
  borrowerName: string;
  borrowerUnit: string;
  borrowerContact: string;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Dipinjam' | 'Dikembalikan' | 'Ditolak' | 'Terlambat';
  conditionOnLoan: string;
  conditionOnReturn?: string;
  borrowerSignature?: string;
  approverSignature?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  username?: string;
  role?: string;
  action: string; // e.g., 'CREATE', 'UPDATE', 'DELETE'
  module: string;
  details: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  isRead: boolean;
}

export interface SOPStep {
  stepNo: number;
  title: string;
  description: string;
  warning?: string;
}

export interface DocumentSOP {
  id: string;
  docNo: string;
  title: string;
  category: 'SOP' | 'Manual Book' | 'Sertifikat' | 'Kebijakan' | 'Petunjuk Teknis';
  equipmentCategory?: string;
  revision: string;
  effectiveDate: string;
  author: string;
  approver: string;
  purpose: string;
  scope: string;
  prerequisites?: string[];
  steps?: SOPStep[];
  fileUrl?: string;
  coverImage?: string;
  fileSize?: string;
  uploadDate: string;
}

export type UserRole = 'Super Admin' | 'Teknisi Elektromedis' | 'Kepala Ruangan' | 'Direksi / Manajemen';

export interface UserRoleDefinition {
  id: string;
  name: string;
  badge: string;
  description: string;
  permissions: string[];
  isCustom?: boolean;
}

export interface AppUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Aktif' | 'Nonaktif';
  nip?: string;
  phone?: string;
  avatar?: string;
  lastLogin?: string;
}

export interface SystemSettings {
  appName: string;
  hospitalName: string;
  unitName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  themeColor: string;
  autoInventoryPattern: string; // e.g. IRIN-{CAT}-{YYYY}-{SEQ}
  calibrationWarningDays: number[]; // [90, 60, 30, 14, 7, 3, 1]
  qrLabelSize: 'standard' | 'small' | 'large';
  enableEmailAlerts: boolean;
  enableWaGateway: boolean;
  waApiEndpoint: string;
  waApiKey: string;
}

export interface KPIStats {
  mttrHours: number; // Mean Time To Repair
  mtbfDays: number; // Mean Time Between Failures
  uptimePercentage: number;
  calibrationCompliancePct: number;
  totalEquipment: number;
  goodCount: number;
  minorDamageCount: number;
  heavyDamageCount: number;
  inRepairCount: number;
  inCalibrationCount: number;
  disposedCount: number;
  upcomingCalibration30Days: number;
  overdueCalibrationCount: number;
  pendingPMCount: number;
  activeWorkOrdersCount: number;
  lowStockSparepartsCount: number;
  activeLoansCount: number;
}
