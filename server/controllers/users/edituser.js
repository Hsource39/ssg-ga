const { user } = require("../../db/models");
const bcrypt = require("bcrypt");
const {
  isAuthorized_access,
  generateAccessToken,
  generateRefreshToken,
  sendToken,
} = require("../tokenFunctions");
const cryptoJS = require("crypto-js");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    if (req.body.username) {
      const userInfo = await user.findOne({
        where: {
          username: req.body.username,
        },
      });

      if (userInfo) {
        return res.status(409).send("Your words is already exist!");
      } else {
        const userdata = isAuthorized_access(req);
        const userInfo = await user.findOne({
          where: {
            id: userdata.id,
          },
        });
        if (!userInfo) {
          res.status(500).send("sorry");
        }
        // 암호화 부분 추가 삽입  //
        let byte = cryptoJS.AES.decrypt(
          req.body.password,
          process.env.CRYPTOJS_SECRETKEY
        );
        let decodePassword = JSON.parse(byte.toString(cryptoJS.enc.Utf8));
        const validPassword = await bcrypt.compare(
          decodePassword.password,
          userInfo.password
        );
        if (!validPassword) {
          res.status(401).send("Your password is wrong.");
        } else {
          if (!req.body.newPassword) {
            delete req.body.password;
            await user.update(req.body, {
              where: { id: userdata.id },
            });
            const editUser = await user.findOne({
              where: {
                id: userdata.id,
              },
            });
            const { id, username, email, image } = editUser;
            const tokenA = generateAccessToken({ id, username, email, image });
            const tokenR = generateRefreshToken({ id, username, email, image });
            sendToken(res, false, tokenA, tokenR);
          } else {
            let byte = cryptoJS.AES.decrypt(
              req.body.newPassword,
              process.env.CRYPTOJS_SECRETKEY
            );
            let decodePassword = JSON.parse(byte.toString(cryptoJS.enc.Utf8));
            const salt = await bcrypt.genSalt(5);
            const pass = await bcrypt.hash(decodePassword.password, salt);
            await user.update(
              {
                image: req.body.image,
                username: req.body.username,
                password: pass,
              },
              { where: { id: userdata.id } }
            );
            const editUser = await user.findOne({
              where: {
                id: userdata.id,
              },
            });
            const { id, username, email, image } = editUser;
            const tokenA = generateAccessToken({ id, username, email, image });
            const tokenR = generateRefreshToken({ id, username, email, image });
            sendToken(res, false, tokenA, tokenR);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("sorry");
  }
};
