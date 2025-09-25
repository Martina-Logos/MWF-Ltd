const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // trim: true this one combines the users names which isn't necessary
  },
  password: {
    type: String,
  },
});

// Export Model
loginSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("loginModel", loginSchema);
