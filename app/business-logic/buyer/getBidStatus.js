const {
  responseError,
  responseData,
  isEmpty,
} = require("../../config/commonFunction");
const httpStatus = require("../../config/statusCode");
const { prisma } = require("../../config/dbConnection");

const getBidStatus = async (req, res) => {
  try {
    const getBidFromDb = await prisma.bid.findMany({
      where: { buyer_id: req.userInformation.user_id },
      select: {
        bid_id: true,
        bid_price: true,
        created_at: true,
        item_id: true,
        trade: {
          select: {
            status: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (isEmpty(getBidFromDb)) {
      return responseData(res, httpStatus.NOT_FOUND, {}, "No Data Found.");
    } else {
      return responseData(res, httpStatus.SUCCESS, getBidFromDb, "Succesfuly.");
    }
  } catch (error) {
    return responseError(res, error);
  }
};

module.exports = { getBidStatus };
