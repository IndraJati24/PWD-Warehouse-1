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
const test_email = process.env.NODEMAILER_USER

function login(req, res) {
  const { username, password } = req.body;

  const hashpass = cryptojs.HmacMD5(password, SECRET_KEY);

  const loginQuery = `SELECT * FROM account
                            WHERE ${username.includes("@") ? "email" : "username"
    }='${username}'
                            AND password=${db.escape(hashpass.toString())}`;

  db.query(loginQuery, (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0)
      return res.status(400).send("Username or Password is wrong");

    if (!result[0].verify) return res.status(400).send('Account is not verified!')

    let token = createToken({
      id: result[0].id_users,
      username: result[0].username,
    });

    delete result[0].password;
    delete result[0].verify;
    console.log(result[0])

    res.status(200).json({ token, user: result[0] });
  });
}

async function keepLogin(req, res) {
  try {
    // query to get data from database
    const getUser = `SELECT * FROM account
            WHERE username='${req.user.username}'`;

    const result = await asyncQuery(getUser);
    console.log('result dari query', result[0])

    res.status(200).send(result[0]);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body
  const checkUser = `SELECT * FROM account WHERE email='${email}'`
  try {
    const result = await asyncQuery(checkUser)

    const option = {
      from: `Admin <${test_email}>`,
      to: email,
      subject: "Reset Password",
    };

    const token = jwt.sign(
      {
        id: result.insertId,
        email,
      },
      SECRET_KEY
    );

    const verifyFile = fs
      .readFileSync("./email/reset_password.html")
      .toString();
    const template = handleBars.compile(verifyFile);

    option.html = template({ token: token });

    const sendEmail = await transporter.sendMail(option);

    res.status(200).send(sendEmail.response)
  } catch (err) {
    console.log(err)
  }
}

async function resetPassword(req, res) {
  const { token, password } = req.body
  const verify = jwt.verify(token, SECRET_KEY);
  const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString();
  try {
    const verifyAccount = `update account set password = '${hashpass}' where email = '${verify.email}'`;
    await asyncQuery(verifyAccount);
    res.status(200).send("Password Has Change.");
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  login,
  keepLogin,
  forgotPassword,
  resetPassword,
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
        from: `Admin <${test_email}>`,
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
