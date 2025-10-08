// models/customerModel.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    businessType: {
      type: String,
      required: [true, "Business type is required"],
      enum: [
        "construction",
        "furniture_dealer",
        "manufacturer",
        "contractor",
        "retailer",
        "other",
      ],
    },
    taxId: {
      type: String,
      trim: true,
    },
    customerSince: {
      type: Date,
      default: Date.now,
    },

    // Contact Information
    contactPerson: {
      type: String,
      required: [true, "Primary contact person is required"],
      trim: true,
    },
    contactTitle: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Address Information
    streetAddress: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },

    // Business Details
    paymentTerms: {
      type: String,
      required: [true, "Payment terms are required"],
      enum: ["cod", "net7", "net15", "net30", "net60"],
    },
    preferredProducts: {
      type: [String], // multiple selection allowed
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Customer", customerSchema);
