const nodemailer = require("nodemailer");


const senderEmail = "alrikmo@yandex.by";
const senderPassword = "alrikmo6969";
const receiverEmail = "howansky.timofei@yandex.ru";

const transport = nodemailer.createTransport({
    service: "Yandex",
    auth: {
        user: senderEmail,
        pass: senderPassword
    },
});


function send(message) {

    const option = {
        from: senderEmail,
        to: receiverEmail,
        subject: "06-03",
        text: message
    };

    transport.sendMail(option, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
}

module.exports = {send};