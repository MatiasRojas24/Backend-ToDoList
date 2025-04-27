import express from 'express';

import {
  getSprints,
  getSprintById,
  createSprint,
  updateSprint, 
  deleteSprint,
  addTaskToSprint
} from '../controllers/sprintController.js';

const router = express.Router();

// GET /sprints
router.get('/', getSprints);

// GET /sprints/:id
router.get('/:id', getSprintById);

// POST /sprints
router.post('/', createSprint);

// PUT /sprints/:id
router.put('/:id', updateSprint);

// DELETE /sprints/:id
router.delete('/:id', deleteSprint);

// PUT /sprints/:id/add-task/:taskId
router.put('/:id/add-task/:taskId', addTaskToSprint)


export default router;