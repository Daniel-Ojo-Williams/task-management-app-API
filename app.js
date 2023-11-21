import express, { urlencoded } from 'express';
import AuthRoute from './routes/routes.js'
import cookieParser from 'cookie-parser';

const app = express();

// handle cookies 
app.use(cookieParser())

app.use(express.json())

// use the port provided by the server if available or use port 5000
const PORT = process.env.PORT || 5000 

app.use('/', AuthRoute)


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})