const router = require('express').Router();
const auth = require('../middleware/auth'); // Our "security guard"
const User = require('../models/User');
const Cohort = require('../models/Cohort');
const HabitEntry = require('../models/HabitEntry');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/profile
// @desc    Update a user's profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { username, bio, age, gender, occupation, interests } = req.body;

  const profileFields = {};
  if (username) profileFields.username = username;
  if (bio || bio === "") profileFields.bio = bio;
  if (age) profileFields.age = age;
  if (gender) profileFields.gender = gender;
  if (occupation) profileFields.occupation = occupation;
  if (interests) profileFields.interests = interests;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (username && username !== user.username) {
      let existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username is already taken' });
      }
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- THIS IS THE NEW "GAMIFIED" STATS ROUTE ---
// @route   GET /api/users/stats
// @desc    Get all calculated stats for a user's profile
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Get total completions
    const totalCompletions = await HabitEntry.countDocuments({
      user: userId,
      completed: true
    });

    // 2. Get active habits
    const activeHabits = await Cohort.countDocuments({
      members: userId,
      endDate: { $gte: today }
    });

    // 3. Get total cohorts joined (all time)
    const totalCohortsJoined = await Cohort.countDocuments({
      members: userId
    });

    // 4. Calculate Level and XP
    // We'll say 1 completion = 10 XP
    const xp_per_completion = 10;
    const xp_per_level = 1000;
    
    const totalXp = totalCompletions * xp_per_completion;
    const level = Math.floor(totalXp / xp_per_level) + 1;
    const currentLevelXp = totalXp % xp_per_level;
    const xpForNextLevel = xp_per_level;

    // 5. Get Longest Streak (we'll reuse the logic from the dashboard)
    // This calculates the *current* longest streak.
    const allUserCohorts = await Cohort.find({ members: userId });
    const allEntries = await HabitEntry.find({ user: userId, completed: true }).select('date cohort');
    const entryMap = new Set();
    allEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      entryMap.add(`${entry.cohort}_${entryDate.toISOString()}`);
    });

    let longestStreak = 0;
    for (const cohort of allUserCohorts) {
      let currentStreak = 0;
      let dayToCheck = new Date();
      dayToCheck.setHours(0, 0, 0, 0);
      
      while (true) {
        if (dayToCheck < new Date(cohort.startDate)) break;
        const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayToCheck.getDay()];
        
        if (cohort.activeDays.includes(dayName)) {
          const entryKey = `${cohort._id}_${dayToCheck.toISOString()}`;
          if (entryMap.has(entryKey)) {
            currentStreak++;
          } else {
            break;
          }
        }
        dayToCheck.setDate(dayToCheck.getDate() - 1);
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    // 6. Send all stats
    res.json({
      level,
      totalXp,
      currentLevelXp,
      xpForNextLevel,
      activeHabits,
      longestStreak,
      totalCompletions,
      totalCohortsJoined
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;