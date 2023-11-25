import express, { urlencoded } from 'express';
import AuthRoute from './authentication/routes.js'
import TaskRoute from './tasks/routes.js'
import verify from './authentication/verify.js';


const app = express();

app.use(express.json())

// use the port provided by the server if available or use port 5000
const PORT = process.env.PORT || 3000 

app.use('/auth', AuthRoute)
app.use('/tasks/:user_id', verify, TaskRoute)



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})