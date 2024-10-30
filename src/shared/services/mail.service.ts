import { readFileSync } from "fs";
import { compile } from "handlebars";
import mjml2html from "mjml";
import { resolve } from "path";

import * as nodemailer from "nodemailer";

export const sendMail = (
  to: string,
  subject: string,
  html: string
): Promise<nodemailer.SentMessageInfo> => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    // host: process.env.SMTP_SERVICE_PROD,
    port: 587,
    auth: {
      user: process.env.SMTP_USER_DEV,
      pass: process.env.SMTP_PASS_DEV,
      type: "Login",
    },
  });

  const mailOptions = {
    from: "info@gist.com",
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

const convertFromMjmlToHtml = (path: string) => {
  const pathToMail = readFileSync(resolve(__dirname, path)).toString();
  return compile(mjml2html(pathToMail).html);
};

export const sendVerifyEmail = async (to: string, otp: string) => {
  return sendMail(
    to,
    "Verify Email",
    convertFromMjmlToHtml("../../templates/receive_verify_email.mjml")({
      otp,
    })
  );
};

export const sendTwoFactorEmail = async (to: string, otp: string) => {
  return sendMail(
    to,
    "Two-factor Authentication Code",
    convertFromMjmlToHtml("../../templates/receive_two_factor_email.mjml")({
      otp,
    })
  );
};
