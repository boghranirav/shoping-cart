const express = require("express");
const router = express.Router();
const { validateUser } = require("../middleware/validateUser");

router.use("/auth", require("./auth"));
router.use(validateUser);
router.use("/seller", require("./seller"));
router.use("/buyer", require("./buyer"));

module.exports = router;
