const db = require("../database");
const cryptojs = require("crypto-js");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const handleBars = require("handlebars");
const transporter = require("../helpers/nodemailer");
const { createToken } = require("../helpers/jwt");
const { asyncQuery } = require("../helpers/queryHelp");

const SECRET_KEY = process.env.CRYPTO_KEY;

function login(req, res) {
  const { username, password } = req.body;

  const hashpass = cryptojs.HmacMD5(password, SECRET_KEY);

  const loginQuery = `SELECT * FROM account
                            WHERE ${
                              username.includes("@") ? "email" : "username"
                            }='${username}'
                            AND password=${db.escape(hashpass.toString())}`;

  db.query(loginQuery, (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0)
      return res.status(400).send("Username or Password is wrong");

    let token = createToken({
      id: result[0].id_users,
      username: result[0].username,
    });

    result[0].token = token;

    res.status(200).json({ token: result[0].token });
  });
}

module.exports = {
  login,
  userRegister: async (req, res) => {
    let { username, password, email } = req.body;

    //!hashpassword
    const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString();

    //!validation
    let errors = validationResult(req);
    const msg = errors.array().map((item) => item.msg);
    if (!errors.isEmpty()) {
      return res.status(400).send(msg);
    }

    try {
      const checkUsername = `select * from account where username = '${username}'`;
      const resultCheckUsername = await asyncQuery(checkUsername);
      if (resultCheckUsername.length !== 0)
        return res.status(400).send(["Username already registered"]);

      const checkEmail = `select * from account where email = '${email}'`;
      const resultCheckEmail = await asyncQuery(checkEmail);
      if (resultCheckEmail.length !== 0)
        return res.status(400).send(["Email already registered"]);

      const registerAccount = `insert into account (username, password, email, id_role) values
                                    ('${username}', '${hashpass}', '${email}', 1)`;
      const resultRegister = await asyncQuery(registerAccount);

      //!Token
      const token = jwt.sign(
        {
          id: resultRegister.insertId,
          username: username,
        },
        SECRET_KEY
      );

      //!Send EMail Notification
      const option = {
        from: `Admin <indrajati24@gmail.com>`,
        to: email,
        subject: "Account Verification",
      };

      //!handlebars
      const verifyFile = fs
        .readFileSync("./email/verification.html")
        .toString();
      const template = handleBars.compile(verifyFile);

      option.html = template({ token: token, name: username });

      const sendEmail = await transporter.sendMail(option);
      res.status(200).send(sendEmail.response);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  emailVerification: async (req, res) => {
    let { token } = req.body;
    const verify = jwt.verify(token, SECRET_KEY);
    try {
      const verifyAccount = `update account set verify = 1 where id_user = '${verify.id}'`;
      await asyncQuery(verifyAccount);
      res.status(200).send("Email Success Verified");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};
