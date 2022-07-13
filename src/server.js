require("express-async-errors")
require("dotenv/config")
const express = require("express")
const cors = require("cors")

const { UPLOADS_FOLDER } = require("./config/upload")

const routes = require("./routes")

const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")

migrationsRun()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/files", express.static(UPLOADS_FOLDER))

app.use(routes)

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message
    })
  }

  console.error(err)

  return res.status(500).json({
    status: "Error",
    message: "Internal server error"
  })
})

app.listen(process.env.PORT || 3030, console.log('server running on port 3030'))