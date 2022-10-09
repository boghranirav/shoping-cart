const Joi = require("joi");
const {
  responseError,
  responseInvalidArgs,
} = require("../config/commonFunction");
const { bidOnItem } = require("../business-logic/buyer/bidOnItem");
const { getBidStatus } = require("../business-logic/buyer/getBidStatus");
const { updateTrade } = require("../business-logic/buyer/updateTrade");

const createBid = async (req, res, _next) => {
  try {
    const validation = Joi.object({
      item_id: Joi.string().uuid().required(),
      bid_price: Joi.number().min(1).max(9999999999).required(),
    });
    const response = validation.validate(req.body);
    if (response.error) {
      return responseInvalidArgs(res, response);
    }

    return await bidOnItem(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

const getBidByUser = async (req, res, _next) => {
  try {
    return await getBidStatus(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

const updateTradeStatus = async (req, res, _next) => {
  try {
    const validation = Joi.object({
      trade_id: Joi.string().uuid().required(),
      status: Joi.string().required().valid("item received", "trade complete"),
    });
    const response = validation.validate(req.body);
    if (response.error) {
      return responseInvalidArgs(res, response);
    }

    return await updateTrade(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

module.exports = { createBid, getBidByUser, updateTradeStatus };
