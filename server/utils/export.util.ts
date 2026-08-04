import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

export const exportToCSV = (res: Response, filename: string, data: any[]) => {
  if (!data || !data.length) {
    return res.status(404).send('No data to export');
  }
  const parser = new Parser();
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(`${filename}.csv`);
  return res.send(csv);
};

export const exportToExcel = async (res: Response, filename: string, data: any[]) => {
  if (!data || !data.length) {
    return res.status(404).send('No data to export');
  }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  const keys = Object.keys(data[0]);
  worksheet.columns = keys.map(key => ({ header: key, key }));

  data.forEach(row => worksheet.addRow(row));

  res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.attachment(`${filename}.xlsx`);
  
  await workbook.xlsx.write(res);
  res.end();
};

export const exportToPDF = (res: Response, filename: string, data: any[], title: string) => {
  if (!data || !data.length) {
    return res.status(404).send('No data to export');
  }

  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  res.header('Content-Type', 'application/pdf');
  res.attachment(`${filename}.pdf`);
  doc.pipe(res);

  doc.fontSize(16).text(title, { align: 'center' });
  doc.moveDown();

  doc.fontSize(10);
  data.forEach(row => {
    doc.text(JSON.stringify(row));
    doc.moveDown(0.5);
  });

  doc.end();
};
