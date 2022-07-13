const { Router } = require("express")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const TagsController = require("../controllers/TagsController")

const tagsRouter = Router()

const tagsController = new TagsController()

tagsRouter.use(ensureAuthenticated)

tagsRouter.get('/',ensureAuthenticated , tagsController.index)

module.exports = tagsRouter