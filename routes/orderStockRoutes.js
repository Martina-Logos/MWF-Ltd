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

      //   await newOrder.save();
      //   console.log("Order saved successfully:", newOrder);

      //   res.redirect("/orderStock"); // redirect back to form or success page
      // } catch (err) {
      //   console.error("Error saving order:", err);
      //   res.status(500).send("Error saving order: " + err.message);
      // }

      await newOrder.save();

      req.flash("success_msg", "Stock recorded successfully");
      res.redirect("/orderStock");
    } catch (err) {
      console.error("Error saving stock:", err);
      req.flash("error_msg", "Failed to record stock. Please check inputs.");
      res.redirect("/orderStock");
    }
  }
);

// (Optional) GET: View all orders
router.get("/orderList", ensureAuthenticated, ensureManager, async (req, res) => {
    try {
      const orders = await OrderStock.find().sort({ createdAt: -1 });
      res.render("orderList", { orders });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send("Error fetching orders");
    }
  }
);

module.exports = router;
