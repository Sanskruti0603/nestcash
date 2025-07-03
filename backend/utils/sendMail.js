const nodemailer = require("nodemailer");


const sendMail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"NestCash" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
