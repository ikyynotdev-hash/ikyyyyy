// api-githubstalk.js
import fetch from "node-fetch"

export default async function handler(req, res) {
  const { user } = req.query

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Masukkan username GitHub! Contoh: ?user=ikyynotdev-hash"
    })
  }

  try {
    const apiUrl = `https://api.siputzx.my.id/api/stalk/github?user=${encodeURIComponent(user)}`
    const response = await fetch(apiUrl)
    const result = await response.json()

    if (!result || !result.status || !result.data) {
      return res.status(404).json({
        success: false,
        message: "User GitHub tidak ditemukan!"
      })
    }

    // Format ulang hasil API
    const data = result.data

    return res.status(200).json({
      success: true,
      creator: "ikyyy-official",
      user: data.username,
      profile: {
        nickname: data.nickname,
        bio: data.bio,
        avatar: data.profile_pic,
        url: data.url,
        type: data.type,
        admin: data.admin
      },
      stats: {
        public_repo: data.public_repo,
        public_gists: data.public_gists,
        followers: data.followers,
        following: data.following
      },
      metadata: {
        id: data.id,
        nodeId: data.nodeId,
        created_at: data.created_at,
        updated_at: data.updated_at
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
