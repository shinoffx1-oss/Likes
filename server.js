const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const LIKE_API = "https://botlikesff.rexapi.com.br/api/v2/likes";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/like", async (req, res) => {
  const uid = String(req.query.uid || "").trim();

  if (!/^\d{5,15}$/.test(uid)) {
    return res.status(400).json({
      status: "error",
      message: "Informe um UID válido com 5 a 15 números."
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const url = `${LIKE_API}?uid=${encodeURIComponent(uid)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json", "User-Agent": "FreeFire-Likes-V2-Site/1.0" },
      signal: controller.signal
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { status: "error", message: "A API retornou uma resposta que não é JSON.", raw: text.slice(0, 1000) }; }

    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    const message = error.name === "AbortError"
      ? "A API demorou mais de 15 segundos para responder."
      : "Não foi possível conectar à API de likes.";
    return res.status(502).json({ status: "error", message });
  } finally {
    clearTimeout(timeout);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Free Fire Likes V2 rodando em http://localhost:${PORT}`);
});
