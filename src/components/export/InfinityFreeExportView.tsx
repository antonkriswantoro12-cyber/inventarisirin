import React, { useState } from 'react';
import { Server, Download, FileCode, CheckCircle2, Copy, Sparkles, FolderArchive, HelpCircle } from 'lucide-react';

export const InfinityFreeExportView: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const dbPhpCode = `<?php
// config/database.php - RS Mardi Rahayu Kudus (InfinityFree MySQL Config)
define('DB_HOST', 'sqlxxx.epizy.com'); // Host MySQL dari cPanel InfinityFree
define('DB_USER', 'epiz_34123456');    // Username MySQL InfinityFree
define('DB_PASS', 'PasswordKamu123');  // Password MySQL InfinityFree
define('DB_NAME', 'epiz_34123456_irin_db'); // Nama Database MySQL

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die("Koneksi Database InfinityFree Gagal: " . $e->getMessage());
}
?>`;

  const sqlSchemaCode = `-- SCHEMA DATABASE MYSQL RS MARDI RAHAYU (SIAP UNTUK PHPMYADMIN INFINITYFREE)
CREATE TABLE IF NOT EXISTS \`equipment\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`inventory_no\` VARCHAR(100) NOT NULL UNIQUE,
  \`asset_no\` VARCHAR(100) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`brand\` VARCHAR(100),
  \`model_no\` VARCHAR(100),
  \`serial_no\` VARCHAR(100),
  \`category\` VARCHAR(100),
  \`room_name\` VARCHAR(100),
  \`status\` VARCHAR(50),
  \`purchase_year\` INT,
  \`purchase_price\` DECIMAL(15,2),
  \`next_calibration_date\` DATE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`calibrations\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`equipment_id\` VARCHAR(50),
  \`scheduled_date\` DATE,
  \`due_date\` DATE,
  \`vendor_name\` VARCHAR(100),
  \`result\` VARCHAR(50),
  \`certificate_no\` VARCHAR(100),
  FOREIGN KEY (\`equipment_id\`) REFERENCES \`equipment\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadZipPackage = () => {
    const zipContent = `=== PAKET CODING PHP NATIVE 8.X + MYSQL UTK INFINITYFREE ===\n\n1. UNGGAH DATABASE schema.sql KE PHPMYADMIN INFINITYFREE\n2. UBAH CREDENTIAL DB PADA config/database.php\n3. UPLOAD SELURUH FOLDER HTDOCS VUA FILE ZILLA FTP\n\n=== FILE config/database.php ===\n${dbPhpCode}\n\n=== FILE schema.sql ===\n${sqlSchemaCode}`;
    const blob = new Blob([zipContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'InfinityFree_PHP_Native_RSMR_Package.txt';
    link.click();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Server className="w-6 h-6 text-emerald-600" />
            <span>Ekspor Kode PHP Native 8.x Siap Unggah InfinityFree</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ekspor struktur folder PHP Native, script `schema.sql` phpMyAdmin, dan `config/database.php` untuk hosting gratis InfinityFree
          </p>
        </div>

        <button
          onClick={handleDownloadZipPackage}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Kode PHP & SQL (.txt / ZIP)</span>
        </button>
      </div>

      {/* Steps to Deploy to InfinityFree */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-7 h-7 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center justify-center">
            1
          </div>
          <h3 className="font-bold text-slate-800">Buat Database MySQL</h3>
          <p className="text-slate-500 leading-relaxed">
            Buka cPanel InfinityFree &gt; MySQL Databases. Buat nama database baru (contoh: <code>epiz_34123456_irin_db</code>).
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-7 h-7 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center justify-center">
            2
          </div>
          <h3 className="font-bold text-slate-800">Impor SQL ke phpMyAdmin</h3>
          <p className="text-slate-500 leading-relaxed">
            Buka phpMyAdmin di cPanel InfinityFree, lalu salin dan eksekusi kode <code>schema.sql</code> di bawah ini.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-7 h-7 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center justify-center">
            3
          </div>
          <h3 className="font-bold text-slate-800">Upload via FTP / File Manager</h3>
          <p className="text-slate-500 leading-relaxed">
            Unggah seluruh file ke dalam folder <code>/htdocs/</code> di InfinityFree menggunakan FileZilla atau File Manager cPanel.
          </p>
        </div>
      </div>

      {/* Code Snippet Displays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PHP Config Snippet */}
        <div className="bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-800 text-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono text-xs font-bold text-sky-400">config/database.php</span>
            <button
              onClick={() => handleCopy(dbPhpCode, 'dbPhp')}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedFile === 'dbPhp' ? 'Tersalin!' : 'Salin Kode PHP'}</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-emerald-400 overflow-x-auto p-3 bg-slate-950 rounded-xl leading-relaxed">
            {dbPhpCode}
          </pre>
        </div>

        {/* MySQL Schema Snippet */}
        <div className="bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-800 text-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono text-xs font-bold text-amber-400">schema.sql (phpMyAdmin)</span>
            <button
              onClick={() => handleCopy(sqlSchemaCode, 'sqlSchema')}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedFile === 'sqlSchema' ? 'Tersalin!' : 'Salin SQL'}</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-amber-300 overflow-x-auto p-3 bg-slate-950 rounded-xl leading-relaxed">
            {sqlSchemaCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
