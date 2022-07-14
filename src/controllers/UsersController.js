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
    const { name, email, password, old_password } = req.body
    const { user_id } = req.body

    const userRepository = new UserRepository()

    const user = await userRepository.findById(user_id)

    if (!user) {
      throw new AppError("Usuário não encontrado")
    }

    const userWithNewEmail = await userRepository.findByEmail(email)

    if (userWithNewEmail && userWithNewEmail.id !== user_id) {
      throw new AppError("Email já está em uso")
    }

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para alterar a sua senha")
    }

    let checkPasswordMatch
    if (password) checkPasswordMatch = bcrypt.compareSync(old_password, user.password)

    if (password && !checkPasswordMatch) {
      throw new AppError("A senha antiga não confere")
    } else {
      user.password = password ? bcrypt.hashSync(password, 8) : user.password
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    await userRepository.update(user)

    return res.status(204).json({})

  }
}

module.exports = UsersController