const SmsService = require("./SmsService");
const AWS = require("aws-sdk");

const sns = new AWS.SNS({ region: "us-east-1" }); // Make sure region supports SMS

class SnsSmsService extends SmsService {
  async sendOtp(number, otp) {
    try {
        console.log("Sending OTP using AWS SNS SMS service...");
        const smsBody = `Your verification code is: ${otp}`;
        let phoneNumber = number.startsWith("+94") ? number : `+94${number}`;
        if (process.env.IS_SMS_SANDBOX) {
            phoneNumber= process.env.SANDBOX_PHONE_NUMBER;
        }
        const params = {
          Message: smsBody,
          PhoneNumber: phoneNumber,
        };
        const result = await sns.publish(params).promise();
        console.log("SMS sent:", result);
        console.log("Message ID:", result.MessageId);
      return result;
    } catch (error) {
      throw new Error("Failed to send OTP: " + error);
    }
  }
}

module.exports = SnsSmsService;