const express = require("express");
const router = express.Router();

// Example routes
router.get("/sales", (req, res) => {
  res.send("Sales page works!");
});

// Export router
module.exports = router; // ✅ MUST be here
