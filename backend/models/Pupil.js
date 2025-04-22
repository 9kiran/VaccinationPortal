import mongoose from 'mongoose';

const pupilSchema = new mongoose.Schema({
  fullName: String,
  grade: String,
  rollNumber: String,
  vaccines: [
    {
      vaccine: String,
      administeredOn: Date,
    },
  ],
});

export default mongoose.model('Pupil', pupilSchema);
