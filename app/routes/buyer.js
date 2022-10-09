const express = require("express");
const {
  createBid,
  getBidByUser,
  updateTradeStatus,
} = require("../controller/buyerController");
const route = express.Router();

route.post("/bid-on-item", createBid);
route.get("/get-bids", getBidByUser);
route.patch("/update-trade-status", updateTradeStatus);

module.exports = route;
