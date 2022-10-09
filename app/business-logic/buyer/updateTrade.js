const {
  responseError,
  responseData,
  isEmpty,
  responseDataFull,
  responseDataNoREST,
} = require("../../config/commonFunction");
const httpStatus = require("../../config/statusCode");
const { prisma } = require("../../config/dbConnection");

const updateTrade = async (req, res) => {
  try {
    const isValidTrade = await validateTrade(req);
    if (!isValidTrade.status) {
      return responseDataFull(res, isValidTrade);
    }

    const updateTradeStatusInDb = await prisma.trade.update({
      where: { trade_id: req.body.trade_id },
      data: {
        status: req.body.status,
        updated_at: new Date(),
      },
    });
    if (isEmpty(updateTradeStatusInDb)) {
      return responseData(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        {},
        "Failed to update trade. Please try later."
      );
    } else {
      return responseData(
        res,
        httpStatus.SUCCESS,
        updateTradeStatusInDb,
        "Trade updated successfuly."
      );
    }
  } catch (error) {
    return responseError(res, error);
  }
};

const validateTrade = async (req) => {
  try {
    const checkTradeExists = await prisma.trade.findFirst({
      where: { trade_id: req.body.trade_id },
      select: {
        status: true,
        bid: {
          select: {
            buyer_id: true,
          },
        },
      },
    });

    if (isEmpty(checkTradeExists)) {
      return responseDataNoREST(httpStatus.NOT_FOUND, {}, "Trade Not Found");
    }

    if (checkTradeExists.bid.buyer_id != req.userInformation.user_id) {
      return responseDataNoREST(
        httpStatus.FORBIDDEN,
        {},
        "You are not buyer of this trade."
      );
    }

    if (checkTradeExists.status === req.body.status) {
      return responseDataNoREST(
        httpStatus.ALREADY_EXISTS,
        {},
        `Status already set to "${req.body.status}"`
      );
    }

    return { status: true };
  } catch (error) {
    return responseDataNoREST(
      httpStatus.INTERNAL_SERVER_ERROR,
      {},
      "Internal Server Error",
      error
    );
  }
};

module.exports = { updateTrade };
