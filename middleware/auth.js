// // Ensure the user is authenticated
// exports.ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/signup"); // or "/login"
// };

// // Ensure user is a Sales Agent
// exports.ensureAgent = (req, res, next) => {
//   if (req.isAuthenticated() && req.user.role === "attendant") {
//     return next();
//   }
//   res.redirect("/");
// };

// // Ensure user is a Manager
// exports.ensureManager = (req, res, next) => {
//   if (req.isAuthenticated() && req.user.role === "manager") {
//     return next();
//   }
//   res.redirect("/");
// };

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
  if (req.isAuthenticated() && req.user.role === "salesAgent") return next();
  return res
    .status(403)
    .render("accessDenied", { message: "Sales Agents only." });
}

// New: Attendant middleware
function ensureAttendant(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "attendant") return next();
  return res.status(403).render("accessDenied", { message: "Attendants only." });
}

// Middleware for shared pages
function ensureManagerOrSalesAgent(req, res, next) {
  if (
    req.isAuthenticated() &&
    (req.user.role === "manager" || req.user.role === "salesAgent")
  )
    return next();
  return res
    .status(403)
    .render("accessDenied", { message: "Unauthorized access." });
}

function ensureManagerOrAttendant(req, res, next) {
  if (
    req.isAuthenticated() &&
    (req.user.role === "manager" || req.user.role === "attendant")
  )
    return next();
  return res
    .status(403)
    .render("accessDenied", { message: "Unauthorized access." });
}

module.exports = {
  ensureAuthenticated,
  ensureManager,
  ensureSalesAgent,
  ensureAttendant,
  ensureManagerOrSalesAgent,
  ensureManagerOrAttendant,
};


