import { Schema, model } from 'mongoose'


const userSchema = Schema({
    fullname: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: String,
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task'
      }
    ]
})

export default model('User', userSchema)