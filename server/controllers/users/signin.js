const { user } = require("../../db/models");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  sendToken,
} = require("../tokenFunctions");
const cryptoJS = require("crypto-js");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    const userInfo = await user.findOne({ email: req.body.email });
    console.log(userInfo.email);

    if (userInfo === null)
      return res.status(404).send("Your ID could not be found.");

    let byte = cryptoJS.AES.decrypt(
      req.body.password,
      process.env.CRYPTOJS_SECRETKEY
    );
    let decodePassword = JSON.parse(byte.toString(cryptoJS.enc.Utf8));
    const validPassword = await bcrypt.compare(
      decodePassword.password,
      userInfo.password
    );
    if (validPassword) {
      const { id, username, email, image } = userInfo;
      const tokenA = generateAccessToken({ id, username, email, image });
      const tokenR = generateRefreshToken({ id });
      sendToken(res, req.body.keepLogin, tokenA, tokenR);
    } else {
      return res.status(409).send("Your password is wrong.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("sorry");
  }
};
