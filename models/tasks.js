import { Schema, model } from 'mongoose'
import Users from './users.js'

const taskSchema = Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  dueDate: {type: String, required: true},
  completed: {type: Boolean, default: false},
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
})


taskSchema.post('save', async function(doc){
  const user = await Users.findById(doc.userId)
  user.tasks.push(doc)
  await user.save()
})

taskSchema.pre('findOneAndDelete', async function(doc){
  const user = await Users.findById(doc.userId)
  await user.tasks.pull(doc)
  await user.save()
})







export default model('Task', taskSchema)