const jwt=require('jsonwebtoken');
const confiq=require('../config/config').get(process.env.NODE_ENV);
const User=require('./../models/user');
const Dashboard=require('./../models/dashboard');

let auth =(req,res,next)=>{
    let token =req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            error :true
        });

        req.token= token;
        req.user=user;
        next();

    })
}


  
// let autht = (req,res,next) =>{
//     const token = req.body.token || req.query.token || req.headers["authorization"];
//     if(!token){
//         return res.status(403).send("A token is required for authentication");
//     }
//     try{
//         const decoded = jwt.verify(token,'6120e49517876d67804b8976');
//     req.user = decoded;
//     }catch(err){
//         return res.status(401).send("Invalid Token");
//     }
//     return next();
// };

const autht = // Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

};

// let autht = function authenticateToken(req, res, next){
//     const authHeader = req.headers['authorization']
//     const token = authHeader || authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, confiq.ACCESS, (err, user) =>{
//       if(err) return res.sendStatus(403)
//       //user=req.user
//       req.user = user
//       next()
//     })
//   }

module.exports={auth, autht};