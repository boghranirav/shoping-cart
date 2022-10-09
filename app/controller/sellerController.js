const Joi = require("joi");
const {
  responseError,
  responseInvalidArgs,
} = require("../config/commonFunction");
var formidable = require("formidable");
const { createNewItem } = require("../business-logic/seller/createNewItem");
const { getAuctionList } = require("../business-logic/seller/getAuctionList");
const { createNewTrade } = require("../business-logic/seller/createTrade");
const { updateTrade } = require("../business-logic/seller/updateTrade");

const createItem = async (req, res, _next) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const validation = Joi.object({
        product_name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(4).max(255).required(),
        base_price: Joi.number().min(1).max(9999999999).required(),
      });
      const response = validation.validate(fields);
      if (response.error) {
        return responseInvalidArgs(res, response);
      }

      return await createNewItem(req, res, fields, files);
    });
  } catch (error) {
    responseError(res, error);
  }
};

const getAuction = async (req, res, _next) => {
  try {
    return await getAuctionList(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

const createTrade = async (req, res, _next) => {
  try {
    const validation = Joi.object({
      bid_id: Joi.string().uuid().required(),
    });
    const response = validation.validate(req.body);
    if (response.error) {
      return responseInvalidArgs(res, response);
    }
    return await createNewTrade(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

const updateTradeStatus = async (req, res, _next) => {
  try {
    const validation = Joi.object({
      trade_id: Joi.string().uuid().required(),
      status: Joi.string()
        .required()
        .valid(
          "payment received",
          "item packed",
          "item shipped",
          "item received",
          "trade complete"
        ),
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

module.exports = { createItem, getAuction, createTrade, updateTradeStatus };
