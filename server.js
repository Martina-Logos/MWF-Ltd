// 1. Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");
const methodOverride = require("method-override");
const flash = require("connect-flash");

require("dotenv").config();

// 2. Models
const UserModel = require("./models/userModel");
const Stock = require("./models/stockModel");
const Sales = require("./models/salesModel");
const OrderStock = require("./models/orderStockModel");
const Invoice = require("./models/invoiceModel");
const Customer = require("./models/customerModel");
const Schedule = require("./models/scheduleModel");

// 3. Routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const orderStockRoutes = require("./routes/orderStockRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const customerRoutes = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");
const salesDashRoutes = require("./routes/salesDashRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const attendantsRoutes = require("./routes/attendantsRoutes");

// 4. Instantiation
const app = express();
const port = 3001;

// 5. Configurations
app.locals.moment = moment;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {});
mongoose.connection
  .on("open", () => console.log("Mongoose successfully connected"))
  .on("error", (err) => console.log(`Connection error: ${err.message}`));

// Set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


// 6. Middleware
// Static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override 
app.use(methodOverride("_method"));

//SESSION SETUP (must come BEFORE flash!) 
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

// FLASH SETUP
app.use(flash());

// Global flash variables for templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// ROUTES
app.use("/", authRoutes);
app.use("/", stockRoutes);
app.use("/", salesRoutes);
app.use("/", orderStockRoutes);
app.use("/", invoiceRoutes);
app.use("/", customerRoutes);
app.use("/", userRoutes);
app.use("/", salesDashRoutes);
app.use("/", scheduleRoutes);
app.use("/", attendantsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Oops! Route not found");
});

// 7. Bootstrapping Server
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
