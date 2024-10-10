const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');

const UserSchema = new mongoose.Schema ({
    usernama: {
        type: String,
        required: true,
        unique: true,
    },
image: {
    type: String
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    require: true,
    unique: true
   }, 
   googleAccessToken: { type: String },
   googleRefreshToken: { type: String }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified( 'password ')) {
        next ();
    }
    const salt = await bcrypt.gensalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

   const User = mongoose.model('User', UserSchema);
   module.exports =User;