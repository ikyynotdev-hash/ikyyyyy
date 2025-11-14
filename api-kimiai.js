// api-ai-kimi.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Masukkan pertanyaan! Contoh: ?query=kamu+siapa"
    });
  }

  try {
    const apiUrl = `https://api.zenzxz.my.id/api/ai/kimi?query=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result || !result.success) {
      return res.status(404).json({
        success: false,
        message: "Gagal mendapatkan respon AI!"
      });
    }

    // Format ulang data biar lebih rapih untuk bot / web
    return res.status(200).json({
      success: true,
      creator: "ikyyy-official",
      question: query,
      answer: result.data.response,
      timestamp: result.timestamp
    });

  } catch (err) {
    console.error("Error API:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    });
  }
}
