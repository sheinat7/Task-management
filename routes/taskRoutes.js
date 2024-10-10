const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, getTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createTask).get(protect, getTasks);
router.route('/:id').get(protect, getTask).put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;




//router.post('/tasks/:taskId/calendar-sync', syncTaskToCalendar);//