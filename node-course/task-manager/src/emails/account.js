const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "federicofloresta@gmail.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the APP ${name}. Let me know how you get along with the app`
    });

    const sendCancellingEmail = (email, name) => {
        sgMail.send({
            to: email,
            from: "federicofloresta@gmail.com",
            subject: "Sad to see you gone!",
            text: `Thank you for using the app ${name}. Let me know how you we can`
        })

    module.exports = {
        sendWelcomeEmail,
        sendCancellingEmail
    }
}}