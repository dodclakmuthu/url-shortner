async function sendEmailOTP(email, otp) {
  console.log(`Sending Email OTP ${otp} to ${email}`);
  // Later: integrate with AWS SES
}

module.exports = { sendEmailOTP };