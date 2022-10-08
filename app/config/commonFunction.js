const httpStatus = require("./statusCode");

const responseInvalidArgs = (res, response) => {
  return res.status(httpStatus.INVALID_ARGUMENTS.statusCode).json({
    ...httpStatus.INVALID_ARGUMENTS,
    data: null,
    message: response.error.details.map((i) => i.message).join(","),
    error: [],
  });
};

const responseData = (res, resHttpStatus, data, message) => {
  return res.status(resHttpStatus.statusCode).json({
    ...resHttpStatus,
    data: data,
    message: message,
    error: [],
  });
};

const responseError = (res, error = null, message = null) => {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR.statusCode).json({
    ...httpStatus.INTERNAL_SERVER_ERROR,
    data: null,
    message: message != null ? message : "Internal Server Error",
    error: typeof error === "object" ? [error.error || error.message] : [error],
  });
};

const isEmpty = (object) => {
  if (object == null || object == undefined) return true;
  else return Object.keys(object).length === 0;
};

const getRandomFileName = () => {
  var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  var random = ("" + Math.random()).substring(2, 8);
  var random_number = timestamp + random;
  return random_number;
};

module.exports = {
  responseData,
  responseError,
  responseInvalidArgs,
  isEmpty,
  getRandomFileName,
};
