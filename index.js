import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Welcome to Ikyy REST API 🚀",
    routes: [
      "/api-subfinder?domain=",
      "/api-play?url=",
      "/api-randomquotes"
    ]
  })
})

app.listen(3000, () => console.log("✅ Server aktif di http://localhost:3000"))