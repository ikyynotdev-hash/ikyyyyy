import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Welcome to Ikyy REST API 🚀",
    Creator: "IkyyOfficiall",
    routes: [
      "/api-subfinder?domain=",
      "/api-play?url=",
      "/api-googleimage?query=",
      "/api-toanime?imageUrl=",
      "/api-tiktoksearch?query=",
      "/api-randomquotes",
      "/api-brat?text=",
      "/api-web2zip?url=",
      "/api-kimiai?query=",
      "/api-asahotak",
      "/api-githubstalk",
      "/api-pinterest?query"
    ]
  })
})

app.listen(3000, () => console.log("✅ Server aktif di http://localhost:3000"))
