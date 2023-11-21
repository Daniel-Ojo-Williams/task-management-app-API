import express, { urlencoded } from 'express';
import AuthRoute from './authentication/routes.js'
import TaskRoute from './routes/routes.js'
import cookieParser from 'cookie-parser';

const app = express();

// handle cookies 
app.use(cookieParser())

app.use(express.json())

// use the port provided by the server if available or use port 5000
const PORT = process.env.PORT || 3000 

app.use('/api/v1/auth', AuthRoute)
app.use('/api/v1/tasks', TaskRoute)



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})