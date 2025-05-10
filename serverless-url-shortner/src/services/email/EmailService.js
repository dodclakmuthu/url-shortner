class emailService {

    async sendOtp(email, otp) {
        throw new Error("sendOtp() method should implement in subclass");
    }
}

module.exports = emailService;