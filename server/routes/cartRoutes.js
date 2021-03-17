const router = require("express").Router();

const { cartController } = require("../controllers");

router.post("/addCart", cartController.addCart);
router.get("/getCart/:id", cartController.getCart);



module.exports = router;