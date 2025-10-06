// // routes/customerRoutes.js
// const express = require("express");
// const router = express.Router();

// const Customer = require("../models/customerModel");
// const { ensureAuthenticated, ensureAgent } = require("../middleware/auth");

// // GET: Show customer creation form
// router.get("/customer", ensureAuthenticated, ensureAgent, (req, res) => {
//   res.render("customer", {
//     title: "Add New Customer",
//     user: req.user,
//   });
// });

// // POST: Save new customer
// router.post("/customer", ensureAuthenticated, ensureAgent, async (req, res) => {
//   try {
//     const {
//       companyName,
//       businessType,
//       taxId,
//       customerSince,
//       contactPerson,
//       contactTitle,
//       phone,
//       email,
//       streetAddress,
//       city,
//       postalCode,
//       country,
//       paymentTerms,
//       creditLimit,
//       preferredProducts,
//     } = req.body;

//     // Build customer object
//     const newCustomer = new Customer({
//       companyName,
//       businessType,
//       taxId,
//       customerSince,
//       contactPerson,
//       contactTitle,
//       phone,
//       email,
//       streetAddress,
//       city,
//       postalCode,
//       country,
//       paymentTerms,
//       creditLimit,
//       preferredProducts: Array.isArray(preferredProducts)
//         ? preferredProducts
//         : preferredProducts
//         ? [preferredProducts]
//         : [],
//     });

//     await newCustomer.save();

//     req.flash("success_msg", "Customer added successfully");
//     res.redirect("/customer"); // reload form for another entry
//   } catch (error) {
//     console.error("Error adding customer:", error);
//     req.flash("error_msg", "Error adding customer. Please try again.");
//     res.redirect("/customer");
//   }

//   // GET customer list
//   router.get("/customerList", async (req, res) => {
//     try {
//       const customers = await Customer.find().lean();
//       res.render("customerList", { customers });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Error loading customer list");
//     }
//   });
// });

// module.exports = router;


// routes/customerRoutes.js
const express = require("express");
const router = express.Router();

const Customer = require("../models/customerModel");
const { ensureAuthenticated, ensureSalesAgent } = require("../middleware/auth");

// GET: Show customer creation form
router.get("/customer", ensureAuthenticated, ensureSalesAgent, (req, res) => {
  res.render("customer", {
    title: "Add New Customer",
    user: req.user,
  });
});

// POST: Save new customer and redirect to customer list
router.post("/customer", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const {
      companyName,
      businessType,
      taxId,
      customerSince,
      contactPerson,
      contactTitle,
      phone,
      email,
      streetAddress,
      city,
      postalCode,
      country,
      paymentTerms,
      creditLimit,
      preferredProducts,
    } = req.body;

    const newCustomer = new Customer({
      companyName,
      businessType,
      taxId,
      customerSince,
      contactPerson,
      contactTitle,
      phone,
      email,
      streetAddress,
      city,
      postalCode,
      country,
      paymentTerms,
      creditLimit,
      preferredProducts: Array.isArray(preferredProducts)
        ? preferredProducts
        : preferredProducts
        ? [preferredProducts]
        : [],
    });

    await newCustomer.save();

    req.flash("success_msg", "Customer added successfully");
    return res.redirect("/customerList");
  } catch (error) {
    console.error("Error adding customer:", error);
    req.flash("error_msg", "Error adding customer. Please try again.");
    return res.redirect("/customer");
  }
});

// GET: Customer list
router.get("/customerList", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const customers = await Customer.find().lean();
    res.render("customerList", {
      title: "Customer List",
      user: req.user,
      customers,
    });
  } catch (err) {
    console.error("Error loading customer list:", err);
    res.status(500).send("Error loading customer list");
  }
});

module.exports = router;

