import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER_USER,
    pass: process.env.EMAIL_SENDER_PASS,
  },
});

export const sendResetPasswordEmail = async (to, token) => {
  await transporter.sendMail({
    from: `E-Commerce Website <${process.env.EMAIL_SENDER_USER}>`,
    to,
    subject: "Reset Password Link",
    html: `
        <p>Click the button below to reset your password:</p>
        <a href="http://localhost:4000/reset-password/${token}">
          Reset Password
        </a>
    `,
  });
};
