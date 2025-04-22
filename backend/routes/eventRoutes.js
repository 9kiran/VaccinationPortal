import express from 'express';
import { getAllEvents, getUpcomingEvents, createEvent } from '../controllers/eventController.js';

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all vaccination events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of vaccination events
 */
router.get('/', getAllEvents);

/**
 * @swagger
 * /api/events/upcoming:
 *   get:
 *     summary: Get upcoming vaccination events (next 30 days)
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of upcoming events
 */
router.get('/upcoming', getUpcomingEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new vaccination event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vaccine, eventDate, doseCount, targetGrades]
 *             properties:
 *               vaccine:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               doseCount:
 *                 type: integer
 *               targetGrades:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createEvent);

export default router;
