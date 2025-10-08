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
 console.log("POST /customer route hit"); // Add this
 console.log("Request body:", req.body);
 
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
      preferredProducts,
    } = req.body;

        console.log("Creating customer with data:", {companyName, businessType, });

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
      preferredProducts: Array.isArray(preferredProducts)
        ? preferredProducts
        : preferredProducts
        ? [preferredProducts]
        : [],
    });

    await newCustomer.save();
    console.log("Customer saved successfully");

    req.flash("success_msg", "Customer added successfully");
    return res.redirect("/customerList");
  } catch (error) {
    console.error("Error adding customer:", error);
    console.error("Error details:", error.message);
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

