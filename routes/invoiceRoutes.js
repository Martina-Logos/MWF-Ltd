// const express = require("express");
// const router = express.Router();
// const Invoice = require("../models/invoiceModel");
// const { ensureAuthenticated, ensureSalesAgent } = require("../middleware/auth");

// // =============================
// // GET – Invoice creation form
// // URL: /invoice
// // =============================
// router.get(
//   "/invoice",
//   ensureAuthenticated,
//   ensureSalesAgent,
//   async (req, res) => {
//     try {
//       console.log("Loading invoice creation form...");

//       const latestInvoice = await Invoice.findOne().sort({ createdAt: -1 });
//       let nextNumber = "INV-2023-0001";

//       if (latestInvoice) {
//         const last = parseInt(latestInvoice.invoiceNumber.split("-").pop());
//         nextNumber = `INV-2023-${String(last + 1).padStart(4, "0")}`;
//       }

//       const today = new Date().toISOString().split("T")[0];
//       const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
//         .toISOString()
//         .split("T")[0];

//       res.render("invoice", {
//         title: "Create Invoice",
//         currentUser: req.user,
//         invoiceNumber: nextNumber,
//         today,
//         dueDate,
//       });
//     } catch (err) {
//       console.error("Error loading invoice form:", err);
//       req.flash("error_msg", "Error loading invoice form.");
//       res.redirect("/salesAgent");
//     }
//   }
// );

// // =============================
// // POST – Save new invoice
// // URL: /invoice (matching the form action)
// // =============================
// router.post(
//   "/invoice",
//   ensureAuthenticated,
//   ensureSalesAgent,
//   async (req, res) => {
//     console.log("Form data received:", req.body);
//     try {
//       const {
//         customerName,
//         customerCompany,
//         customerAddress,
//         customerPhone,
//         invoiceNumber,
//         invoiceDate,
//         dueDate,
//         notes,
//         subtotal,
//         tax,
//         discount,
//         total,
//         items,
//       } = req.body;

//       // Validate required fields
//       if (!customerName || !invoiceNumber || !invoiceDate) {
//         req.flash(
//           "error_msg",
//           "Customer name, invoice number, and date are required."
//         );
//         return res.redirect("/invoice");
//       }

//       // Parse items from form data
//       let itemsArray = [];

//       if (items) {
//         // Items come as items[0][description], items[0][quantity], etc.
//         // Convert to array of objects
//         const itemKeys = Object.keys(items);
//         const itemIndices = [
//           ...new Set(itemKeys.map((key) => key.match(/\d+/)?.[0])),
//         ].filter(Boolean);

//         itemsArray = itemIndices
//           .map((index) => {
//             const item = items[index];
//             const qty = parseFloat(item.quantity) || 0;
//             const price = parseFloat(item.price) || 0;

//             return {
//               description: item.description || "",
//               quantity: qty,
//               price: price,
//               total: qty * price,
//             };
//           })
//           .filter((item) => item.description); // Remove empty items
//       }

//       if (itemsArray.length === 0) {
//         req.flash("error_msg", "At least one item is required.");
//         return res.redirect("/invoice");
//       }

//       // Create invoice object
//       const newInvoice = new Invoice({
//         invoiceNumber,
//         invoiceDate,
//         dueDate: dueDate || null,
//         customerName,
//         customerCompany: customerCompany || "",
//         customerPhone: customerPhone || "",
//         customerAddress: customerAddress || "",
//         items: itemsArray,
//         subtotal: parseFloat(subtotal) || 0,
//         tax: parseFloat(tax) || 0,
//         discount: parseFloat(discount) || 0,
//         total: parseFloat(total) || 0,
//         notes: notes || "",
//         createdBy: req.user._id,
//       });

//       await newInvoice.save();
//       console.log("Invoice saved successfully:", newInvoice);

//       req.flash("success_msg", "Invoice created successfully.");
//       res.redirect("/invoiceList");
//     } catch (err) {
//       console.error("Error creating invoice:", err);

//       if (err.code === 11000) {
//         req.flash("error_msg", "Invoice number already exists.");
//       } else {
//         req.flash("error_msg", "Error creating invoice. Please try again.");
//       }

//       res.redirect("/invoice");
//     }
//   }
// );

// // =============================
// // GET – List all invoices
// // URL: /invoiceList (matching your sidebar link)
// // =============================
// router.get(
//   "/invoiceList",
//   ensureAuthenticated,
//   ensureSalesAgent,
//   async (req, res) => {
//     try {
//       console.log("Fetching all invoices...");
//       const invoices = await Invoice.find()
//         .sort({ createdAt: -1 })
//         .populate("createdBy", "name email");

//       console.log(`Found ${invoices.length} invoices`);

//       res.render("invoiceList", {
//         title: "Invoice List",
//         currentUser: req.user,
//         invoices,
//       });
//     } catch (err) {
//       console.error("Error fetching invoices:", err);
//       req.flash("error_msg", "Error fetching invoices.");
//       res.redirect("/salesAgent");
//     }
//   }
// );

// // =============================
// // GET – View single invoice
// // URL: /invoice/view/:id
// // =============================
// router.get(
//   "/invoice/view/:id",
//   ensureAuthenticated,
//   ensureSalesAgent,
//   async (req, res) => {
//     try {
//       console.log(`Fetching invoice with ID: ${req.params.id}`);
//       const invoice = await Invoice.findById(req.params.id).populate(
//         "createdBy",
//         "name email"
//       );

//       if (!invoice) {
//         req.flash("error_msg", "Invoice not found.");
//         return res.redirect("/invoiceList");
//       }

//       res.render("invoiceView", {
//         title: "Invoice Details",
//         currentUser: req.user,
//         invoice,
//       });
//     } catch (err) {
//       console.error("Error viewing invoice:", err);
//       req.flash("error_msg", "Error loading invoice details.");
//       res.redirect("/invoiceList");
//     }
//   }
// );

// // =============================
// // POST – Delete invoice
// // URL: /invoice/delete/:id
// // =============================
// router.post(
//   "/invoice/delete/:id",
//   ensureAuthenticated,
//   ensureSalesAgent,
//   async (req, res) => {
//     try {
//       console.log(`Deleting invoice with ID: ${req.params.id}`);
//       await Invoice.findByIdAndDelete(req.params.id);

//       req.flash("success_msg", "Invoice deleted successfully.");
//       res.redirect("/invoiceList");
//     } catch (err) {
//       console.error("Error deleting invoice:", err);
//       req.flash("error_msg", "Error deleting invoice.");
//       res.redirect("/invoiceList");
//     }
//   }
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoiceModel");
const { ensureAuthenticated, ensureSalesAgent } = require("../middleware/auth");

// GET – Invoice creation form
// URL: /invoice
router.get(
  "/invoice",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    try {
      console.log("Loading invoice creation form...");

      const latestInvoice = await Invoice.findOne().sort({ createdAt: -1 });
      let nextNumber = "INV-2025-0001";

      if (latestInvoice) {
        const last = parseInt(latestInvoice.invoiceNumber.split("-").pop());
        const year = new Date().getFullYear();
        nextNumber = `INV-${year}-${String(last + 1).padStart(4, "0")}`;
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

// POST – Save new invoice
// URL: /invoice
router.post(
  "/invoice",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    console.log("Form data received:", req.body);
    try {
      const {
        customerName,
        customerCompany,
        customerAddress,
        customerPhone,
        invoiceNumber,
        invoiceDate,
        dueDate,
        notes,
        subtotal,
        tax,
        discount,
        total,
        items,
      } = req.body;

      // Validate required fields
      if (!customerName || !invoiceNumber || !invoiceDate) {
        req.flash(
          "error_msg",
          "Customer name, invoice number, and date are required."
        );
        return res.redirect("/invoice");
      }

      // Parse items from form data
      let itemsArray = [];

      if (items) {
        const itemKeys = Object.keys(items);
        const itemIndices = [
          ...new Set(itemKeys.map((key) => key.match(/\d+/)?.[0])),
        ].filter(Boolean);

        itemsArray = itemIndices
          .map((index) => {
            const item = items[index];
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;

            return {
              description: item.description || "",
              quantity: qty,
              price: price,
              total: qty * price,
            };
          })
          .filter((item) => item.description);
      }

      if (itemsArray.length === 0) {
        req.flash("error_msg", "At least one item is required.");
        return res.redirect("/invoice");
      }

      // Create invoice object
      const newInvoice = new Invoice({
        invoiceNumber,
        invoiceDate,
        dueDate: dueDate || null,
        customerName,
        customerCompany: customerCompany || "",
        customerPhone: customerPhone || "",
        customerAddress: customerAddress || "",
        items: itemsArray,
        subtotal: parseFloat(subtotal) || 0,
        tax: parseFloat(tax) || 0,
        discount: parseFloat(discount) || 0,
        total: parseFloat(total) || 0,
        notes: notes || "",
        createdBy: req.user._id,
      });

      await newInvoice.save();
      console.log("Invoice saved successfully:", newInvoice);

      req.flash("success_msg", "Invoice created successfully.");
      res.redirect("/invoiceList");
    } catch (err) {
      console.error("Error creating invoice:", err);

      if (err.code === 11000) {
        req.flash("error_msg", "Invoice number already exists.");
      } else {
        req.flash("error_msg", "Error creating invoice. Please try again.");
      }

      res.redirect("/invoice");
    }
  }
);

// GET – List all invoices
// URL: /invoiceList
router.get(
  "/invoiceList",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    try {
      console.log("Fetching all invoices...");
      const invoices = await Invoice.find().sort({ createdAt: -1 });

      console.log(`Found ${invoices.length} invoices`);

      res.render("invoiceList", {
        title: "Invoice List",
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

// GET – View single invoice
// URL: /invoice/view/:id
router.get(
  "/invoice/view/:id",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    try {
      console.log(`Fetching invoice with ID: ${req.params.id}`);
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        req.flash("error_msg", "Invoice not found.");
        return res.redirect("/invoiceList");
      }

      res.render("invoiceView", {
        title: "Invoice Details",
        currentUser: req.user,
        invoice,
      });
    } catch (err) {
      console.error("Error viewing invoice:", err);
      req.flash("error_msg", "Error loading invoice details.");
      res.redirect("/invoiceList");
    }
  }
);

// GET – Edit invoice form
// URL: /invoice/edit/:id
router.get(
  "/invoice/edit/:id",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    try {
      console.log(`Editing invoice with ID: ${req.params.id}`);
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        req.flash("error_msg", "Invoice not found.");
        return res.redirect("/invoiceList");
      }

      res.render("invoiceEdit", {
        title: "Edit Invoice",
        currentUser: req.user,
        invoice,
      });
    } catch (err) {
      console.error("Error loading invoice for editing:", err);
      req.flash("error_msg", "Error loading invoice edit form.");
      res.redirect("/invoiceList");
    }
  }
);

// POST – Delete invoice
// URL: /invoice/delete/:id
router.post(
  "/invoice/delete/:id",
  ensureAuthenticated,
  ensureSalesAgent,
  async (req, res) => {
    try {
      console.log(`Deleting invoice with ID: ${req.params.id}`);
      await Invoice.findByIdAndDelete(req.params.id);

      req.flash("success_msg", "Invoice deleted successfully.");
      res.redirect("/invoiceList");
    } catch (err) {
      console.error("Error deleting invoice:", err);
      req.flash("error_msg", "Error deleting invoice.");
      res.redirect("/invoiceList");
    }
  }
);

module.exports = router;