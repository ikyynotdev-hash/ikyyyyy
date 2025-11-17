import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());

const __dirname = path.resolve();

// === AUTO REGISTER ROUTES ===
const apiFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file.startsWith("api-") && file.endsWith(".js"));

for (const file of apiFiles) {
  const route = "/" + file.replace(".js", "");
  import(path.join(__dirname, file)).then((mod) => {
    const handler = mod.default;

    if (typeof handler === "function") {
      app.all(route, handler);
      console.log("LOADED:", route);
    } else {
      console.log("⚠️ SKIPPED:", route, "(no default export)");
    }
  });
}

// === ROUTE HOME ===
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "🚀 Auto REST API Active",
    total_routes: apiFiles.length,
    routes: apiFiles.map((f) => "/" + f.replace(".js", "")),
  });
});

// === WAJIB: EXPORT UNTUK VERCEL ===
export default app;
