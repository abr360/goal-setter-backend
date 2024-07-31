const express = require('express');
const router = express.Router();
const { getGoals, postGoals, putGoals, deleteGoals } = require('../controllers/goalsController');
const { protect } = require('../middleware/authMiddleware');
router.route('/').get(protect, getGoals).post(protect, postGoals);
router.route('/:id').put(protect, putGoals).delete(protect, deleteGoals);

module.exports = router;

