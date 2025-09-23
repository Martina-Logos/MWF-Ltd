const express = require("express");
const router = express.Router();

const { ensureauthenticated, ensureManager } = require("../middleware/auth");
const StockModel = require("../models/stockModel");

//ensureauthenticated, ensureManager,
router.get("/stock", (req, res) => {
  //like the registerStock, you can use any  name that's not the file namebut better to have it related to what content is in the file
  res.render("stock");
});

router.post("/stock", async (req, res) => {
  try {
    const stock = new StockModel(req.body);
    console.log(req.body);
    await stock.save();
    res.redirect("/manager");
  } catch (error) {
    console.error(error);
    res.redirect("/stock");
  }
});

router.get("/manager", (req, res) => {
  res.render("manager");
});

//Getting stock from the database
router.get("/stockList", async (req, res) => {
  try {
    let items = await StockModel.find().sort({ $natural: -1 });
    console.log(items);
    res.render("stockList", { items });
  } catch (error) {
    res.status(400).send("Unable to get data from the database");
  }
});

//updating stock
router.put("/stockList", (req, res) => {});



module.exports = router;
