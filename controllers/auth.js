const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Vonage = require('@vonage/server-sdk')



exports.register = async (req, res) => {

    try{
        const { first_name, last_name, address, user_class, password, phone_number, account_type,username} = req.body

        // const old_user = await userModel.findOne({phone_number})

        // if(old_user){
        //     return res.status(409).send({
        //         message: 'This account exists, Please login'
        //     })
        // }

  const hash_password = await bcrypt.hash(password, 10);
       
  const userdetails = await userModel.findOne({phone_number}); 

  userdetails.first_name = first_name
  userdetails.last_name = last_name
  userdetails.address = address
  userdetails.user_class = user_class
  userdetails.password = hash_password
  userdetails.account_type = account_type
  userdetails.username = username

  await userdetails.save()

  const token = jwt.sign({ userdetails: userdetails._id, phone_number}, process.env.TOKEN_KEY, { expiresIn: '6h'})

  return  res.status(200).send({
    data: userdetails,
    token
});

    }

    catch(e){
        
        res.status(500).send(e);

    }

}

exports.login = async (req, res) => {
    try{

        const { phone_number, password } = req.body;

        const userdetails = await userModel.findOne({phone_number});

        const pass_check = await bcrypt.compare(password, userdetails.password)

        if(userdetails && pass_check){

            const token = jwt.sign({ userdetails: userdetails._id, phone_number}, process.env.TOKEN_KEY, { expiresIn: '6h'})

          return  res.status(200).send({
                data: userdetails,
                token
            });

        }

        res.status(401).send({
            message: "Invalid login credentials"
        })

    }
    catch(e){
        res.status(500).send(e)
    }
}

exports.checkStatus = async (req, res) => {

    try{

        const { phone_number } = req.body;
        console.log(req.body)

        const userdetails = await userModel.findOne({phone_number});

        if(!userdetails){
            return res.status(404).send({
                message: 'User not found'
            })
        }


         res.status(200).send({
                data: userdetails
            });

    }
        catch(e){
            res.status(500).send(e)
        }
    }

exports.sendVerification = async (req, res) => {


        const vonage = new Vonage({
            apiKey: "26fdd524",
            apiSecret: "qslAwE2o9HZ16zVD"
          })

          const { phone_number } = req.body;

        try{

           
            const random = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1) ) + min;
             }
              
             const otp = random(10000,90000)

            const from = "HiiScore"
            const to = phone_number
            const text = 'Verification code: ' + otp
            
            vonage.message.sendSms(from, to, text, async (err, responseData) => {
                if (err) {
                    console.log(err);
                } else {
                    if(responseData.messages[0]['status'] === "0") {

                        const user = userModel({
                            phone_number,
                            otp
                        })
     
                       await user.save();

                        res.status(200).send({
                            message: "OTP sent successfuly",
                        });


                    } else {
                        res.status(500).send({
                            message: `Message failed with error: ${responseData.messages[0]['error-text']}`
                        });
                        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                    }
                }
            })
    
        }
            catch(e){
                res.status(500).send(e)
            }
        }

exports.verifyOtp = async (req, res) => {
          
        const { phone_number, otp } = req.body;

        try{

         const userdetails = await userModel.findOne({phone_number})

         if( userdetails.otp == otp){
             return res.send({
                 message: "Otp verified successfully"
             })
         }

         res.status(401).send({
             message: "Invalid Otp"
         })

        }

        catch(e){

            res.status(500).send(e)

        }
    }

exports.resendOtp = async (req, res) => {

        const vonage = new Vonage({
            apiKey: "26fdd524",
            apiSecret: "qslAwE2o9HZ16zVD"
          })

          const { phone_number } = req.body;

        try{

           
            const random = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1) ) + min;
             }
              
             const otp = random(10000,90000)

            const from = "HiiScore"
            const to = phone_number
            const text = 'Verification code: ' + otp
            
            vonage.message.sendSms(from, to, text, async (err, responseData) => {
                if (err) {
                    console.log(err);
                } else {
                    if(responseData.messages[0]['status'] === "0") {

                        const userdetails = await userModel.findOne({phone_number}); 

                        userdetails.otp = otp
                      
                        await userdetails.save()

                        res.status(200).send({
                            message: "OTP sent successfuly",
                        });


                    } else {
                        res.status(500).send({
                            message: `Message failed with error: ${responseData.messages[0]['error-text']}`
                        });
                        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                    }
                }
            })
    
        }
            catch(e){
                res.status(500).send(e)
            }
        }

exports.changeNumber = async(req, res) => {
    try{
        const { phone_number } = req.body;

        const userdetails = await userModel.findOne({phone_number});

       console.log(userdetails)
       
        if(userdetails){
            
    await userModel.findOneAndDelete({phone_number: phone_number}, (err) => {
            if(err){
          console.log(err)
            }
            console.log('User Deleted')
        });

        res.send({
            message: "User Deleted"
        })
        }
        else{
            res.status(404).send({
                message: "User not found"
            })
        }

    }
    catch(e){
        res.status(500).send(e)
    }
    
}