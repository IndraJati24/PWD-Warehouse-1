const router = require("express").Router();

const { productController } = require("../controllers");

router.get("/getAll", productController.getAllProduct);
router.get("/getCategory", productController.getAllCategory);
router.get("/getDetailPage/:id",productController.getDetailPage)
router.get("/getCarousel", productController.getCarousel);


module.exports = router;
