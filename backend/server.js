require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const allowed = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/", (_req, res) => res.json({ name: "Arrowgo Website API", status: "ok" }));

app.use("/api/services", require("./routes/services"));
app.use("/api/locations", require("./routes/locations"));

app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => console.log(`Arrowgo Website API running on port ${PORT}`));
