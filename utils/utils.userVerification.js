require('dotenv').config();
const https = require('https');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const sequelize = require('../config/db');
const model = require('../model/index')
const {HttpStatus} = require('./utils.httpStatus')

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const userVerification = {
    async sendEmailOTP(email) {
        const t = await sequelize.transaction()
        try {
            const otp = generateOTP();
            await model.User.update(
                { generatedEmailOtp: otp },
                {
                    where: {
                        email: email,
                    },
                    transaction: t
                }
            );

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.User,
                    pass: process.env.APP_Password
                }
            });

            let info = await transporter.sendMail({
                from: '"Your Name" <your.email@example.com>',
                to: email,
                subject: "Email Verification OTP",
                html: `<html>
                            <head>
                                <title>Email OTP</title>
                            </head>
                            <body>
                                <h1>Your OTP for email verification is ${otp}</h1>
                            </body>
                        </html>`
            });

            await t.commit();
            return {msg:"user mail send successfully" , result:"pass"}
        } catch (err) {
            if (t) await t.rollback();
            return { msg: err.message , result:"fail" };
        }
    }
}

module.exports = {
    userVerification
}
