const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// --- GET /user : show page with all users ---
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Fetched users:", users);
    res.render("user", { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server Error");
  }
});

// --- POST /user : create new user ---
router.post("/user", async (req, res) => {
  try {
    console.log("Form body:", req.body); // 👀 to debug

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
      password: req.body.password, // NOTE: hash in production
      role: req.body.role,
      status: req.body.status,

      inventoryAccess: req.body.inventoryAccess ? true : false,
      salesAccess: req.body.salesAccess ? true : false,
      reportsAccess: req.body.reportsAccess ? true : false,
      userManagementAccess: req.body.userManagementAccess ? true : false,
    });

    await newUser.save();
    console.log("User saved:", newUser);
    res.redirect("/user"); // refresh list after adding
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Failed to create user");
  }
});

module.exports = router;
