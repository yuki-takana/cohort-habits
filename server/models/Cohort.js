const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cohortSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  activeDays: {
    type: [String],
    required: true,
  },
  
  // --- NEW FIELDS YOU REQUESTED ---
  startDate: {
    type: Date,
    required: true,
    default: Date.now // Default to today
  },
  endDate: {
    type: Date,
    required: true
  },
  timeOfDay: {
    type: String,
    enum: ['Anytime', 'Morning', 'Afternoon', 'Evening'], // Only allows these values
    default: 'Anytime'
  },
  motivation: {
    type: String,
    trim: true // The "why u wanna do it"
  },
  // --- END OF NEW FIELDS ---

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
});

const Cohort = mongoose.model('Cohort', cohortSchema);

module.exports = Cohort;