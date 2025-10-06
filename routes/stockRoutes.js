const express = require("express");
const router = express.Router();

const { ensureAuthenticated, ensureManager } = require("../middleware/auth");
const Stock = require("../models/stockModel");

// Render Stock Form
router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("stock");
});

// Add New Stock
// Add New Stock
router.post("/stock", async (req, res) => {
  try {
    // 🔍 Debug: log incoming form data
    console.log("Form Data:", req.body);

    const {
      productName,
      productType,
      costPrice,
      sellingPrice,
      quantity,
      supplierName,
      supplierContact,
      quality,
      color,
    } = req.body;

    const errors = [];

    // --- Manual validation ---
    if (!productName || productName.trim() === "") {
      errors.push("Product Name is required");
    }
    if (!productType || productType.trim() === "") {
      errors.push("Product Type is required");
    }
    if (!quality || quality.trim() === "") {
      errors.push("Quality grade is required");
    }

    const quantityNum = parseFloat(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum < 1) {
      errors.push("Quantity must be at least 1");
    }

    const sellingPriceNum = parseFloat(sellingPrice);
    if (!sellingPrice || isNaN(sellingPriceNum) || sellingPriceNum < 0) {
      errors.push("Selling Price is required and cannot be negative");
    }

    const costPriceNum = parseFloat(costPrice) || 0;

    // --- If errors exist, re-render form ---
    if (errors.length > 0) {
      return res.render("stock", {
        errors,
        formData: req.body, // keep old inputs filled
      });
    }

    // --- Build stock object ---
    const stockData = {
      productName,
      productType,
      costPrice: costPriceNum,
      sellingPrice: sellingPriceNum,
      quantity: quantityNum,
      supplierName,
      supplierContact,
      quality,
      color,
    };

    // --- Save to DB ---
    const newStock = new Stock(stockData);
    const savedStock = await newStock.save();

    console.log("Stock saved to DB:", savedStock);
    req.flash("success_msg", "Stock added successfully!");
    res.redirect("/stockList");
  } catch (error) {
    console.error("Error saving stock:", error);

    // In case of Mongoose schema validation
    const errors = error.errors
      ? Object.values(error.errors).map((err) => err.message)
      : [error.message];

    res.render("stock", {
      errors,
      formData: req.body,
    });
  }
});



router.get("/manager", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("manager");
});

// List All Stock
// router.get("/stockList", ensureAuthenticated, ensureManager, async (req, res) => {
//     try {
//       const items = await StockModel.find().sort({ $natural: -1 });

//       // Summary counts
//       const totalProducts = items.length;
//       const inStock = items.filter((item) => item.quantity > 0).length;
//       const lowStock = items.filter(
//         (item) => item.quantity > 0 && item.quantity <= 5
//       ).length;
//       const outOfStock = items.filter((item) => item.quantity === 0).length;

//       res.render("stockList", {
//         items,
//         totalProducts,
//         inStock,
//         lowStock,
//         outOfStock,
//       });
//     } catch (err) {
//       console.error("Error loading stock list:", err);
//       res.status(500).send("Server Error");
//       req.flash("error_msg", "Error loading stock list");
//       res.redirect("/salesAgent");
//     }
//   }
// );

// Update Stock

// GET: List all stock items
router.get("/stockList", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const items = await Stock.find().sort({ createdAt: -1 }); // newest first

    // Stock summary counts
    const totalProducts = items.length;
    const inStock = items.filter(i => i.quantity > 10).length;
    const lowStock = items.filter(i => i.quantity <= 10 && i.quantity > 0).length;
    const outOfStock = items.filter(i => i.quantity === 0).length;

    // Render template with data
    res.render("stockList", {
      items,             // array of stock items
      totalProducts,
      inStock,
      lowStock,
      outOfStock
    });
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).send("Server Error");
  }
});


router.put(
  "/stockList/:id",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    // You can implement updating stock here
    res.send("Update stock route - not implemented yet");
  }
);

module.exports = router;
