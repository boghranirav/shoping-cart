const express = require("express");
const {
  createItem,
  getAuction,
  createTrade,
  updateTradeStatus,
} = require("../controller/sellerController");
const route = express.Router();

route.post("/list-item", createItem);
route.get("/get-auctions", getAuction);
route.post("/select-bid", createTrade);
route.patch("/update-trade-status", updateTradeStatus);

module.exports = route;
