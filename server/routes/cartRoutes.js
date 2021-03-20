const router = require("express").Router();

const { cartController } = require("../controllers");

router.post("/addCart", cartController.addCart);
router.get("/getCart/:id", cartController.getCart);
router.post("/editCart/:id", cartController.editCart);
router.delete("/delCart/:id", cartController.deleteCart)
router.post("/invoice", cartController.invoice)



module.exports = router;