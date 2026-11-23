import type { Transaction } from "@/context/FinanceContext";

export interface ExportOptions {
  transactions: Transaction[];
  periodLabel: string;
  filterNote?: string;
  fileDate: string; // YYYY-MM-DD
}

const GREEN = "FF224431";
const CREAM = "FFFAF8F5";
const LINE = "FFE7EDE7";
const MUTED = "FF718576";
const RUPIAH = '"Rp"#,##0';

// Build the date in UTC so Excel shows the same calendar day in every timezone
function isoToUtcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

const thinBorder = {
  top: { style: "thin" as const, color: { argb: LINE } },
  left: { style: "thin" as const, color: { argb: LINE } },
  bottom: { style: "thin" as const, color: { argb: LINE } },
  right: { style: "thin" as const, color: { argb: LINE } },
};

export async function exportTransactionsXlsx(opts: ExportOptions): Promise<void> {
  const { transactions, periodLabel, filterNote, fileDate } = opts;
  if (transactions.length === 0) return;

  // Loaded only when the user exports, so the library does not slow down the dashboard
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Sakuwise";
  wb.created = new Date();

  // ---------- Sheet 1: Transaksi ----------
  const ws = wb.addWorksheet("Transaksi", {
    views: [{ state: "frozen", ySplit: 4 }],
  });
  ws.columns = [
    { key: "date", width: 16 },
    { key: "name", width: 34 },
    { key: "category", width: 20 },
    { key: "amount", width: 18 },
    { key: "note", width: 36 },
  ];

  ws.mergeCells("A1:E1");
  const title = ws.getCell("A1");
  title.value = "Sakuwise Â· Laporan Pengeluaran";
  title.font = { name: "Calibri", size: 16, bold: true, color: { argb: GREEN } };
  title.alignment = { vertical: "middle" };
  ws.getRow(1).height = 28;

  ws.mergeCells("A2:E2");
  const subtitle = ws.getCell("A2");
  subtitle.value =
    `Periode: ${periodLabel}` + (filterNote ? ` Â· ${filterNote}` : "") + ` Â· Diekspor ${fileDate}`;
  subtitle.font = { name: "Calibri", size: 10, color: { argb: MUTED } };

  const headerRow = ws.getRow(4);
  headerRow.values = ["Tanggal", "Deskripsi", "Kategori", "Jumlah", "Catatan"];
  headerRow.height = 22;
  headerRow.eachCell((cell, col) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREEN } };
    cell.alignment = { vertical: "middle", horizontal: col === 4 ? "right" : "left" };
    cell.border = thinBorder;
  });

  const first = 5;
  transactions.forEach((t, i) => {
    const row = ws.getRow(first + i);
    row.values = [isoToUtcDate(t.date), t.name, t.category, t.amount, t.note ?? ""];
    row.getCell(1).numFmt = "dd mmm yyyy";
    row.getCell(1).alignment = { horizontal: "left" };
    row.getCell(4).numFmt = RUPIAH;
    row.getCell(5).alignment = { wrapText: true, vertical: "top" };
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { name: "Calibri", size: 11, color: { argb: "FF1E3A2B" } };
      cell.border = thinBorder;
      if (i % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
      }
    });
  });

  const last = first + transactions.length - 1;
  const total = transactions.reduce((s, t) => s + t.amount, 0);

  const totalRow = ws.getRow(last + 1);
  totalRow.getCell(1).value = "Total";
  totalRow.getCell(4).value = { formula: `SUM(D${first}:D${last})`, result: total };
  totalRow.getCell(4).numFmt = RUPIAH;
  totalRow.height = 22;
  for (let c = 1; c <= 5; c += 1) {
    const cell = totalRow.getCell(c);
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: GREEN } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8EFEA" } };
    cell.border = {
      ...thinBorder,
      top: { style: "medium", color: { argb: GREEN } },
    };
    cell.alignment = { vertical: "middle" };
  }

  ws.autoFilter = { from: "A4", to: `E${last}` };
  ws.pageSetup = { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  // ---------- Sheet 2: Per Kategori ----------
  const byCategory = new Map<string, { count: number; sum: number }>();
  for (const t of transactions) {
    const cur = byCategory.get(t.category) ?? { count: 0, sum: 0 };
    byCategory.set(t.category, { count: cur.count + 1, sum: cur.sum + t.amount });
  }
  const cats = [...byCategory.entries()].sort((a, b) => b[1].sum - a[1].sum);

  const ws2 = wb.addWorksheet("Per Kategori", { views: [{ state: "frozen", ySplit: 3 }] });
  ws2.columns = [{ width: 24 }, { width: 18 }, { width: 20 }, { width: 12 }];

  ws2.mergeCells("A1:D1");
  const t2 = ws2.getCell("A1");
  t2.value = "Ringkasan per Kategori";
  t2.font = { name: "Calibri", size: 16, bold: true, color: { argb: GREEN } };
  ws2.getRow(1).height = 28;

  const h2 = ws2.getRow(3);
  h2.values = ["Kategori", "Jumlah transaksi", "Total", "Porsi"];
  h2.height = 22;
  h2.eachCell((cell, col) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREEN } };
    cell.alignment = { vertical: "middle", horizontal: col === 1 ? "left" : "right" };
    cell.border = thinBorder;
  });

  const catFirst = 4;
  const catLast = catFirst + cats.length - 1;
  const rangeCat = `Transaksi!$C$${first}:$C$${last}`;
  const rangeAmt = `Transaksi!$D$${first}:$D$${last}`;
  const totalRef = `$C$${catLast + 1}`;

  cats.forEach(([name, v], i) => {
    const r = catFirst + i;
    const row = ws2.getRow(r);
    row.getCell(1).value = name;
    row.getCell(2).value = { formula: `COUNTIF(${rangeCat},A${r})`, result: v.count };
    row.getCell(3).value = { formula: `SUMIF(${rangeCat},A${r},${rangeAmt})`, result: v.sum };
    row.getCell(4).value = { formula: `C${r}/${totalRef}`, result: total > 0 ? v.sum / total : 0 };
    row.getCell(3).numFmt = RUPIAH;
    row.getCell(4).numFmt = "0.0%";
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.font = { name: "Calibri", size: 11, color: { argb: "FF1E3A2B" } };
      cell.border = thinBorder;
      cell.alignment = { horizontal: col === 1 ? "left" : "right" };
      if (i % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
      }
    });
  });

  const t2Row = ws2.getRow(catLast + 1);
  t2Row.getCell(1).value = "Total";
  t2Row.getCell(2).value = { formula: `SUM(B${catFirst}:B${catLast})`, result: transactions.length };
  t2Row.getCell(3).value = { formula: `SUM(C${catFirst}:C${catLast})`, result: total };
  t2Row.getCell(4).value = { formula: `SUM(D${catFirst}:D${catLast})`, result: total > 0 ? 1 : 0 };
  t2Row.getCell(3).numFmt = RUPIAH;
  t2Row.getCell(4).numFmt = "0.0%";
  t2Row.height = 22;
  for (let c = 1; c <= 4; c += 1) {
    const cell = t2Row.getCell(c);
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: GREEN } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8EFEA" } };
    cell.border = { ...thinBorder, top: { style: "medium", color: { argb: GREEN } } };
    cell.alignment = { vertical: "middle", horizontal: c === 1 ? "left" : "right" };
  }

  // ---------- Download ----------
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sakuwise-transaksi-${fileDate}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
