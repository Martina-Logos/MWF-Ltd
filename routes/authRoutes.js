// // const express = require("express");
// // const router = express.Router();
// // const passport = require("passport");
// // const flash = require("connect-flash");
// // const UserModel = require("../models/userModel");

// // // Middleware to ensure user is authenticated
// // function ensureAuthenticated(req, res, next) {
// //   if (req.isAuthenticated()) return next();
// //   res.redirect("/login");
// // }

// // // Landing page
// // router.get("/", (req, res) => {
// //   res.render("index", { title: "MWF" });
// // });

// // // Signup page
// // router.get("/signup", (req, res) => {
// //   res.render("signup", { title: "Signup Page" });
// // });

// // // Signup form submission
// // router.post("/signup", async (req, res) => {
// //   try {
// //     const {
// //       firstName,
// //       lastName,
      
// //       email,
// //       phone,
// //       password,
// //       role,
// //       inventoryAccess,
// //       salesAccess,
// //     } = req.body;

// //     const existingUser = await UserModel.findOne({ email });
// //     if (existingUser) {
// //       req.flash("error_msg", "Email is already registered");
// //       return res.redirect("/signup");
// //     }

// //     const newUser = new UserModel({
// //       firstName,
// //       lastName,
// //       email,
// //       phone,
// //       role,
// //       permissions: {
// //         inventory: !!inventoryAccess,
// //         sales: !!salesAccess,
// //       },
// //     });

// //     // Hash & save password using passport-local-mongoose
// //     await UserModel.register(newUser, password);

// //     req.flash("success_msg", "User registered successfully. Please login.");
// //     res.redirect("/login");
// //   } catch (error) {
// //     console.error("Registration error:", error);
// //     req.flash("error_msg", "Registration failed. Try again.");
// //     res.redirect("/signup");
// //   }
// // });

// // // Login page
// // router.get("/login", (req, res) => {
// //   res.render("login", {
// //     title: "Login Page",
// //     error_msg: req.flash("error_msg"),
// //     success_msg: req.flash("success_msg"),
// //   });
// // });

// // // Login submission
// // router.post("/login", (req, res, next) => {
// //   passport.authenticate("local", (err, user, info) => {
// //     if (err) return next(err);

// //     if (!user) {
// //       req.flash(
// //         "error_msg",
// //         "Unauthorized access! Please check your credentials."
// //       );
// //       return res.redirect("/login");
// //     }

// //     req.logIn(user, (err) => {
// //       if (err) return next(err);

// //       req.session.user = user; // store user in session

// //       // Role-based redirects
// //       if (user.role === "manager") return res.redirect("/manager");
// //       if (user.role === "attendant") return res.redirect("/salesAgent");

// //       return res.render("noneuser");
// //     });
// //   })(req, res, next);
// // });

// // // Manager dashboard
// // router.get("/manager", ensureAuthenticated, (req, res) => {
// //   res.render("manager", {
// //     title: "Manager Dashboard",
// //     currentUser: req.user, // <-- matches Pug variable
// //   });
// // });

// // // Sales agent dashboard
// // router.get("/salesAgent", ensureAuthenticated, (req, res) => {
// //   res.render("salesAgent", {
// //     title: "Sales Agent Dashboard",
// //     currentUser: req.user, // <-- matches Pug variable
// //   });
// // });

// // // Logout
// // router.get("/logout", (req, res, next) => {
// //   req.flash("success_msg", "You have logged out successfully.");
// //   req.logout((err) => {
// //     if (err) return next(err);
// //     req.session.destroy(() => {
// //       res.clearCookie("connect.sid"); // optional
// //       res.redirect("/login");
// //     });
// //   });
// // });

// // module.exports = router;


// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const flash = require("connect-flash");
// const UserModel = require("../models/userModel");
// const Stock = require("../models/stockModel");
// const Sales = require("../models/salesModel");


// // --- Role-based middleware ---
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   req.flash("error_msg", "Please log in first.");
//   return res.redirect("/login");
// }

// function ensureManager(req, res, next) {
//   if (req.isAuthenticated() && req.user.role === "manager") return next();
//   return res.status(403).render("accessDenied", { message: "Managers only." });
// }

// function ensureSalesAgent(req, res, next) {
//   if (req.isAuthenticated() && req.user.role === "attendant") return next();
//   return res
//     .status(403)
//     .render("accessDenied", { message: "Sales Agents only." });
// }

// function ensureManagerOrSalesAgent(req, res, next) {
//   if (
//     req.isAuthenticated() &&
//     (req.user.role === "manager" || req.user.role === "attendant")
//   )
//     return next();
//   return res
//     .status(403)
//     .render("accessDenied", { message: "Unauthorized access." });
// }


// // --- Dashboard API ---
// router.get("/api/dashboard", ensureManager, async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // start of today

//     // Today's sales
//     const salesAgg = await SalesModel.aggregate([
//       { $match: { saleDate: { $gte: today } } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//     ]);
//     const salesAmount = Number(salesAgg[0]?.total || 0);

//     // Total stock value
//     const stockAgg = await StockModel.aggregate([
//       { $group: { _id: null, totalValue: { $sum: { $multiply: ["$quantity", "$sellingPrice"] } } } }
//     ]);
//     const stockValue = Number(stockAgg[0]?.totalValue || 0);

//     // Low stock items (quantity ≤ 5)
//     const lowStockItems = await StockModel.countDocuments({ quantity: { $lte: 5 } });

//     res.json({
//       salesAmount,
//       stockValue,
//       lowStockItems
//     });
//   } catch (err) {
//     console.error("Dashboard API error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // Weekly sales for last 7 days
// // router.get("/api/dashboard/weekly-sales", ensureManager, async (req, res) => {
// //   try {
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);

// //     const last7Days = Array.from({ length: 7 }, (_, i) => {
// //       const day = new Date(today);
// //       day.setDate(today.getDate() - i);
// //       return day;
// //     }).reverse();

// //     const salesData = [];

// //     for (const day of last7Days) {
// //       const nextDay = new Date(day);
// //       nextDay.setDate(day.getDate() + 1);

// //       const Sales = await Sales.aggregate([
// //         { $match: { saleDate: { $gte: day, $lt: nextDay } } },
// //         { $group: { _id: null, total: { $sum: "$totalAmount" } } }
// //       ]);

// //       salesData.push(ales[0]?.total || 0);
// //     }

// //     const labels = last7Days.map(d =>
// //       d.toLocaleDateString("en-GB", { weekday: "short" })
// //     );

// //     res.json({ labels, data: salesData });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });


// // Stock category distribution

// // Weekly sales chart
// router.get("/api/dashboard/weekly-sales", ensureManager, async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const last7Days = Array.from({ length: 7 }, (_, i) => {
//       const d = new Date(today);
//       d.setDate(today.getDate() - i);
//       return d;
//     }).reverse();

//     const salesData = [];

//     for (const day of last7Days) {
//       const nextDay = new Date(day);
//       nextDay.setDate(day.getDate() + 1);

//       const daySales = await SalesModel.aggregate([
//         { $match: { saleDate: { $gte: day, $lt: nextDay } } },
//         { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//       ]);

//       salesData.push(daySales[0]?.total || 0);
//     }

//     const labels = last7Days.map(d =>
//       d.toLocaleDateString("en-GB", { weekday: "short" })
//     );

//     res.json({ labels, data: salesData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.get("/api/dashboard/stock-categories", ensureManager, async (req, res) => {
//   try {
//     const categories = ["timber", "poles", "hardwood", "softwood", "furniture"];
//     const data = [];

//     for (const cat of categories) {
//       const count = await Stock.countDocuments({ productType: cat });
//       data.push(count);
//     }

//     res.json({ labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)), data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // --- Public routes ---
// router.get("/", (req, res) => res.render("index", { title: "MWF" }));

// router.get("/signup", (req, res) =>
//   res.render("signup", { title: "Signup Page" })
// );

// router.post("/signup", async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       password,
//       role,
//       inventoryAccess,
//       salesAccess,
//     } = req.body;

//     if (!firstName || !lastName || !email || !password || !role) {
//       req.flash("error_msg", "Please fill in all required fields.");
//       return res.redirect("/signup");
//     }

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       req.flash("error_msg", "Email is already registered");
//       return res.redirect("/signup");
//     }

//     const newUser = new UserModel({
//       firstName,
//       lastName,
//       email,
//       phone,
//       role,
//       permissions: {
//         inventory: !!inventoryAccess,
//         sales: !!salesAccess,
//       },
//     });

//     await UserModel.register(newUser, password);

//     req.flash("success_msg", "User registered successfully. Please login.");
//     res.redirect("/login");
//   } catch (error) {
//     console.error("Registration error:", error);
//     req.flash("error_msg", "Registration failed. Try again.");
//     res.redirect("/signup");
//   }
// });

// // --- Login routes ---
// router.get("/login", (req, res) =>
//   res.render("login", {
//     title: "Login Page",
//     error_msg: req.flash("error_msg"),
//     success_msg: req.flash("success_msg"),
//   })
// );

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);

//     if (!user) {
//       req.flash("error_msg", "Unauthorized access! Check your credentials.");
//       return res.redirect("/login");
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       req.session.user = user;

//       // Role-based redirects
//       if (user.role === "manager") return res.redirect("/manager");
//       if (user.role === "attendant") return res.redirect("/salesAgent");

//       return res.render("noneuser");
//     });
//   })(req, res, next);
// });

// // --- Manager routes ---
// router.get("/manager", ensureManager, (req, res) =>
//   res.render("manager", { title: "Manager Dashboard", currentUser: req.user })
// );

// router.get("/recordSales", ensureManager, (req, res) =>
//   res.render("recordSales", { currentUser: req.user })
// );

// router.get("/salesList", ensureManager, (req, res) =>
//   res.render("salesList", { currentUser: req.user })
// );

// // --- Sales Agent routes ---
// router.get("/salesAgent", ensureSalesAgent, (req, res) =>
//   res.render("salesAgent", {
//     title: "Sales Agent Dashboard",
//     currentUser: req.user,
//   })
// );

// router.get("/sales", ensureSalesAgent, (req, res) =>
//   res.render("sales", { currentUser: req.user })
// );

// router.get("/invoice", ensureSalesAgent, (req, res) =>
//   res.render("invoice", { currentUser: req.user })
// );

// router.get("/customer", ensureSalesAgent, (req, res) =>
//   res.render("customer", { currentUser: req.user })
// );

// // --- Shared page (Stock List) ---
// router.get("/stockList", ensureManagerOrSalesAgent, async (req, res) => {
//   try {
//     const stockItems = await StockModel.find();
//     res.render("stockList", {
//       title: "Stock List",
//       currentUser: req.user,
//       stockItems,
//     });
//   } catch (err) {
//     console.error("Error fetching stock:", err);
//     req.flash("error_msg", "Failed to load stock list.");
//     res.redirect(req.get("referer") || "/");
//   }
// });

// // --- Logout ---
// router.get("/logout", (req, res, next) => {
//   req.flash("success_msg", "You have logged out successfully.");
//   req.logout((err) => {
//     if (err) return next(err);
//     req.session.destroy(() => {
//       res.clearCookie("connect.sid");
//       res.redirect("/login");
//     });
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const flash = require("connect-flash");
const UserModel = require("../models/userModel");
const Stock = require("../models/stockModel");
const Sales = require("../models/salesModel");

// --- Role-based middleware ---
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error_msg", "Please log in first.");
  return res.redirect("/login");
}

function ensureManager(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "manager") return next();
  return res.status(403).render("accessDenied", { message: "Managers only." });
}

function ensureSalesAgent(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "attendant") return next();
  return res
    .status(403)
    .render("accessDenied", { message: "Sales Agents only." });
}

function ensureManagerOrSalesAgent(req, res, next) {
  if (
    req.isAuthenticated() &&
    (req.user.role === "manager" || req.user.role === "attendant")
  )
    return next();
  return res
    .status(403)
    .render("accessDenied", { message: "Unauthorized access." });
}

// --- Dashboard API ---
router.get("/api/dashboard", ensureManager, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's sales
    const salesAgg = await Sales.aggregate([
      { $match: { saleDate: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const salesAmount = Number(salesAgg[0]?.total || 0);

    // Total stock value
    const stockAgg = await Stock.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ["$quantity", "$sellingPrice"] },
          },
        },
      },
    ]);
    const stockValue = Number(stockAgg[0]?.totalValue || 0);

    // Low stock items (quantity ≤ 5)
    const lowStockItems = await Stock.countDocuments({ quantity: { $lte: 5 } });

    res.json({
      salesAmount,
      stockValue,
      lowStockItems,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Weekly sales for last 7 days
router.get("/api/dashboard/weekly-sales", ensureManager, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d;
    }).reverse();

    const salesData = [];

    for (const day of last7Days) {
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const daySales = await Sales.aggregate([
        { $match: { saleDate: { $gte: day, $lt: nextDay } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);

      salesData.push(daySales[0]?.total || 0);
    }

    const labels = last7Days.map((d) =>
      d.toLocaleDateString("en-GB", { weekday: "short" })
    );

    res.json({ labels, data: salesData });
  } catch (err) {
    console.error("Weekly sales error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Stock category distribution
router.get(
  "/api/dashboard/stock-categories",
  ensureManager,
  async (req, res) => {
    try {
      const categories = [
        "timber",
        "poles",
        "hardwood",
        "softwood",
        "furniture",
      ];
      const data = [];

      for (const cat of categories) {
        const count = await Stock.countDocuments({ productType: cat });
        data.push(count);
      }

      res.json({
        labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
        data,
      });
    } catch (err) {
      console.error("Stock categories error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// --- Public routes ---
router.get("/", (req, res) => res.render("index", { title: "MWF" }));

router.get("/signup", (req, res) =>
  res.render("signup", { title: "Signup Page" })
);

router.post("/signup", async (req, res) => {
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

    if (!firstName || !lastName || !email || !password || !role) {
      req.flash("error_msg", "Please fill in all required fields.");
      return res.redirect("/signup");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      req.flash("error_msg", "Email is already registered");
      return res.redirect("/signup");
    }

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

    await UserModel.register(newUser, password);

    req.flash("success_msg", "User registered successfully. Please login.");
    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error_msg", "Registration failed. Try again.");
    res.redirect("/signup");
  }
});

// --- Login routes ---
router.get("/login", (req, res) =>
  res.render("login", {
    title: "Login Page",
    error_msg: req.flash("error_msg"),
    success_msg: req.flash("success_msg"),
  })
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.flash("error_msg", "Unauthorized access! Check your credentials.");
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.user = user;

      // Role-based redirects
      if (user.role === "manager") return res.redirect("/manager");
      if (user.role === "attendant") return res.redirect("/salesAgent");

      return res.render("noneuser");
    });
  })(req, res, next);
});

// --- Manager routes ---
router.get("/manager", ensureManager, (req, res) =>
  res.render("manager", { title: "Manager Dashboard", currentUser: req.user })
);

router.get("/recordSales", ensureManager, (req, res) =>
  res.render("recordSales", { currentUser: req.user })
);

router.get("/salesList", ensureManager, (req, res) =>
  res.render("salesList", { currentUser: req.user })
);

// --- Sales Agent routes ---
router.get("/salesAgent", ensureSalesAgent, (req, res) =>
  res.render("salesAgent", {
    title: "Sales Agent Dashboard",
    currentUser: req.user,
  })
);

router.get("/sales", ensureSalesAgent, (req, res) =>
  res.render("sales", { currentUser: req.user })
);

router.get("/invoice", ensureSalesAgent, (req, res) =>
  res.render("invoice", { currentUser: req.user })
);

router.get("/customer", ensureSalesAgent, (req, res) =>
  res.render("customer", { currentUser: req.user })
);

// --- Shared page (Stock List) ---
router.get("/stockList", ensureManagerOrSalesAgent, async (req, res) => {
  try {
    const stockItems = await Stock.find();
    res.render("stockList", {
      title: "Stock List",
      currentUser: req.user,
      stockItems,
    });
  } catch (err) {
    console.error("Error fetching stock:", err);
    req.flash("error_msg", "Failed to load stock list.");
    res.redirect(req.get("referer") || "/");
  }
});

// --- Logout ---
router.get("/logout", (req, res, next) => {
  req.flash("success_msg", "You have logged out successfully.");
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
});

module.exports = router;