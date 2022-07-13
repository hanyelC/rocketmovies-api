const fs = require("fs")
const path = require("path")
const { TMP_FOLDER, UPLOADS_FOLDER } = require("../config/upload")

class DiskStorage {
  async saveFile(file) {
    try {
      await fs.promises.rename(
        path.resolve(TMP_FOLDER, file),
        path.resolve(UPLOADS_FOLDER, file)
      )
    } catch (error) {
      console.log(error)
    }
    return file
  }

  async deleteFile(file) {
    const filePath = path.resolve(UPLOADS_FOLDER, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}

module.exports = DiskStorage