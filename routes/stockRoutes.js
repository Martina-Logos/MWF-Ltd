// const express = require("express");
// const router = express.Router();

// const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

// const Stock = require("../models/stockModel");

// // Render Stock Form
// router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
//   res.render("stock");
// });

// // Add New Stock
// router.post("/stock", async (req, res) => {
//   try {
//     console.log("Form Data:", req.body);

//     const {
//       productName,
//       productType,
//       costPrice,
//       sellingPrice,
//       quantity,
//       supplierName,
//       supplierContact,
//       quality,
//       color,
//     } = req.body;

//     const errors = [];

//     // --- Manual validation ---
//     if (!productName || productName.trim() === "") {
//       errors.push("Product Name is required");
//     }
//     if (!productType || productType.trim() === "") {
//       errors.push("Product Type is required");
//     }
//     if (!quality || quality.trim() === "") {
//       errors.push("Quality grade is required");
//     }

//     const quantityNum = parseFloat(quantity);
//     if (!quantity || isNaN(quantityNum) || quantityNum < 1) {
//       errors.push("Quantity must be at least 1");
//     }

//     const sellingPriceNum = parseFloat(sellingPrice);
//     if (!sellingPrice || isNaN(sellingPriceNum) || sellingPriceNum < 0) {
//       errors.push("Selling Price is required and cannot be negative");
//     }

//     const costPriceNum = parseFloat(costPrice) || 0;

//     // --- If errors exist, re-render form ---
//     if (errors.length > 0) {
//       return res.render("stock", {
//         errors,
//         formData: req.body, // keep old inputs filled
//       });
//     }

//     // --- Build stock object ---
//     const stockData = {
//       productName,
//       productType,
//       costPrice: costPriceNum,
//       sellingPrice: sellingPriceNum,
//       quantity: quantityNum,
//       supplierName,
//       supplierContact,
//       quality,
//       color,
//     };

//     // --- Save to DB ---
//     const newStock = new Stock(stockData);
//     const savedStock = await newStock.save();

//     console.log("Stock saved to DB:", savedStock);
//     req.flash("success_msg", "Stock added successfully!");
//     res.redirect("/stockList");
//   } catch (error) {
//     console.error("Error saving stock:", error);

//     // In case of Mongoose schema validation
//     const errors = error.errors
//       ? Object.values(error.errors).map((err) => err.message)
//       : [error.message];

//     res.render("stock", {
//       errors,
//       formData: req.body,
//     });
//   }
// });

// router.get("/manager", ensureAuthenticated, ensureManager, (req, res) => {
//   res.render("manager");
// });

// router.get("/stockList", async (req, res) => {
//   const items = await Stock.find().sort({ $natural: -1 });
//   console.log("Fetched items:", items); // Show actual data in console
//   res.render("stockList", { items });
// });

// // List All Stock
// router.get("/stockList", ensureAuthenticated, ensureManager, async (req, res) => {
//   try {
//     const items = await Stock.find().sort({ $natural: -1 });
//     console.log("Fetched items:", items); // Debug log

//     // Calculate summary statistics
//     const totalProducts = items.length;
//     const inStock = items.filter((item) => item.quantity > 10).length;
//     const lowStock = items.filter(
//       (item) => item.quantity > 0 && item.quantity <= 10
//     ).length;
//     const outOfStock = items.filter((item) => item.quantity === 0).length;

//     res.render("stockList", {
//       items,
//       totalProducts,
//       inStock,
//       lowStock,
//       outOfStock,
//     });
//   } catch (err) {
//     console.error("Error loading stock list:", err);
//     req.flash("error_msg", "Error loading stock list");
//     res.redirect("/manager");
//   }
// });

// router.put(
//   "/stockList/:id",
//   ensureAuthenticated,
//   ensureManager,
//   async (req, res) => {
//     // You can implement updating stock here
//     res.send("Update stock route - not implemented yet");
//   }
// );

// module.exports = router;



const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");
const Stock = require("../models/stockModel");


// GET: Render Stock Form (Add New Stock)
router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("stock", {
    errors: [],
    formData: {},
  });
});

// POST: Add New Stock
router.post("/stock", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
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

    // Validate required fields
    if (!productName || productName.trim() === "") {
      errors.push("Product Name is required");
    }
    if (!productType || productType.trim() === "") {
      errors.push("Product Type is required");
    }
    if (!quality || quality.trim() === "") {
      errors.push("Quality grade is required");
    }

    // Validate numeric fields
    const quantityNum = parseFloat(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum < 1) {
      errors.push("Quantity must be at least 1");
    }

    const sellingPriceNum = parseFloat(sellingPrice);
    if (!sellingPrice || isNaN(sellingPriceNum) || sellingPriceNum < 0) {
      errors.push("Selling Price is required and cannot be negative");
    }

    const costPriceNum = parseFloat(costPrice) || 0;

    // If validation fails, re-render form with errors
    if (errors.length > 0) {
      return res.render("stock", {
        errors,
        formData: req.body,
      });
    }

    // Create new stock entry
    const stockData = {
      productName: productName.trim(),
      productType: productType.trim(),
      costPrice: costPriceNum,
      sellingPrice: sellingPriceNum,
      quantity: quantityNum,
      supplierName: supplierName ? supplierName.trim() : "",
      supplierContact: supplierContact ? supplierContact.trim() : "",
      quality: quality.trim(),
      color: color ? color.trim() : "",
    };

    const newStock = new Stock(stockData);
    await newStock.save();

    req.flash("success_msg", "Stock added successfully!");
    res.redirect("/stockList");
  } catch (error) {
    console.error("Error saving stock:", error);

    // Handle Mongoose validation errors
    const errors = error.errors
      ? Object.values(error.errors).map((err) => err.message)
      : [error.message || "An error occurred while saving stock"];

    res.render("stock", {
      errors,
      formData: req.body,
    });
  }
});

// GET: Manager Dashboard
router.get("/manager", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("manager");
});

// GET: Stock List (View All Stock)
router.get(
  "/stockList",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    try {
      // Fetch all stock items, newest first
      const items = await Stock.find().sort({ createdAt: -1 });

      // Calculate summary statistics
      const totalProducts = items.length;
      const inStock = items.filter((item) => item.quantity > 10).length;
      const lowStock = items.filter(
        (item) => item.quantity > 0 && item.quantity <= 10
      ).length;
      const outOfStock = items.filter((item) => item.quantity === 0).length;

      res.render("stockList", {
        items,
        totalProducts,
        inStock,
        lowStock,
        outOfStock,
      });
    } catch (error) {
      console.error("Error loading stock list:", error);
      req.flash("error_msg", "Error loading stock list");
      res.redirect("/manager");
    }
  }
);


// GET: Edit Stock Form
router.get(
  "/stockList/edit/:id",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    try {
      const stock = await Stock.findById(req.params.id);

      if (!stock) {
        req.flash("error_msg", "Stock item not found");
        return res.redirect("/stockList");
      }

      res.render("editStock", {
        stock,
        errors: [],
      });
    } catch (error) {
      console.error("Error loading stock for edit:", error);
      req.flash("error_msg", "Error loading stock item");
      res.redirect("/stockList");
    }
  }
);

// POST: Update Stock
router.post(
  "/stockList/edit/:id",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    try {
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

      // Validate required fields
      if (!productName || productName.trim() === "") {
        errors.push("Product Name is required");
      }
      if (!productType || productType.trim() === "") {
        errors.push("Product Type is required");
      }
      if (!quality || quality.trim() === "") {
        errors.push("Quality grade is required");
      }

      // Validate numeric fields
      const quantityNum = parseFloat(quantity);
      if (!quantity || isNaN(quantityNum) || quantityNum < 0) {
        errors.push("Quantity cannot be negative");
      }

      const sellingPriceNum = parseFloat(sellingPrice);
      if (!sellingPrice || isNaN(sellingPriceNum) || sellingPriceNum < 0) {
        errors.push("Selling Price is required and cannot be negative");
      }

      const costPriceNum = parseFloat(costPrice) || 0;

      // If validation fails, re-render form with errors
      if (errors.length > 0) {
        const stock = await Stock.findById(req.params.id);
        return res.render("editStock", {
          errors,
          stock: { ...stock.toObject(), ...req.body },
        });
      }

      // Update stock
      const updatedStock = await Stock.findByIdAndUpdate(
        req.params.id,
        {
          productName: productName.trim(),
          productType: productType.trim(),
          costPrice: costPriceNum,
          sellingPrice: sellingPriceNum,
          quantity: quantityNum,
          supplierName: supplierName ? supplierName.trim() : "",
          supplierContact: supplierContact ? supplierContact.trim() : "",
          quality: quality.trim(),
          color: color ? color.trim() : "",
        },
        { new: true, runValidators: true }
      );

      if (!updatedStock) {
        req.flash("error_msg", "Stock item not found");
        return res.redirect("/stockList");
      }

      req.flash("success_msg", "Stock updated successfully!");
      res.redirect("/stockList");
    } catch (error) {
      console.error("Error updating stock:", error);

      const errors = error.errors
        ? Object.values(error.errors).map((err) => err.message)
        : [error.message || "An error occurred while updating stock"];

      const stock = await Stock.findById(req.params.id);
      res.render("editStock", {
        errors,
        stock: { ...stock.toObject(), ...req.body },
      });
    }
  }
);

// DELETE: Remove Stock Item
router.delete(
  "/stockList/:id",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    try {
      const deletedStock = await Stock.findByIdAndDelete(req.params.id);

      if (!deletedStock) {
        req.flash("error_msg", "Stock item not found");
        return res.redirect("/stockList");
      }

      req.flash("success_msg", "Stock deleted successfully!");
      res.redirect("/stockList");
    } catch (error) {
      console.error("Error deleting stock:", error);
      req.flash("error_msg", "Error deleting stock item");
      res.redirect("/stockList");
    }
  }
);


// GET: Low Stock Alert Page (Optional)
router.get(
  "/lowStock",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    try {
      const lowStockItems = await Stock.find({
        quantity: { $lte: 10, $gt: 0 },
      }).sort({ quantity: 1 });

      res.render("lowStock", {
        items: lowStockItems,
      });
    } catch (error) {
      console.error("Error loading low stock items:", error);
      req.flash("error_msg", "Error loading low stock items");
      res.redirect("/manager");
    }
  }
);

// GET: Out of Stock Page (Optional)
router.get(
  "/outOfStock",
  ensureAuthenticated,
  ensureManager,
  async (req, res) => {
    try {
      const outOfStockItems = await Stock.find({ quantity: 0 }).sort({
        productName: 1,
      });

      res.render("outOfStock", {
        items: outOfStockItems,
      });
    } catch (error) {
      console.error("Error loading out of stock items:", error);
      req.flash("error_msg", "Error loading out of stock items");
      res.redirect("/manager");
    }
  }
);

module.exports = router;
