import express from 'express';
import path from 'path';
import fs from 'fs';
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

  const DB_FILE = path.join(process.cwd(), 'database.json');

  // In-memory data store seeded with initial RS Mardi Rahayu data or loaded from file
  let store: any;
  if (fs.existsSync(DB_FILE)) {
    try {
      store = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      console.log('Database loaded from database.json');
    } catch (e) {
      console.error('Error loading database.json, resetting to seed:', e);
    }
  }

  if (!store) {
    store = {
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
      settings: { ...initialSettings },
      documents: [
        { id: 'doc-1', title: 'SOP Pengoperasian Ventilator Hamilton C3 (No. SOP/IRIN/001)', category: 'SOP', size: '2.4 MB', date: '2026-01-15', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-2', title: 'User Manual & Service Manual Syringe Pump Terumo TE-331', category: 'Manual Book', size: '14.8 MB', date: '2025-11-20', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-3', title: 'Sertifikat Induk Kalibrasi BPFK Semarang Tahun 2026', category: 'Sertifikat', size: '5.1 MB', date: '2026-03-01', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-4', title: 'Pedoman KARS & Keselamatan Kerja Radiasi/Elektromedis RSMR', category: 'Kebijakan', size: '8.3 MB', date: '2026-02-10', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
      ]
    };
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
    } catch (e) {
      console.error('Error writing database.json initial file:', e);
    }
  }

  const saveStore = () => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
    } catch (e) {
      console.error('Error saving database:', e);
    }
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
    saveStore();
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

  app.put('/api/kalibrasi/:id', (req, res) => {
    const { id } = req.params;
    const index = store.calibrations.findIndex(c => c.id === id);
    if (index !== -1) {
      store.calibrations[index] = { ...store.calibrations[index], ...req.body };
      addAuditLog('UPDATE_KALIBRASI', 'Kalibrasi', `Memperbarui data kalibrasi untuk ${store.calibrations[index].equipmentName}`, req);
      return res.json({ success: true, message: 'Data kalibrasi berhasil diperbarui', data: store.calibrations[index] });
    }
    res.status(404).json({ success: false, message: 'Kalibrasi tidak ditemukan' });
  });

  app.delete('/api/kalibrasi/:id', (req, res) => {
    const { id } = req.params;
    const index = store.calibrations.findIndex(c => c.id === id);
    if (index !== -1) {
      const cal = store.calibrations[index];
      store.calibrations.splice(index, 1);
      addAuditLog('HAPUS_KALIBRASI', 'Kalibrasi', `Menghapus data kalibrasi untuk ${cal.equipmentName}`, req);
      return res.json({ success: true, message: 'Kalibrasi berhasil dihapus' });
    }
    res.status(404).json({ success: false, message: 'Kalibrasi tidak ditemukan' });
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

  app.post('/api/teknisi', (req, res) => {
    const newTech = {
      ...req.body,
      id: `tech-${Date.now()}`,
      activeWorkload: req.body.activeWorkload || 0,
      completedTasksCount: req.body.completedTasksCount || 0,
      performanceScore: req.body.performanceScore || 100
    };
    store.technicians.push(newTech);
    addAuditLog('TAMBAH_TEKNISI', 'Teknisi', `Menambah teknisi baru: ${newTech.name}`, req);
    res.json({ success: true, message: 'Teknisi berhasil ditambahkan', data: newTech });
  });

  app.put('/api/teknisi/:id', (req, res) => {
    const { id } = req.params;
    const index = store.technicians.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      store.technicians[index] = { ...store.technicians[index], ...req.body };
      addAuditLog('UPDATE_TEKNISI', 'Teknisi', `Memperbarui data teknisi: ${store.technicians[index].name}`, req);
      return res.json({ success: true, message: 'Teknisi berhasil diperbarui', data: store.technicians[index] });
    }
    res.status(404).json({ success: false, message: 'Teknisi tidak ditemukan' });
  });

  app.delete('/api/teknisi/:id', (req, res) => {
    const { id } = req.params;
    const index = store.technicians.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      const tech = store.technicians[index];
      store.technicians.splice(index, 1);
      addAuditLog('HAPUS_TEKNISI', 'Teknisi', `Menghapus teknisi: ${tech.name}`, req);
      return res.json({ success: true, message: 'Teknisi berhasil dihapus' });
    }
    res.status(404).json({ success: false, message: 'Teknisi tidak ditemukan' });
  });

  // 9. Ruangan Endpoints
  app.get('/api/ruangan', (req, res) => {
    res.json({ success: true, data: store.rooms });
  });

  app.post('/api/ruangan', (req, res) => {
    const newRoom = {
      ...req.body,
      id: `rm-${Date.now()}`,
      equipmentCount: req.body.equipmentCount || 0
    };
    store.rooms.push(newRoom);
    addAuditLog('TAMBAH_RUANGAN', 'Ruangan', `Menambah ruangan baru: ${newRoom.name}`, req);
    res.json({ success: true, message: 'Ruangan berhasil ditambahkan', data: newRoom });
  });

  app.put('/api/ruangan/:id', (req, res) => {
    const { id } = req.params;
    const index = store.rooms.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      store.rooms[index] = { ...store.rooms[index], ...req.body };
      addAuditLog('UPDATE_RUANGAN', 'Ruangan', `Memperbarui data ruangan: ${store.rooms[index].name}`, req);
      return res.json({ success: true, message: 'Ruangan berhasil diperbarui', data: store.rooms[index] });
    }
    res.status(404).json({ success: false, message: 'Ruangan tidak ditemukan' });
  });

  app.delete('/api/ruangan/:id', (req, res) => {
    const { id } = req.params;
    const index = store.rooms.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      const room = store.rooms[index];
      store.rooms.splice(index, 1);
      addAuditLog('HAPUS_RUANGAN', 'Ruangan', `Menghapus ruangan: ${room.name}`, req);
      return res.json({ success: true, message: 'Ruangan berhasil dihapus' });
    }
    res.status(404).json({ success: false, message: 'Ruangan tidak ditemukan' });
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

  app.put('/api/peminjaman/:id', (req, res) => {
    const { id } = req.params;
    const index = store.loans.findIndex((l: any) => l.id === id);
    if (index !== -1) {
      store.loans[index] = { ...store.loans[index], ...req.body };
      addAuditLog('PENGEMBALIAN_ALAT', 'Peminjaman', `Memperbarui data peminjaman/kembali alat ${store.loans[index].equipmentName}`, req);
      return res.json({ success: true, message: 'Data peminjaman berhasil diperbarui', data: store.loans[index] });
    }
    res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
  });

  // 12. Documents Endpoints
  app.get('/api/documents', (req, res) => {
    res.json({ success: true, count: store.documents.length, data: store.documents });
  });

  app.post('/api/documents', (req, res) => {
    const newDoc = {
      ...req.body,
      id: `doc-${Date.now()}`,
      date: req.body.date || new Date().toISOString().slice(0, 10)
    };
    store.documents.unshift(newDoc);
    addAuditLog('UPLOAD_DOKUMEN', 'Dokumen', `Mengunggah dokumen baru: ${newDoc.title}`, req);
    res.json({ success: true, message: 'Dokumen berhasil diunggah', data: newDoc });
  });

  app.delete('/api/documents/:id', (req, res) => {
    const { id } = req.params;
    const index = store.documents.findIndex((d: any) => d.id === id);
    if (index !== -1) {
      const doc = store.documents[index];
      store.documents.splice(index, 1);
      addAuditLog('HAPUS_DOKUMEN', 'Dokumen', `Menghapus dokumen: ${doc.title}`, req);
      return res.json({ success: true, message: 'Dokumen berhasil dihapus' });
    }
    res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan' });
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
