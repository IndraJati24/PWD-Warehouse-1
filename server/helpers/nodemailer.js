const nodemailer = require('nodemailer');
const password = process.env.NODEMAILER_PASS
const email = process.env.NODEMAILER_USER

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    },
    tls: {
        rejectUnauthorized: true
    }
})

module.exports = transporter