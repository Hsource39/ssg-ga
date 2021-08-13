const { user } = require("../../db/models");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  sendToken,
} = require("../tokenFunctions");
const cryptoJS = require("crypto-js");
require("dotenv").config();

module.exports = (req, res) => {
  try {
    user
      .findOne({
        where: {
          email: req.body.email,
        },
      })
      .then(async (data) => {
        if (!data) {
          return res.status(404).send("Login fail!");
        }
        console.log("password!!!!!", req.body.password);
        let byte = cryptoJS.AES.decrypt(
          req.body.password,
          process.env.CRYPTOJS_SECRETKEY
        );
        console.log("byte======!!!!" + byte);
        let decodePassword = byte.toString(cryptoJS.enc.Utf8);
        console.log("decode======" + decodePassword);
        const validPassword = await bcrypt.compare(
          decodePassword,
          data.dataValues.password
        );
        console.log(validPassword);
        if (validPassword) {
          delete data.dataValues.password;
          delete data.dataValues.iat;
          delete data.dataValues.exp;
          console.log(JSON.stringify(data.dataValues));
          const tokenA = generateAccessToken(data.dataValues);
          const tokenR = generateRefreshToken(data.dataValues);

          sendToken(res, tokenA, tokenR);
        } else {
          return res.status(409).send("Login fail!");
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).send("500 err sorry");
  }
};
