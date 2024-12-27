const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,  
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;  
            },
        },
        username: {
            type: String,
            required: function () {
                return !this.googleId;  
            },
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'manager', 'operator'],
            default: 'user',
        },
        googleId: {
            type: String,
            sparse: true,  
        },
        resetCode: {
            type: Number,
            default: null,  
        },
        resetCodeExpires: {
            type: Date,
            default: null,  
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
