const User = require('../models/User');
const fs = require('fs');
const path = require('path')
const { generateToken } = require('../utils/jwtUtils');


const  getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        const userImage = user.image && `${process.env.BACKEND_URL}${user.image}`;

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            image: userImage ? userImage : null, 
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
      
     const updateUserProfile = async (req, res) => {
        try {
            const user =await User.findById(req.user._id);
            if (user) {
                user.username = req.body.username || user.username
                user.email= req.body.email || user.email;

                if (req.file) {
                    if (user.image) {
                        const oldImagePath = path.join
                        (__dirname, '..', user.image);

                        fs.unlink(oldImagePath,(err) => {
                            if (err){
                            console.error("Failed to delete old image:", err);
                            } else{
                                console.log("Old image delete successfully");                            }

                        })
                    }

                 const imagePath = `/uploads/ ${req.file.filename}`;
                 user.image = imagePath;
                }
             if (req.body.password) {
                user.password = req.body.password
             }

             const updateUser = await user.save()
             const userImage = updateUser.image && `${process.env.BACKEND_URL}${updateUser.image}`;
            console.log("userController -> updateUserProfile: ", userImage ?? "No Image");
            res.json({
                _id: updateUser._id,
                username: updateUser.username,
                email: updateUser.email,
                image: userImage ? userImage: null,
                token: generateToken(updateUser._id),
            });
            } else{
                res.status(404).json({message: ' User not found '});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json ({ message: error.message });
        }
     };

     module.exports = { getUserProfile, updateUserProfile}; 



