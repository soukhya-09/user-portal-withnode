const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Assignment = require('../models/Assignment')


exports.registerUser = async(req,res)=>{
    const {username,password} = req.body;
    try {
        if(!username || !password){
            return  res.status(401).json({message:'empty details'})
        }
        const newuser = await User.findOne({username:username})
        if(newuser){
            return  res.status(401).json({message:'user already registered , please login'})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({username,password:hashedPassword})
        await user.save()
        res.status(201).json({message:'user registered successfully'})


        
    } catch (error) {
        res.status(400).json({message:'error registering user'})
        
    }
}

exports.loginUser = async(req,res)=>{
    const {username,password} = req.body;
    try {
        if(!username || !password){
            return  res.status(401).json({message:'empty details'})
        }
        const user = await User.findOne({username})
        if(!user ){
            return res.status(401).json({message:'user not registered, please register'})
        }
        const passwordhashed = await bcrypt.compare(password,user.password);
        if(!passwordhashed){
            return res.status(401).json({message:'password is incorrect'})
        }
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'})
       return res.cookie("token",token,{maxAge:5*1000*60*60, httpOnly:true}).status(200).json({message:"logged in successfully"})

        
    } catch (error) {
        res.status(400).json({message:'error logging in',issue:error})
        
    }
}

exports.uploadAssignment =async(req,res)=>{
    try {
        const {task,admin} = req.body;
         //console.log(req.cookies.token);
        const userId = req.user.id;
       // console.log(userId);
        if(!userId){
            return  res.status(401).json({message:'user not authenticated , please login'})
        }
        if(!task || !admin){
            return  res.status(401).json({message:'empty details, enter task and admin'})
        }
        const assignment = new Assignment({userId,task,admin})
        await assignment.save()
        res.status(201).json({message:'Assignment uploaded successfully'})
    } catch (error) {
        res.status(400).json({message:'error uploading assignment', error:error.message})
    }
}