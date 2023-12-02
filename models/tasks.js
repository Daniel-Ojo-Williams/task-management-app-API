import { Schema, model } from 'mongoose'

const taskSchema = Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  dueDate: {type: Date, required: true},
  completed: {type: Boolean, default: false},
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
})

export default model('Task', taskSchema)