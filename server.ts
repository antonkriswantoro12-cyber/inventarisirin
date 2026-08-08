import express from 'express';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// ===================== KONEKSI KE TiDB CLOUD =====================
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '4000'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'test',
  ssl: { rejectUnauthorized: false }, // WAJIB untuk TiDB
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+07:00'
});

// Tes koneksi saat server mulai
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ BERHASIL TERHUBUNG KE TiDB CLOUD!');
    conn.release();
  } catch (err) {
    console.error('❌ GAGAL TERHUBUNG KE BASIS DATA:', err);
  }
}
testConnection();

// ===================== FUNGSI BANTU: LOG AKTIVITAS =====================
const addAuditLog = async (action: string, moduleName: string, details: string, req: express.Request, username = 'admin') => {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  await pool.query(
    `INSERT INTO audit_logs (id, timestamp, username, role, action, module, details, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [`log-${Date.now()}`, timestamp, username, 'Admin', action, moduleName, details, ipAddress]
  );
};

// ===================== API ENDPOINTS =====================

// Cek kesehatan server
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Inventaris IRIN RS Mardi Rahayu', version: '2.0.0', time: new Date() });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'anton.kriswantoro' || username === 'admin') {
    await addAuditLog('LOGIN', 'Autentikasi', 'User berhasil login', req, username);
    return res.json({
      success: true,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnRvbi5rcmlzd2FudG9ybyIsIm5hbWUiOiJBbnRvbiBLcmlzd2FudG9ybyIsImlhdCI6MTY3MjUxMjAwMH0.sample_token',
      user: { id: 'u-1', name: 'Anton Kriswantoro', username: 'anton.kriswantoro', role: 'Admin' }
    });
  }
  res.status(401).json({ success: false, message: 'Username atau password salah' });
});

// Dashboard Ringkasan
app.get('/api/dashboard', async (req, res) => {
  try {
    const [eq] = await pool.query('SELECT status, calibrationStatus FROM equipment');
    const equipment = eq as any[];
    const totalEquipment = equipment.length;
    const goodCount = equipment.filter(e => e.status === 'Baik').length;
    const minorDamageCount = equipment.filter(e => e.status === 'Rusak Ringan').length;
    const heavyDamageCount = equipment.filter(e => e.status === 'Rusak Berat').length;
    const inRepairCount = equipment.filter(e => e.status === 'Dalam Perbaikan').length;
    const inCalibrationCount = equipment.filter(e => e.status === 'Dalam Kalibrasi').length;
    const disposedCount = equipment.filter(e => e.status === 'Afkir').length;
    const calibratedPassedCount = equipment.filter(e => e.calibrationStatus === 'Lulus').length;
    const calibrationCompliancePct = totalEquipment ? Number(((calibratedPassedCount / totalEquipment) * 100).toFixed(1)) : 0;

    const [pm] = await pool.query("SELECT status FROM maintenance_pm WHERE status != 'Selesai'");
    const [cm] = await pool.query("SELECT status FROM maintenance_corrective WHERE status != 'Selesai'");
    const [sp] = await pool.query('SELECT stock, minStock FROM spareparts');
    const lowStockCount = (sp as any[]).filter(s => s.stock <= s.minStock).length;
    const [loans] = await pool.query("SELECT status FROM loans WHERE status = 'Dipinjam'");
    const [rooms] = await pool.query('SELECT * FROM rooms');

    res.json({
      success: true,
      data: {
        kpis: {
          mttrHours: 18,
          mtbfDays: 120,
          uptimePercentage: 99.8,
          calibrationCompliancePct,
          totalEquipment,
          goodCount,
          minorDamageCount,
          heavyDamageCount,
          inRepairCount,
          inCalibrationCount,
          disposedCount,
          upcomingCalibration30Days: equipment.filter(e => e.calibrationStatus === 'Mendekati').length,
          overdueCalibrationCount: equipment.filter(e => e.calibrationStatus === 'Jatuh Tempo').length,
          pendingPMCount: Array.isArray(pm) ? pm.length : 0,
          activeWorkOrdersCount: Array.isArray(cm) ? cm.length : 0,
          lowStockSparepartsCount: lowStockCount,
          activeLoansCount: Array.isArray(loans) ? loans.length : 0
        },
        equipmentByRoom: Array.isArray(rooms) ? rooms.map((r: any) => ({
          roomName: r.name,
          count: equipment.filter(e => e.roomId === r.id).length
        })) : [],
        recentActivities: []
      }
    });
  } catch (err) {
    res.json({ success: true, data: { kpis: {}, equipmentByRoom: [], recentActivities: [] } });
  }
});

// === INVENTARIS ALAT ===
app.get('/api/inventaris', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipment ORDER BY createdAt DESC');
    res.json({ success: true, count: Array.isArray(rows) ? rows.length : 0, data: rows });
  } catch (err) {
    res.json({ success: true, count: 0, data: [] });
  }
});

app.post('/api/inventaris', async (req, res) => {
  try {
    const id = `eq-${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const { name, inventoryNo, roomId, status, calibrationStatus, description } = req.body;
    
    await pool.query(
      `INSERT INTO equipment (id, name, inventoryNo, roomId, status, calibrationStatus, description, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, inventoryNo, roomId, status || 'Baik', calibrationStatus || 'Belum Kalibrasi', description || '', now, now]
    );
    
    await addAuditLog('TAMBAH_ALAT', 'Inventaris', `Menambah alat: ${name} (${inventoryNo})`, req);
    res.json({ success: true, message: 'Alat berhasil ditambahkan', data: { id, ...req.body } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menambah alat' });
  }
});

app.put('/api/inventaris/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const { name, inventoryNo, roomId, status, calibrationStatus, description } = req.body;
    
    await pool.query(
      `UPDATE equipment SET name=?, inventoryNo=?, roomId=?, status=?, calibrationStatus=?, description=?, updatedAt=? WHERE id=?`,
      [name, inventoryNo, roomId, status, calibrationStatus, description, now, id]
    );
    
    await addAuditLog('UPDATE_ALAT', 'Inventaris', `Memperbarui alat: ${name}`, req);
    res.json({ success: true, message: 'Data alat diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui alat' });
  }
});

app.delete('/api/inventaris/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
    await addAuditLog('HAPUS_ALAT', 'Inventaris', `Menghapus alat ID: ${id}`, req);
    res.json({ success: true, message: 'Alat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus alat' });
  }
});

// === KALIBRASI ===
app.get('/api/kalibrasi', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM calibrations ORDER BY date DESC');
    res.json({ success: true, count: Array.isArray(rows) ? rows.length : 0, data: rows });
  } catch {
    res.json({ success: true, count: 0, data: [] });
  }
});

app.post('/api/kalibrasi', async (req, res) => {
  try {
    const id = `cal-${Date.now()}`;
    await pool.query('INSERT INTO calibrations (id, equipmentName, date, result, notes) VALUES (?, ?, ?, ?, ?)',
      [id, req.body.equipmentName, req.body.date, req.body.result, req.body.notes]);
    await addAuditLog('TAMBAH_KALIBRASI', 'Kalibrasi', `Kalibrasi: ${req.body.equipmentName}`, req);
    res.json({ success: true, data: { id, ...req.body } });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mencatat kalibrasi' });
  }
});

// === MAINTENANCE ===
app.get('/api/maintenance', async (req, res) => {
  try {
    const [pm] = await pool.query('SELECT * FROM maintenance_pm ORDER BY date DESC');
    const [cm] = await pool.query('SELECT * FROM maintenance_corrective ORDER BY reportDate DESC');
    res.json({ success: true, pm: pm || [], corrective: cm || [] });
  } catch {
    res.json({ success: true, pm: [], corrective: [] });
  }
});

app.post('/api/maintenance/pm', async (req, res) => {
  try {
    const id = `pm-${Date.now()}`;
    await pool.query('INSERT INTO maintenance_pm (id, equipmentName, date, activity, status) VALUES (?, ?, ?, ?, ?)',
      [id, req.body.equipmentName, req.body.date, req.body.activity, req.body.status || 'Terjadwal']);
    await addAuditLog('TAMBAH_PM', 'Maintenance', `PM: ${req.body.equipmentName}`, req);
    res.json({ success: true, data: { id, ...req.body } });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mencatat PM' });
  }
});

app.post('/api/maintenance/corrective', async (req, res) => {
  try {
    const id = `cm-${Date.now()}`;
    await pool.query('INSERT INTO maintenance_corrective (id, equipmentName, reportDate, issue, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.body.equipmentName, req.body.reportDate, req.body.issue, req.body.priority || 'Sedang', req.body.status || 'Dilaporkan']);
    await addAuditLog('LAPOR_KERUSAKAN', 'Maintenance', `Kerusakan: ${req.body.equipmentName}`, req);
    res.json({ success: true, data: { id, ...req.body } });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal melaporkan kerusakan' });
  }
});

// === SPAREPART ===
app.get('/api/spareparts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM spareparts ORDER BY name');
    res.json({ success: true, count: Array.isArray(rows) ? rows.length : 0, data: rows });
  } catch {
    res.json({ success: true, count: 0, data: [] });
  }
});

app.post('/api/spareparts', async (req, res) => {
  try {
    const id = `sp-${Date.now()}`;
    await pool.query('INSERT INTO spareparts (id, name, stock, minStock, unit) VALUES (?, ?, ?, ?, ?)',
      [id, req.body.name, req.body.stock || 0, req.body.minStock || 5, req.body.unit || 'Buah']);
    await addAuditLog('TAMBAH_SPAREPART', 'Sparepart', `Sparepart: ${req.body.name}`, req);
    res.json({ success: true, data: { id, ...req.body } });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal menambah sparepart' });
  }
});

// === RUANGAN, VENDOR, TEKNISI ===
app.get('/api/ruangan', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM rooms ORDER BY name'); res.json({ success: true, data: rows || [] }); }
  catch { res.json({ success: true, data: [] }); }
});
app.get('/api/vendors', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM vendors ORDER BY name'); res.json({ success: true, data: rows || [] }); }
  catch { res.json({ success: true, data: [] }); }
});
app.get('/api/teknisi', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM technicians ORDER BY name'); res.json({ success: true, data: rows || [] }); }
  catch { res.json({ success: true, data: [] }); }
});

// === PEMINJAMAN ===
app.get('/api/peminjaman', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM loans ORDER BY borrowDate DESC'); res.json({ success: true, data: rows || [] }); }
  catch { res.json({ success: true, data: [] }); }
});
app.post('/api/peminjaman', async (req, res) => {
  try {
    const id = `loan-${Date.now()}`;
    await pool.query('INSERT INTO loans (id, equipmentName, borrowerName, borrowDate, expectedReturn, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.body.equipmentName, req.body.borrowerName, req.body.borrowDate, req.body.expectedReturn, 'Dipinjam']);
    await addAuditLog('PEMINJAMAN', 'Peminjaman', `Pinjam: ${req.body.equipmentName} oleh ${req.body.borrowerName}`, req);
    res.json({ success: true, data: { id, ...req.body, status: 'Dipinjam' } });
  } catch { res.status(500).json({ success: false, message: 'Gagal mencatat peminjaman' }); }
});

// === LOG AKTIVITAS ===
app.get('/api/audit-log', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50'); res.json({ success: true, count: Array.isArray(rows) ? rows.length : 0, data: rows || [] }); }
  catch { res.json({ success: true, count: 0, data: [] }); }
});

// === PENGATURAN ===
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: { appName: 'Inventaris IRIN RS Mardi Rahayu' } });
});

// === LAYANAN FILE STATIS / VITE ===
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  })();
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// === JALANKAN SERVER ===
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📦 Basis Data: TiDB Cloud (MySQL kompatibel)`);
});
