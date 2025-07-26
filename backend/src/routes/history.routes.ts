import { Router } from 'express';
import {
  createHistory,
  getAllHistory,
  getHistoryById,
  deleteAllHistory,
} from '@/controllers/history.controller';

const router = Router();

router.post('/', createHistory);           // POST /history
router.get('/', getAllHistory);            // GET /history
router.get('/:id', getHistoryById);        // GET /history/:id
router.delete('/', deleteAllHistory);      // DELETE /history

export default router;
