const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  mobile: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required(), // E.164 format: +94712345678
  fname: Joi.string().optional(),
  lname: Joi.string().optional(),
});

module.exports = signupSchema;
