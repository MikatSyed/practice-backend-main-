//  send mail function
import nodemailer from 'nodemailer';
import config from '../../config';

export const sendEMail = async (
  fromEmail: any,
  toEmail: string,
  subject: string,
  html: any
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.SMTP_MAIL,
      pass: config.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    html: html,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};