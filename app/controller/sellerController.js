const Joi = require("joi");
const {
  responseError,
  responseInvalidArgs,
} = require("../config/commonFunction");
var formidable = require("formidable");
const { createNewItem } = require("../business-logic/seller/createNewItem");

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
    const validation = Joi.object({
      email_id: Joi.string()
        .min(4)
        .max(60)
        .email({ tlds: { allow: false } }),
      password: Joi.string().min(4).max(30).required(),
    });
    const response = validation.validate(req.body);
    if (response.error) {
      return responseInvalidArgs(res, response);
    }

    // return await validateUserLogin(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

const createTrade = async (req, res, _next) => {
  try {
    const validation = Joi.object({
      email_id: Joi.string()
        .min(4)
        .max(60)
        .email({ tlds: { allow: false } }),
      password: Joi.string().min(4).max(30).required(),
    });
    const response = validation.validate(req.body);
    if (response.error) {
      return responseInvalidArgs(res, response);
    }

    // return await validateUserLogin(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

const updateTradeStatus = async (req, res, _next) => {
  try {
    const validation = Joi.object({
      email_id: Joi.string()
        .min(4)
        .max(60)
        .email({ tlds: { allow: false } }),
      password: Joi.string().min(4).max(30).required(),
    });
    const response = validation.validate(req.body);
    if (response.error) {
      return responseInvalidArgs(res, response);
    }

    // return await validateUserLogin(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

module.exports = { createItem, getAuction, createTrade, updateTradeStatus };
