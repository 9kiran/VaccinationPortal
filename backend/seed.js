import express from 'express';
import multer from 'multer';
import { getAllPupils, addPupil, bulkUploadPupils } from './controllers/pupilController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllPupils);
router.post('/', addPupil);
router.post('/upload', upload.single('file'), bulkUploadPupils);

export default router;


// backend/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pupil from './models/Pupil.js';
import VaccinationEvent from './models/VaccinationEvent.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to DB. Seeding fresh data...');

    await Pupil.deleteMany();
    await VaccinationEvent.deleteMany();

    const pupils = [
      { fullName: 'Ritika Mehra', grade: 'Grade 4', rollNumber: 'P401' },
      { fullName: 'Sahil Kapoor', grade: 'Grade 6', rollNumber: 'P402' },
      { fullName: 'Tanya Roy', grade: 'Grade 5', rollNumber: 'P403' },
      { fullName: 'Yash Goyal', grade: 'Grade 7', rollNumber: 'P404' },
      { fullName: 'Nisha Verma', grade: 'Grade 5', rollNumber: 'P405' },
      { fullName: 'Vivek Arora', grade: 'Grade 6', rollNumber: 'P406' },
    ];

    const events = [
      {
        vaccine: 'Typhoid',
        eventDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        doseCount: 120,
        targetGrades: ['Grade 4', 'Grade 5'],
      },
      {
        vaccine: 'Chickenpox',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        doseCount: 100,
        targetGrades: ['Grade 6'],
      },
      {
        vaccine: 'DTaP',
        eventDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        doseCount: 90,
        targetGrades: ['Grade 7'],
      },
    ];

    await Pupil.insertMany(pupils);
    await VaccinationEvent.insertMany(events);

    console.log('✅ Seed complete!');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  });
