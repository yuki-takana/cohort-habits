const router = require('express').Router();
const auth = require('../middleware/auth');
const Cohort = require('../models/Cohort');
const User = require('../models/User');
const Notification = require('../models/Notifications'); 
const HabitEntry = require('../models/HabitEntry');

// @route   POST /api/cohorts
// @desc    Create a new cohort
// @access  Private
router.post('/', auth, async (req, res) => {
  const { 
    title, 
    description, 
    category, 
    activeDays,
    startDate,
    endDate,
    timeOfDay,
    motivation 
  } = req.body;

  if (!category || !activeDays || activeDays.length === 0 || !startDate || !endDate) {
    return res.status(400).json({ msg: 'Please fill out all required fields.' });
  }

  try {
    const newCohort = new Cohort({
      title,
      description,
      category,
      activeDays,
      startDate,
      endDate,
      timeOfDay,
      motivation,
      creator: req.user.id,
      members: [req.user.id]
    });

    const cohort = await newCohort.save();
    res.json(cohort);

  } catch (err) { 
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/cohorts/mycohorts
// @desc    Get all *active* cohorts the user is a member of
// @access  Private
router.get('/mycohorts', auth, async (req, res) => {
  try {
    // --- THIS IS THE UPDATED LOGIC ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    const cohorts = await Cohort.find({ 
      members: req.user.id,
      endDate: { $gte: today } // Only get cohorts where end date is today or later
    }).sort({ createdAt: -1 });

    res.json(cohorts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/cohorts/all
// @desc    Get all cohorts the user is NOT in
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const cohorts = await Cohort.find({
      members: { $nin: [req.user.id] } 
    }).sort({ createdAt: -1 });

    res.json(cohorts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/cohorts/:id
// @desc    Get a single cohort by its ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id)
                                .populate('members', 'username');
    
    if (!cohort) {
      return res.status(404).json({ msg: 'Cohort not found' });
    }

    if (!cohort.members.some(member => member._id.equals(req.user.id))) {
       return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(cohort);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/cohorts/join/:id
// @desc    Join a cohort
// @access  Private
router.post('/join/:id', auth, async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    const user = await User.findById(req.user.id); 

    if (!cohort) {
      return res.status(404).json({ msg: 'Cohort not found' });
    }

    if (cohort.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'User is already a member' });
    }
    
    cohort.members.push(req.user.id);
    await cohort.save();

    const newNotification = new Notification({
      user: cohort.creator,
      message: `${user.username} has joined your cohort: "${cohort.title}"`,
      link: `/cohort/${cohort._id}`
    });
    await newNotification.save();
    
    res.json(cohort.members);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/cohorts/:id
// @desc    Delete a cohort
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);

    if (!cohort) {
      return res.status(404).json({ msg: 'Cohort not found' });
    }

    if (cohort.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this cohort' });
    }

    await Cohort.findByIdAndDelete(req.params.id);
    await HabitEntry.deleteMany({ cohort: req.params.id });
    await Notification.deleteMany({ link: `/cohort/${req.params.id}` });

    res.json({ msg: 'Cohort and all related data removed' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;