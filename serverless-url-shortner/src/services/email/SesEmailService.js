const EmailService = require('./EmailService');

class SesEmailService extends EmailService {
    async sendOtp(email, otp) {
        try {
            console.log("Sending OTP using SES email service...");
            // Simulate sending OTP
            console.log(`Sending OTP ${otp} to ${email}`);
        } catch (error) {
            throw new Error("Failed to send OTP: " + error.message);
        }
    }
}

module.exports = SesEmailService;