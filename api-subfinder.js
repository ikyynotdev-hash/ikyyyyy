import axios from "axios"

export default async function handler(req, res) {
  const { domain } = req.query
  if (!domain)
    return res.status(400).json({ status: false, message: "Masukkan parameter ?domain=" })

  try {
    const { data } = await axios.get(`https://api.nekolabs.web.id/tools/subdomain-finder?domain=${encodeURIComponent(domain)}`)
    res.json({
      status: true,
      total: data.result?.length || 0,
      domain,
      subdomains: data.result || []
    })
  } catch (err) {
    res.status(500).json({ status: false, message: "Gagal mengambil data" })
  }
}