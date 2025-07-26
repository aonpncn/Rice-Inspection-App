import { Request, Response } from 'express';
import standards from '../../standards.json';

export const getStandards = (_req: Request, res: Response) => {
  res.json(standards);
};
