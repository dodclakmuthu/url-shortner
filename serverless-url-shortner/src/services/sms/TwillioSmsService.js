const SmsService = require("./SmsService");
const twilio = require("twilio");
require("dotenv").config();
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!ACCOUNT_SID || !AUTH_TOKEN || !fromPhoneNumber) {
  throw new Error("Twilio configuration is missing in environment variables");
}


class TwillioSmsService extends SmsService {
    async sendOtp(number, otp) {
        try {
            console.log("Sending OTP using Twilio SMS service...");
            const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
            const message = await client.messages.create({
                body: `Your OTP is ${otp}`,
                from: fromPhoneNumber,
                to: number,
            }).then((message) => {
                console.log(message);
                console.log("Message SID:", message.sid);
                return message;
            })
            
            ;
            console.log("OTP sent successfully", message.sid);
            return message.sid;
        } catch (error) {
            throw new Error("Failed to send OTP: " + error.message);
        }
    }
}

module.exports = TwillioSmsService;