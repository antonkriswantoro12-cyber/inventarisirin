import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initialRooms,
  initialVendors,
  initialTechnicians,
  initialSpareparts,
  initialEquipment,
  initialCalibrations,
  initialPMs,
  initialCorrective,
  initialLoans,
  initialAuditLogs,
  initialRoles,
  currentUser,
  initialSettings
} from './src/data/seedData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // In-memory data store seeded with initial RS Mardi Rahayu data
  let store = {
    rooms: [...initialRooms],
    vendors: [...initialVendors],
    technicians: [...initialTechnicians],
    spareparts: [...initialSpareparts],
    equipment: [...initialEquipment],
    calibrations: [...initialCalibrations],
    pms: [...initialPMs],
    corrective: [...initialCorrective],
    loans: [...initialLoans],
    auditLogs: [...initialAuditLogs],
    roles: [...initialRoles],
    user: { ...currentUser },
    settings: { ...initialSettings }
  };

  // Helper function to log audit
  const addAuditLog = (action: string, moduleName: string, details: string, req: express.Request) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: store.user.name,
      role: store.user.role,
      action,
      module: moduleName,
      details,
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1'
    };
    store.auditLogs.unshift(newLog);
  };

  // --- REST API ENDPOINTS ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Inventaris IRIN RS Mardi Rahayu', version: '1.0.0', time: new Date() });
  });

  // 17. Authentication endpoint
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'anton.kriswantoro' || username === 'admin') {
      addAuditLog('LOGIN', 'Autentikasi', 'User berhasil login via REST API', req);
      return res.json({
        success: true,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnRvbi5rcmlzd2FudG9ybyIsIm5hbWUiOiJBbnRvbiBLcmlzd2FudG9ybyIsImlhdCI6MTY3MjUxMjAwMH0.sample_token',
        user: store.user
      });
    }
    res.status(401).json({ success: false, message: 'Username atau password salah' });
  });

  // 1. Dashboard summary
  app.get('/api/dashboard', (req, res) => {
    const totalEquipment = store.equipment.length;
    const goodCount = store.equipment.filter(e => e.status === 'Baik').length;
    const minorDamageCount = store.equipment.filter(e => e.status === 'Rusak Ringan').length;
    const heavyDamageCount = store.equipment.filter(e => e.status === 'Rusak Berat').length;
    const inRepairCount = store.equipment.filter(e => e.status === 'Dalam Perbaikan').length;
    const inCalibrationCount = store.equipment.filter(e => e.status === 'Dalam Kalibrasi').length;
    const disposedCount = store.equipment.filter(e => e.status === 'Afkir').length;

    // KPI calculation
    // MTTR calculation (average downtime of completed repairs in hours)
    const completedCMs = store.corrective.filter(c => c.downtimeHours && c.downtimeHours > 0);
    const avgMTTR = completedCMs.length ? (completedCMs.reduce((sum, c) => sum + (c.downtimeHours || 0), 0) / completedCMs.length) : 18;
    const avgMTBF = 120; // 120 days between failures
    const uptimePercentage = Number((((365 * 24 - avgMTTR) / (365 * 24)) * 100).toFixed(1));
    const calibratedPassedCount = store.equipment.filter(e => e.calibrationStatus === 'Lulus').length;
    const calibrationCompliancePct = Number(((calibratedPassedCount / (totalEquipment || 1)) * 100).toFixed(1));

    res.json({
      success: true,
      data: {
        kpis: {
          mttrHours: avgMTTR,
          mtbfDays: avgMTBF,
          uptimePercentage,
          calibrationCompliancePct,
          totalEquipment,
          goodCount,
          minorDamageCount,
          heavyDamageCount,
          inRepairCount,
          inCalibrationCount,
          disposedCount,
          upcomingCalibration30Days: store.equipment.filter(e => e.calibrationStatus === 'Mendekati').length,
          overdueCalibrationCount: store.equipment.filter(e => e.calibrationStatus === 'Jatuh Tempo').length,
          pendingPMCount: store.pms.filter(p => p.status !== 'Selesai').length,
          activeWorkOrdersCount: store.corrective.filter(c => c.status !== 'Selesai').length,
          lowStockSparepartsCount: store.spareparts.filter(s => s.stock <= s.minStock).length,
          activeLoansCount: store.loans.filter(l => l.status === 'Dipinjam').length
        },
        equipmentByRoom: store.rooms.map(r => ({
          roomName: r.name,
          count: store.equipment.filter(e => e.roomId === r.id).length
        })),
        recentActivities: store.auditLogs.slice(0, 10)
      }
    });
  });

  // 2. Inventaris Endpoints
  app.get('/api/inventaris', (req, res) => {
    res.json({ success: true, count: store.equipment.length, data: store.equipment });
  });

  app.post('/api/inventaris', (req, res) => {
    const newItem = {
      ...req.body,
      id: `eq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      locationHistory: req.body.locationHistory || []
    };
    store.equipment.unshift(newItem);
    addAuditLog('TAMBAH_ALAT', 'Inventaris', `Menambah alat baru: ${newItem.name} (${newItem.inventoryNo})`, req);
    res.json({ success: true, message: 'Alat berhasil ditambahkan', data: newItem });
  });

  app.put('/api/inventaris/:id', (req, res) => {
    const { id } = req.params;
    const index = store.equipment.findIndex(e => e.id === id);
    if (index !== -1) {
      store.equipment[index] = { ...store.equipment[index], ...req.body, updatedAt: new Date().toISOString() };
      addAuditLog('UPDATE_ALAT', 'Inventaris', `Memperbarui data alat: ${store.equipment[index].name} (${store.equipment[index].inventoryNo})`, req);
      return res.json({ success: true, message: 'Data alat berhasil diperbarui', data: store.equipment[index] });
    }
    res.status(404).json({ success: false, message: 'Alat tidak ditemukan' });
  });

  app.delete('/api/inventaris/:id', (req, res) => {
    const { id } = req.params;
    const item = store.equipment.find(e => e.id === id);
    if (item) {
      store.equipment = store.equipment.filter(e => e.id !== id);
      addAuditLog('HAPUS_ALAT', 'Inventaris', `Menghapus alat: ${item.name} (${item.inventoryNo})`, req);
      return res.json({ success: true, message: 'Alat berhasil dihapus' });
    }
    res.status(404).json({ success: false, message: 'Alat tidak ditemukan' });
  });

  // 3. Kalibrasi Endpoints
  app.get('/api/kalibrasi', (req, res) => {
    res.json({ success: true, count: store.calibrations.length, data: store.calibrations });
  });

  app.post('/api/kalibrasi', (req, res) => {
    const newCal = { ...req.body, id: `cal-${Date.now()}` };
    store.calibrations.unshift(newCal);
    addAuditLog('TAMBAH_KALIBRASI', 'Kalibrasi', `Menambah jadwal kalibrasi untuk ${newCal.equipmentName}`, req);
    res.json({ success: true, message: 'Kalibrasi berhasil dicatat', data: newCal });
  });

  // 4 & 5. Maintenance Endpoints
  app.get('/api/maintenance', (req, res) => {
    res.json({
      success: true,
      pm: store.pms,
      corrective: store.corrective
    });
  });

  app.post('/api/maintenance/pm', (req, res) => {
    const newPM = { ...req.body, id: `pm-${Date.now()}` };
    store.pms.unshift(newPM);
    addAuditLog('TAMBAH_PM', 'Preventive Maintenance', `Mencatat PM untuk ${newPM.equipmentName}`, req);
    res.json({ success: true, data: newPM });
  });

  app.post('/api/maintenance/corrective', (req, res) => {
    const newCM = { ...req.body, id: `cm-${Date.now()}` };
    store.corrective.unshift(newCM);
    addAuditLog('LAPOR_KERUSAKAN', 'Corrective Maintenance', `Laporan kerusakan baru: ${newCM.equipmentName} (${newCM.priority})`, req);
    res.json({ success: true, data: newCM });
  });

  // 6. Spareparts Endpoints
  app.get('/api/spareparts', (req, res) => {
    res.json({ success: true, count: store.spareparts.length, data: store.spareparts });
  });

  app.post('/api/spareparts', (req, res) => {
    const newPart = { ...req.body, id: `sp-${Date.now()}` };
    store.spareparts.unshift(newPart);
    addAuditLog('TAMBAH_SPAREPART', 'Sparepart', `Menambah sparepart baru: ${newPart.name}`, req);
    res.json({ success: true, data: newPart });
  });

  // 7. Vendors Endpoints
  app.get('/api/vendors', (req, res) => {
    res.json({ success: true, data: store.vendors });
  });

  // 8. Teknisi Endpoints
  app.get('/api/teknisi', (req, res) => {
    res.json({ success: true, data: store.technicians });
  });

  // 9. Ruangan Endpoints
  app.get('/api/ruangan', (req, res) => {
    res.json({ success: true, data: store.rooms });
  });

  // 11. Peminjaman Endpoints
  app.get('/api/peminjaman', (req, res) => {
    res.json({ success: true, data: store.loans });
  });

  app.post('/api/peminjaman', (req, res) => {
    const newLoan = { ...req.body, id: `loan-${Date.now()}` };
    store.loans.unshift(newLoan);
    addAuditLog('PEMINJAMAN_ALAT', 'Peminjaman', `Peminjaman alat ${newLoan.equipmentName} oleh ${newLoan.borrowerName}`, req);
    res.json({ success: true, data: newLoan });
  });

  // 19. Audit Log Endpoint
  app.get('/api/audit-log', (req, res) => {
    res.json({ success: true, count: store.auditLogs.length, data: store.auditLogs });
  });

  // 20 & 21. Settings & Backup Endpoints
  app.get('/api/settings', (req, res) => {
    res.json({ success: true, data: store.settings });
  });

  app.put('/api/settings', (req, res) => {
    store.settings = { ...store.settings, ...req.body };
    addAuditLog('UPDATE_PENGATURAN', 'Pengaturan Sistem', 'Memperbarui konfigurasi sistem', req);
    res.json({ success: true, message: 'Pengaturan berhasil disimpan', data: store.settings });
  });

  app.get('/api/export/backup', (req, res) => {
    addAuditLog('BACKUP_DATA', 'Backup & Restore', 'Mengeksport full backup JSON database', req);
    res.json({
      appName: store.settings.appName,
      timestamp: new Date().toISOString(),
      store
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
