import { Task } from '../models/Task.js';
import { Sprint } from '../models/Sprint.js';
import { Backlog } from '../models/Backlog.js';
import mongoose from "mongoose"


async function limpiarReferenciasDeTareas() {
  // Obtener todos los IDs válidos de tareas que existen actualmente
  const tareasExistentes = await Task.find({}, '_id');
  const idsValidos = tareasExistentes.map(t => t._id.toString());

  // Limpiar Backlog
  const backlog = await Backlog.findOne();
  if (backlog) {
    backlog.tareas = backlog.tareas.filter(id => idsValidos.includes(id.toString()));
    await backlog.save();
  }

  // Limpiar todos los Sprints
  const sprints = await Sprint.find();
  for (const sprint of sprints) {
    sprint.tareas = sprint.tareas.filter(id => idsValidos.includes(id.toString()));
    await sprint.save();
  }
}

// GET /tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

// GET /tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
};

// POST /tasks
export const createTask = async (req, res) => {
  try {
    const nuevaTarea = new Task(req.body);
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la tarea', detalle: error.message });
  }
};

// PUT /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const tareaActualizada = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tareaActualizada) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la tarea' });
  }
};

// DELETE /tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'ID de tarea inválido' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'La tarea no existe' });
    }

    // Borramos la tarea
    await task.deleteOne();

    // Limpiamos referencias automáticamente
    await limpiarReferenciasDeTareas();

    res.json({ mensaje: 'Tarea eliminada correctamente y referencias limpiadas' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea', detalle: error.message });
  }
};

// PUT /tasks/:taskId/move-to-sprint/:sprintId
export const moveTaskFromBacklogToSprint = async (req, res) => {
  try {
    const { taskId, sprintId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'La tarea no existe' });

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return res.status(404).json({ error: 'Sprint no encontrado' });

    const backlog = await Backlog.findOne();

    if (backlog?.tareas.includes(taskId)) {
      backlog.tareas = backlog.tareas.filter(id => id.toString() !== taskId);
      await backlog.save();
    }

    if (!sprint.tareas.includes(taskId)) {
      sprint.tareas.push(taskId);
      await sprint.save();
    }

    res.json({ mensaje: 'Tarea movida del backlog al sprint', sprint });
  } catch (error) {
    res.status(500).json({ error: 'Error al mover la tarea del backlog al sprint', detalle: error.message });
  }
};


// PUT /tasks/:taskId/move-to-backlog/:sprintId
export const moveTaskFromSprintToBacklog = async (req, res) => {
  try {
    const { taskId, sprintId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'La tarea no existe' });

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return res.status(404).json({ error: 'Sprint no encontrado' });

    const backlog = await Backlog.findOne();
    if (!backlog) return res.status(404).json({ error: 'No hay backlog creado' });

    // Remover del sprint si está
    if (sprint.tareas.includes(taskId)) {
      sprint.tareas = sprint.tareas.filter(id => id.toString() !== taskId);
      await sprint.save();
    }

    // Agregar al backlog si no está
    if (!backlog.tareas.includes(taskId)) {
      backlog.tareas.push(taskId);
      await backlog.save();
    }

    res.json({ mensaje: 'Tarea movida del sprint al backlog', backlog });
  } catch (error) {
    res.status(500).json({ error: 'Error al mover la tarea del sprint al backlog' });
  }
};