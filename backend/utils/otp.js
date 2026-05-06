const axios = require('axios');

exports.sendOTP = async (to, otp) => {
    const data = {
        sender: { name: "Findit", email: process.env.EMAIL },
        to: [{ email: to }],
        subject: "Kode OTP",
        textContent: `Berlaku untuk 5 Menit: ${otp}`
    };

    try {
        await axios.post('https://api.brevo.com/v3/smtp/email', data, {
            headers: {
                'api-key': process.env.BREVO_API_KEY, 
                'Content-Type': 'application/json'
            }
        });
        console.log("OTP terkirim via API");
    } catch (error) {
        console.error("Gagal via API:", error.response.data);
    }
};

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};