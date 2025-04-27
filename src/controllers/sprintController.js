import { Sprint } from '../models/Sprint.js';
import { Task } from '../models/Task.js';


  // GET /sprints
export const getSprints = async (req, res) => {
    try {
      const sprints = await Sprint.find().populate('tareas');
      res.json(sprints);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los sprints' });
    }

  };
  // GET /sprints/:id
export const getSprintById = async (req, res) => {
    try {
      const sprint = await Sprint.findById(req.params.id).populate('tareas');
      if (!sprint) return res.status(404).json({ error: 'Sprint no encontrado' });
      res.json(sprint);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el sprint' });
    }
  };
  
  // POST /sprints
  export const createSprint = async (req, res) => {
    try {
      const nuevoSprint = new Sprint(req.body);
      await nuevoSprint.save();
      res.status(201).json(nuevoSprint);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el sprint', detalle: error.message });
    }
  };
  
  // PUT /sprints/:id
  export const updateSprint = async (req, res) => {
    try {
      const sprintActualizado = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!sprintActualizado) return res.status(404).json({ error: 'Sprint no encontrado' });
      res.json(sprintActualizado);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar el sprint' });
    }
  };
  
  // DELETE /sprints/:id
  export const deleteSprint = async (req, res) => {
    try {
      const eliminado = await Sprint.findByIdAndDelete(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'Sprint no encontrado' });
      res.json({ mensaje: 'Sprint eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el sprint' });
    }
  };
  
  // PUT /sprints/:id/add-task/:taskId
  export const addTaskToSprint = async (req, res) => {
    try {
      const { id, taskId } = req.params;
  
      // Verificar si la tarea existe
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ error: 'La tarea no existe' });
  
      // Agregar la tarea al sprint
      const sprint = await Sprint.findById(id);
      if (!sprint) return res.status(404).json({ error: 'Sprint no encontrado' });

      // Evitar duplicados
      if (sprint.tareas.includes(taskId)) {
        return res.status(400).json({ error: 'La tarea ya está en el sprint' });
      }
  
      sprint.tareas.push(taskId);
      await sprint.save();
  
      res.json({ mensaje: 'Tarea agregada al sprint', sprint });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar tarea al sprint' });
    }
  };