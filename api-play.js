// api-play.js
import fetch from "node-fetch"

export default async function handler(req, res) {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Masukkan query lagu! Contoh: ?query=dj%20wahai%20sahabatku"
    })
  }

  try {
    const apiUrl = `https://api.zenzxz.my.id/api/search/play?query=${encodeURIComponent(query)}`
    const response = await fetch(apiUrl)
    const result = await response.json()

    if (!result || !result.success) {
      return res.status(404).json({
        success: false,
        message: "Lagu tidak ditemukan!"
      })
    }

    // Format ulang biar lebih rapi & ringan buat bot
    const data = result.data
    return res.status(200).json({
      success: true,
      title: data.metadata.title,
      duration: data.metadata.duration,
      thumbnail: data.metadata.thumbnail,
      audio: data.dl_mp3,
      video: data.dl_mp4
    })
  } catch (err) {
    console.error("Error API:", err)
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    })
  }
}