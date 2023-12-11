import db from '../db/connectdb.js'
import { CronJob } from 'cron'
import nodemailer from 'nodemailer'
import 'dotenv/config'

/*
Send a an email notification reminder to users with tasks due in 24hrs.
Job checks the database every day at 00:00 for notifications that suit this req
*/
export const job = new CronJob('0 0 * * *',
  async () => {
    try {
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "freakydmuse@gmail.com",
          pass: process.env.GMAIL_PASS,
        },
      });

      const response = await db.query("SELECT * FROM tasks WHERE duedate > current_date AND current_date <= duedate + INTERVAL '1 day'");
      
      let tasks = response.rows
      if(!tasks.length > 0){
        return
      }

      for (const task of tasks){
        const { rows } = await db.query("SELECT email FROM users WHERE userid = $1", [task.userid])
        const email = rows[0].email

        const mailOptions = {
          from: "freakydmuse@gmail.com",
          to: email,
          subject: `REMINDER: ${task.title}`,
          text: "Here is to remind you about your task, it's due for tomorrow.",
          html: "<h1>Here is to remind you about your task</h1>,<br><h3>it's due for tomorrow.</h3>",
        };

        transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info.response);
          }
        });
      }

    } catch (error) {
        console.log(error.message)
    }
  }
)
