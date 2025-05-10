const SesEmailService = require('./SesEmailService');

function createEmailService() {
    const serviceType = process.env.EMAIL_SERVICE_TYPE || "ses"; // Default to SES if not specified

    switch (serviceType) {
        case "ses":
            return new SesEmailService();
        default:
            throw new Error("Invalid email service type");
    }
}

module.exports = { createEmailService };