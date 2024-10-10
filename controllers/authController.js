const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { generateToken }=  require ('../utils/jwtUtils');

//רישום משתמש חדש //
 
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExsists) {
            return res.status(400).json ({message: ' User already exists'}) ;
        }

        const user = await User.create ({ username, email, password});
        res.status(201).json ({ _id: user._id, username:user.username, 
            email:user.email, 
            token: generateToken(user._id),
         });
    }catch (error){
        res.status(500).json ({message:error.message});
    }
};

const loginUser = async (req, res) => {
    const { email, password} = req.body
    try{
        const user = await User.findOne({ email});

        const userImage = user.image && `${process.env.BACKEND_URL}${user.image}`;
        if (user && (await bcrypt.compare(password, user.password))) {
     res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
       image: userImage ? userImage: null,
        token: generateToken(user_id),
     });
        } else {
            res.status(401).json ({ message: 'Invalid email or password '});
        }
    } catch (error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {registerUser, loginUser };
