const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['manager', 'salesAgent', 'attendant'],
    required: true,
  },
  permissions: {
    inventoryAccess: {
      type: Boolean,
      default: true,
    },
    salesAccess: {
      type: Boolean,
      default: true,
    },
  },
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });


module.exports = mongoose.model("UserModel", userSchema);
