const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const signupSchema = new mongoose.Schema({
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
signupSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("userModel", signupSchema);
