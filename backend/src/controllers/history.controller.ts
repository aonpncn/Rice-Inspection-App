import { Request, Response } from 'express';
import { calculateInspectionResult } from '@/services/inspection.service';
import { History } from '@/types/inspection';
import { v4 as uuidv4 } from 'uuid';

const historyDb: History[] = []; // Mock DB

export const createHistory = (req: Request, res: Response) => {
  const { name, standardID, note } = req.body;

  try {
    const result = calculateInspectionResult(standardID);
    const history: History = {
      id: uuidv4(),
      name,
      createDate: new Date().toISOString(),
      inspectionID: uuidv4(),
      standardID,
      note,
      result
    };

    historyDb.push(history);
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllHistory = (_req: Request, res: Response) => {
  res.json(historyDb);
};

export const getHistoryById = (req: Request, res: Response) => {
  const history = historyDb.find(h => h.id === req.params.id);
  if (!history) return res.status(404).json({ error: 'Not found' });
  res.json(history);
};

export const deleteAllHistory = (_req: Request, res: Response) => {
  historyDb.length = 0;
  res.json({ message: 'All history deleted' });
};
