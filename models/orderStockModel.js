// models/orderStockModel.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String,
    required: [true, "Product is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  unitCost: {
    type: Number,
    required: [true, "Unit cost is required"],
    min: [0, "Unit cost cannot be negative"],
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total cannot be negative"],
  },
});

const orderStockSchema = new mongoose.Schema(
  {
    supplier: {
      type: String,
      required: [true, "Supplier is required"],
      trim: true,
    },
    orderDate: {
      type: Date,
      required: [true, "Order date is required"],
    },
    expectedDate: {
      type: Date,
    },
    paymentTerms: {
      type: String,
      enum: ["net15", "net30", "cod", "prepaid"],
      required: [true, "Payment terms are required"],
    },
    supplierDetails: {
      contactPerson: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one order item is required",
      },
    },
    transportMethod: {
      type: String,
      enum: ["delivery", "courier", "freight"],
      default: "delivery",
    },
    deliveryCost: {
      type: Number,
      default: 0,
      min: [0, "Delivery cost cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    orderTotal: {
      type: Number,
      required: true,
      min: [0, "Order total cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "received", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderStock", orderStockSchema);
