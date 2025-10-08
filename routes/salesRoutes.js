// const express = require("express");
// const router = express.Router();
// const Stock = require("../models/stockModel");
// const Sale = require("../models/salesModel");

// // @desc    Render the sales form
// router.get("/sales", (req, res) => {
//   res.render("sales", { title: "Record Sale" });
// });

// // POST route to record a sale and update stock
// router.post("/sales", async (req, res) => {
//   try {
//     console.log("Incoming Sale Request Body:", req.body);
//     const {
//       customerName,
//       customerContact,
//       customerAddress,
//       customerPhone,
//       productName,
//       quantity,
//       price,
//       paymentMethod,
//       salesAgent,
//       provideTransport,
//       saleDate,
//     } = req.body;

//     let items = [];
//     let subtotal = 0;

//     // Handle multiple items
//     if (Array.isArray(productName)) {
//       for (let i = 0; i < productName.length; i++) {
//         const qty = Number(quantity[i]) || 0;
//         const prc = Number(price[i]) || 0;
//         const total = qty * prc;
//         subtotal += total;

//         items.push({
//           productName: productName[i],
//           quantity: qty,
//           price: prc,
//           total: total,
//         });
//       }
//     } else if (productName) {
//       // Single item case
//       const qty = Number(quantity) || 0;
//       const prc = Number(price) || 0;
//       const total = qty * prc;
//       subtotal = total;

//       items.push({
//         productName,
//         quantity: qty,
//         price: prc,
//         total: total,
//       });
//     }

//     // Calculate transport fee and total amount
//     const transportFee =
//       provideTransport === "on" || provideTransport === true
//         ? subtotal * 0.05
//         : 0;
//     const totalAmount = subtotal + transportFee;

//     // Log calculated totals before saving
//     console.log("Items:", items);
//     console.log("Subtotal:", subtotal);
//     console.log("Transport Fee:", transportFee);
//     console.log("Total Amount:", totalAmount);

//     // Create new sale document
//     const newSale = new Sale({
//       customer: {
//         name: customerName,
//         contactPerson: customerContact,
//         address: customerAddress,
//         phone: customerPhone,
//       },
//       items,
//       paymentMethod,
//       salesAgent,
//       saleDate: saleDate ? new Date(saleDate) : new Date(),
//       provideTransport: provideTransport === "on" || provideTransport === true,
//       transportFee,
//       subtotal,
//       totalAmount,
//     });

//     await newSale.save();
//     console.log("Sale recorded:", newSale);

//     res.redirect("/salesList");
//   } catch (err) {
//     console.error("Error saving sale:", err);
//     res.status(500).send("Failed to record sale");
//   }
// });

// // GET route to display all sales
// // GET route to display all sales
// router.get("/salesList", async (req, res) => {
//   try {
//     const { productName, date } = req.query; // optional search filters
//     const filter = {};

//     // Filter by product name (case-insensitive)
//     if (productName) {
//       filter["items.productName"] = { $regex: productName, $options: "i" };
//     }

//     // Filter by saleDate
//     if (date) {
//       const start = new Date(date);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);
//       filter.saleDate = { $gte: start, $lte: end };
//     }

//     // Fetch sales and sort by most recent
//     const sales = await Sale.find(filter).sort({ saleDate: -1 });

//     console.log("Found sales count:", sales.length);
//     console.log("Sample sale:", sales[0]);

//     // Ensure totals are always calculated for display
//     const sanitizedSales = sales.map((sale) => {
//       let subtotal = 0;
//       sale.items.forEach((item) => {
//         // fallback to 0 if values missing
//         const qty = Number(item.quantity) || 0;
//         const price = Number(item.price) || 0;
//         const total = qty * price;
//         item.total = total; // recalc in case missing
//         subtotal += total;
//       });

//       // Recalculate transport and total
//       const transportFee = sale.provideTransport ? subtotal * 0.05 : 0;
//       const totalAmount = subtotal + transportFee;

//       return {
//         ...sale._doc, // keep all original fields
//         subtotal,
//         transportFee,
//         totalAmount,
//       };
//     });

//     res.render("salesList", { sales: sanitizedSales, query: { productName, date } });
//   } catch (err) {
//     console.error("Error fetching sales:", err);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const StockModel = require("../models/stockModel");
const SalesModel = require("../models/salesModel");
const {ensureAuthenticated, ensureManagerOrSalesAgent,} = require("../middleware/auth");

// @desc    Render the sales form (only accessible to authenticated users)
router.get("/sales", ensureAuthenticated, async (req, res) => {
  try {
    const stockItems = await StockModel.find(); // fetch stock for selection in the form
    res.render("sales", { title: "Record Sale", stockItems });
  } catch (err) {
    console.error("Error fetching stock:", err);
    req.flash("error_msg", "Failed to load stock items.");
    res.redirect("/manager");
  }
});

// @desc    Record a sale and update stock
router.post("/sales", ensureAuthenticated, async (req, res) => {
  try {
    const {
      customerName,
      customerContact,
      customerAddress,
      customerPhone,
      productName,
      quantity,
      price,
      paymentMethod,
      salesAgent,
      provideTransport,
      saleDate,
    } = req.body;

    let items = [];
    let subtotal = 0;

    // Handle multiple items
    if (Array.isArray(productName)) {
      for (let i = 0; i < productName.length; i++) {
        const qty = Number(quantity[i]) || 0;
        const prc = Number(price[i]) || 0;
        const total = qty * prc;
        subtotal += total;

        items.push({
          productName: productName[i],
          quantity: qty,
          price: prc,
          total,
        });

        // Update stock quantity
        await StockModel.findOneAndUpdate(
          { productName: productName[i] },
          { $inc: { quantity: -qty } }
        );
      }
    } else if (productName) {
      const qty = Number(quantity) || 0;
      const prc = Number(price) || 0;
      const total = qty * prc;
      subtotal = total;

      items.push({
        productName,
        quantity: qty,
        price: prc,
        total,
      });

      await StockModel.findOneAndUpdate(
        { productName },
        { $inc: { quantity: -qty } }
      );
    }

    const transportFee =
      provideTransport === "on" || provideTransport === true
        ? subtotal * 0.05
        : 0;
    const totalAmount = subtotal + transportFee;

    const newSale = new SalesModel({
      customer: {
        name: customerName,
        contactPerson: customerContact,
        address: customerAddress,
        phone: customerPhone,
      },
      items,
      paymentMethod,
      salesAgent,
      saleDate: saleDate ? new Date(saleDate) : new Date(),
      provideTransport: provideTransport === "on" || provideTransport === true,
      transportFee,
      subtotal,
      totalAmount,
    });

    await newSale.save();

    req.flash("success_msg", "Sale recorded successfully.");
    res.redirect("/salesList");
  } catch (err) {
    console.error("Error recording sale:", err);
    req.flash("error_msg", "Failed to record sale.");
    res.redirect("/sales");
  }
});

// @desc    Display all sales (accessible by manager & sales agent)
router.get("/salesList", ensureManagerOrSalesAgent, async (req, res) => {
  try {
    const { productName, date } = req.query;
    const filter = {};

    if (productName) {
      filter["items.productName"] = { $regex: productName, $options: "i" };
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.saleDate = { $gte: start, $lte: end };
    }

    const sales = await SalesModel.find(filter).sort({ saleDate: -1 });

    // Ensure totals are calculated
    const sanitizedSales = sales.map((sale) => {
      let subtotal = 0;
      sale.items.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        item.total = qty * price;
        subtotal += item.total;
      });
      const transportFee = sale.provideTransport ? subtotal * 0.05 : 0;
      const totalAmount = subtotal + transportFee;

      return {
        ...sale._doc,
        subtotal,
        transportFee,
        totalAmount,
      };
    });

    res.render("salesList", {
      sales: sanitizedSales,
      query: { productName, date },
    });
  } catch (err) {
    console.error("Error fetching sales:", err);
    req.flash("error_msg", "Failed to load sales list.");
    res.redirect("/manager");
  }
});

module.exports = router;



