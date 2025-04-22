import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  vaccine: String,
  eventDate: Date,
  doseCount: Number,
  targetGrades: [String],
});

export default mongoose.model('VaccinationEvent', eventSchema);
