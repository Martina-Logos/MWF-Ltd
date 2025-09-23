const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    enum: ["timber", "poles", "hardwood", "softwood", "furniture", "other"],
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    enum: ["premium", "standard", "economy"],
    required: true,
  },
  supplierName: {
    type: String,
    required: true,
  },
  supplierContact: {
    type: String,
    required: true,
  },
  quality: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("StockModel", stockSchema);
