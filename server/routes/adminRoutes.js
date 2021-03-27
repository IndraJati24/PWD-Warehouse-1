const router = require("express").Router();

const { adminController: { getProducts, addProduct, editProduct, deleteProduct,
    getCategories, addCategory, editCategory, deleteCategory, stockOperasional, stockOperasionalAll,
    getOrders, confirmationOrder, deliverOrder } } = require("../controllers");

router.get('/products', getProducts);
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);

router.get('/categories', getCategories)
router.post('/categories', addCategory)
router.put('/categories/:id', editCategory)
router.delete('/categories/:id', deleteCategory)


router.get('/stockOperasional', stockOperasional)
router.get('/stockOperasionalAll', stockOperasionalAll)

router.get('/orders', getOrders)
router.post('/orders/confirmation/:no_order', confirmationOrder)
router.post('/orders/deliver/:no_order', deliverOrder)

module.exports = router;
