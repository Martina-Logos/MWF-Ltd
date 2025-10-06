const express = require("express");
const router = express.Router();

// Import your models
const Sales = require("../models/salesModel");
const Customer = require("../models/customerModel");
const Invoice = require("../models/invoiceModel");

// GET /api/dashboard-data
router.get("/salesDash", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Today's sales (sum + count)
    const todaysSales = await Sale.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    // 2. Total transactions
    const transactions = await Sale.countDocuments();

    // 3. Customers
    const customers = await Customer.countDocuments();

    // 4. Issued invoices
    const invoices = await Invoice.countDocuments();

    // 5. Recent transactions (latest 5)
    const recentTxns = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName amount status createdAt");

    // 6. Top selling products (aggregate items)
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" }, // assumes Sale has an `items` array
      {
        $group: {
          _id: "$items.productName",
          units: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { units: -1 } },
      { $limit: 5 },
    ]);

    // 7. Top customers (optional highlight section)
    const topCustomers = await Customer.find()
      .sort({ totalSpent: -1 })
      .limit(3)
      .select("companyName tier totalSpent ordersThisMonth");

    res.json({
      todaysSales: todaysSales[0]?.total || 0,
      transactions,
      customers,
      invoices,
      recentTxns,
      topProducts,
      topCustomers,
    });
  } catch (err) {
    console.error("Dashboard data error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
