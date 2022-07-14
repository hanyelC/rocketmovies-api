const bcrypt = require('bcryptjs')
const sqliteConnection = require("../database/sqlite")
const AppError = require("../utils/AppError")

const { UserRepository } = require("../repositories/UserRepository")
const { UserCreateService } = require("../services/UserCreateService")

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)

    await userCreateService.execute({ name, email, password })

    return res.status(201).json()
  }

  async update(req, res) {
    const db = await sqliteConnection()

    const { name, email, password, old_password } = req.body
    const { user_id } = req.body

    const user = await db.get("SELECT * FROM users WHERE id = (?)", [user_id])

    if (!user) {
      await db.close()
      throw new AppError("Usuário não encontrado")
    }

    const userWithNewEmail = await db.get("SELECT * FROM users WHERE email = (?)", [email])

    if (userWithNewEmail && userWithNewEmail.id !== user_id) {
      await db.close()
      throw new AppError("Email já está em uso")
    }

    if (password && !old_password) {
      await db.close()
      throw new AppError("Você precisa informar a senha antiga para alterar a sua senha")
    }

    let checkPasswordMatch
    if (password) checkPasswordMatch = bcrypt.compareSync(old_password, user.password)

    if (password && !checkPasswordMatch) {
      await db.close()
      throw new AppError("A senha antiga não confere")
    } else {
      user.password = password ? bcrypt.hashSync(password, 8) : user.password
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    await db.run("UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now')  WHERE id = ?", [user.name, user.email, user.password, user_id])
    await db.close()


    return res.status(204).json({})

  }
}

module.exports = UsersController