const router = require("express").Router();

const {orderController} = require("../controllers")

router.post("/wareLoc", orderController.getWarehouseLoc)

module.exports = router