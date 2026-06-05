const User = require("../models/userSchem");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

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
      password: hashpassword,
    });

    userDetails.password = undefined;

    res.status(201).json({
      success: true,
      message: "User Created successfully!!",
      user: userDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    });
  }
};

exports.loginUser = async (req, res) => {
  try{
     const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
      .trim()
      .required(),
  });

  const {error} = schema.validate({
    email,
    password
  });

  if(error){
    return res.status(400).json({
        success:false,
        message:error.message
    });
  }

  const userDetails = await User.findOne({email:email}).select('+password');

  if(!userDetails){
    return res.status(400).json({
        success:false,
        message:"Invalid Email or Password!!"
    });
  }

  const isPasswordValid = await bcrypt.compare(password,userDetails.password);

  if(!isPasswordValid){
    return res.status(400).json({
        success:false,
        message:'Invalid Email or Password!!'
    });
  }
  
  const token = jwt.sign({
    userId:userDetails._id,
    name:userDetails.name,
    role:userDetails.role
  },process.env.SECRET_KEY,{expiresIn:'2d'});

  res.status(200).json({
    success:true,
    message:"Login Successfully!!",
    token
  })


  }catch(error){
     res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    });
  }
 
};
