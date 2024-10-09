const jwt = require("jsonwebtoken")
const Admin = require('../models/Admin')

exports.verifyAdmin = async(req,res,next)=>{
    
    try {
        const token = req.headers['authorization'] || req.cookies.token;
    if(!token){
        return res.status(403).json({message:'no token, please login'})
    }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
       //req.user = decoded
       const admin = await Admin.findById(decoded.id);
       if(!admin){
        return res.status(400).json({
            message:"Not an Admin , please login with Admin credentials"
        })
       }
       req.admin = decoded
        next();
        
    } catch (error) {
        return res.status(401).json({message:'unauthorized', error:error.message})
    }
}



exports.verifyUser = async(req,res,next)=>{
    
    try {
        const token = req.headers['authorization'] || req.cookies.token;
    if(!token){
        return res.status(403).json({message:'no token, please login'})
    }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
       req.user = decoded
        next();
        
    } catch (error) {
        return res.status(401).json({message:'unauthorized'})
    }
}