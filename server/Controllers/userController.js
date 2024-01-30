const userModel = require("../Models/userModel");
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const env = require("dotenv");

env.config();

const createToken = (_id) =>{
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}

const registerUser = async (req, res) =>{
    try {
        const {name, email, password} = req.body;
    
        let user = await userModel.findOne({email: email})
        if (user){
            return res.status(400).json("User already exists");
        }
    
        if (!name || !email || !password){
            return res.status(400).json("All fields are required");
        }
    
        if (!validator.isEmail(email)){
            return res.status(400).json("Invalid email");
        }
    
        if (!validator.isStrongPassword(password)){
            return res.status(400).json("Password must be strong");
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        let newUser = new userModel({name:name, email:email, password:hashedPassword});
        await newUser.save();
    
        const token = createToken(newUser._id);
        return res.status(200).json({_id: newUser._id, name: newUser.name, email: newUser.email,token});

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};

const loginUser = async (req, res) =>{
    try {
        const {email, password} = req.body;
    
        let user = await userModel.findOne({email: email})
        if (!user){
            return res.status(400).json("User not found");
        }
        
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword){
            return res.status(400).json("Invalid credentials");
        }

        const token = createToken(user._id);
        return res.status(200).json({ _id: user._id, name: user.name, email: user.email, token});

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};

const findUser = async (req, res) =>{
    try {
        const userId = req.params.userId;

        const user = await userModel.findById(userId);

        return res.status(200).json(user)

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

}

const getUsers = async (req, res) =>{
    try {
        const users = await userModel.find();

        return res.status(200).json(users)

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

}

module.exports = {registerUser, loginUser, findUser, getUsers};