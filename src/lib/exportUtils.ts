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
  
  // Dimensions for standard 50x30 mm stickers on A4 (3 cols x 8 rows)
  const labelWidth = labelSize === 'small' ? 40 : labelSize === 'large' ? 70 : 55;
  const labelHeight = labelSize === 'small' ? 25 : labelSize === 'large' ? 40 : 32;
  const marginX = 10;
  const marginY = 15;
  const gapX = 8;
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
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(x, y, labelWidth, labelHeight);

    // Header strip
    doc.setFillColor(2, 132, 199);
    doc.rect(x, y, labelWidth, 5, 'F');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('RS MARDI RAHAYU - IRIN', x + 2, y + 3.5);

    // QR Code
    const qrDataUrl = await generateQRCodeDataUrl(item.inventoryNo);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', x + 2, y + 7, 18, 18);
    }

    // Text details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(doc.splitTextToSize(item.name, labelWidth - 22), x + 21, y + 9);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`No: ${item.inventoryNo}`, x + 21, y + 16);
    doc.text(`Aset: ${item.assetNo}`, x + 21, y + 20);
    doc.text(`Lokasi: ${item.roomName}`, x + 21, y + 24);

    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
    itemsOnPage++;
  }

  doc.save(`Label_Inventaris_IRIN_${new Date().toISOString().slice(0, 10)}.pdf`);
}
