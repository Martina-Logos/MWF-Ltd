const express = require("express");
const router = express.Router();
// const Report = require("../models/reportModel");

// ==========================
// GET /reports
// ==========================
// Renders the Reports page
router.get("/reports", async (req, res) => {
  try {
    // Optional: Fetch latest 5 reports to show in the table
    const recentReports = await Report.find().sort({ createdAt: -1 }).limit(5);
    res.render("reports", { recentReports }); // pass to your Pug template
  } catch (err) {
    console.error("Error loading reports page:", err);
    res.status(500).send("Error loading reports page");
  }
});

// ==========================
// POST /reports/generate
// ==========================
// Generates & saves a new report based on filters
router.post("/generate", async (req, res) => {
  try {
    const { reportType, dateRange, productCategory } = req.body;

    // ---- Example mock data ----
    // In production, you would query Orders/Stock models here
    const report = new Report({
      reportType,
      dateRange,
      productCategory,
      totalRevenue: 24560,
      totalOrders: 128,
      totalItems: 356,
      transportFees: 1228,
      records: [
        {
          orderId: "#ORD-001",
          date: new Date("2023-10-12"),
          customer: "BuildMax Constructions",
          product: "Timber (50 units)",
          amount: 2500,
          status: "completed",
        },
        {
          orderId: "#ORD-002",
          date: new Date("2023-10-11"),
          customer: "Home Comfort Furniture",
          product: "Office Chairs (10 units)",
          amount: 1200,
          status: "completed",
        },
      ],
      createdBy: req.user ? req.user.username : "Manager",
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).send("Error generating report");
  }
});

// ==========================
// GET /reports/data
// ==========================
// Returns JSON for charts / tables dynamically
router.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).send("Error fetching reports");
  }
});

module.exports = router;
