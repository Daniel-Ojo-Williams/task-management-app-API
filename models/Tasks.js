import db from '../db/connectdb.js';

class Tasks {
  constructor(title, description, dueDate, status, userId){
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.status = status;
    this.userId = userId;
  }

  async createTask(){
    const response = await db.query('INSERT INTO tasks (title, description, userId, status, dueDate) VALUES ($1, $2, $3, $4, TO_DATE($5, \'DD-MM-YYYY\')) RETURNING *', [this.title, this.description, this.userId, this.status, this.dueDate]);

    return await response.rows[0]
  }
  static async updateTask(taskId, title, description, userId, status, dueDate){
    const response = await db.query(
      "UPDATE tasks SET title = $1, description = $2, dueDate = TO_DATE($3, 'DD-MM-YYYY'), status = $4 WHERE taskid = $5 AND userid = $6 RETURNING *",
      [title, description, dueDate, status, taskId, userId]
    );
    return await response.rows[0];
  }
  static async getAllTask(userId){
    const response = await db.query("SELECT * FROM tasks WHERE userid = $1", [
      userId,
    ]);
    return await response.rows;
  }
  static async findOne(taskId){
    const response = await db.query("SELECT * FROM tasks WHERE taskid = $1", [
      taskId,
    ]);
    return await response.rows[0];
  }
  static async deleteTask(taskId, userId){
    await db.query(
      "DELETE FROM tasks WHERE taskid = $1 AND userid = $2",
      [taskId, userId]
    );
  }
}

export default Tasks