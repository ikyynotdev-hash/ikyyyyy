import axios from "axios"

export default async function handler(req, res) {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'query' diperlukan! contoh: /api/play?query=dj wahai sahabatku"
      })
    }

    // ambil data dari API musik
    const url = `https://api.zenzxz.my.id/api/search/play?query=${encodeURIComponent(query)}`
    const { data } = await axios.get(url)

    if (!data.success || !data.data) {
      return res.status(404).json({
        success: false,
        message: "Lagu tidak ditemukan!"
      })
    }

    const { dl_mp3, metadata } = data.data
    const { title, thumbnail, duration } = metadata

    res.status(200).json({
      success: true,
      result: {
        title,
        thumbnail,
        duration,
        audio: dl_mp3
      }
    })
  } catch (err) {
    console.error("Error di /api/play:", err)
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server!",
      error: err.message
    })
  }
}