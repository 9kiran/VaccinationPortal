import express from 'express';
import { getSummary } from '../controllers/summaryController.js';

const router = express.Router();

/**
 * @swagger
 * /api/summary:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Summary]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/', getSummary);

export default router;
