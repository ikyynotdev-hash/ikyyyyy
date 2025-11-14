// api-web2zip.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "Masukkan URL! Contoh: ?url=https://example.com"
    });
  }

  try {
    const apiUrl = `https://api.nekolabs.web.id/tools/web2zip?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const result = await response.json();

    // Kalau API gagal
    if (!result || !result.success) {
      return res.status(500).json({
        success: false,
        message: "Gagal membuat ZIP!",
        detail: result?.error || {}
      });
    }

    // Format ulang biar simpel dipakai bot
    return res.status(200).json({
      success: true,
      target: result.result.url,
      copied: result.result.copiedFilesAmount,
      zip_url: result.result.downloadUrl,
      timestamp: result.timestamp
    });

  } catch (err) {
    console.error("Error API web2zip:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    });
  }
}
