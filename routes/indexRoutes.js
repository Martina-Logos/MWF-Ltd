const express = require("express"); //In every route file, you must have these two as well as the button line of (module.exports)
// const { title } = require("process");
const router = express.Router();


//Getting the landing page
router.get("/index", (req, res) => {
  res.render("index");
});

router.post("/index", (req, res) => {
    console.log(req.body);

});



module.exports = router;