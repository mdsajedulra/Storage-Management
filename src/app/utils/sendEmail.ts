import nodemailer from "nodemailer";
import config from "../config";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.nodemailer.user, // generated ethereal user
    pass: config.nodemailer.pass,
  },
});

// Wrap in an async IIFE so we can use await.
export const sendEmail = async (
  toEmail: string,
  subject: string,
  bodyText: string
) => {
  const info = await transporter.sendMail({
    from: '"Storage Management" <mdsajedulra@gmail.com>',
    to: toEmail,
    subject: subject,
    // text: "Hello world?", // plain‑text body
    html: bodyText, // HTML body
  });

  console.log("Message sent:", info.messageId);
};
