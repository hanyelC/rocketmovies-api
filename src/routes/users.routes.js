const { Router } = require("express")
const multer = require("multer")

const uploadConfig = require("../config/upload")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const UsersController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController")

const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController()
const usersAvatarController = new UserAvatarController()

const usersRouter = Router()

usersRouter.post("/", usersController.create)

usersRouter.use(ensureAuthenticated)
usersRouter.put("/", usersController.update)
usersRouter.patch("/avatar", upload.single("avatar"), ensureAuthenticated, usersAvatarController.update)

module.exports = usersRouter