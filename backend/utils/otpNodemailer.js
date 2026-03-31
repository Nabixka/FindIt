// For Dev
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

exports.sendOTP = async (to, otp) => {
    await transporter.sendMail({
        from: `"Kode OTP" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: "Kode OTP Anda",
        text: `Kode OTP Anda Adalah ${otp}. Berlaku 5 Menit`
    }).then(info => {
        console.log("Info ", info.response)
    }).catch(err => {
        console.log("Error: ", err.message)
    })
}

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
