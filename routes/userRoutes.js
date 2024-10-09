const express  = require("express")
const {registerUser,loginUser,uploadAssignment}=require('../controllers/UserController')
const router = express.Router()
const {verifyAdmin, verifyUser} = require("../middleware/authMiddleware")
router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/upload',verifyUser,uploadAssignment)

module.exports=router