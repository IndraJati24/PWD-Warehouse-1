const express = require("express");
const { login } = require("../controllers/userController");
const router = express.Router();

router.get("/", (req, res) => res.json({ status: "OK" }));
router.post("/login", login);

module.exports = router;
