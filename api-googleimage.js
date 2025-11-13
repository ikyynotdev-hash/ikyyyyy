// api-googleimage.js
import fetch from "node-fetch"

export default async function handler(req, res) {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Masukkan query gambar! Contoh: ?query=kucing"
    })
  }

  try {
    const apiUrl = `https://api.zenzxz.my.id/api/search/googleimage?query=${encodeURIComponent(query)}`
    const response = await fetch(apiUrl)
    const result = await response.json()

    if (!result || !result.success || !Array.isArray(result.data) || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gambar tidak ditemukan!"
      })
    }

    // Ambil satu gambar random dari hasil
    const random = result.data[Math.floor(Math.random() * result.data.length)]

    // Format ulang biar simpel & enak dipakai bot
    return res.status(200).json({
      success: true,
      query,
      image: random.url,
      width: random.width,
      height: random.height
    })
  } catch (err) {
    console.error("Error API:", err)
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    })
  }
}
