const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const registerUser = asyncHandler(async (req, res) => {
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    const userExists=await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const user=await User.create({name,email,password:hashedPassword});
    if(user){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user.id)
        })
    }else{
            res.status(400);
            throw new Error('Invalid user data');
        }
    // res.status(201).json({message: 'User registered'});
});

const loginUser = asyncHandler(async (req, res) => {
   const {email,password}=req.body;
   const user=await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
         res.status(200).json({
              _id:user._id,
              name:user.name,
              email:user.email,
              token:generateToken(user.id)
            
         })
    }
    else{
        res.status(401);
        throw new Error('Invalid email or password');
    }

});

const getMe = asyncHandler(async (req, res) => {
    const user=await User.findById(req.user._id);
    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'60d'
    });
}

module.exports = { registerUser, loginUser, getMe };
