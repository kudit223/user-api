
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"Please enter the name!!"],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Invalid Email formate"],
        unique:[true,"Email already exists"],
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,"Invalid Password formate"]
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

module.exports = User;