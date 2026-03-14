const router = require('express').Router();
const auth = require('../middleware/auth'); // Our "security guard"
const HabitEntry = require('../models/HabitEntry');
const Cohort = require('../models/Cohort');

// @route   POST /api/habits/checkin/:cohortId
// @desc    Check-in for a habit on the current day
// @access  Private
router.post('/checkin/:cohortId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cohortId = req.params.cohortId;

    // --- Validation ---
    // 1. Check if the cohort exists and if the user is a member
    const cohort = await Cohort.findOne({ _id: cohortId, members: userId });
    if (!cohort) {
      return res.status(404).json({ msg: 'Cohort not found or user is not a member' });
    }

    // 2. Standardize the date to just "today" (removes time)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Sets time to midnight

    // 3. Check if an entry for this user/cohort/date already exists
    let entry = await HabitEntry.findOne({
      user: userId,
      cohort: cohortId,
      date: today
    });

    if (entry) {
      // If entry exists, just update it (e.g., toggle it)
      entry.completed = !entry.completed; // This lets users "un-check"
      await entry.save();
      return res.json(entry);
    } else {
      // If no entry exists, create a new one
      const newEntry = new HabitEntry({
        user: userId,
        cohort: cohortId,
        date: today,
        completed: true // Mark as completed on first check-in
      });
      await newEntry.save();
      return res.status(201).json(newEntry);
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/habits/:cohortId
// @desc    Get all habit entries for a specific cohort
// @access  Private
router.get('/:cohortId', auth, async (req, res) => {
  try {
    const cohortId = req.params.cohortId;

    // Find all entries for this cohort
    const entries = await HabitEntry.find({ cohort: cohortId })
                                    .populate('user', 'username'); // Also send back the user's name

    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;