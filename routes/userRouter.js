const express =require('express');
const { getUserProfile , updateUserProfile } = require 
('../controllers/userController');
const { protect } = require ('../middleware/authMiddleware');
const upload = require ('../middleware/multer');
const router = express.Router();

router
.route('/profile')
.get(protect, getUserProfile)
.put(protect, upload.single('image'),
updateUserProfile);

module.exports =router;
