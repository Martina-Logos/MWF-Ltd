const express = require("express"); //In every route file, you must have these two as well as the button line of (module.exports)
// const { title } = require("process");
const router = express.Router();
const passport = require("passport");

const UserModel = require("../models/userModel");

//Getting the landing page
router.get("/index", (req, res) => {
  res.render("index");
});

//Getting the login form
router.get("/login", (req, res) => {
  res.render("login", { title: "login page" }); //Render replaces send file
});

router.get("/manager", (req, res) => {
  res.render("manager", { title: "Manager Dashboard" });
});

router.get("/salesAgent", (req, res) => {
  res.render("salesAgent", { title: "Sales Agent Dashboard" });
});

router.post(
  "/login",
  (req, res, next) => {
    console.log("Login attempt:", req.body); // login credentials
    next();
  },
  passport.authenticate("local", { failureRedirect: "/manager" }),
  (req, res) => {
    console.log("Authenticated user:", req.user); // login user
    req.session.user = req.user;
    if (req.user.role === "Manager") {
      res.redirect("/manager");
    } else if (req.user.role === "Attendant") {
      res.redirect("/salesAgent");
    } else {
      res.render("noneuser");
    }
  }
);

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send("Error loggingOut");
      }
      res.redirect("/");
    });
  }
});

module.exports = router;


















// router.post("/signup", async (req, res) => {
//   try {
//     const user = new UserModel(req.body);
//     console.log(req.body);
//     let existingUser = await UserModel.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(400).send("This email already exists");
//     } else {
//       await UserModel.register(user, req.body.password, (error) => {
//         if (error) {
//           throw error;
//         }
//         res.redirect("/signin");
//       });
//     }
//   } catch (error) {
//     res.status(400).send("Try again");
//   }
// });

// router.get("/login", (req, res) => {
//   res.render("login"); //Render replaces send file
// });

// router.post(
//   "/signin",
//   passport.authenticate("Local", { failureRedirect: "/signup" }),
//   (req, res) => {
//     req.session.user = req.user;
//     if (req.user.role === "Manager") {
//       res.redirect("/dashboard");
//     } else if (req.user.role === "Attendant") {
//       res.redirect("/stock");
//     } else res.render("noneuser");
//   }
// );
