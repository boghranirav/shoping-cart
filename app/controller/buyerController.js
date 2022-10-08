const Joi = require("joi");
const {
  responseError,
  responseInvalidArgs,
} = require("../config/commonFunction");
const {
  registerNewUser,
  validateUserLogin,
} = require("../business-logic/auth");

const createBid = async (req, res, _next) => {
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

const getBidByUser = async (req, res, _next) => {
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

module.exports = { createBid, getBidByUser };
