const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- Personal Information ---
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // --- Account Information ---
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["manager", "attendant"],
      required: [true, "User role is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // --- Permissions ---
    permissions: {
      inventoryAccess: { type: Boolean, default: false },
      salesAccess: { type: Boolean, default: false },
      reportsAccess: { type: Boolean, default: false },
      userManagementAccess: { type: Boolean, default: false },
    },

    // --- System Tracking ---
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
