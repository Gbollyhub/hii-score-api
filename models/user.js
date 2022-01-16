const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: { type: String},
    last_name: { type: String},
    user_name: { type: String},
    address: { type: String},
    user_class: { type: String},
    password: { type: String},
    account_type: { type: Number},
    phone_number: { type: String, unique:true},
    otp: { type: Number, unique:true},
    created: {
        type: Date,
        default: Date.now
    }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel