const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Assignment = require('../models/Assignment');

// Register a new admin
exports.registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return  res.status(401).json({message:'empty details'})
        }
        const newuser = await Admin.findOne({username:username})
        if(newuser){
            return  res.status(401).json({message:'user already registered , please login'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering admin', error:error.message });
    }
};

// Login admin
exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return  res.status(401).json({message:'empty details'})
        }
        const admin = await Admin.findOne({ username });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin._id , role:admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token",token,{maxAge:5*1000*60*60 , httpOnly:true,}).status(201).json({message:"logged in successfully , welcome admin"});
    } catch (error) {
        res.status(400).json({ message: 'Error logging in' ,error:error.message});
    }
};

// Get assignments for admin
exports.getAssignments = async (req, res) => {
    try {
        const adminId = req.admin.id; // Assuming middleware sets req.admin
        if(!adminId){
            return res.status(400).json({
                message:"admin not authenticated, please login"
            })
        }
       
        const admin = await Admin.findById(adminId);
    
        return res.status(200).json({
            message:"fetched succesfully",
            assignments:admin.assignments
        })
    } catch (error) {
        res.status(400).json({ message: 'Error fetching assignments', error:error.message });
    }
};

// Accept an assignment
exports.acceptAssignment = async (req, res) => {
    try {
        const {id } = req.params;
        if(!id){
            return res.status(400).json({
                message:"no assignment_id found , please mention the assignment id"
            })
        }
        const assign = await Assignment.findById(id);
        if(!assign){
            return res.status(401).json({
                message:"No assignment found with this id ,please check id"
            })
        }
        await Assignment.findByIdAndUpdate(id, { status: 'Accepted' });
       
       return res.status(200).json({ message: 'Assignment accepted' });
    } catch (error) {
        res.status(400).json({ message: 'Error accepting assignment',error:error.message });
    }
};

// Reject an assignment
exports.rejectAssignment = async (req, res) => {
    try {
        const {id } = req.params;
        if(!id){
            return res.status(400).json({
                message:"no assignment_id found , please mention the assignment id"
            })
        }
        const assign = await Assignment.findById(id);
        if(!assign){
            return res.status(401).json({
                message:"No assignment found with this id ,please check id"
            })
        }
        await Assignment.findByIdAndUpdate(id, { status: 'Rejected' });
       
       return res.status(200).json({ message: 'Assignment Rejected' });
    } catch (error) {
        res.status(400).json({ message: 'Error rejecting assignment',error:error.message });
    }
};