import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//Route for user Login

const loginUser = async(req,res) =>{
    try {
        
        const {email, password} = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success:false, message:"User doesn't exists"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            return res.json({
                success:true,
                message:"User logged in successfully",
                token
            });
        }else{
            return res.json({
                success:false,
                message:"Invalid credentials" 
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}
//Route for user Registration

const registerUser = async(req,res) =>{
    try{
        const { name, email, password } = req.body;

        //checking user already exists 
        const exists = await userModel.findOne({email});

        if(exists){
            return res.json({
                success:false, message:"User already exists"
            })
        }

        //validating email format & password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email format"});
        }
        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password with at least 8 characters"});
        }

        //hashing password

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        //creating user

        const newUser  = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({
            success: true,
            message: "User registered successfully",token})
    }catch(error) {
        res.status(500).json({success:false, message: "Internal Server Error" });
    }
}

//Route for Admin Login

const adminLogin = async(req,res) =>{
    
    try {
        const {email,password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.json({
                success:true,
                message:"Admin logged in successfully",
                token
            });
        }else{
            return res.json({
                success:false,
                message:"Invalid credentials"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        });
        
    }
}

export { loginUser, registerUser, adminLogin };