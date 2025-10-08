const express = require("express");
const router = express.Router();
const Schedule = require("../models/scheduleModel");
const {ensureAuthenticated, ensureManager, ensureManagerOrAttendant, } = require("../middleware/auth");

/* MANAGER: CREATE SCHEDULE (form page)*/
router.get("/schedule",
  ensureAuthenticated,
  ensureManager,
  (req, res) => {
    res.render("schedule", { user: req.user });
  }
);

router.post(
  "/schedule",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    try {
      const { assignedAttendant, type, products, date, time } = req.body;

      // Validation
      if (!assignedAttendant || !type || !products || !date || !time) {
        req.flash("error_msg", "Please fill in all fields.");
        return res.redirect("/schedule");
      }

      // Save schedule
      const newSchedule = new Schedule({
        assignedAttendant,
        type,
        products,
        date,
        time,
      });

      await newSchedule.save();
      req.flash("success_msg", "Schedule successfully created.");
      res.redirect("/scheduleList");
    } catch (err) {
      console.error("Error saving schedule:", err);
      res.status(500).send("Server Error");
    }
  }
);

/*MANAGER & ATTENDANT: VIEW SCHEDULE LIST */
router.get(
  "/scheduleList",
  ensureAuthenticated,
  ensureManagerOrAttendant,
  async (req, res) => {
    try {
      let schedules;

      if (req.user.role === "manager") {
        // Manager sees all schedules
        schedules = await Schedule.find().sort({ date: 1, time: 1 });
      } else if (req.user.role === "attendant") {
        // Attendant sees only their own assigned schedules
        schedules = await Schedule.find({
          assignedAttendant: req.user.name,
        }).sort({
          date: 1,
          time: 1,
        });
      }

      res.render("scheduleList", { user: req.user, schedules });
    } catch (err) {
      console.error("Error fetching schedules:", err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
