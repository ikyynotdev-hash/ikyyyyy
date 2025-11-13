// api-toanime.js
import fetch from "node-fetch"

export default async function handler(req, res) {
  const { imageUrl } = req.query

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: "Masukkan URL gambar! Contoh: ?imageUrl=https://files.catbox.moe/79l7at.jpg"
    })
  }

  try {
    const apiUrl = `https://api.nekolabs.web.id/tools/convert/toanime?imageUrl=${encodeURIComponent(imageUrl)}`
    const response = await fetch(apiUrl)
    const result = await response.json()

    if (!result || !result.success || !result.result) {
      return res.status(404).json({
        success: false,
        message: "Gagal mengubah gambar menjadi anime!"
      })
    }

    // Format ulang biar rapi & ringan buat bot / client
    return res.status(200).json({
      success: true,
      anime_image: result.result,
      timestamp: result.timestamp,
      response_time: result.responseTime
    })
  } catch (err) {
    console.error("Error API:", err)
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    })
  }
}
