import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as masterService from './master.service.js';

export const getDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const data = await masterService.getDoctors();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

export const getChemists = async (req: AuthRequest, res: Response) => {
  try {
    const data = await masterService.getChemists();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch chemists' });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const data = await masterService.getProducts();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const requestDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = await masterService.requestDoctor(userId, req.body);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to request doctor' });
  }
};

export const requestChemist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = await masterService.requestChemist(userId, req.body);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to request chemist' });
  }
};
