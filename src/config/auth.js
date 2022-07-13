module.exports = {
  jwt: {
    secret: process.env.AUTH_SECRET,
    expiresIn: process.env.TOKEN_EXPIRATION
  }
}