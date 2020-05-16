const nodemailer = require('nodemailer')
const promisify = require('es6-promisify');
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`)
    const inlined = juice(html)
    return inlined
}

exports.send = async (options) => {
    const html = generateHTML(options.filename, options)
    const text = htmlToText.fromString(html)
    const mailOptions = {
        from: `Delicious <noreply@delicious.com`,
        to: options.user.email,
        subject: options.subject,
        html,
        text
    }
    const sendMail = promisify(transport.sendMail, transport)
    return sendMail(mailOptions)
}


// transport.sendMail({
//     from: 'Chloe <chloe.jandsten@gmail.com>',
//     to: 'wesbos@gmail.com',
//     subject: 'Test test testy',
//     html: 'hey I <strong>LOVE</strong> you',
//     text: 'Hey I looooove you'
// })