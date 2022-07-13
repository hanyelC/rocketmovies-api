const sqliteConnection = require("../database/sqlite")

class TagsController {
  async index(req, res) {
    const db = await sqliteConnection()

    const { user_id } = req.body
    
    const tags = await db.get("SELECT * FROM tags WHERE user_id = (?)",[user_id])

    await db.close()
    
    res.json(tags)
  }

}

module.exports = TagsController