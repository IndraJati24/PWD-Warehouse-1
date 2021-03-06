const router = require("express").Router();
const { userController } = require("../controllers");
const { body } = require("express-validator");
const { verifyToken } = require("../helpers/jwt");

const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username can't be empty")
    .isLength({ min: 5 })
    .withMessage("Username must have 5 character"),
  body("password")
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 5 })
    .withMessage("Password must have 5 character")
    .matches(/[0-9]/)
    .withMessage("Password must include number")
    .matches(/[!@#$%^&*]/)
    .withMessage("password must include symbol"),
  body("email").isEmail().withMessage("Invalid email"),
];

router.put("/register", registerValidation, userController.userRegister);
router.post("/verification", userController.emailVerification);
router.post("/login", userController.login);
router.post('/keepLogin', verifyToken, userController.keepLogin)
router.post('/forgotPassword', userController.forgotPassword)
router.post('/resetPassword', userController.resetPassword)
router.post('/address', userController.updateData)

module.exports = router;
