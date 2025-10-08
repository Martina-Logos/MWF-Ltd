// routes/orderStockRoutes.js
const express = require("express");
const router = express.Router();
const OrderStock = require("../models/orderStockModel");
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

// GET: Order Stock page (form)
router.get("/orderStock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("orderStock"); // pug template name: orderStock.pug
});

// POST: Create a new purchase order
router.post("/orderStock", ensureAuthenticated, ensureManager, async (req, res) => {
    try {
      const {
        supplier,
        orderDate,
        expectedDate,
        paymentTerms,
        transportMethod,
        deliveryCost,
        notes,
        product,
        quantity,
        cost,
      } = req.body;

      // Map items from form arrays
      const items = (Array.isArray(product) ? product : [product]).map(
        (p, i) => {
          const qty = Array.isArray(quantity) ? quantity[i] : quantity;
          const unitCost = Array.isArray(cost) ? cost[i] : cost;
          const total = qty * unitCost;

          return {
            product: p,
            quantity: qty,
            unitCost,
            total,
          };
        }
      );

      // Calculate subtotal
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const orderTotal = subtotal + (Number(deliveryCost) || 0);

      const newOrder = new OrderStock({
        supplier,
        orderDate,
        expectedDate,
        paymentTerms,
        items,
        transportMethod,
        deliveryCost,
        notes,
        subtotal,
        orderTotal,
      });

      await newOrder.save();

      req.flash("success_msg", "Stock recorded successfully");
      res.redirect("/orderList");
    } catch (err) {
      console.error("Error saving stock:", err);
      req.flash("error_msg", "Failed to record stock. Please check inputs.");
      res.redirect("/orderStock");
    }
  }
);

// View all orders
router.get("/orderList", ensureAuthenticated, ensureManager, async (req, res) => {
    try {
      const { supplier, status, startDate, endDate } = req.query;

      const filter = {};
      if (supplier) filter.supplier = supplier;
      if (status) filter.status = status;
      if (startDate || endDate) filter.orderDate = {};
      if (startDate) filter.orderDate.$gte = new Date(startDate);
      if (endDate) filter.orderDate.$lte = new Date(endDate);

      const orders = await OrderStock.find(filter).sort({ createdAt: -1 });

      res.render("orderList", { orders, filters: req.query });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send("Error fetching orders");
    }
  }
);

// 4. GET: View single order details
router.get("/order/:id", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const order = await OrderStock.findById(req.params.id);
    if (!order) {
      req.flash("error_msg", "Order not found");
      return res.redirect("/orderList");
    }
    res.render("orderDetails", { order });
  } catch (err) {
    console.error("Error fetching order:", err);
    req.flash("error_msg", "Failed to fetch order details");
    res.redirect("/orderList");
  }
});

module.exports = router;
