const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { config } = require("dotenv");
require("dotenv").config();

// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLEINT_SECRET = process.env.GMAIL_CLEINT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (email, link) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_ADDRESS,
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `DIU TRANSPORT 📧 <${process.env.GMAIL_ADDRESS}>`,
      to: email,
      subject: "Forget Password Link",
      text: `Hello, your forgot password link is ${link}`,
      html: `<h1>Hello </h1>
        <p>Your forgot password link is <a href="${link}">${link}</a></p>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    return res.status(403).render("reset", {
      error: "Something went wrong! Please try again",
    });
  }
};

module.exports.sendMail = sendMail;
