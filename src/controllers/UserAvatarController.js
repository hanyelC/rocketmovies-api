const DiskStorage = require("../providers/DiskStorage")
const sqliteConnection = require("../database/sqlite")

class UserAvatarController {
  async update(req, res) {
    const { user_id } = req.body
    const { filename } = req.file

    const diskStorage = new DiskStorage()
    const db = await sqliteConnection()

    const user = await db.get("SELECT * FROM users WHERE id = (?)", [user_id])

    if (user.avatar)
      diskStorage.deleteFile(user.avatar)

    const file = diskStorage.saveFile(filename)

    if (file)
      await db.run("UPDATE users SET avatar = ? WHERE id = ?", [filename, user_id])

    res.json({ "avatar": filename })
  }
}

module.exports = UserAvatarController