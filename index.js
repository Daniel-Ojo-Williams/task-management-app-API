import express, { urlencoded } from 'express';
import AuthRoute from './authentication/routes.js'
import TaskRoute from './tasks/routes.js'
import { connectdb } from './db/connectdb.js';
import 'dotenv/config'
import { validateAuthBody, protectRoute } from './middleware/index.js'
import { globalErrorHandler } from './utils/index.js';
import session from "express-session";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, //expires in 7 days
    },
  })
  );
  
app.use(express.json())
// use the port provided by the server if available or use port 5000
const PORT = process.env.PORT || 3000 

app.use('/auth', validateAuthBody, AuthRoute)
app.use('/tasks', protectRoute, TaskRoute)


app.use(globalErrorHandler)
app.listen(PORT, async () => {
  try {
    await connectdb(process.env.DB_URI);
    console.log(`Server listening on ${PORT}`)
  } catch (error) {
    console.log('Connection faild', error.message)
  }
})