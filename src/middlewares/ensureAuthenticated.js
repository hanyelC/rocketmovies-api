const { verify } = require("jsonwebtoken")

const AppError = require("../utils/AppError")
const authConfig = require("../config/auth")

async function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) throw new AppError("Token JWT não informado", 401)

  const [, token] = authHeader.split(" ")

  try {
    const { sub } = verify(token, authConfig.jwt.secret)
    const { user_id } = JSON.parse(sub)

    req.body.user_id = user_id

    return next()
  } catch {
    throw new AppError("Token JWT inválido", 401)
  }
}

module.exports = ensureAuthenticated