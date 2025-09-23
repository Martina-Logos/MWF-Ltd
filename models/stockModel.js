const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
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
    required: true,
  },
  minStockLevel: {
    type: Number,
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
