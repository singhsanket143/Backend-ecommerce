const express = require("express");
var router = express.Router();
const v1 = require("./v1");

router.use("/v1", v1);

module.exports = router;