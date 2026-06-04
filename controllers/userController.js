const User = require("../models/userSchem");
const Joi = require("joi");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const schema = Joi.object({
      name: Joi.string().trim().min(3).max(50).required(),
      email: Joi.string().email().trim().lowercase().required(),
      password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
        .trim()
        .required(),
    });

    const { error } = schema.validate({
      name,
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const isUserExists = await User.findOne({ email: email });

    if (isUserExists) {
      return res.status(400).json({
        success: false,
        message: "Email allready exists!!",
      });
    }

    const hashpassword = await bcrypt.hash(password, Number(process.env.SALTS));

    const userDetails = await User.create({
        name,
        email,
        password:hashpassword
    })

    userDetails.password = undefined

    res.status(201).json({
        success:true,
        message:"User Created successfully!!",
        user:userDetails
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    });
  }
};
