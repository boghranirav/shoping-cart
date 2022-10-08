const {
  responseError,
  responseData,
  isEmpty,
} = require("../config/commonFunction");
const httpStatus = require("../config/statusCode");
const { prisma } = require("../config/dbConnection");
const jwt = require("jsonwebtoken");

const validateUser = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }
    if (!req.headers.authorization) {
      return responseData(res, httpStatus.FORBIDDEN, {}, "FORBIDDEN!");
    }

    const accessToken = req.headers.authorization.replace("Bearer ", "");

    jwt.verify(accessToken, process.env.JWT_SECRET, async (error, _d) => {
      if (
        error === null ||
        error === undefined ||
        error.name === "TokenExpiredError"
      ) {
        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET, {
          ignoreExpiration: true,
        });
        if (Date.now() <= decodedToken.exp * 1000) {
          const checkUser = await prisma.users.findFirst({
            where: { user_id: decodedToken.userId },
            select: {
              user_id: true,
            },
          });

          if (isEmpty(checkUser)) {
            return responseData(res, httpStatus.NOT_FOUND, {}, "Invalid User!");
          } else {
            req.userInformation = checkUser;
            next();
          }
        } else {
          return responseData(
            res,
            httpStatus.UNAUTHORIZED,
            {},
            "Token Expire!"
          );
        }
      } else {
        return responseData(res, httpStatus.UNAUTHORIZED, {}, "Invalid Token!");
      }
    });
  } catch (error) {
    return responseError(res, error);
  }
};

module.exports = { validateUser };
