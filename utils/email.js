const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.fr",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "passwordforgot@dff.com", // generated ethereal user
        pass: "sdjkbsjd", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'email@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log(`E-mail envoyé : ${info.response}`);
  });
};

module.exports = {sendEmail, transporter};
