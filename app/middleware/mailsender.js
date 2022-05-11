const nodemailer = require("nodemailer");
const config = require("../config/mail.config");

mailsender = async (data) => {
    let emailTo = data.to
    let emailSubject = data.subject
    let emailMsg = data.text
    let emailMsgHtml = data.html

    let transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: true,
        auth: {
            user: config.user,
            pass: config.pass
        },
    });

    let info = await transporter.sendMail({
        from: '"Application - admin" <andy13galuh@gmail.com>', // sender address
        to: emailTo, // list of receivers
        bcc: config.bcc,
        subject: emailSubject, // Subject line
        text: emailMsg, // plain text body
        html: emailMsgHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log(info);
}

module.exports = mailsender;