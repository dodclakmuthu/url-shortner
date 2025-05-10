class SmsService{

    async sendOtp(number, otp) {
        throw new Error("sendOtp() method should implement in subclass");
    } 

}

module.exports = SmsService;