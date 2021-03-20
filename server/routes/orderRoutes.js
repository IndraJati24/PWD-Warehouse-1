const router = require("express").Router();

const {orderController} = require("../controllers")

const { upload } = require('../helpers/multer')
const uploader = upload()

router.post("/wareLoc", orderController.getWarehouseLoc)
router.post("/bukti_bayar/:no_order", uploader,orderController.uploadBuktiBayar)

module.exports = router