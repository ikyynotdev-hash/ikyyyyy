// api-tiktoksearch.js
import fetch from "node-fetch"

export default async function handler(req, res) {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Masukkan query pencarian! Contoh: ?query=dj wahai sahabatku"
    })
  }

  try {
    const apiUrl = `https://api.zenzxz.my.id/api/search/tiktok?query=${encodeURIComponent(query)}`
    const response = await fetch(apiUrl)
    const result = await response.json()

    if (!result || !result.success || !Array.isArray(result.data) || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video tidak ditemukan!"
      })
    }

    // Ambil satu random dari list pencarian
    const random = result.data[Math.floor(Math.random() * result.data.length)]

    // Format ulang
    return res.status(200).json({
      success: true,
      query,
      video_id: random.video_id,
      title: random.title,
      duration: random.duration,
      cover: random.cover,
      play: random.play,
      music: random.music,
      author: {
        name: random.author?.nickname,
        username: random.author?.unique_id,
        avatar: random.author?.avatar
      },
      stats: {
        play_count: random.play_count,
        digg_count: random.digg_count,
        comment_count: random.comment_count,
        share_count: random.share_count
      }
    })
  } catch (err) {
    console.error("Error API:", err)
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    })
  }
}
