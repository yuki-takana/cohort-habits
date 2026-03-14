const router = require('express').Router();
const auth = require('../middleware/auth');
const Cohort = require('../models/Cohort');
const HabitEntry = require('../models/HabitEntry');

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Standardize a date to midnight (removes time)
const getDayStart = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// @route   GET /api/dashboard/stats
// @desc    Get all calculated stats for the user's dashboard
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getDayStart(new Date());
    const todayName = dayNames[today.getDay()];

    // --- 1. Get all *ACTIVE* cohorts user is a member of ---
    // This is the FIX: We only find cohorts where the end date is today or in the future.
    const activeUserCohorts = await Cohort.find({ 
      members: userId,
      endDate: { $gte: today } 
    });

    // --- 2. Calculate "Today's Progress %" ---
    let activeTodayCohorts = 0;
    let activeTodayCohortIds = [];
    
    // We now loop through the *active* cohorts list
    activeUserCohorts.forEach(cohort => {
      const startDate = getDayStart(cohort.startDate);
      // const endDate = getDayStart(cohort.endDate); // We already know endDate is >= today

      // Check if today is an active day and within the date range
      if (today >= startDate && cohort.activeDays.includes(todayName)) {
        activeTodayCohorts++;
        activeTodayCohortIds.push(cohort._id);
      }
    });

    let todaysProgress = 0;
    if (activeTodayCohorts > 0) {
      const completedEntries = await HabitEntry.find({
        user: userId,
        date: today,
        completed: true,
        cohort: { $in: activeTodayCohortIds }
      });
      todaysProgress = Math.round((completedEntries.length / activeTodayCohorts) * 100);
    }

    // --- 3. Calculate "Current Streak" (Longest of all active cohorts) ---
    // We get ALL entries, which is fine, but we only check against active cohorts.
    
    const allEntries = await HabitEntry.find({ user: userId, completed: true }).select('date cohort');
    const entryMap = new Set();
    allEntries.forEach(entry => {
      entryMap.add(`${entry.cohort}_${getDayStart(entry.date).toISOString()}`);
    });

    let maxStreak = 0;
    
    // Now, we only loop through the *active* cohorts
    for (const cohort of activeUserCohorts) {
      let currentStreak = 0;
      let dayToCheck = getDayStart(new Date()); 
      
      while (true) {
        if (dayToCheck < getDayStart(cohort.startDate)) break;

        const dayName = dayNames[dayToCheck.getDay()];
        
        if (cohort.activeDays.includes(dayName)) {
          const entryKey = `${cohort._id}_${dayToCheck.toISOString()}`;
          
          if (entryMap.has(entryKey)) {
            currentStreak++;
          } else {
            // Streak is broken
            break; 
          }
        }
        
        dayToCheck.setDate(dayToCheck.getDate() - 1);
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    // --- 4. Send the final stats object ---
    res.json({
      activeHabits: activeUserCohorts.length, // <-- This is now correct
      currentStreak: maxStreak,
      todaysProgress: todaysProgress,
      cohortsJoined: activeUserCohorts.length // <-- This is now correct
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;