const productRouter = require("./productRoutes")
const userRouter = require('./userRoutes')
const cartRouter = require('./cartRoutes')
const orderRouter = require('./orderRoutes')
const adminRouter = require('./adminRoutes')

module.exports = {
    productRouter,
    userRouter,
    cartRouter,
    orderRouter,
    adminRouter
}
