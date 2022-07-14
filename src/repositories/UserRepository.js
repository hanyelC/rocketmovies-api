const sqliteConnection = require("../database/sqlite")

class UserRepository {
  async findByEmail(email) {
    const db = await sqliteConnection()

    const user = await db.get("SELECT * FROM users WHERE email = (?)", [email])

    await db.close()

    return user
  }

  async findById(id) {
    const db = await sqliteConnection()

    const user = await db.get("SELECT * FROM users WHERE id = (?)", [id])

    await db.close()

    return user
  }

  async create({ name, email, password }) {
    const db = await sqliteConnection()

    const userId = await db.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name, email, password])

    await db.close()

    return { id: userId }
  }

  async update({ id, name, email, password }) {
    const db = await sqliteConnection()

    await db.run("UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now')  WHERE id = ?", [name, email, password, id])

    await db.close()

    return { id }
  }
}

module.exports = { UserRepository }
