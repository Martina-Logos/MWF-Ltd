const mongoose = require("mongoose");

// Schema for individual sale items
const saleItemSchema = new mongoose.Schema({
  productName: { type: String, required: true }, // Product name
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

// Schema for the overall sale
const salesSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    contactPerson: { type: String },
    address: { type: String },
    phone: { type: String },
  },
  items: [saleItemSchema], // Array of sale items
  paymentMethod: { type: String, required: true },
  salesAgent: { type: String, required: true },
  saleDate: { type: Date, required: true }, // Date of the sale
  provideTransport: { type: Boolean, default: false },
  transportFee: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }, // Record creation date
});

// Export the model
module.exports = mongoose.model("Sales", salesSchema);
