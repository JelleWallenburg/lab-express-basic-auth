const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// router.get("/signup", (req, res, next) => {
//   res.render("auth/signup")
// });


module.exports = router;
