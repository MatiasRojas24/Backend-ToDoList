import mongoose from 'mongoose';

const backlogSchema = new mongoose.Schema({
  tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

export const Backlog = mongoose.model('Backlog', backlogSchema);
