const { compareSync, hashSync } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ id, name, email, password, old_password }) {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new AppError("Usuário não encontrado")
    }

    const userWithNewEmail = await this.userRepository.findByEmail(email)

    if (userWithNewEmail && userWithNewEmail.id !== id) {
      throw new AppError("Email já está em uso")
    }

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para alterar a sua senha")
    }

    let checkPasswordMatch
    if (password) checkPasswordMatch = compareSync(old_password, user.password)

    if (password && !checkPasswordMatch) {
      throw new AppError("A senha antiga não confere")
    } else {
      user.password = password ? hashSync(password, 8) : user.password
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    const userId = await this.userRepository.update(user)

    return userId

  }
}

module.exports = { UserUpdateService }
