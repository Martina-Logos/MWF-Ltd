// // routes/invoiceRoutes.js
// const express = require("express");
// const router = express.Router();

// const Invoice = require("../models/invoiceModel");
// const { ensureAuthenticated, ensureAgent } = require("../middleware/auth");

// // GET - Show invoice creation form
// router.get("/invoice", ensureAuthenticated, ensureAgent, async (req, res) => {
//   try {
//     // Generate next invoice number
//     const latestInvoice = await Invoice.findOne().sort({ createdAt: -1 });
//     let nextNumber = "INV-2023-0001";
//     if (latestInvoice) {
//       const last = parseInt(latestInvoice.invoiceNumber.split("-").pop());
//       nextNumber = `INV-2023-${String(last + 1).padStart(4, "0")}`;
//     }

//     // Default dates
//     const today = new Date().toISOString().split("T")[0];
//     const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days later
//       .toISOString()
//       .split("T")[0];

//     res.render("invoice", {
//       title: "Create Invoice",
//       user: req.user,
//       invoiceNumber: nextNumber,
//       today,
//       dueDate,
//     });
//   } catch (err) {
//     console.error("Error loading invoice form:", err);
//     req.flash("error_msg", "Error loading invoice form.");
//     res.redirect("/salesAgent");
//   }
// });

// // POST - Create new invoice
// router.post("/invoice/save", ensureAuthenticated, ensureAgent, async (req, res) => {
// console.log("Form data received:", req.body);  
//   try {
//     const {
//       customerName,
//       customerContact,
//       customerAddress,
//       customerPhone,
//       invoiceNumber,
//       invoiceDate,
//       dueDate,
//       salesAgent,
//       paymentMethod,
//       provideTransport,
//       notes,
//       product,
//       quantity,
//       price,
//     } = req.body;

//     // Convert products, quantity, price into arrays
//     const productsArr = Array.isArray(product) ? product : [product];
//     const quantitiesArr = Array.isArray(quantity) ? quantity : [quantity];
//     const pricesArr = Array.isArray(price) ? price : [price];

//     if (!productsArr || !productsArr[0]) {
//       req.flash("error_msg", "At least one product is required.");
//       return res.redirect("/invoice");
//     }

//     // Build items array
//     const items = productsArr.map((prod, index) => {
//       const qty = parseFloat(quantitiesArr[index]) || 0;
//       const unitPrice = parseFloat(pricesArr[index]) || 0;
//       return {
//         product: prod,
//         quantity: qty,
//         unitPrice,
//         total: qty * unitPrice,
//       };
//     });

//     // Calculate totals
//     const subtotal = items.reduce((acc, item) => acc + item.total, 0);
//     const transportFee = provideTransport === "on" ? subtotal * 0.05 : 0;
//     const totalAmount = subtotal + transportFee;

//     // Create invoice
//     const newInvoice = new Invoice({
//       customer: {
//         name: customerName,
//         contactPerson: customerContact,
//         address: customerAddress,
//         phone: customerPhone,
//       },
//       invoiceNumber,
//       invoiceDate,
//       dueDate,
//       salesAgent,
//       paymentMethod,
//       items,
//       provideTransport: provideTransport === "on",
//       transportFee,
//       subtotal,
//       totalAmount,
//       notes,
//     });

//     await newInvoice.save();
//     console.log("Invoice saved successfully:", newInvoice);

//     req.flash("success_msg", "Invoice created successfully.");
//     res.redirect("/invoice"); // Redirect back to empty form
//   } catch (err) {
//     console.error("Error creating invoice:", err);
//     req.flash("error_msg", "Error creating invoice. Please try again.");
//     res.redirect("/invoice");
//   }
//   // GET: Render all invoices
//   router.get("/invoiceList", async (req, res) => {
//     try {
//       const invoices = await Invoice.find().sort({ createdAt: -1 });
//       res.render("invoiceList", { invoices });
//     } catch (err) {
//       console.error("Error fetching invoices:", err);
//       res.status(500).send("Server error while fetching invoices.");
//     }
//   });

// });



// module.exports = router;



const express = require("express");
const router = express.Router();

const Invoice = require("../models/invoiceModel");
const { ensureAuthenticated, ensureSalesAgent } = require("../middleware/auth"); // renamed for consistency

// GET - Show invoice creation form
router.get(
  "/invoice",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    try {
      const latestInvoice = await Invoice.findOne().sort({ createdAt: -1 });
      let nextNumber = "INV-2023-0001";
      if (latestInvoice) {
        const last = parseInt(latestInvoice.invoiceNumber.split("-").pop());
        nextNumber = `INV-2023-${String(last + 1).padStart(4, "0")}`;
      }

      const today = new Date().toISOString().split("T")[0];
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      res.render("invoice", {
        title: "Create Invoice",
        currentUser: req.user,
        invoiceNumber: nextNumber,
        today,
        dueDate,
      });
    } catch (err) {
      console.error("Error loading invoice form:", err);
      req.flash("error_msg", "Error loading invoice form.");
      res.redirect("/salesAgent");
    }
  }
);

// POST - Create new invoice
router.post(
  "/invoice/save",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    console.log("Form data received:", req.body);
    try {
      const {
        customerName,
        customerContact,
        customerAddress,
        customerPhone,
        invoiceNumber,
        invoiceDate,
        dueDate,
        salesAgent,
        paymentMethod,
        provideTransport,
        notes,
        product,
        quantity,
        price,
      } = req.body;

      const productsArr = Array.isArray(product) ? product : [product];
      const quantitiesArr = Array.isArray(quantity) ? quantity : [quantity];
      const pricesArr = Array.isArray(price) ? price : [price];

      if (!productsArr || !productsArr[0]) {
        req.flash("error_msg", "At least one product is required.");
        return res.redirect("/invoice");
      }

      const items = productsArr.map((prod, index) => {
        const qty = parseFloat(quantitiesArr[index]) || 0;
        const unitPrice = parseFloat(pricesArr[index]) || 0;
        return {
          product: prod,
          quantity: qty,
          unitPrice,
          total: qty * unitPrice,
        };
      });

      const subtotal = items.reduce((acc, item) => acc + item.total, 0);
      const transportFee = provideTransport === "on" ? subtotal * 0.05 : 0;
      const totalAmount = subtotal + transportFee;

      const newInvoice = new Invoice({
        customer: {
          name: customerName,
          contactPerson: customerContact,
          address: customerAddress,
          phone: customerPhone,
        },
        invoiceNumber,
        invoiceDate,
        dueDate,
        salesAgent,
        paymentMethod,
        items,
        provideTransport: provideTransport === "on",
        transportFee,
        subtotal,
        totalAmount,
        notes,
      });

      await newInvoice.save();
      console.log("Invoice saved successfully:", newInvoice);

      req.flash("success_msg", "Invoice created successfully.");
      res.redirect("/invoice");
    } catch (err) {
      console.error("Error creating invoice:", err);
      req.flash("error_msg", "Error creating invoice. Please try again.");
      res.redirect("/invoice");
    }
  }
);

// GET - Show all invoices
router.get(
  "/invoiceList",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    try {
      const invoices = await Invoice.find().sort({ createdAt: -1 });
      res.render("invoiceList", {
        title: "Invoices",
        currentUser: req.user,
        invoices,
      });
    } catch (err) {
      console.error("Error fetching invoices:", err);
      req.flash("error_msg", "Error fetching invoices.");
      res.redirect("/salesAgent");
    }
  }
);

module.exports = router;



