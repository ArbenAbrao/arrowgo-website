const router = require("express").Router();
const locations = require("../data/locations.json");

// GET /api/locations?service=cold-chain
router.get("/", (req, res) => {
  const { service } = req.query;
  const result = service
    ? locations.filter((l) => l.services.includes(service))
    : locations;
  res.json(result);
});

router.get("/:id", (req, res) => {
  const item = locations.find((l) => l.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Location not found" });
  res.json(item);
});

module.exports = router;
