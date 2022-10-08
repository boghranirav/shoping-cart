const Joi = require("joi");
const {
  responseError,
  responseInvalidArgs,
} = require("../config/commonFunction");
const {
  registerNewUser,
  validateUserLogin,
} = require("../business-logic/auth");

const userLogin = async (req, res, _next) => {
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

    return await validateUserLogin(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

const userRegistration = async (req, res, _next) => {
  try {
    const validation = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).trim(true).required(),
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

    return await registerNewUser(req, res);
  } catch (error) {
    responseError(res, error);
  }
};

module.exports = {
  userLogin,
  userRegistration,
};
