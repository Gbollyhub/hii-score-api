const express = require('express');
const router = express.Router();
const {register, login, checkStatus, sendVerification, verifyOtp, resendOtp, changeNumber} = require('../controllers/auth')

router.post('/register', register)

router.post('/login', login)

router.post('/check-status', checkStatus)

router.post('/send-otp', sendVerification)

router.post('/verify-otp', verifyOtp)

router.post('/resend-otp', resendOtp)

router.delete('/change-number', changeNumber)




module.exports = router;