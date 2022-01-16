const jwt = require('jsonwebtoken')

exports.verifyToken = (req,res,next) => {

    const token = req.headers['Authorization'];

    if(!token){
       return res.status(403).send({
            message: 'User is unauthorized'
        })
    }

    try {
     const check_token = jwt.verify(token, process.env.TOKEN_KEY);
    }
    catch(e){
        res.status(401).send({
            message: 'Invalid Token'
        })
    }

   return next();
    
}