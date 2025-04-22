import VaccinationEvent from '../models/VaccinationEvent.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await VaccinationEvent.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  const now = new Date();
  const next30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  try {
    const upcoming = await VaccinationEvent.find({
      eventDate: { $gte: now, $lte: next30 },
    }).sort({ eventDate: 1 });
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  const { vaccine, eventDate, doseCount, targetGrades } = req.body;

  const parsedDate = new Date(eventDate);
  const today = new Date();
  const daysDiff = (parsedDate - today) / (1000 * 60 * 60 * 24);

  if (daysDiff < 15) {
    return res.status(400).json({ error: 'Event must be scheduled at least 15 days in advance.' });
  }

  const conflict = await VaccinationEvent.findOne({ vaccine, eventDate: parsedDate });
  if (conflict) {
    return res.status(400).json({ error: 'This vaccine is already scheduled for that day.' });
  }

  try {
    const event = new VaccinationEvent({
      vaccine,
      eventDate: parsedDate,
      doseCount,
      targetGrades,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};