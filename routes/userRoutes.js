// const express = require("express");
// const router = express.Router();

// // User model
// const UserModel = require("../models/userModel");
// const { ensureAuthenticated, ensureManager } = require("../middleware/auth");


// // User Management 
// router.get("/user", ensureAuthenticated, ensureManager, async (req, res) => {
//   try {
//     const users = await UserModel.find().lean();
//     res.render("user", { users, currentUser: req.user }); // pass logged-in user for header
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).send("Server Error");
//   }
// });

// // Create New User 
// router.post("/user", ensureAuthenticated, ensureManager, async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       username,
//       password, // plain text
//       role,
//       status,
//       inventoryAccess,
//       salesAccess,
//       userManagementAccess,
//     } = req.body;

//     const newUser = new UserModel({
//       firstName,
//       lastName,
//       email,
//       phone,
//       username,
//       password, // Passport-local will use this
//       role,
//       status,
//       permissions: {
//         inventory: !!inventoryAccess,
//         sales: !!salesAccess,
//         userManagement: !!userManagementAccess,
//       },
//     });

//     await newUser.save();
//     res.redirect("/user");
//   } catch (err) {
//     console.error("Error creating user:", err);
//     res.status(500).send("Error creating user");
//   }
// });

// // Edit User 
// router.post("/user/edit/:id", ensureAuthenticated, ensureManager, async (req, res) => {
//     try {
//       const userId = req.params.id;

//       const updateData = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         phone: req.body.phone,
//         username: req.body.username,
//         role: req.body.role,
//         status: req.body.status,
//         permissions: {
//           inventory: !!req.body.inventoryAccess,
//           sales: !!req.body.salesAccess,
//           userManagement: !!req.body.userManagementAccess,
//         },
//       };

//       // Update password if provided
//       if (req.body.password && req.body.password.trim() !== "") {
//         updateData.password = req.body.password;
//       }

//       await UserModel.findByIdAndUpdate(userId, updateData);
//       res.redirect("/user");
//     } catch (err) {
//       console.error("Error updating user:", err);
//       res.status(500).send("Error updating user");
//     }
//   }
// );

// // Delete User 
// router.post("/user/delete/:id", ensureAuthenticated, ensureManager, async (req, res) => {
//     try {
//       await UserModel.findByIdAndDelete(req.params.id);
//       res.redirect("/user");
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       res.status(500).send("Error deleting user");
//     }
//   }
// );

// module.exports = router;



const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");

const { ensureAuthenticated, ensureManager } = require("../middleware/auth");
const passport = require("passport"); 


// GET – Users List
router.get("/user", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const users = await UserModel.find().lean();
    res.render("user", { users, currentUser: req.user });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server Error");
  }
});


// GET – Add New User Form
// URL: /user/signup
router.get("/signup", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("signup", { currentUser: req.user });
});


// POST – Create New User
// URL: /user/signup
router.post("/signup", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      inventoryAccess,
      salesAccess,
    } = req.body;

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      phone,
      role,
      permissions: {
        inventory: !!inventoryAccess,
        sales: !!salesAccess,
      },
    });

    // Hash & save password using passport-local-mongoose
    await UserModel.register(newUser, password);

    res.redirect("/user"); // back to users list
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});


// Edit User
// GET – Edit User Form
router.get("/user/edit/:id", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).lean();
    if (!user) return res.status(404).send("User not found");

    res.render("editUser", { user, currentUser: req.user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Server Error");
  }
});


router.post("/user/edit/:id", ensureAuthenticated, ensureManager, async (req, res) => {
    try {
      const userId = req.params.id;

      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        permissions: {
          inventory: !!req.body.inventoryAccess,
          sales: !!req.body.salesAccess,
        },
      };

      if (req.body.password && req.body.password.trim() !== "") {
        updateData.password = req.body.password;
      }

      await UserModel.findByIdAndUpdate(userId, updateData);
      res.redirect("/user");
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Error updating user");
    }
  }
);


// POST – Delete User
// URL: /user/delete/:id
router.post("/user/delete/:id", ensureAuthenticated, ensureManager, async (req, res) => {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.redirect("/user");
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Error deleting user");
    }
  }
);

module.exports = router;




