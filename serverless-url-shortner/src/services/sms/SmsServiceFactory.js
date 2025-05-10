require("dotenv").config();
// const TwillioSmsService = require("./twillioSmsService");
// const DialogSmsService = require("./DialogSmsService");
const SnsSmsService = require("./SnsSmsService");


function createSmsService() {
    const serviceType = process.env.SMS_SERVICE_TYPE || "twillio"; // Default to Twilio if not specified
    console.log("Creating SMS service of type:", serviceType);
    switch (serviceType) {
        // case "twillio":
        //     console.log("Using Twilio SMS service");
        //     return new twillioSmsService();
        // case "dialog":
        //     return new DialogSmsService();
        case "sns":
            console.log("Using AWS SNS SMS service");
            return new SnsSmsService();
        default:
            throw new Error("Invalid SMS service type");
    }
}

module.exports = { createSmsService };