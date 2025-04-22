import Pupil from '../models/Pupil.js';
import fs from 'fs';
import csv from 'csv-parser';

export const getAllPupils = async (req, res) => {
  const data = await Pupil.find();
  res.json(data);
};

export const addPupil = async (req, res) => {
  const { fullName, grade, rollNumber } = req.body;
  const newPupil = new Pupil({ fullName, grade, rollNumber });
  await newPupil.save();
  res.status(201).json(newPupil);
};

export const bulkUploadPupils = async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        fullName: data.fullName,
        grade: data.grade,
        rollNumber: data.rollNumber,
      });
    })
    .on('end', async () => {
      try {
        await Pupil.insertMany(results);
        fs.unlinkSync(req.file.path);
        res.json({ message: 'Pupils uploaded successfully', count: results.length });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
};

export const updatePupil = async (req, res) => {
  const { vaccine, administeredOn } = req.body;
  const pupil = await Pupil.findById(req.params.id);
  if (!pupil) return res.status(404).json({ error: 'Pupil not found' });

  const alreadyVaccinated = pupil.vaccines?.some(
    v => v.vaccine.toLowerCase() === vaccine.toLowerCase()
  );
  if (alreadyVaccinated) return res.status(400).json({ error: 'Already vaccinated for this vaccine.' });

  pupil.vaccines.push({ vaccine, administeredOn });
  await pupil.save();

  res.json(pupil);
};
