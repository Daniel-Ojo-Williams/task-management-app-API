import db from '../db/connectdb.js'

class User {
  constructor(fullname, email, password) {
    this.fullname = fullname;
    this.email = email;
    this.passwordHash = password;
  }

  async createUser(){
    const response = await db.query('INSERT INTO users (fullname, email, passwordHash) VALUES ($1, $2, $3) RETURNING userid, fullname, email', [this.fullname, this.email, this.passwordHash]);
    return await response.rows[0]
  }

  static async findOne(email){
    const response = await db.query('SELECT * FROM users WHERE email = $1', [email])
    return await response.rows[0]
  }
}

export default User