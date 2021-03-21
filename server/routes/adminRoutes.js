const router = require("express").Router();

const { adminController: { getProducts, addProduct, editProduct, deleteProduct,
    getCategories, addCategory, editCategory, deleteCategory } } = require("../controllers");

router.get('/products', getProducts);
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);

router.get('/categories', getCategories)
router.post('/categories', addCategory)
router.put('/categories', editCategory)
router.delete('/categories', deleteCategory)

module.exports = router;
