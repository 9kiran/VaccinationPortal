import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import pupilRoutes from './routes/pupilRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import { serveSwagger, setupSwagger } from './docs/swagger.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', serveSwagger, setupSwagger);

app.use('/api/pupils', pupilRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/summary', summaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger docs available at http://localhost:${PORT}/api-docs`);
});