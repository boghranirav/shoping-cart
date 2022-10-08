const express = require("express");
const { createBid, getBidByUser } = require("../controller/buyerController");
const route = express.Router();

route.post("/bid-on-item", createBid);
route.get("/get-bids", getBidByUser);

module.exports = route;
