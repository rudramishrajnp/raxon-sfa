import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as reportsService from './reports.service.js';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/export.util.js';

const handleExport = (res: Response, format: string, filename: string, data: any[], title: string) => {
  if (format === 'csv') return exportToCSV(res, filename, data);
  if (format === 'excel') return exportToExcel(res, filename, data);
  if (format === 'pdf') return exportToPDF(res, filename, data, title);
  return res.status(200).json({ data });
};

export const getDailyDCRReport = async (req: AuthRequest, res: Response) => {
  try {
    const date = req.query.date as string || new Date().toISOString().split('T')[0];
    const format = (req.query.export as string) || 'json';
    const data = await reportsService.getDailyDCRReport(date);
    return handleExport(res, format, `DCR_Report_${date}`, data, `Daily DCR Report - ${date}`);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const getAttendanceReport = async (req: AuthRequest, res: Response) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    if (!startDate || !endDate) return res.status(400).json({ error: 'startDate and endDate required' });
    
    const format = (req.query.export as string) || 'json';
    const data = await reportsService.getAttendanceReport(startDate, endDate);
    return handleExport(res, format, `Attendance_${startDate}_${endDate}`, data, `Attendance Report`);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const getExpenseReport = async (req: AuthRequest, res: Response) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const format = (req.query.export as string) || 'json';
    const data = await reportsService.getExpenseReport(month, year);
    return handleExport(res, format, `Expense_Report_${month}_${year}`, data, `Expense Report`);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const getSecondarySalesReport = async (req: AuthRequest, res: Response) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    if (!startDate || !endDate) return res.status(400).json({ error: 'startDate and endDate required' });
    
    const format = (req.query.export as string) || 'json';
    const data = await reportsService.getSecondarySalesReport(startDate, endDate);
    return handleExport(res, format, `Sales_${startDate}_${endDate}`, data, `Secondary Sales Report`);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const getStockReport = async (req: AuthRequest, res: Response) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const format = (req.query.export as string) || 'json';
    const data = await reportsService.getStockReport(month, year);
    return handleExport(res, format, `Stock_Report_${month}_${year}`, data, `Stock Report`);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};
