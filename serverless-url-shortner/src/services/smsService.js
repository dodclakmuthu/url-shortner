async function sendMobileOTP(mobile, otp) {
  console.log(`Sending Mobile OTP ${otp} to ${mobile}`);
  // Later: integrate with AWS SNS
}

module.exports = { sendMobileOTP };
