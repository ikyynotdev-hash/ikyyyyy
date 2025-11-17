// api-sholat.js
import axios from "axios";

// ========================
//   CLASS API SHOLAT GLOBAL
// ========================
class GlobalPrayerTime {
  constructor() {
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
    };
  }

  fetch(url) {
    return new Promise((resolve, reject) => {
      https
        .get(
          url,
          { headers: this.headers },
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(JSON.parse(data)));
          }
        )
        .on("error", reject);
    });
  }

  async getCoordinates(city, country = "") {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=` +
      encodeURIComponent(`${city} ${country}`);

    const result = await this.fetch(url);

    if (!result.length) throw new Error("Kota tidak ditemukan.");

    return {
      lat: parseFloat(result[0].lat),
      lon: parseFloat(result[0].lon),
      display: result[0].display_name,
    };
  }

  async getTimes(lat, lon, method = 1) {
    const now = new Date();
    const d = now.getDate();
    const m = now.getMonth() + 1;
    const y = now.getFullYear();

    const url =
      `http://api.aladhan.com/v1/timings/${d}-${m}-${y}` +
      `?latitude=${lat}&longitude=${lon}&method=${method}&school=1`;

    const res = await this.fetch(url);

    if (!res.data) throw new Error("Gagal mengambil jadwal sholat");

    const t = res.data.timings;

    return {
      subuh: t.Fajr,
      syuruq: t.Sunrise,
      dzuhur: t.Dhuhr,
      ashar: t.Asr,
      maghrib: t.Maghrib,
      isya: t.Isha,
      sumber: "Aladhan API",
    };
  }

  timeToMin(str) {
    const [time, ap] = str.split(" ");
    let [h, m] = time.split(":").map(Number);

    if (ap) {
      if (ap === "PM" && h !== 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
    }
    return h * 60 + m;
  }

  nextPrayer(times) {
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();

    const list = [
      { name: "Subuh", time: this.timeToMin(times.subuh) },
      { name: "Dzuhur", time: this.timeToMin(times.dzuhur) },
      { name: "Ashar", time: this.timeToMin(times.ashar) },
      { name: "Maghrib", time: this.timeToMin(times.maghrib) },
      { name: "Isya", time: this.timeToMin(times.isya) },
    ];

    for (let p of list) {
      if (p.time > cur) {
        const diff = p.time - cur;
        return {
          sholat_berikutnya: p.name,
          waktu_tersisa: `${Math.floor(diff / 60)} jam ${diff % 60} menit`,
          jam: times[p.name.toLowerCase()],
        };
      }
    }

    return {
      sholat_berikutnya: "Subuh",
      waktu_tersisa: "Besok pagi",
      jam: times.subuh,
    };
  }

  async getSchedule(city, country = "") {
    try {
      const c = await this.getCoordinates(city, country);
      const times = await this.getTimes(c.lat, c.lon);

      return {
        success: true,
        lokasi: c.display,
        kota: city,
        negara: country || "Indonesia",
        tanggal: new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        koordinat: { lat: c.lat, lon: c.lon },
        jadwal: times,
        sholat_berikutnya: this.nextPrayer(times),
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}

const prayer = new GlobalPrayerTime();

// ========================
//   REST API (EXPORT DEFAULT)
// ========================
export default async function handler(req, res) {
  const { city, country } = req.query;

  if (!city) {
    return res.status(400).json({
      success: false,
      message: "Parameter city wajib ada! Contoh: ?city=jakarta",
    });
  }

  const result = await prayer.getSchedule(city, country || "");
  return res.status(200).json(result);
      }
