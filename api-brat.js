// api-brat.js
import fetch from "node-fetch"

export default async function handler(req, res) {
  const { text } = req.query

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Masukkan text! Contoh: ?text=haii"
    })
  }

  try {
    const apiUrl = `https://api.nekolabs.web.id/canvas/brat/v2?text=${encodeURIComponent(text)}`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      return res.status(404).json({
        success: false,
        message: "Gagal mengambil gambar!"
      })
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    // Set header biar respon langsung gambar
    res.setHeader("Content-Type", "image/png")
    res.setHeader("Content-Length", buffer.length)

    return res.status(200).send(buffer)

  } catch (err) {
    console.error("Error API:", err)
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    })
  }
}
