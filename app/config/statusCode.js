const statusCode = {
  SUCCESS: {
    status: true,
    statusCode: 200,
  },
  UNAUTHORIZED: {
    status: false,
    statusCode: 401,
  },
  FORBIDDEN: {
    status: false,
    statusCode: 403,
  },
  NOT_FOUND: {
    status: false,
    statusCode: 404,
  },
  ALREADY_EXISTS: {
    status: false,
    statusCode: 409,
  },
  INVALID_ARGUMENTS: {
    status: false,
    statusCode: 422,
  },
  INTERNAL_SERVER_ERROR: {
    status: false,
    statusCode: 500,
  },
};

module.exports = statusCode;
