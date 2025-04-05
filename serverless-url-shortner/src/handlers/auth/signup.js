const signupSchema = require("../../validators/signupValidator");
const { getUserByEmail, createUser } = require("../../models/userModel");
const generateOTP = require("../../utils/generateOTP");
const { sendEmailOTP } = require("../../services/emailService");
const { sendMobileOTP } = require("../../services/smsService");
const { v4: uuidv4 } = require("uuid");

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // 1. Validate
    const { error, value } = signupSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
      };
    }

    const { email, mobile, fname, lname } = value;

    // 2. Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "User already exists" }),
      };
    }

    // 3. Generate OTPs
    const emailOTP = generateOTP();
    const mobileOTP = generateOTP();

    const user = {
      id: uuidv4(), 
      email,
      mobile,
      fname,
      lname,
      isEmailVerified: false,
      isMobileVerified: false,
      emailOTP,
      mobileOTP,
      createdAt: new Date().toISOString(),
    };

    // 4. Save user
    await createUser(user);

    // 5. Send OTPs
    await sendEmailOTP(email, emailOTP);
    await sendMobileOTP(mobile, mobileOTP);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Signup successful. OTPs sent." }),
    };
  } catch (err) {
    console.error("Signup error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
