const express = require('express');
const { registerAdmin, loginAdmin, getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/AdminController');
const { verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/assignments', verifyAdmin, getAssignments);
router.post('/assignments/accept/:id', verifyAdmin, acceptAssignment);
router.post('/assignments/reject/:id', verifyAdmin, rejectAssignment);

module.exports = router;