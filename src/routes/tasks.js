import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTaskFromBacklogToSprint,
  moveTaskFromSprintToBacklog
} from '../controllers/taskController.js';

const router = express.Router();

// GET /tasks
router.get('/', getTasks);

// GET /tasks/:id
router.get('/:id', getTaskById);

// POST /tasks
router.post('/', createTask);

// PUT /tasks/:id
router.put('/:id', updateTask);

// DELETE /tasks/:id
router.delete('/:id', deleteTask);

// PUT /tasks/:taskId/move-to-sprint/:sprintId
router.put('/:taskId/move-to-sprint/:sprintId', moveTaskFromBacklogToSprint);

// PUT /tasks/:taskId/move-to-backlog/:sprintId
router.put('/:taskId/move-to-backlog/:sprintId', moveTaskFromSprintToBacklog);

export default router;
