import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completado'],
    default: 'pendiente',
  },
  fechaLimite: { type: String, required: true },
});

export const Task = mongoose.model('Task', taskSchema);
