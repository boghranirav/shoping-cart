const {
  responseError,
  responseData,
  isEmpty,
} = require("../config/commonFunction");
const httpStatus = require("../config/statusCode");
const bcrypt = require("bcrypt");
const { prisma } = require("../config/dbConnection");
const jwt = require("jsonwebtoken");

const registerNewUser = async (req, res) => {
  try {
    const { username, email_id, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const checkUserExists = await prisma.users.count({
      where: { email_id: { equals: email_id, mode: "insensitive" } },
    });

    if (checkUserExists >= 1) {
      return responseData(
        res,
        httpStatus.ALREADY_EXISTS,
        {},
        "Email id already exists. Please try another email id."
      );
    }
    const register = await prisma.users.create({
      data: {
        username: username,
        email_id: email_id,
        password: hashPassword,
      },
    });
    if (isEmpty(register)) {
      return responseData(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        {},
        "Registration failed. Please try later."
      );
    } else {
      return responseData(
        res,
        httpStatus.SUCCESS,
        {},
        "User register succesfuly."
      );
    }
  } catch (error) {
    return responseError(res, error);
  }
};

const validateUserLogin = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const checkUserExists = await prisma.users.findFirst({
      where: { email_id: { equals: email_id, mode: "insensitive" } },
    });

    if (isEmpty(checkUserExists)) {
      return responseData(
        res,
        httpStatus.NOT_FOUND,
        {},
        "Email not found. Please register first."
      );
    } else {
      const validPassword = await bcrypt.compare(
        password,
        checkUserExists.password
      );
      if (validPassword) {
        const signToken = jwt.sign(
          { userId: checkUserExists.user_id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );
        return responseData(
          res,
          httpStatus.SUCCESS,
          { accessToken: signToken },
          "Login successful."
        );
      } else {
        return responseData(
          res,
          httpStatus.UNAUTHORIZED,
          {},
          "Invalid email or password."
        );
      }
    }
  } catch (error) {
    return responseError(res, error);
  }
};

module.exports = { registerNewUser, validateUserLogin };
