const { hashSync } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    if (!name) {
      throw new AppError("Nome é obrigatório.")
    }

    if (!email) {
      throw new AppError("Email é obrigatório.")
    }

    if (!password) {
      throw new AppError("Senha é obrigatória.")
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new AppError("Formato de email inválido.")
    }

    const checkIfUserExists = await this.userRepository.findByEmail(email)

    if (checkIfUserExists) {
      throw new AppError("Email já cadastrado.")
    }

    const hashedPassword = hashSync(password, 8)

    const userCreated = await this.userRepository.create({ name, email, password: hashedPassword })

    return userCreated
  }
}

module.exports = { UserCreateService }
