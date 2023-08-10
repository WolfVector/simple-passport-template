const express = require('express')
var router = express.Router()

router.get("/", function(req, res) {
  res.render("index")
})

router.get("/success", function(req, res) {
  res.render("success", { user: req.user })
})

module.exports = router