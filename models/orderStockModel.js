const mongoose = require("mongoose");

  const orderItemSchema = new mongoose.Schema({
    product: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    cost: {
      type: Number,
      required: true,
      min: [0, "Cost cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
  });

const orderStockSchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: [true, "Supplier is required"],
    trim: true,
  },
  orderDate: {
    type: Date,
    required: [true, "Order Date is required"],
  },
  expectedDate: {
    type: Date,
  },
  paymentTerms: {
    type: String,
    enum: ["net15", "net30", "cod", "prepaid"],
    required: [true, "Payment terms are required"],
  },

  // Supplier details (optional but can be auto-filled)
  supplierContact: {
    type: String,
    trim: true,
  },
  supplierPhone: {
    type: String,
    trim: true,
  },
  supplierEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  supplierAddress: {
    type: String,
    trim: true,
  },

    // Order items
    items: {
      type: [orderItemSchema],
      validate: [
        (val) => val.length > 0,
        "At least one item is required in the order",
      ],
    },

    // Shipping info
    shippingMethod: {
      type: String,
      enum: ["pickup", "delivery", "courier", "freight", ""],
      default: "",
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, "Shipping cost cannot be negative"],
    },

    notes: {
      type: String,
      trim: true,
    },

    // Totals
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderStock", orderStockSchema);