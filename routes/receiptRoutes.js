// routes/receiptRoutes.js
const express = require("express");
const router = express.Router();
const Receipt = require("../models/receiptModel");

// Render receipt form (or receipt list)
router.get("/receipts", async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.render("receipts", { receipts }); // assumes you have views/receipt.pug
  } catch (err) {
    res.status(500).send("Error loading receipts: " + err.message);
  }
});

// Create a new receipt (save to DB)
router.post("/receipts", async (req, res) => {
  try {
    const {
      receiptNumber,
      receiptDate,
      receiptTime,
      salesAgent,
      customerName,
      customerContact,
      customerPhone,
      customerAddress,
      products,
      subtotal,
      transportFee,
      taxAmount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      transactionRef,
    } = req.body;

    const newReceipt = new Receipt({
      receiptNumber,
      receiptDate,
      receiptTime,
      salesAgent,
      customerName,
      customerContact,
      customerPhone,
      customerAddress,
      products, // should be an array of { description, qty, price, discount, total }
      subtotal,
      transportFee,
      taxAmount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      transactionRef,
    });

    await newReceipt.save();
    console.log(" Receipt saved:", newReceipt);

    res.redirect(`/receipts/${newReceipt._id}`);
  } catch (err) {
    res.status(500).send("Error creating receipt: " + err.message);
  }
});

// View single receipt by ID
router.get("/receipts/:id", async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).send("Receipt not found");
    }
    res.render("receiptDetail", { receipt }); // use a separate pug template for details
  } catch (err) {
    res.status(500).send("Error fetching receipt: " + err.message);
  }
});

module.exports = router;
