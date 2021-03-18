const router = require("express").Router();

const { cartController } = require("../controllers");

router.post("/addCart", cartController.addCart);
router.get("/getCart/:id", cartController.getCart);
router.post("/editCart/:id", cartController.editCart);



module.exports = router;