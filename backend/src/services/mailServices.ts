import nodemailer from "nodemailer";

export function hasMailCredentials() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
