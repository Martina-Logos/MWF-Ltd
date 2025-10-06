// stockModel.js
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ["timber", "poles", "hardwood", "softwood", "furniture", "other"],
    },
    costPrice: {
      type: Number,
      required: false,
      min: [0, "Cost price cannot be negative"],
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: [0, "Selling price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    supplierName: {
      type: String,
      required: false,
      trim: true,
    },
    supplierContact: {
      type: String,
      trim: true,
    },
    quality: {
      type: String,
      required: [true, "Quality grade is required"],
      enum: ["premium", "standard", "economy"],
    },
    color: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports= mongoose.model("Stock", stockSchema);

