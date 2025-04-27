import { Backlog } from '../models/Backlog.js';
import { Task } from '../models/Task.js';

// GET /backlog
export const getBacklog = async (req, res) => {
  try {
    const backlog = await Backlog.findOne().populate('tareas');
    if (!backlog) return res.status(404).json({ error: 'No hay backlog creado' });
    res.json(backlog);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el backlog' });
  }
};

// POST /backlog
export const createBacklog = async (req, res) => {
  try {
    const existente = await Backlog.findOne();
    if (existente) {
      return res.status(400).json({ error: 'Ya existe un backlog' });
    }

    const nuevoBacklog = new Backlog({ tareas: [] });
    await nuevoBacklog.save();
    res.status(201).json(nuevoBacklog);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el backlog' });
  }
};

// PUT /backlog/add-task/:taskId
export const addTaskToBacklog = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'La tarea no existe' });

    const backlog = await Backlog.findOne();
    if (!backlog) return res.status(404).json({ error: 'No hay backlog creado' });

    if (backlog.tareas.includes(taskId)) {
      return res.status(400).json({ error: 'La tarea ya está en el backlog' });
    }

    backlog.tareas.push(taskId);
    await backlog.save();

    res.json({ mensaje: 'Tarea agregada al backlog', backlog });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la tarea al backlog' });
  }
};
