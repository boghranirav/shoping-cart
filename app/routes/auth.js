const express = require("express");
const { userLogin, userRegistration } = require("../controller/authController");
const route = express.Router();

route.post("/login", userLogin);
route.post("/register", userRegistration);

module.exports = route;
