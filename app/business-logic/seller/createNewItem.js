const {
  responseError,
  responseData,
  isEmpty,
  getRandomFileName,
} = require("../../config/commonFunction");
const httpStatus = require("../../config/statusCode");
const { prisma } = require("../../config/dbConnection");
const fs = require("fs");
const path = require("path");

const createNewItem = async (req, res, fields, files) => {
  try {
    const { product_name, description, base_price } = fields;
    const { image_src } = files;
    const fileName = getRandomFileName();

    let ext = image_src.originalFilename.substring(
      image_src.originalFilename.indexOf("."),
      image_src.originalFilename.length
    );

    const rootPath = path.join(__dirname, "/../../assets");
    if (!fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath);
    }
    const imagePath = path.join(rootPath) + "/" + fileName + ext;

    const rawData = fs.readFileSync(image_src.filepath);
    fs.writeFile(imagePath, rawData, function (err) {
      if (err) {
        return responseError(res, err);
      }
    });

    const createItemInDb = await prisma.items.create({
      data: {
        product_name: product_name,
        base_price: base_price,
        image_src: process.env.HOST_ADDRESS + "/assets/" + fileName + ext,
        description: description,
        seller_id: req.userInformation.user_id,
      },
    });

    if (isEmpty(createItemInDb)) {
      return responseData(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        {},
        "Failed to add item. Please try later."
      );
    } else {
      return responseData(
        res,
        httpStatus.SUCCESS,
        createItemInDb,
        "Item added succesfuly."
      );
    }
  } catch (error) {
    return responseError(res, error);
  }
};

module.exports = { createNewItem };
