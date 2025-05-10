const SmsService = require("./SmsService");

class DialogSmsService extends SmsService {
    async sendOtp(number, otp) {
        try {
            console.log("Sending OTP using Dialog SMS service...");
            // Simulate sending OTP
            console.log(`Sending OTP ${otp} to ${number}`);
        } catch (error) {
            throw new Error("Failed to send OTP: " + error.message);
        }
    }
}

module.exports = DialogSmsService;