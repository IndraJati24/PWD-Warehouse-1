const router = require("express").Router();

const {orderController} = require("../controllers")

const { upload } = require('../helpers/multer')
const uploader = upload()

router.post("/wareLoc", orderController.getWarehouseLoc)
router.post("/bukti_bayar/:no_order", uploader,orderController.uploadBuktiBayar)
router.get("/getOrderDetail", orderController.getOrderDetail)
router.get("/getAllOrder", orderController.getAllOrder)
router.post("/cancelPaymentPending/:id", orderController.cancelPaymentPending)
router.post("/cancelOrderConfirm/:id", orderController.cancelOrderConfirm)
router.post("/arrived/:id", orderController.orderArrived)

module.exports = router