import nodemailer from "nodemailer";
import MailGen from "mailgen";
import fs from "fs";
const sendEmail = async (subject, send_to, template, reply_to, cc) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // create template with mailgen
  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "Fullstack Template Project",
      link: "https://olink.to/courses",
    },
  });
  const emailTemplate = mailGenerator.generate(template);
  fs.writeFileSync("prevew.html", emailTemplate, "utf8");
  // options for sending email
  const options = {
    from: process.env.EMAIL_USER,
    to: send_to,
    replyTo: reply_to,
    subject,
    html: emailTemplate,
    cc,
  };
  // send Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export { sendEmail };
