const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

const router = express.Router();

// Get all projects for current user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new project
router.post('/',
  auth,
  [
    body('name').trim().notEmpty(),
    body('description').trim().optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = new Project({
        ...req.body,
        user: req.user._id
      });

      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update project
router.patch('/:id',
  auth,
  [
    body('name').trim().optional(),
    body('description').trim().optional(),
    body('status').isIn(['active', 'completed', 'archived']).optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 