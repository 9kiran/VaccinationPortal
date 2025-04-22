import express from 'express';
import multer from 'multer';
import { getAllPupils, addPupil, bulkUploadPupils } from '../controllers/pupilController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/pupils:
 *   get:
 *     summary: Get all pupils
 *     tags: [Pupils]
 *     responses:
 *       200:
 *         description: List of pupils
 */
router.get('/', getAllPupils);

/**
 * @swagger
 * /api/pupils:
 *   post:
 *     summary: Add a new pupil
 *     tags: [Pupils]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, grade, rollNumber]
 *             properties:
 *               fullName:
 *                 type: string
 *               grade:
 *                 type: string
 *               rollNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pupil added successfully
 */
router.post('/', addPupil);

/**
 * @swagger
 * /api/pupils/upload:
 *   post:
 *     summary: Bulk upload pupils via CSV
 *     tags: [Pupils]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Pupils uploaded successfully
 */
router.post('/upload', upload.single('file'), bulkUploadPupils);

export default router;
