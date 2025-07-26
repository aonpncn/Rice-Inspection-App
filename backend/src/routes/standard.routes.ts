import { Router } from 'express';
import { getStandards } from '@/controllers/standard.controller';

const router = Router();

router.get('/', getStandards);  // GET /standard

export default router;
