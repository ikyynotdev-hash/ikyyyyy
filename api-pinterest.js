// api-pinterest.js
import https from "https";

// ========================
//   STEP 1: Ambil CSRF + Session
// ========================
const getInitialAuth = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "id.pinterest.com",
      path: "/",
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      },
    };

    https
      .get(options, (res) => {
        const cookies = res.headers["set-cookie"];
        if (cookies) {
          const csrfCookie = cookies.find((c) => c.startsWith("csrftoken="));
          const sessCookie = cookies.find((c) =>
            c.startsWith("_pinterest_sess=")
          );

          if (csrfCookie && sessCookie) {
            const csrftoken = csrfCookie.split(";")[0].split("=")[1];
            const sess = sessCookie.split(";")[0];
            resolve({
              csrftoken,
              cookieHeader: `csrftoken=${csrftoken}; ${sess}`,
            });
            return;
          }
        }
        reject(
          new Error("Gagal mendapatkan CSRF token atau session cookie.")
        );
      })
      .on("error", reject);
  });
};

// ========================
//   STEP 2: Scraping Pinterest
// ========================
const searchPinterest = async (query, limit) => {
  try {
    const { csrftoken, cookieHeader } = await getInitialAuth();
    let results = [];
    let bookmark = null;
    let keepFetching = true;

    while (keepFetching && results.length < limit) {
      const postData = {
        options: {
          query,
          scope: "pins",
          bookmarks: bookmark ? [bookmark] : [],
        },
        context: {},
      };

      const sourceUrl = `/search/pins/?q=${encodeURIComponent(query)}`;
      const formBody =
        `source_url=${encodeURIComponent(sourceUrl)}` +
        `&data=${encodeURIComponent(JSON.stringify(postData))}`;

      const options = {
        hostname: "id.pinterest.com",
        path: "/resource/BaseSearchResource/get/",
        method: "POST",
        headers: {
          Accept: "application/json, text/javascript, */*, q=0.01",
          "Content-Type":
            "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": csrftoken,
          "X-Pinterest-Source-Url": sourceUrl,
          Cookie: cookieHeader,
        },
      };

      const responseBody = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(body));
        });
        req.on("error", reject);
        req.write(formBody);
        req.end();
      });

      const json = JSON.parse(responseBody);
      const items = json?.resource_response?.data?.results || [];

      items.forEach((pin) => {
        if (pin.images?.["736x"]) {
          results.push(pin.images["736x"].url);
        } else if (pin.images?.orig) {
          results.push(pin.images.orig.url);
        }
      });

      bookmark = json?.resource_response?.bookmark;

      if (!bookmark || items.length === 0) keepFetching = false;
    }

    return results.slice(0, limit);
  } catch (e) {
    throw new Error(e.message);
  }
};

// ========================
//   STEP 3: REST API – Random 1
// ========================
export default async function handler(req, res) {
  const { query, limit } = req.query;
  const max = parseInt(limit) || 10;

  if (!query) {
    return res.status(400).json({
      success: false,
      message:
        "Masukkan query pencarian! Contoh: ?query=aesthetic girl",
    });
  }

  try {
    const results = await searchPinterest(query, max);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada hasil yang ditemukan.",
      });
    }

    // ambil 1 random
    const randomResult =
      results[Math.floor(Math.random() * results.length)];

    return res.status(200).json({
      success: true,
      query,
      result: randomResult,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
        }
