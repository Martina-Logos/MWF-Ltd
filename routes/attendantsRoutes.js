const express = require("express");
const router = express.Router();
const Schedule = require("../models/scheduleModel");
const Stock = require("../models/stockModel");
const {
  ensureAuthenticated,
  ensureManagerOrAttendant,
} = require("../middleware/auth");

/* ATTENDANTS DASHBOARD */
router.get(
  "/attendants",
  ensureAuthenticated,
  ensureManagerOrAttendant,
  async (req, res) => {
    try {
      let schedules;

      if (req.user.role === "manager") {
        // Manager sees all schedules
        schedules = await Schedule.find().sort({ date: 1, time: 1 });
      } else if (req.user.role === "attendant") {
        // Attendant sees only their assigned schedules
        schedules = await Schedule.find({
          assignedAttendant: req.user.name,
        }).sort({ date: 1, time: 1 });
      }

      // Fetch all stock items (both roles can view)
      const stocks = await Stock.find().sort({ productName: 1 });

      res.render("attendants", {
        user: req.user,
        schedules,
        stocks,
      });
    } catch (err) {
      console.error("Error loading attendants dashboard:", err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
