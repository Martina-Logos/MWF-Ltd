const express = require("express");
const router = express.Router();
const OrderStock = require("../models/orderStockModel");

// GET form
router.get("/orderStock/new", (req, res) => {
  res.render("orderStock"); // your form page
});

// POST order
router.post("/orderStock", async (req, res) => {
  try {
    const {
      supplier,
      orderDate,
      expectedDate,
      paymentTerms,
      product,
      quantity,
      cost,
      shippingMethod,
      shippingCost,
      notes,
    } = req.body;

    if (!product) return res.status(400).send("No products selected");

    const items = [];

    if (Array.isArray(product)) {
      product.forEach((p, i) => {
        items.push({
          product: p,
          quantity: parseFloat(quantity[i]),
          cost: parseFloat(cost[i]),
          total: parseFloat(quantity[i]) * parseFloat(cost[i]),
        });
      });
    } else {
      items.push({
        product,
        quantity: parseFloat(quantity),
        cost: parseFloat(cost),
        total: parseFloat(quantity) * parseFloat(cost),
      });
    }

    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const total = subtotal + parseFloat(shippingCost || 0);

    const order = new OrderStock({
      supplier,
      orderDate,
      expectedDate,
      paymentTerms,
      items,
      shippingMethod,
      shippingCost: shippingCost || 0,
      notes,
      subtotal,
      orderTotal: total,
    });

    const savedOrder = await order.save();
    console.log("Order saved:", savedOrder); // Check terminal

    res.redirect("/orderStock/new"); // redirect after success
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

module.exports = router;





// const express = require("express");
// const router = express.Router();
// const OrderStock = require("../models/orderStockModel");

// // GET /orderStock - list all orders
// router.get("/orderStock", async (req, res) => {
//   try {
//     const orders = await OrderStock.find().sort({ createdAt: -1 });
//     console.log("Fetched orders:", orders); // should print to terminal
//     res.render("orderStock", { orders });
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).send("Error fetching orders");
//   }
// });

// // GET /orderStock/new - show form
// router.get("/orderStock/new", (req, res) => {
//   res.render("orderStock"); // your form pug file
// });

// // POST /orderStock - create new order
// router.post("/orderStock", async (req, res) => {
//   try {
//     const {
//       supplier,
//       orderDate,
//       expectedDate,
//       paymentTerms,
//       supplierContact,
//       supplierPhone,
//       supplierEmail,
//       supplierAddress,
//       product,
//       quantity,
//       cost,
//       shippingMethod,
//       shippingCost,
//       notes,
//     } = req.body;

//     const items = [];
//     if (Array.isArray(product)) {
//       product.forEach((p, i) => {
//         const qty = parseFloat(quantity[i]);
//         const unitCost = parseFloat(cost[i]);
//          if (p && !isNaN(qty) && !isNaN(unitCost)) {
//            items.push({
//              product: p,
//              quantity: qty,
//              cost: unitCost,
//              total: qty * unitCost,
//            });
//          }
//       });
//     } else if (product) {
//       items.push({
//         product,
//         quantity: parseFloat(quantity),
//         cost: parseFloat(cost),
//         total: parseFloat(quantity) * parseFloat(cost),
//       });
//     }

//     const subtotal = items.reduce((sum, i) => sum + i.total, 0);
//     const total = subtotal + parseFloat(shippingCost || 0);

//     const order = new OrderStock({
//       supplier,
//       orderDate,
//       expectedDate,
//       paymentTerms,
//       supplierContact,
//       supplierPhone,
//       supplierEmail,
//       supplierAddress,
//       items,
//       shippingMethod,
//       shippingCost: shippingCost || 0,
//       notes,
//       subtotal,
//       orderTotal: total,
//       createdBy: req.user && req.user._id ? req.user._id : null,
//     });

//     await order.save();
//     console.log("Order saved:", order); // check in terminal
//     res.redirect("/orderStock");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error creating purchase order");
//   }
// });

//module.exports = router;
