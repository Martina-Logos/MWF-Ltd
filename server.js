//1.Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");
const methodOverride = require("method-override");

require("dotenv").config();

//import models
const userModel = require("./models/userModel");

//import routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const indexRoutes = require("./routes/indexRoutes");

//2.Instantiations
const app = express();
const port = 3000;

//3.Configurations
app.locals.moment = moment;

//Setting up mongodb connection
mongoose.connect(process.env.MONGODB_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

mongoose.connection
  .on("open", () => {
    console.log("Mongoose successfully connected");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

//setting view engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//non existent route handler
// app.use((req, res) => {
//   res.status(404).send(`Oops! Route not found.`);
// });

//4. Middleware
// app.use(express.static("public"));     //static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); //Helps to pass data from forms
app.use(express.json());

//express session configs
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //what we've specified mas how long the cookie hould run in the browser. 24-the number of hours in a day, 60-minutes in an hour, 60-seconds in a minute, 1000-number of milliseconds in a second
  })
);

//passport configs
app.use(passport.initialize());
app.use(passport.session());

//authenticate with passport local strategy
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


//5. Routes
//Using imported routes
app.use("/", authRoutes);
app.use("/", stockRoutes);
app.use("/", salesRoutes);
app.use("/", indexRoutes);


//non existent route handler second last
app.use((req, res) => {
  res.status(404).send("Oops! Route not found");
});

//6. Bootstrapping Server
// //This line should always be the last line in this file.
app.listen(port, () =>
  console.log(`listening on port http://localhost/${port}`)
);
