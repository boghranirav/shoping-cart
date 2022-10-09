const {
  responseError,
  responseData,
  isEmpty,
  responseDataFull,
  responseDataNoREST,
} = require("../../config/commonFunction");
const httpStatus = require("../../config/statusCode");
const { prisma } = require("../../config/dbConnection");

const createNewTrade = async (req, res) => {
  try {
    const isValidTrade = await validateTrade(req);
    if (!isValidTrade.status) {
      return responseDataFull(res, isValidTrade);
    }
    const createTradeInDb = await prisma.trade.create({
      data: {
        item_id: isValidTrade.data.item_id,
        bid_id: req.body.bid_id,
        status: "trade created",
      },
    });
    if (isEmpty(createTradeInDb)) {
      return responseData(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        {},
        "Failed to create trade. Please try later."
      );
    } else {
      return responseData(
        res,
        httpStatus.SUCCESS,
        createTradeInDb,
        "Trade created successfuly."
      );
    }
  } catch (error) {
    return responseError(res, error);
  }
};

const validateTrade = async (req) => {
  try {
    const checkBidExists = await prisma.bid.findFirst({
      where: { bid_id: req.body.bid_id },
    });

    if (isEmpty(checkBidExists)) {
      return responseDataNoREST(httpStatus.NOT_FOUND, {}, "Bid Not Found");
    }

    const checkItemExists = await prisma.items.findFirst({
      where: { item_id: checkBidExists.item_id },
    });

    if (checkItemExists.seller_id != req.userInformation.user_id) {
      return responseDataNoREST(
        httpStatus.FORBIDDEN,
        {},
        "You are not owner of this item."
      );
    }

    const getItemInfo = await prisma.trade.findFirst({
      where: { item_id: req.body.item_id },
    });

    if (!isEmpty(getItemInfo)) {
      return responseDataNoREST(
        httpStatus.ALREADY_EXISTS,
        {},
        "Trade for this item alrady exists."
      );
    }

    return { status: true, data: { item_id: checkItemExists.item_id } };
  } catch (error) {
    return responseDataNoREST(
      httpStatus.INTERNAL_SERVER_ERROR,
      {},
      "Internal Server Error",
      error
    );
  }
};

module.exports = { createNewTrade };
