const sqliteConnection = require("../database/sqlite")

class UserRepository {
  async findByEmail(email) {
    const db = await sqliteConnection()

    const user = await db.get("SELECT * FROM users WHERE email = (?)", [email])

    db.close()

    return user
  }

  async create({ name, email, password }) {
    const db = await sqliteConnection()

    const userId = await db.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name, email, password])

    db.close()

    return { id: userId }
  }
}

module.exports = { UserRepository }
