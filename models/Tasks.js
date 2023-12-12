import db from '../db/connectdb.js';

class Tasks {
  constructor(title, description, dueDate, status, userId){
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.status = status || 'pending';
    this.userId = userId;
  }

  // create a task
  async createTask(){
    const response = await db.query(
      "INSERT INTO tasks (title, description, userId, status, dueDate) VALUES ($1, $2, $3, $4, TO_DATE($5, 'DD-MM-YYYY')) RETURNING *, to_char(duedate::date, \'Mon dd, yyyy\') AS duedate",
      [this.title, this.description, this.userId, this.status, this.dueDate]
    );

    return await response.rows[0]
  }
  // update task, task status defaults to pending if status is not provided
  static async updateTask(taskId, title, description, userId, status = 'pending', dueDate){
    const response = await db.query(
      "UPDATE tasks SET title = $1, description = $2, dueDate = TO_DATE($3, 'DD-MM-YYYY'), status = $4 WHERE taskid = $5 AND userid = $6 RETURNING *, to_char(duedate::date, 'Mon dd, yyyy') AS duedate",
      [title, description, dueDate, status, taskId, userId]
    );
    return await response.rows[0];
  }
  static async getAllTask(userId){
    const response = await db.query(
      "SELECT *, to_char(duedate::date, 'Mon dd, yyyy') AS duedate FROM tasks WHERE userid = $1",
      [userId]
    );
    return await response.rows;
  }

  // get one task
  static async findOne(taskId){
    const response = await db.query(
      "SELECT *, to_char(duedate::date, 'Mon dd, yyyy') AS duedate FROM tasks WHERE taskid = $1",
      [taskId]
    );
    return await response.rows[0];
  }
  static async deleteTask(taskId, userId){
    const response = await db.query(
      "DELETE FROM tasks WHERE taskid = $1 AND userid = $2 RETURNING *, to_char(duedate::date, 'Mon dd, yyyy') AS duedate",
      [taskId, userId]
    );

    return await response.rows[0];
  }

  static async updateTaskStatus(status, taskId, userId) {
    const response = await db.query('UPDATE tasks SET status = $1 WHERE taskid = $2 AND userid = $3 RETURNING status', 
    [status, taskId, userId]);

    return response.rows[0]
  }
}

export default Tasks