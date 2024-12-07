const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

const router = express.Router();

// Get tasks for a project with filters
router.get('/',
  auth,
  [
    query('project').isMongoId(),
    query('status').optional().isIn(['pending', 'in-progress', 'completed']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('sortBy').optional().isIn(['dueDate', 'priority', 'status'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Verify project belongs to user
      const project = await Project.findOne({
        _id: req.query.project,
        user: req.user._id
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Build query
      const query = { project: req.query.project };
      if (req.query.status) query.status = req.query.status;
      if (req.query.priority) query.priority = req.query.priority;

      // Build sort options
      let sort = { createdAt: -1 };
      if (req.query.sortBy === 'dueDate') sort = { dueDate: 1 };
      if (req.query.sortBy === 'priority') {
        sort = {
          priority: { $in: ['high', 'medium', 'low'] }
        };
      }

      const tasks = await Task.find(query)
        .sort(sort)
        .populate('assignedTo', 'name email');

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Create new task
router.post('/',
  auth,
  [
    body('project').isMongoId(),
    body('title').trim().notEmpty(),
    body('description').trim().optional(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('dueDate').optional().isISO8601(),
    body('assignedTo').optional().isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Verify project belongs to user
      const project = await Project.findOne({
        _id: req.body.project,
        user: req.user._id
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const task = new Task(req.body);
      await task.save();

      await task.populate('assignedTo', 'name email');
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update task
router.patch('/:id',
  auth,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional().isISO8601(),
    body('assignedTo').optional().isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Verify project belongs to user
      const project = await Project.findOne({
        _id: task.project,
        user: req.user._id
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      Object.assign(task, req.body);
      await task.save();
      await task.populate('assignedTo', 'name email');

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify project belongs to user
    const project = await Project.findOne({
      _id: task.project,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 