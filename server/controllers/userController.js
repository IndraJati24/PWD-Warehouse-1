const db = require("../database");
const cryptojs = require("crypto-js");
const { createToken } = require("../helpers/jwt");

const SECRET_KEY = process.env.CRYPTO_KEY;

function login(req, res) {
  const { username, password } = req.body;

  const hashpass = cryptojs.HmacMD5(password, SECRET_KEY);
  console.log(req.body, hashpass.toString());

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

module.exports = { login };
