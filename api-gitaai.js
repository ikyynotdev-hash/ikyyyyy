import fetch from "node-fetch"; // kalo Node <18

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { text } = req.query; // ambil query text
  if (!text) {
    return res.status(400).json({ success: false, message: "Query 'text' required" });
  }

  try {
    // panggil API eksternal dengan text query
    const apiRes = await fetch(`https://api.nekolabs.web.id/ai/gitagpt?text=${encodeURIComponent(text)}`);
    if (!apiRes.ok) {
      throw new Error(`Failed to fetch: ${apiRes.status}`);
    }

    const data = await apiRes.json();

    // return hasil ke client
    res.status(200).json({
      success: true,
      result: data.result,
      timestamp: data.timestamp,
      responseTime: data.responseTime,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
