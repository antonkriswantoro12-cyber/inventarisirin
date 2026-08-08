import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

export interface ExportColumn {
  header: string;
  key: string;
}

/**
 * Export array of objects to Excel .xlsx file
 */
export function exportToExcel(data: any[], fileName: string, sheetName = 'Data') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Export array of objects to CSV file
 */
export function exportToCSV(data: any[], fileName: string) {
  if (!data || !data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export array of objects to a styled PDF table document
 */
export function exportToPDF(
  title: string,
  columns: ExportColumn[],
  data: any[],
  fileName: string
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  
  // Header section
  doc.setFontSize(16);
  doc.setTextColor(2, 132, 199); // Medical blue
  doc.text('RS MARDI RAHAYU KUDUS - INSTALASI IRIN', 14, 15);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(title.toUpperCase(), 14, 23);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 29);

  const tableHead = [columns.map(c => c.header)];
  const tableBody = data.map(item => columns.map(c => item[c.key] ?? '-'));

  autoTable(doc, {
    startY: 34,
    head: tableHead,
    body: tableBody,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  doc.save(`${fileName}.pdf`);
}

/**
 * Generate a Data URL for 1D Barcode (Code 128) image
 */
export function generateBarcodeDataUrl(text: string): string {
  const CODE128_PATTERNS = [
    "212221", "222121", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
    "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
    "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
    "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
    "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
  ];

  const codeIndices: number[] = [104]; // Start B
  let checksum = 104;

  const safeText = text.trim() || 'IRIN-001';
  for (let i = 0; i < safeText.length; i++) {
    let charCode = safeText.charCodeAt(i) - 32;
    if (charCode < 0 || charCode > 94) charCode = 31; // Fallback '?'
    codeIndices.push(charCode);
    checksum += charCode * (i + 1);
  }

  const checkDigit = checksum % 103;
  codeIndices.push(checkDigit);
  codeIndices.push(106); // Stop

  let patternStr = "";
  for (const idx of codeIndices) {
    patternStr += CODE128_PATTERNS[idx] || "";
  }

  let totalModules = 0;
  for (let i = 0; i < patternStr.length; i++) {
    totalModules += parseInt(patternStr[i], 10);
  }

  const quietZone = 8;
  const moduleWidth = 2;
  const barcodeHeight = 45;
  const canvasWidth = (totalModules * moduleWidth) + (quietZone * 2);
  const canvasHeight = barcodeHeight + 18;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Bars
  ctx.fillStyle = '#000000';
  let currentX = quietZone;
  let isBar = true;

  for (let i = 0; i < patternStr.length; i++) {
    const width = parseInt(patternStr[i], 10) * moduleWidth;
    if (isBar) {
      ctx.fillRect(currentX, 4, width, barcodeHeight);
    }
    currentX += width;
    isBar = !isBar;
  }

  // Label text under barcode
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText(safeText, canvasWidth / 2, barcodeHeight + 14);

  return canvas.toDataURL('image/png');
}

/**
 * Generate a Data URL for QR Code image
 */
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 250,
      color: {
        dark: '#0284c7',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Print QR/Barcode Labels to PDF (Batch or Single)
 */
export async function generateLabelsPDF(
  items: { inventoryNo: string; name: string; assetNo: string; roomName: string }[],
  labelSize: 'standard' | 'small' | 'large' = 'standard'
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // Dimensions for standard stickers on A4
  const labelWidth = labelSize === 'small' ? 42 : labelSize === 'large' ? 75 : 60;
  const labelHeight = labelSize === 'small' ? 28 : labelSize === 'large' ? 45 : 36;
  const marginX = 8;
  const marginY = 12;
  const gapX = 6;
  const gapY = 6;
  
  const cols = Math.floor((210 - marginX * 2) / (labelWidth + gapX));

  let col = 0;
  let row = 0;
  let itemsOnPage = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (itemsOnPage > 0 && col === 0 && row >= Math.floor((297 - marginY * 2) / (labelHeight + gapY))) {
      doc.addPage();
      row = 0;
      col = 0;
    }

    const x = marginX + col * (labelWidth + gapX);
    const y = marginY + row * (labelHeight + gapY);

    // Draw label border box
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.rect(x, y, labelWidth, labelHeight);

    // Header strip
    doc.setFillColor(2, 132, 199);
    doc.rect(x, y, labelWidth, 5.5, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('RS MARDI RAHAYU - IRIN / ATEM', x + labelWidth / 2, y + 3.8, { align: 'center' });

    // 2D QR Code
    const qrDataUrl = await generateQRCodeDataUrl(item.inventoryNo);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', x + 2, y + 7.5, 16, 16);
    }

    // 1D Barcode image
    const barcodeDataUrl = generateBarcodeDataUrl(item.inventoryNo);
    if (barcodeDataUrl) {
      doc.addImage(barcodeDataUrl, 'PNG', x + 2, y + 24.5, labelWidth - 4, 9.5);
    }

    // Text details
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(doc.splitTextToSize(item.name, labelWidth - 20), x + 19, y + 9.5);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Kode: ${item.inventoryNo}`, x + 19, y + 16);
    doc.text(`Aset: ${item.assetNo}`, x + 19, y + 19.5);
    doc.text(`Ruang: ${item.roomName}`, x + 19, y + 23);

    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
    itemsOnPage++;
  }

  doc.save(`Label_Stiker_Aset_IRIN_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generate official SOP PDF document formatted with Kop Surat, steps, and approval signatures
 */
export function exportSOPToPDF(sop: {
  docNo: string;
  title: string;
  category: string;
  revision: string;
  effectiveDate: string;
  author: string;
  approver: string;
  purpose: string;
  scope: string;
  prerequisites?: string[];
  steps?: { stepNo: number; title: string; description: string; warning?: string }[];
  coverImage?: string;
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Kop Surat Header
  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199); // Sky Blue
  doc.setFont('helvetica', 'bold');
  doc.text('RS MARDI RAHAYU KUDUS', 105, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text('INSTALASI IRIN (INTENSIVE CARE UNIT) & PEMELIHARAAN ELEKTROMEDIS', 105, 21, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Jl. AKBP Agil Kusumadya No. 110, Kudus, Jawa Tengah | Telp: (0291) 438234', 105, 26, { align: 'center' });

  // Double Line Separator
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.8);
  doc.line(14, 29, 196, 29);
  doc.setLineWidth(0.2);
  doc.line(14, 30.5, 196, 30.5);

  // Document Box Header
  doc.setDrawColor(180, 180, 180);
  doc.rect(14, 34, 182, 28);
  doc.line(14, 48, 196, 48);
  doc.line(105, 34, 105, 62);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('DOKUMEN STANDAR OPERASIONAL PROSEDUR', 59.5, 41, { align: 'center' });
  doc.setFontSize(9);
  doc.text(sop.title.toUpperCase(), 59.5, 56, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`No. Dokumen : ${sop.docNo}`, 108, 40);
  doc.text(`No. Revisi    : ${sop.revision}`, 108, 45);
  doc.text(`Tgl. Terbit   : ${sop.effectiveDate}`, 108, 52);
  doc.text(`Kategori      : ${sop.category}`, 108, 58);

  let currentY = 68;

  // 1. TUJUAN & PENGERTIAN
  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    head: [['1. TUJUAN & PENGERTIAN']],
    body: [[sop.purpose || 'Sebagai pedoman operasional dan keselamatan penggunaan alat medis.']],
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 40] }
  });
  currentY = (doc as any).lastAutoTable.finalY + 4;

  // 2. RUANG LINGKUP & PRASYARAT
  const prereqText = sop.prerequisites && sop.prerequisites.length > 0
    ? sop.prerequisites.join(', ')
    : 'Teknisi ATEM, Perawat ICU, Dokter Spesialis, Peralatan Medis Terkalibrasi.';

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    head: [['2. RUANG LINGKUP & PRASYARAT ALAT']],
    body: [
      [`Ruang Lingkup: ${sop.scope || 'Seluruh unit perawatan intensif dan rawat inap RS Mardi Rahayu.'}`],
      [`Peralatan & Bahan: ${prereqText}`]
    ],
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 40] }
  });
  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Cover / Diagram Image
  if (sop.coverImage && sop.coverImage.startsWith('data:image')) {
    try {
      doc.addImage(sop.coverImage, 'JPEG', 14, currentY, 50, 35);
      doc.rect(14, currentY, 50, 35);
      currentY += 38;
    } catch (err) {
      console.warn('Could not render image in PDF:', err);
    }
  }

  // 3. PROSEDUR KERJA
  if (sop.steps && sop.steps.length > 0) {
    const stepRows = sop.steps.map(s => [
      `Langkah ${s.stepNo}`,
      s.title,
      s.description + (s.warning ? `\n⚠️ CATATAN KESELAMATAN: ${s.warning}` : '')
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: 14, right: 14 },
      head: [['No', 'Instruksi / Tahapan', 'Deskripsi Operasional & Keselamatan']],
      body: stepRows,
      headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 'auto' }
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  } else {
    currentY += 10;
  }

  // Signatures Block
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);

  doc.text('Disusun & Diperiksa Oleh:', 30, currentY);
  doc.text('Disetujui & Disahkan Oleh:', 140, currentY);

  currentY += 18;
  doc.setFont('helvetica', 'normal');
  doc.text(`(${sop.author || 'Teknisi Elektromedis / ATEM'})`, 30, currentY);
  doc.text(`(${sop.approver || 'Kepala Instalasi IRIN'})`, 140, currentY);

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('SOP Resmi Rumah Sakit Mardi Rahayu - Dokumen Terkontrol Digital', 105, 287, { align: 'center' });

  doc.save(`SOP_${sop.docNo.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`);
}

/**
 * Generate official Work Order PDF for PM / Corrective Maintenance
 */
export function exportWorkOrderToPDF(data: {
  type: 'PM' | 'CM';
  woNo: string;
  equipmentName: string;
  inventoryNo: string;
  roomName: string;
  date: string;
  technicianName: string;
  reportedBy?: string;
  problem?: string;
  actionTaken?: string;
  status: string;
  sparepartsCost?: number;
  laborCost?: number;
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Kop Header
  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199);
  doc.setFont('helvetica', 'bold');
  doc.text('RS MARDI RAHAYU KUDUS', 105, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`LEMBAR KERJA WORK ORDER ${data.type === 'PM' ? 'PEMELIHARAAN PREVENTIF (PM)' : 'PERBAIKAN PERALATAN (CM)'}`, 105, 21, { align: 'center' });

  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.8);
  doc.line(14, 26, 196, 26);

  // Table Details
  autoTable(doc, {
    startY: 30,
    margin: { left: 14, right: 14 },
    head: [['PARAMETER KERJA', 'DETAIL DOKUMEN']],
    body: [
      ['No. Work Order', data.woNo || `WO-${Date.now()}`],
      ['Tanggal Pelaksanaan', data.date],
      ['Nama Alat Medis', data.equipmentName],
      ['No. Inventaris', data.inventoryNo],
      ['Lokasi Ruangan', data.roomName],
      ['Pelapor / Pengaju', data.reportedBy || 'Perawat Ruangan'],
      ['Teknisi Penanggung Jawab', data.technicianName],
      ['Status Pekerjaan', data.status],
      ['Uraian Kerusakan / Tugas', data.problem || 'Pemeliharaan Rutin'],
      ['Tindakan & Solusi', data.actionTaken || 'Pemeriksaan fungsi, pembersihan, dan kalibrasi internal.']
    ],
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Teknisi Elektromedis,', 30, finalY);
  doc.text('Kepala Ruangan / User,', 140, finalY);

  doc.setFont('helvetica', 'normal');
  doc.text(`(${data.technicianName})`, 30, finalY + 20);
  doc.text(`(${data.reportedBy || 'Kepala Ruangan'})`, 140, finalY + 20);

  doc.save(`WorkOrder_${data.type}_${data.inventoryNo}.pdf`);
}

