const router = require('express').Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notifications');
const Cohort = require('../models/Cohort'); // <-- 1. IMPORT COHORT
const HabitEntry = require('../models/HabitEntry'); // <-- 2. IMPORT HABITENTRY

// Helper data
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getDayStart = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// @route   GET /api/notifications
// @desc    Get all unread notifications for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      read: false
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/notifications/mark-read
// @desc    Mark all of the user's notifications as read
// @access  Private
router.post('/mark-read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );
    
    res.json({ msg: 'Notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- 3. THIS IS THE NEW "SMART" ROUTE ---
// @route   POST /api/notifications/generate-reminders
// @desc    Create daily reminders for active, uncompleted habits
// @access  Private
router.post('/generate-reminders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getDayStart(new Date());
    const todayName = dayNames[today.getDay()];

    // 1. Find all cohorts for the user that are active today
    const activeCohorts = await Cohort.find({
      members: userId,
      endDate: { $gte: today },
      startDate: { $lte: today },
      activeDays: todayName
    });

    if (activeCohorts.length === 0) {
      return res.json({ msg: 'No active habits today.' });
    }

    // 2. Find cohorts the user has *already completed* today
    const completedEntries = await HabitEntry.find({
      user: userId,
      date: today,
      completed: true
    });
    const completedCohortIds = completedEntries.map(entry => entry.cohort.toString());

    // 3. Find reminders we've *already sent* today
    const existingReminders = await Notification.find({
      user: userId,
      createdAt: { $gte: today } // Find reminders created today
    });
    const remindedCohortTitles = existingReminders.map(n => n.message.split("'")[1]); // Gets title from message

    let newRemindersCreated = 0;

    // 4. Filter to find which cohorts still need a reminder
    for (const cohort of activeCohorts) {
      const isCompleted = completedCohortIds.includes(cohort._id.toString());
      const isReminded = remindedCohortTitles.includes(cohort.title);

      // If it's not completed and not reminded, create a notification!
      if (!isCompleted && !isReminded) {
        const newNotification = new Notification({
          user: userId,
          message: `Reminder: '${cohort.title}' is active today. You can do this! 💪`,
          link: `/cohort/${cohort._id}`
        });
        await newNotification.save();
        newRemindersCreated++;
      }
    }

    res.json({ msg: `Generated ${newRemindersCreated} new reminders.` });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;