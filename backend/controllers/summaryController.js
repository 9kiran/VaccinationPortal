import Pupil from '../models/Pupil.js';
import VaccinationEvent from '../models/VaccinationEvent.js';

export const getSummary = async (req, res) => {
    try {
        const totalStudents = await Pupil.countDocuments();
        const vaccinatedStudents = await Pupil.countDocuments({ vaccines: { $exists: true, $not: { $size: 0 } } });

        const percentageVaccinated = totalStudents === 0
            ? 0
            : Math.round((vaccinatedStudents / totalStudents) * 100);

        const upcomingDrives = await VaccinationEvent.find({
            eventDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });

        res.json({
            totalStudents,
            vaccinatedStudents,
            percentageVaccinated,
            upcomingDrives
        });
    } catch (error) {
        res.status(500).json({ error: 'Error loading dashboard metrics' });
    }
};
