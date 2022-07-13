const { Router } = require("express")
const SessionController = require("../controllers/SessionController")

const sessionsController = new SessionController()

const sessionsRouter = Router()

sessionsRouter.post("/", sessionsController.create)

module.exports = sessionsRouter