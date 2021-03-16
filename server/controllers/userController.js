const db = require("../database");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const cryptjs = require("crypto-js");
const fs = require("fs");
const handleBars = require("handlebars");
const transporter = require("../helpers/nodemailer");
const SECRET_KEY = "!@#$%^&*";

const { asyncQuery } = require("../helpers/queryHelp");

module.exports = {
	userRegister: async (req, res) => {
		let { username, password, email } = req.body;

		//!hashpassword
		const hashpass = cryptjs.HmacMD5(password, SECRET_KEY).toString();

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
				to: "jatigamez@gmail.com",
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
            res.status(200).send('Email Success Verified')
		} catch (err) {
			console.log(err);
			res.status(400).send(err);
		}
	},
};
