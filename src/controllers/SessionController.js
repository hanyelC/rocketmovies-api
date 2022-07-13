const { sign } = require("jsonwebtoken")
const { compareSync } = require("bcryptjs")

const authConfig = require("../config/auth")
const sqliteConnection = require("../database/sqlite")
const AppError = require("../utils/AppError")

class SessionController {
  async create(req, res) {
    const { email, password } = req.body

    if (!email || !password) throw new AppError("E-mail e senha são obrigatórios")

    const db = await sqliteConnection()

    const user = await db.get("SELECT * FROM users WHERE email = (?)", [email])

    if (!user) throw new AppError("E-mail e/ou senha incorreto", 401)

    const passwordMatched = compareSync(password, user.password)

    if (!passwordMatched) throw new AppError("E-mail e/ou senha incorreto", 401)

    const { secret, expiresIn } = authConfig.jwt

    const subject = JSON.stringify({
      user_id: user.id
    })

    const token = sign({}, secret, {
      subject,
      expiresIn
    })

    res.json({ user, token })
  }
}

module.exports = SessionController