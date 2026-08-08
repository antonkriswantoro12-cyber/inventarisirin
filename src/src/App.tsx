import React, { useState, useEffect } from 'react';
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
  DocumentSOP,
  AuditLog,
  NotificationItem,
  UserRole,
  AppUser,
  UserRoleDefinition
} from './types/inventory';
import { initialEquipment, initialVendors, initialTechnicians, initialRooms } from './data/seedData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { InventoryView } from './components/inventory/InventoryView';
import { CalibrationView } from './components/calibration/CalibrationView';
import { PreventiveMaintenanceView } from './components/maintenance/PreventiveMaintenanceView';
import { CorrectiveMaintenanceView } from './components/maintenance/CorrectiveMaintenanceView';
import { SparepartView } from './components/sparepart/SparepartView';
import { VendorView } from './components/vendor/VendorView';
import { TechnicianView } from './components/technician/TechnicianView';
import { RoomView } from './components/room/RoomView';
import { QRCodeView } from './components/qrcode/QRCodeView';
import { LoanView } from './components/loans/LoanView';
import { ReportsView } from './components/reports/ReportsView';
import { ImportView } from './components/import/ImportView';
import { DocumentsView, initialDocumentsSOP } from './components/documents/DocumentsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { RestApiExplorer } from './components/api/RestApiExplorer';
import { RoleManagementView } from './components/settings/RoleManagementView';
import { SettingsView } from './components/settings/SettingsView';
import { InfinityFreeExportView } from './components/export/InfinityFreeExportView';
import { QRCodeModal } from './components/common/QRCodeModal';
import { exportToExcel } from './lib/exportUtils';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // RBAC Users State
  const [users, setUsers] = useState<AppUser[]>([
    {
      id: 'usr-1',
      username: 'anton.k',
      name: 'Anton Kriswantoro, S.ST',
      email: 'anton.kriswantoro@mardirahayu.com',
      role: 'Super Admin',
      department: 'Instalasi IRIN / ATEM',
      status: 'Aktif',
      nip: '198504122010011002',
      phone: '0812-3456-7890',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-2',
      username: 'budi.atem',
      name: 'Budi Santoso, A.Md.Tem',
      email: 'budi@mardirahayu.com',
      role: 'Teknisi Elektromedis',
      department: 'ATEM / Pemeliharaan',
      status: 'Aktif',
      nip: '199008232015021003',
      phone: '0813-9012-3456',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-3',
      username: 'dewi.st',
      name: 'Dewi Rahmawati, ST',
      email: 'dewi@mardirahayu.com',
      role: 'Teknisi Elektromedis',
      department: 'ATEM / Pemeliharaan',
      status: 'Aktif',
      nip: '199211052018032001',
      phone: '0815-6789-0123',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-4',
      username: 'ratna.karu',
      name: 'Ns. Ratna Sari, S.Kep',
      email: 'ratna.icu@mardirahayu.com',
      role: 'Kepala Ruangan',
      department: 'Ruang ICU',
      status: 'Aktif',
      nip: '198803152012022004',
      phone: '0812-9988-7766',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-5',
      username: 'purnomo.dr',
      name: 'dr. H. Purnomo, Sp.B',
      email: 'direktur@mardirahayu.com',
      role: 'Direksi / Manajemen',
      department: 'Direksi Utama',
      status: 'Aktif',
      nip: '197501012000031001',
      phone: '0811-2233-4455',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80'
    }
  ]);

  const [activeUser, setActiveUser] = useState<AppUser>(users[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');
  const [currentUser, setCurrentUser] = useState('Anton Kriswantoro, S.ST');

  // Role Definitions
  const [roleDefinitions, setRoleDefinitions] = useState<UserRoleDefinition[]>([
    {
      id: 'role-1',
      name: 'Super Admin',
      badge: 'Akses Penuh',
      description: 'Akses penuh ke seluruh modul, audit log, kelola user & RBAC, backup database',
      permissions: [
        'inventory_view', 'inventory_add', 'inventory_edit', 'inventory_delete',
        'calibration_manage', 'pm_manage', 'corrective_manage', 'sparepart_manage',
        'vendor_manage', 'loan_manage', 'sign_verification', 'reports_export',
        'rbac_manage', 'backup_manage'
      ]
    },
    {
      id: 'role-2',
      name: 'Teknisi Elektromedis',
      badge: 'Akses Operasional',
      description: 'Input kalibrasi & PM, buat perbaikan, kelola sparepart, dan cetak QR label',
      permissions: [
        'inventory_view', 'inventory_edit', 'calibration_manage', 'pm_manage',
        'corrective_manage', 'sparepart_manage', 'loan_manage', 'reports_export'
      ]
    },
    {
      id: 'role-3',
      name: 'Kepala Ruangan',
      badge: 'Akses Verifikasi',
      description: 'Verifikasi tanda tangan digital, permohonan perbaikan, dan peminjaman alat',
      permissions: [
        'inventory_view', 'corrective_manage', 'loan_manage', 'sign_verification'
      ]
    },
    {
      id: 'role-4',
      name: 'Direksi / Manajemen',
      badge: 'Akses Read-Only',
      description: 'Lihat dashboard, laporan kinerja, analisis biaya, dan ekspor PDF/Excel',
      permissions: [
        'inventory_view', 'reports_export'
      ]
    }
  ]);

  // Core State
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  // Calibrations state
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([
    {
      id: 'cal-1',
      equipmentId: 'eq-1',
      equipmentName: 'Ventilator Mechanical ICU (Hamilton C3)',
      inventoryNo: 'IRIN-VNT-2024-001',
      scheduledDate: '2026-08-15',
      dueDate: '2026-08-15',
      daysRemaining: 9,
      statusBadgeColor: 'red',
      statusBadgeLabel: 'Mendesak (9 Hari)',
      vendorId: 'v-3',
      vendorName: 'LPFK Semarang',
      cost: 1500000,
      result: 'Lulus',
      certificateNo: 'SERT-BPFK-2025-089',
      certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      technicianName: 'Anton Kriswantoro, S.ST'
    },
    {
      id: 'cal-2',
      equipmentId: 'eq-2',
      equipmentName: 'Patient Monitor 6 Parameter',
      inventoryNo: 'IRIN-MON-2023-014',
      scheduledDate: '2026-09-01',
      dueDate: '2026-09-01',
      daysRemaining: 26,
      statusBadgeColor: 'yellow',
      statusBadgeLabel: 'Akan Datang (26 Hari)',
      vendorId: 'v-3',
      vendorName: 'LPFK Semarang',
      cost: 750000,
      result: 'Lulus',
      certificateNo: 'SERT-BPFK-2025-104',
      certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      technicianName: 'Budi Santoso, A.Md.Tem'
    }
  ]);

  // PM state
  const [pms, setPms] = useState<PMRecord[]>([
    {
      id: 'pm-1',
      equipmentId: 'eq-1',
      equipmentName: 'Ventilator Mechanical ICU (Hamilton C3)',
      inventoryNo: 'IRIN-VNT-2024-001',
      roomName: 'Ruang ICU Utama',
      scheduledDate: '2026-08-01',
      actualDate: '2026-08-01',
      technicianId: 't-1',
      technicianName: 'Anton Kriswantoro, S.ST',
      durationHours: 2,
      cost: 500000,
      status: 'Selesai',
      checklist: [
        { id: '1', task: 'Inspeksi Fisik & Kebersihan', isPassed: true },
        { id: '2', task: 'Uji Fungsi Kelistrikan IEC 60601', isPassed: true },
        { id: '3', task: 'Uji Baterai Cadangan & Aliran O2', isPassed: true }
      ],
      beforePhoto: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      technicianSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      headSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      sparepartsUsed: []
    }
  ]);

  // Corrective Maintenance state
  const [corrective, setCorrective] = useState<CorrectiveMaintenanceRecord[]>([
    {
      id: 'cm-1',
      equipmentId: 'eq-3',
      equipmentName: 'Syringe Pump Terumo TE-331',
      inventoryNo: 'IRIN-SYR-2022-008',
      roomName: 'Ruang HCU',
      reportDate: '2026-08-04',
      reportedBy: 'Ns. Ratna Sari, S.Kep',
      priority: 'Tinggi',
      failureCause: 'Alarm oklusi berbunyi palsu saat dorongan spuit 50cc',
      solution: 'Pembersihan sensor optik dan penggantian kabel fleksibel',
      technicianId: 't-2',
      technicianName: 'Budi Santoso, A.Md.Tem',
      estimatedCompletionDate: '2026-08-08',
      sparepartsCost: 350000,
      laborCost: 150000,
      totalCost: 500000,
      status: 'Dalam Perbaikan',
      photos: ['https://images.unsplash.com/photo-1583912267670-65759240432e?auto=format&fit=crop&w=600&q=80']
    }
  ]);

  // Spareparts state
  const [spareparts, setSpareparts] = useState<Sparepart[]>([
    {
      id: 'sp-1',
      partNo: 'SP-MED-001',
      name: 'Oxygen Flow Sensor Hamilton',
      category: 'Sensor',
      stock: 4,
      minStock: 2,
      unit: 'Pcs',
      storageLocation: 'Lemari A-Rack 02',
      unitPrice: 2500000,
      supplierId: 'v-1',
      supplierName: 'PT Medika Utama Kudus',
      qrCode: 'SP-MED-001',
      barcode: '8991002003001',
      lastRestockDate: '2026-06-15'
    },
    {
      id: 'sp-2',
      partNo: 'SP-MED-002',
      name: 'Baterai Li-Ion Patient Monitor 12V',
      category: 'Power',
      stock: 1,
      minStock: 3,
      unit: 'Unit',
      storageLocation: 'Lemari B-Rack 01',
      unitPrice: 1200000,
      supplierId: 'v-2',
      supplierName: 'PT Biomedis Jaya Semarang',
      qrCode: 'SP-MED-002',
      barcode: '8991002003002',
      lastRestockDate: '2026-05-10'
    }
  ]);

  // Equipment Loans state
  const [loans, setLoans] = useState<EquipmentLoan[]>([
    {
      id: 'loan-1',
      equipmentId: 'eq-4',
      equipmentName: 'Defibrillator Biphasic + ECG Monitor',
      inventoryNo: 'IRIN-DEF-2021-003',
      borrowerName: 'dr. Eko Prasetyo',
      borrowerUnit: 'IGD Gawat Darurat',
      borrowerContact: '0812-3344-5566',
      loanDate: '2026-08-05',
      expectedReturnDate: '2026-08-07',
      status: 'Dipinjam',
      conditionOnLoan: 'Sangat Baik (Baterai 100%)'
    }
  ]);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-08-06 09:30:15',
      userId: 'u-1',
      userName: 'Anton Kriswantoro, S.ST',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: 'Inventaris',
      details: 'Menambahkan alat medis baru Ventilator Mechanical ICU (Hamilton C3)',
      ipAddress: '192.168.1.104'
    },
    {
      id: 'log-2',
      timestamp: '2026-08-06 08:15:00',
      userId: 'u-1',
      userName: 'Anton Kriswantoro, S.ST',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: 'Kalibrasi',
      details: 'Memperbarui tanggal jatuh tempo kalibrasi LPFK Semarang',
      ipAddress: '192.168.1.104'
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Jatuh Tempo Kalibrasi Mendekati!',
      message: 'Ventilator Hamilton C3 (IRIN-VNT-2024-001) tinggal 9 hari lagi.',
      timestamp: '10 Menit lalu',
      type: 'warning',
      isRead: false
    },
    {
      id: 'n-2',
      title: 'Peringatan Stok Sparepart Menipis',
      message: 'Baterai Li-Ion Patient Monitor sisa 1 Unit (Min: 3).',
      timestamp: '1 Jam lalu',
      type: 'danger',
      isRead: false
    }
  ]);

  // Documents / SOP State
  const [documents, setDocuments] = useState<DocumentSOP[]>(initialDocumentsSOP);

  // Selected Item for QR Code Modal
  const [selectedQRItem, setSelectedQRItem] = useState<Equipment | Sparepart | null>(null);

  // Sync state with backend Express API
  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .catch(err => console.log('Using initial client state. API ready in container environment.'));
  }, []);

  const addAuditLog = (action: 'CREATE' | 'UPDATE' | 'DELETE', module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: 'u-1',
      userName: currentUser,
      userRole: currentRole,
      action,
      module,
      details,
      ipAddress: '192.168.1.104'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Equipment CRUD Handlers
  const handleAddEquipment = (newItem: Partial<Equipment>) => {
    const item: Equipment = {
      id: `eq-${Date.now()}`,
      inventoryNo: newItem.inventoryNo || `IRIN-EQ-2026-${Date.now().toString().slice(-3)}`,
      assetNo: newItem.assetNo || `AST-RSMR-${Date.now().toString().slice(-4)}`,
      bmnNo: newItem.bmnNo || `BMN-2026-${Date.now().toString().slice(-4)}`,
      name: newItem.name || 'Alat Medis Baru',
      brand: newItem.brand || 'Generic',
      modelNo: newItem.modelNo || 'M-01',
      serialNo: newItem.serialNo || 'SN-000',
      category: newItem.category || 'Lain-lain',
      subcategory: newItem.subcategory || 'Monitoring',
      roomId: newItem.roomId || rooms[0].id,
      roomName: newItem.roomName || rooms[0].name,
      status: newItem.status || 'Baik',
      purchaseYear: newItem.purchaseYear || 2026,
      economicLifespan: newItem.economicLifespan || 5,
      purchasePrice: newItem.purchasePrice || 10000000,
      salvageValue: newItem.salvageValue || 2000000,
      warrantyExpiry: newItem.warrantyExpiry || '2027-08-01',
      purchaseVendorId: newItem.purchaseVendorId || 'v-1',
      purchaseVendorName: newItem.purchaseVendorName || 'PT Medika Utama',
      serviceVendorId: newItem.serviceVendorId || 'v-1',
      serviceVendorName: newItem.serviceVendorName || 'PT Medika Utama',
      calibrationVendorId: newItem.calibrationVendorId || 'v-3',
      calibrationVendorName: newItem.calibrationVendorName || 'LPFK Semarang',
      manualBookUrl: newItem.manualBookUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      sopUrl: newItem.sopUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      calibrationStatus: 'Lulus',
      nextPMDate: '2026-11-01',
      pmFrequencyMonths: 3,
      locationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photos: newItem.photos || ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'],
      lastCalibrationDate: newItem.lastCalibrationDate || '2025-08-01',
      nextCalibrationDate: newItem.nextCalibrationDate || '2026-08-01'
    };

    setEquipment(prev => [item, ...prev]);
    addAuditLog('CREATE', 'Inventaris', `Menambahkan alat medis: ${item.name} (${item.inventoryNo})`);
  };

  const handleUpdateEquipment = (id: string, updated: Partial<Equipment>) => {
    setEquipment(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
    addAuditLog('UPDATE', 'Inventaris', `Memperbarui data alat medis ID: ${id}`);
  };

  const handleDeleteEquipment = (id: string) => {
    const item = equipment.find(e => e.id === id);
    setEquipment(prev => prev.filter(e => e.id !== id));
    addAuditLog('DELETE', 'Inventaris', `Menghapus alat medis: ${item?.name || id}`);
  };

  const handleRelocateEquipment = (id: string, newRoomId: string, notes: string) => {
    const targetRoom = rooms.find(r => r.id === newRoomId);
    const targetEq = equipment.find(e => e.id === id);
    if (targetEq && targetRoom) {
      const historyEntry = {
        id: `loc-${Date.now()}`,
        equipmentId: id,
        fromRoomId: targetEq.roomId,
        fromRoomName: targetEq.roomName,
        toRoomId: targetRoom.id,
        toRoomName: targetRoom.name,
        movedBy: currentUser,
        movedAt: new Date().toISOString().slice(0, 10),
        reason: notes || 'Mutasi antar unit perawatan IRIN'
      };
      setEquipment(prev => prev.map(item => item.id === id ? {
        ...item,
        roomId: targetRoom.id,
        roomName: targetRoom.name,
        locationHistory: [historyEntry, ...(item.locationHistory || [])]
      } : item));
      addAuditLog('UPDATE', 'Inventaris', `Relokasi alat ${targetEq.name} ke ${targetRoom.name}`);
    }
  };

  const handleBatchImportEquipment = (batch: Partial<Equipment>[]) => {
    batch.forEach(item => handleAddEquipment(item));
  };

  // Calibration Handler
  const handleAddCalibration = (cal: Partial<CalibrationRecord>) => {
    const newRecord: CalibrationRecord = {
      id: `cal-${Date.now()}`,
      equipmentId: cal.equipmentId || equipment[0].id,
      equipmentName: cal.equipmentName || equipment[0].name,
      inventoryNo: cal.inventoryNo || equipment[0].inventoryNo,
      scheduledDate: cal.scheduledDate || '2026-09-01',
      dueDate: cal.dueDate || '2027-08-01',
      daysRemaining: cal.daysRemaining || 360,
      statusBadgeColor: cal.statusBadgeColor || 'green',
      statusBadgeLabel: cal.statusBadgeLabel || 'Lulus / Aktif',
      vendorId: cal.vendorId || vendors[0].id,
      vendorName: cal.vendorName || vendors[0].name,
      cost: cal.cost || 1000000,
      result: cal.result || 'Lulus',
      certificateNo: cal.certificateNo || 'SERT-RSMR-2026',
      certificateUrl: cal.certificateUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      technicianName: currentUser
    };

    setCalibrations(prev => [newRecord, ...prev]);
    addAuditLog('CREATE', 'Kalibrasi', `Mencatat hasil kalibrasi ${newRecord.equipmentName}`);
  };

  const handleDeleteCalibration = (id: string) => {
    setCalibrations(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE', 'Kalibrasi', `Menghapus data kalibrasi ID: ${id}`);
  };

  // PM Handler
  const handleAddPM = (pm: Partial<PMRecord>) => {
    const newPM: PMRecord = {
      id: `pm-${Date.now()}`,
      equipmentId: pm.equipmentId || equipment[0].id,
      equipmentName: pm.equipmentName || equipment[0].name,
      inventoryNo: pm.inventoryNo || equipment[0].inventoryNo,
      roomName: pm.roomName || equipment[0].roomName,
      scheduledDate: pm.scheduledDate || new Date().toISOString().slice(0, 10),
      actualDate: pm.actualDate || new Date().toISOString().slice(0, 10),
      technicianId: pm.technicianId || technicians[0].id,
      technicianName: pm.technicianName || technicians[0].name,
      durationHours: pm.durationHours || 2,
      cost: pm.cost || 500000,
      status: pm.status || 'Selesai',
      checklist: pm.checklist || [],
      beforePhoto: pm.beforePhoto || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      afterPhoto: pm.afterPhoto || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      sparepartsUsed: []
    };
    setPms(prev => [newPM, ...prev]);
    addAuditLog('CREATE', 'Preventive Maintenance', `Menambahkan PM untuk ${newPM.equipmentName}`);
  };

  const handleUpdatePM = (id: string, updated: Partial<PMRecord>) => {
    setPms(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    addAuditLog('UPDATE', 'Preventive Maintenance', `Memperbarui PM ID: ${id}`);
  };

  const handleDeletePM = (id: string) => {
    setPms(prev => prev.filter(p => p.id !== id));
    addAuditLog('DELETE', 'Preventive Maintenance', `Menghapus data PM ID: ${id}`);
  };

  // Corrective Handler
  const handleAddCorrective = (rec: Partial<CorrectiveMaintenanceRecord>) => {
    const newRecord: CorrectiveMaintenanceRecord = {
      id: `cm-${Date.now()}`,
      equipmentId: rec.equipmentId || equipment[0].id,
      equipmentName: rec.equipmentName || equipment[0].name,
      inventoryNo: rec.inventoryNo || equipment[0].inventoryNo,
      roomName: rec.roomName || equipment[0].roomName,
      reportDate: rec.reportDate || new Date().toISOString().slice(0, 10),
      reportedBy: rec.reportedBy || 'Perawat ICU',
      priority: rec.priority || 'Tinggi',
      failureCause: rec.failureCause || 'Disfungsi sensor',
      solution: rec.solution || 'Perbaikan kabel',
      technicianId: rec.technicianId || technicians[0].id,
      technicianName: rec.technicianName || technicians[0].name,
      estimatedCompletionDate: rec.estimatedCompletionDate || '2026-08-10',
      sparepartsCost: rec.sparepartsCost || 0,
      laborCost: rec.laborCost || 200000,
      totalCost: (rec.sparepartsCost || 0) + (rec.laborCost || 200000),
      status: 'Dilaporkan',
      photos: [],
      documents: []
    };

    setCorrective(prev => [newRecord, ...prev]);
    addAuditLog('CREATE', 'Kerusakan', `Laporan kerusakan baru: ${newRecord.equipmentName}`);
  };

  const handleUpdateCorrective = (id: string, updated: Partial<CorrectiveMaintenanceRecord>) => {
    setCorrective(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    addAuditLog('UPDATE', 'Kerusakan', `Memperbarui laporan kerusakan ID: ${id}`);
  };

  const handleDeleteCorrective = (id: string) => {
    setCorrective(prev => prev.filter(r => r.id !== id));
    addAuditLog('DELETE', 'Kerusakan', `Menghapus laporan kerusakan ID: ${id}`);
  };

  // Sparepart Handler
  const handleAddSparepart = (part: Partial<Sparepart>) => {
    const newPart: Sparepart = {
      id: `sp-${Date.now()}`,
      partNo: part.partNo || `SP-${Date.now().toString().slice(-4)}`,
      name: part.name || 'Sparepart Baru',
      category: part.category || 'Sensor',
      stock: part.stock || 10,
      minStock: part.minStock || 2,
      unit: part.unit || 'Pcs',
      storageLocation: part.storageLocation || 'Rak A1',
      unitPrice: part.unitPrice || 500000,
      supplierId: part.supplierId || vendors[0]?.id || '',
      supplierName: part.supplierName || vendors[0]?.name || '',
      qrCode: part.partNo || `SP-${Date.now().toString().slice(-4)}`,
      barcode: '8991002003999',
      lastRestockDate: new Date().toISOString().slice(0, 10)
    };
    setSpareparts(prev => [newPart, ...prev]);
    addAuditLog('CREATE', 'Sparepart', `Menambahkan sparepart: ${newPart.name}`);
  };

  const handleDeleteSparepart = (id: string) => {
    setSpareparts(prev => prev.filter(sp => sp.id !== id));
    addAuditLog('DELETE', 'Sparepart', `Menghapus sparepart ID: ${id}`);
  };

  // Vendor Handler
  const handleAddVendor = (v: Partial<Vendor>) => {
    const newV: Vendor = {
      id: `v-${Date.now()}`,
      name: v.name || 'Vendor Baru',
      category: v.category || ['Pembelian'],
      picName: v.picName || 'Bapak Ahmad',
      phone: v.phone || '0812-0000-1111',
      email: v.email || 'info@vendor.com',
      address: v.address || 'Kudus, Jawa Tengah',
      contractNo: v.contractNo || 'KNT/2026/001',
      contractExpiry: v.contractExpiry || '2027-12-31',
      rating: v.rating || 4.5
    };
    setVendors(prev => [newV, ...prev]);
    addAuditLog('CREATE', 'Vendor', `Menambahkan vendor baru: ${newV.name}`);
  };

  const handleUpdateVendor = (id: string, updated: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v));
    addAuditLog('UPDATE', 'Vendor', `Memperbarui vendor ID: ${id}`);
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    addAuditLog('DELETE', 'Vendor', `Menghapus vendor ID: ${id}`);
  };

  // Technician Handlers
  const handleAddTechnician = (tech: Partial<Technician>) => {
    const newT: Technician = {
      id: `t-${Date.now()}`,
      employeeNo: tech.employeeNo || `ATEM-2026-${Date.now().toString().slice(-3)}`,
      name: tech.name || 'Teknisi Baru',
      email: tech.email || 'teknisi@mardirahayu.com',
      phone: tech.phone || '0812-3456-7890',
      certifications: tech.certifications || ['ATEM', 'STR Aktif'],
      activeWorkload: 0,
      completedTasksCount: 0,
      performanceScore: 95,
      schedule: tech.schedule || 'Shift Pagi (07:00 - 14:00)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    };
    setTechnicians(prev => [newT, ...prev]);
    addAuditLog('CREATE', 'Teknisi', `Menambahkan teknisi baru: ${newT.name}`);
  };

  const handleUpdateTechnician = (id: string, updated: Partial<Technician>) => {
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    addAuditLog('UPDATE', 'Teknisi', `Memperbarui teknisi ID: ${id}`);
  };

  const handleDeleteTechnician = (id: string) => {
    setTechnicians(prev => prev.filter(t => t.id !== id));
    addAuditLog('DELETE', 'Teknisi', `Menghapus teknisi ID: ${id}`);
  };

  // Room Handlers
  const handleAddRoom = (r: Partial<Room>) => {
    const newR: Room = {
      id: `room-${Date.now()}`,
      code: r.code || `R-${Date.now().toString().slice(-3)}`,
      name: r.name || 'Ruangan Baru',
      location: r.location || 'Gedung Medis Fl 2',
      headName: r.headName || 'Perawat Kepala',
      headPhone: r.headPhone || '0812-0000',
      capacity: r.capacity || 10,
      equipmentCount: 0,
      conditionStatus: r.conditionStatus || 'Steril / Siap'
    };
    setRooms(prev => [newR, ...prev]);
    addAuditLog('CREATE', 'Ruangan', `Menambahkan ruangan baru: ${newR.name}`);
  };

  const handleUpdateRoom = (id: string, updated: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    addAuditLog('UPDATE', 'Ruangan', `Memperbarui ruangan ID: ${id}`);
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    addAuditLog('DELETE', 'Ruangan', `Menghapus ruangan ID: ${id}`);
  };

  // Loan Handlers
  const handleAddLoan = (loan: Partial<EquipmentLoan>) => {
    const targetEq = equipment.find(e => e.id === loan.equipmentId) || equipment[0];
    const newLoan: EquipmentLoan = {
      id: `loan-${Date.now()}`,
      equipmentId: loan.equipmentId || targetEq?.id || '',
      equipmentName: loan.equipmentName || targetEq?.name || '',
      inventoryNo: loan.inventoryNo || targetEq?.inventoryNo || '',
      borrowerName: loan.borrowerName || 'Perawat',
      borrowerUnit: loan.borrowerUnit || 'IGD',
      borrowerContact: loan.borrowerContact || '0812-000',
      loanDate: loan.loanDate || new Date().toISOString().slice(0, 10),
      expectedReturnDate: loan.expectedReturnDate || '2026-08-10',
      status: 'Dipinjam',
      conditionOnLoan: loan.conditionOnLoan || 'Baik'
    };
    setLoans(prev => [newLoan, ...prev]);
    if (newLoan.equipmentId) {
      setEquipment(prev => prev.map(e => e.id === newLoan.equipmentId ? { ...e, status: 'Dipinjam' } : e));
    }
    addAuditLog('CREATE', 'Peminjaman', `Peminjaman alat ${newLoan.equipmentName} oleh ${newLoan.borrowerName}`);
  };

  const handleUpdateLoan = (id: string, updated: Partial<EquipmentLoan>) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
    addAuditLog('UPDATE', 'Peminjaman', `Memperbarui peminjaman ID: ${id}`);
  };

  const handleDeleteLoan = (id: string) => {
    const loan = loans.find(l => l.id === id);
    if (loan && loan.status === 'Dipinjam') {
      setEquipment(prev => prev.map(e => e.id === loan.equipmentId ? { ...e, status: 'Baik' } : e));
    }
    setLoans(prev => prev.filter(l => l.id !== id));
    addAuditLog('DELETE', 'Peminjaman', `Menghapus peminjaman ID: ${id}`);
  };

  const handleReturnLoan = (id: string, condition: string) => {
    const loan = loans.find(l => l.id === id);
    if (loan) {
      setEquipment(prev => prev.map(e => e.id === loan.equipmentId ? { ...e, status: 'Baik' } : e));
    }
    setLoans(prev => prev.map(l => l.id === id ? {
      ...l,
      status: 'Dikembalikan',
      actualReturnDate: new Date().toISOString().slice(0, 10),
      conditionOnReturn: condition
    } : l));
    addAuditLog('UPDATE', 'Peminjaman', `Pengembalian alat peminjaman ID: ${id}`);
  };

  // Documents / SOP Handlers
  const handleAddDocument = (doc: DocumentSOP) => {
    setDocuments(prev => [doc, ...prev]);
    addAuditLog('CREATE', 'Dokumen', `Menambahkan dokumen SOP: ${doc.title}`);
  };

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    addAuditLog('DELETE', 'Dokumen', `Menghapus dokumen SOP: ${doc?.title || id}`);
  };

  // User Management & RBAC Handlers
  const handleAddUser = (u: Partial<AppUser>) => {
    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      username: u.username || u.email?.split('@')[0] || `user_${Date.now()}`,
      name: u.name || 'Pengguna Baru',
      email: u.email || 'user@mardirahayu.com',
      role: u.role || 'Teknisi Elektromedis',
      department: u.department || 'ATEM',
      status: u.status || 'Aktif',
      nip: u.nip || '-',
      phone: u.phone || '-'
    };
    setUsers(prev => [newUser, ...prev]);
    addAuditLog('CREATE', 'Pengguna', `Menambahkan pengguna baru: ${newUser.name} (${newUser.role})`);
  };

  const handleUpdateUser = (id: string, u: Partial<AppUser>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...u } : user));
    if (activeUser.id === id) {
      setActiveUser(prev => ({ ...prev, ...u }));
      if (u.name) setCurrentUser(u.name);
      if (u.role) setCurrentRole(u.role as UserRole);
    }
    addAuditLog('UPDATE', 'Pengguna', `Memperbarui data pengguna ID: ${id}`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('DELETE', 'Pengguna', `Menghapus pengguna ID: ${id}`);
  };

  const handleUpdateRolePermissions = (roleId: string, permissions: string[]) => {
    setRoleDefinitions(prev => prev.map(r => r.id === roleId ? { ...r, permissions } : r));
    addAuditLog('UPDATE', 'RBAC', `Memperbarui perizinan matriks role ID: ${roleId}`);
  };

  const handleAddRoleDefinition = (role: Partial<UserRoleDefinition>) => {
    const newRole: UserRoleDefinition = {
      id: `role-${Date.now()}`,
      name: role.name || 'Role Custom',
      badge: role.badge || 'Akses Khusus',
      description: role.description || '',
      permissions: role.permissions || ['inventory_view', 'reports_export']
    };
    setRoleDefinitions(prev => [...prev, newRole]);
    addAuditLog('CREATE', 'RBAC', `Membuat peran baru: ${newRole.name}`);
  };

  const handleChangeActiveUser = (u: AppUser) => {
    setActiveUser(u);
    setCurrentUser(u.name);
    setCurrentRole(u.role as UserRole);
    addAuditLog('UPDATE', 'Sesi', `Beralih ke pengguna: ${u.name} (${u.role})`);
  };

  // Quick Action Navigator
  const handleQuickAction = (action: string) => {
    if (action === 'ADD_EQUIPMENT') setActiveTab('inventaris');
    else if (action === 'ADD_PM') setActiveTab('pm');
    else if (action === 'ADD_CALIBRATION') setActiveTab('kalibrasi');
    else if (action === 'PRINT_LABEL') setActiveTab('qrcode');
  };

  const handleExportFullExcel = () => {
    const data = equipment.map(e => ({
      'No. Inventaris': e.inventoryNo,
      'No. Aset RS': e.assetNo,
      'Nama Alat Kesehatan': e.name,
      'Merk': e.brand,
      'Tipe/Model': e.modelNo,
      'No. Seri': e.serialNo,
      'Ruangan': e.roomName,
      'Status': e.status,
      'Harga Beli (Rp)': e.purchasePrice,
      'Tahun Beli': e.purchaseYear,
      'Kalibrasi Berikutnya': e.nextCalibrationDate
    }));
    exportToExcel(data, 'Inventaris_Alat_Kesehatan_IRIN_RS_Mardi_Rahayu');
  };

  const handleBackupDatabase = () => {
    const backupObj = {
      exportDate: new Date().toISOString(),
      hospital: 'RS Mardi Rahayu Kudus',
      unit: 'Instalasi IRIN',
      equipment,
      calibrations,
      pms,
      corrective,
      spareparts,
      vendors,
      technicians,
      rooms,
      loans,
      auditLogs
    };

    const str = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Backup_Database_IRIN_RSMR_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    addAuditLog('CREATE', 'Backup', 'Pengunduhan cadangan database JSON penuh');
  };

  const handleRestoreDatabase = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.equipment) setEquipment(parsed.equipment);
      if (parsed.calibrations) setCalibrations(parsed.calibrations);
      if (parsed.pms) setPms(parsed.pms);
      if (parsed.corrective) setCorrective(parsed.corrective);
      if (parsed.spareparts) setSpareparts(parsed.spareparts);
      if (parsed.vendors) setVendors(parsed.vendors);
      addAuditLog('UPDATE', 'Restore', 'Memulihkan data sistem dari cadangan JSON');
    } catch (err) {
      alert('Format file cadangan tidak valid.');
    }
  };

  const syncedTechnicians = technicians.map(tech => {
    const activePMs = pms.filter(p => p.technicianName === tech.name && p.status !== 'Selesai').length;
    const activeCorr = corrective.filter(c => (c.technicianName === tech.name || c.technicianId === tech.id) && c.status !== 'Selesai').length;
    const donePMs = pms.filter(p => p.technicianName === tech.name && p.status === 'Selesai').length;
    const doneCorr = corrective.filter(c => (c.technicianName === tech.name || c.technicianId === tech.id) && c.status === 'Selesai').length;

    return {
      ...tech,
      activeWorkload: activePMs + activeCorr,
      completedTasksCount: (tech.completedTasksCount || 0) + donePMs + doneCorr
    };
  });

  const syncedRooms = rooms.map(room => {
    const count = equipment.filter(eq => eq.roomId === room.id || (room.name && eq.roomName?.toLowerCase().includes(room.name.toLowerCase()))).length;
    return {
      ...room,
      equipmentCount: count
    };
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        activeModule={activeTab}
        onSelectModule={setActiveTab}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          user={activeUser}
          settings={{
            hospitalName: 'RS MARDI RAHAYU KUDUS',
            unitName: 'Instalasi IRIN',
            address: 'Jl. AKBP R. Agil Kusumadya No. 110 Kudus',
            phone: '(0291) 438234',
            email: 'irin@mardirahayu.com',
            pmDefaultFrequencyMonths: 3,
            calibrationAlertDays: 30,
            enableEmailNotification: true,
            enableWhatsappNotification: false,
            backupAutoDaily: true
          }}
          onOpenScanner={() => setSelectedQRItem(equipment[0])}
          onSelectModule={setActiveTab}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onUpdateUserPhoto={(photoUrl) => handleUpdateUser(activeUser.id, { avatar: photoUrl })}
          notificationCount={notifications.filter(n => !n.isRead).length}
          unreadNotifications={notifications.filter(n => !n.isRead).map(n => ({
            id: n.id,
            title: n.title,
            time: n.timestamp,
            type: n.type === 'danger' ? 'error' : n.type === 'warning' ? 'warning' : 'info'
          }))}
        />

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <DashboardView
              equipment={equipment}
              calibrations={calibrations}
              pms={pms}
              corrective={corrective}
              spareparts={spareparts}
              rooms={rooms}
              loans={loans}
              auditLogs={auditLogs}
              onSelectModule={setActiveTab}
              onOpenScanner={() => setSelectedQRItem(equipment[0])}
              onAddNewEquipment={() => setActiveTab('inventaris')}
            />
          )}

          {activeTab === 'inventaris' && (
            <InventoryView
              equipment={equipment}
              rooms={rooms}
              vendors={vendors}
              onAddEquipment={handleAddEquipment}
              onUpdateEquipment={handleUpdateEquipment}
              onDeleteEquipment={handleDeleteEquipment}
              onRelocateEquipment={handleRelocateEquipment}
              onShowQRModal={(item) => setSelectedQRItem(item)}
            />
          )}

          {activeTab === 'kalibrasi' && (
            <CalibrationView
              calibrations={calibrations}
              equipment={equipment}
              vendors={vendors}
              onAddCalibration={handleAddCalibration}
              onUpdateCalibration={(id, rec) => {
                setCalibrations(prev => prev.map(c => c.id === id ? { ...c, ...rec } : c));
              }}
              onDeleteCalibration={handleDeleteCalibration}
            />
          )}

          {activeTab === 'pm' && (
            <PreventiveMaintenanceView
              pms={pms}
              equipment={equipment}
              technicians={technicians}
              spareparts={spareparts}
              onAddPM={handleAddPM}
              onUpdatePM={handleUpdatePM}
              onDeletePM={handleDeletePM}
            />
          )}

          {activeTab === 'corrective' && (
            <CorrectiveMaintenanceView
              records={corrective}
              equipment={equipment}
              technicians={technicians}
              spareparts={spareparts}
              onAddRecord={handleAddCorrective}
              onUpdateRecord={handleUpdateCorrective}
              onDeleteRecord={handleDeleteCorrective}
            />
          )}

          {activeTab === 'sparepart' && (
            <SparepartView
              spareparts={spareparts}
              vendors={vendors}
              onAddSparepart={handleAddSparepart}
              onUpdateSparepart={(id, p) => setSpareparts(prev => prev.map(sp => sp.id === id ? { ...sp, ...p } : sp))}
              onDeleteSparepart={handleDeleteSparepart}
              onShowQRModal={(item) => setSelectedQRItem(item)}
            />
          )}

          {activeTab === 'vendor' && (
            <VendorView
              vendors={vendors}
              onAddVendor={handleAddVendor}
              onUpdateVendor={handleUpdateVendor}
              onDeleteVendor={handleDeleteVendor}
            />
          )}

          {(activeTab === 'technician' || activeTab === 'teknisi') && (
            <TechnicianView
              technicians={syncedTechnicians}
              equipment={equipment}
              pms={pms}
              corrective={corrective}
              spareparts={spareparts}
              onAddTechnician={handleAddTechnician}
              onUpdateTechnician={handleUpdateTechnician}
              onDeleteTechnician={handleDeleteTechnician}
              onAddCorrective={handleAddCorrective}
              onUpdateCorrective={handleUpdateCorrective}
            />
          )}

          {(activeTab === 'room' || activeTab === 'ruangan') && (
            <RoomView
              rooms={syncedRooms}
              equipment={equipment}
              onAddRoom={handleAddRoom}
              onUpdateRoom={handleUpdateRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          )}

          {activeTab === 'qrcode' && (
            <QRCodeView
              equipment={equipment}
              spareparts={spareparts}
              selectedItemForQR={selectedQRItem}
            />
          )}

          {(activeTab === 'loan' || activeTab === 'peminjaman') && (
            <LoanView
              loans={loans}
              equipment={equipment}
              onAddLoan={handleAddLoan}
              onUpdateLoan={handleUpdateLoan}
              onDeleteLoan={handleDeleteLoan}
              onReturnLoan={handleReturnLoan}
            />
          )}

          {(activeTab === 'reports' || activeTab === 'laporan') && (
            <ReportsView
              equipment={equipment}
              calibrations={calibrations}
              pms={pms}
              corrective={corrective}
              spareparts={spareparts}
              vendors={vendors}
            />
          )}

          {activeTab === 'import' && (
            <ImportView onImportEquipmentBatch={handleBatchImportEquipment} />
          )}

          {(activeTab === 'documents' || activeTab === 'dokumen') && (
            <DocumentsView
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogView logs={auditLogs} />
          )}

          {activeTab === 'api' && (
            <RestApiExplorer />
          )}

          {activeTab === 'roles' && (
            <RoleManagementView
              users={users}
              roleDefinitions={roleDefinitions}
              activeUser={activeUser}
              onChangeActiveUser={handleChangeActiveUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onUpdateRolePermissions={handleUpdateRolePermissions}
              onAddRoleDefinition={handleAddRoleDefinition}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              onTriggerBackup={handleBackupDatabase}
              onRestoreBackup={handleRestoreDatabase}
            />
          )}

          {activeTab === 'infinityfree' && (
            <InfinityFreeExportView />
          )}
        </main>

        {/* High Density Footer Info */}
        <footer className="bg-white border-t border-slate-200 px-6 py-2 flex flex-wrap justify-between items-center text-[10px] text-slate-400 uppercase tracking-tighter">
          <div>Sistem Manajemen Inventaris Elektromedis v2.5.0-Stable</div>
          <div className="flex items-center space-x-4">
            <span>Database Status: <span className="text-emerald-500 font-semibold">Online</span></span>
            <span>Server Time: 12:44:02 WIB</span>
            <span className="text-slate-800 font-bold tracking-normal italic">RS MARDI RAHAYU KUDUS</span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <BottomNav
        activeModule={activeTab}
        onSelectModule={setActiveTab}
        onOpenScanner={() => setSelectedQRItem(equipment[0])}
      />

      {/* QR Code Printable Modal */}
      {selectedQRItem && (
        <QRCodeModal
          isOpen={!!selectedQRItem}
          onClose={() => setSelectedQRItem(null)}
          item={selectedQRItem}
        />
      )}
    </div>
  );
}

export default App;
