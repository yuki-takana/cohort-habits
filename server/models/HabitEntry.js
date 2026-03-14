const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the blueprint for a single day's check-in
const habitEntrySchema = new Schema({
  // --- Relationships ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  // --- Data ---
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds "createdAt" and "updatedAt"
});

const HabitEntry = mongoose.model('HabitEntry', habitEntrySchema);

module.exports = HabitEntry;