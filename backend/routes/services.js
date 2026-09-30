const router = require("express").Router();
const services = require("../data/services.json");

router.get("/", (_req, res) => res.json(services));

router.get("/:slug", (req, res) => {
  const item = services.find((s) => s.slug === req.params.slug);
  if (!item) return res.status(404).json({ message: "Service not found" });
  res.json(item);
});

module.exports = router;
