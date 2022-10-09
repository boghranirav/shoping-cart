const {
  responseError,
  responseData,
  isEmpty,
  responseDataNoREST,
  responseDataFull,
} = require("../../config/commonFunction");
const httpStatus = require("../../config/statusCode");
const { prisma } = require("../../config/dbConnection");

const bidOnItem = async (req, res) => {
  try {
    const isValidBid = await validateBid(req);

    if (!isValidBid.status) {
      return responseDataFull(res, isValidBid);
    }
    const createBidInDb = await prisma.bid.create({
      data: {
        item_id: req.body.item_id,
        bid_price: req.body.bid_price,
        buyer_id: req.userInformation.user_id,
      },
    });

    if (isEmpty(createBidInDb)) {
      return responseData(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        {},
        "Failed to create bid. Please try later."
      );
    } else {
      return responseData(
        res,
        httpStatus.SUCCESS,
        createBidInDb,
        "Bid added succesfuly."
      );
    }
  } catch (error) {
    return responseError(res, error);
  }
};

const validateBid = async (req) => {
  try {
    const getItemInfo = await prisma.items.findFirst({
      where: { item_id: req.body.item_id },
    });

    if (isEmpty(getItemInfo)) {
      return responseDataNoREST(httpStatus.NOT_FOUND, {}, "Item Not Found");
    }

    if (getItemInfo.seller_id === req.userInformation.user_id) {
      return responseDataNoREST(
        httpStatus.FORBIDDEN,
        {},
        "Seller and Buyer cannot be same."
      );
    }
    if (req.body.bid_price < getItemInfo.base_price) {
      return responseDataNoREST(
        httpStatus.FORBIDDEN,
        {},
        `Bid price cannot be less then base price (${getItemInfo.base_price}).`
      );
    }

    const checkBidExists = await prisma.bid.findFirst({
      where: {
        buyer_id: req.userInformation.user_id,
        item_id: req.body.item_id,
      },
    });

    if (!isEmpty(checkBidExists)) {
      return responseDataNoREST(
        httpStatus.ALREADY_EXISTS,
        {},
        "You have already bid for this item."
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

module.exports = { bidOnItem };
