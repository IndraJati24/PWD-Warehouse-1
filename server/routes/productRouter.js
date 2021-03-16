const router =require('express').Router()

const {productController}= require("../controllers")

router.get("/getAll",productController.getAllProduct)
router.get("/getCategory",productController.getAllCategory)

module.exports=router