// api-asahotak.js
import fetch from "node-fetch"

export default async function handler(req, res) {
  try {
    const apiUrl = `https://api.siputzx.my.id/api/games/asahotak`
    const response = await fetch(apiUrl)
    const result = await response.json()

    if (!result || !result.status || !result.data) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan!"
      })
    }

    // Format ulang data
    return res.status(200).json({
      success: true,
      creator: "ikyyy-official",
      data: {
        index: result.data.index,
        soal: result.data.soal,
        jawaban: result.data.jawaban
      },
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    console.error("Error API:", err)
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    })
  }
}
