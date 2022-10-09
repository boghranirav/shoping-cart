const {
  responseError,
  responseData,
  isEmpty,
} = require("../../config/commonFunction");
const httpStatus = require("../../config/statusCode");
const { prisma } = require("../../config/dbConnection");

const getAuctionList = async (req, res) => {
  try {
    const getItemInDb = await prisma.items.findMany({
      where: { seller_id: req.userInformation.user_id },
      select: {
        item_id: true,
        product_name: true,
        description: true,
        image_src: true,
        base_price: true,
        created_at: true,
        bid: true,
      },
    });

    if (isEmpty(getItemInDb)) {
      return responseData(res, httpStatus.NOT_FOUND, {}, "No Data Found.");
    } else {
      return responseData(res, httpStatus.SUCCESS, getItemInDb, "Succesfuly.");
    }
  } catch (error) {
    return responseError(res, error);
  }
};

module.exports = { getAuctionList };
