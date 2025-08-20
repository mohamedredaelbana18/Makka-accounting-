import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';

type TableRow = (string | number)[];

export class ExportService {
  static async toExcel({ columns, rows, title }: { columns: string[]; rows: TableRow[]; title: string; }) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(title);
    sheet.addRow(columns);
    rows.forEach((r) => sheet.addRow(r));
    const buf = await workbook.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  static async toPdf({ columns, rows, title }: { columns: string[]; rows: TableRow[]; title: string; }) {
    const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/>`
      + `<style>body{font-family: sans-serif} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;padding:6px;text-align:right}</style>`
      + `</head><body><h2>${title}</h2><table><thead><tr>${columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead>`
      + `<tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    return Buffer.from(pdf);
  }
}

