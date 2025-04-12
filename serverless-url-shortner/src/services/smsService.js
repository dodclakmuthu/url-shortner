const AWS = require("aws-sdk");
const sns = new AWS.SNS({ region: "us-east-1" });

async function sendMobileOTP(mobile, otp) {
    console.log(`Sending Mobile OTP ${otp} to ${mobile}`);
    const params = {
        Message: `Your verification code is: ${otp}`,
        PhoneNumber: mobile, // e.g. +94712345678
    };

    try {
        await sns.publish(params).promise();
        console.log(`OTP SMS sent to ${mobile}`);
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw error;
    }
}

module.exports = { sendMobileOTP };
