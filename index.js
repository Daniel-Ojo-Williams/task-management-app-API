import express, { urlencoded } from "express";
import AuthRoute from "./authentication/routes.js";
import TaskRoute from "./tasks/routes.js";
import db from "./db/connectdb.js";
import "dotenv/config";
import { validateAuthBody, protectRoute, validateTaskBody } from "./middleware/index.js";
import { globalErrorHandler } from "./utils/index.js";
import session from "express-session";
import createTable from "./models/createTable.js";
import { job } from "./tasks/cronJob.js";
import morgan from 'morgan'
import { fileURLToPath } from 'url'
import { dirname, join } from "path";
import { createWriteStream } from "fs";
import { createClient } from "redis";

const app = express();

const logFile = join(dirname(fileURLToPath(import.meta.url)), 'access.log')
const accessLogStream = createWriteStream(logFile, {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}))

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

// initiate redis client on server start
export let redisClient
(
  async () => {
    redisClient = createClient();
    redisClient.on('error', (err) => {
      console.error(`Error : ${err.message}`);
    })

    await redisClient.connect();
  }
)();

app.use(express.json());
// use the port provided by the server if available or use port 5000
const PORT = process.env.PORT || 4000;

app.use("/auth", validateAuthBody, AuthRoute);
app.use(protectRoute)
app.use("/tasks", validateTaskBody, TaskRoute);

app.use(globalErrorHandler);
app.listen(PORT, async () => {
  try {
    const client = await db.connect();
    console.log("Connected to database");
    await createTable();
    client.release();
    console.log(`Server listening on ${PORT}`);
  } catch (error) {
    console.log("Connection faild", error.message);
  }
});

job.start();
