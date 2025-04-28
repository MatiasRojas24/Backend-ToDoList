import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaCierre: { type: Date, required: true },
  tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

export const Sprint = mongoose.model('Sprint', sprintSchema);
