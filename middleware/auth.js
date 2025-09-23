//ensure the user is authenticated
exports.ensureauthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/signup");
};

//ensure user is a Sales Agent
exports.ensureAgent = (req, res, next) => {
  if (req.session.user && req.session.role === "Sales Agent") {
    //make sure the name written on the role matches with the one saved in the database. It shouldn't be the manager but that other person handling either sales or sale.
    return next();
  }
  res.redirect("/");
};

//ensure user is a Manager
exports.ensureManager = (req, res, next) => {
  if (req.session.user && req.session.role === "Manager") {
    //make sure the name written on the role matches with the one saved in the database. It should only be the manager.
    return next();
  }
  res.redirect("/");
};
