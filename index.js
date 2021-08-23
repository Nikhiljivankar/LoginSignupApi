const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt=require('jsonwebtoken');
const db = require("./config/config").get(process.env.NODE_ENV);
const User = require("./models/user");
const Dashboard = require("./models/dashboard");
const { auth, autht } = require("./middlewares/auth");
const dashboard = require("./models/dashboard");

const app = express();

//app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(
  db.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) console.log(err);
    console.log("database is connected");
  }
);
//const conn= mongoose.createConnection('mongodb://localhost:27017/Dashboards');
//mongoose.connect(
//   db.DATABASE1,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err) {
//     if (err) console.log(err);
//     console.log("database is connected1");
//   }
// );

// adding new user (sign-up route)
app.post("/api/register", function (req, res) {
  // taking a user
  const newuser = new User(req.body);

  if (newuser.password != newuser.password2)
    return res.status(400).json({ message: "password not match" });

  User.findOne({ email: newuser.email }, function (err, user) {
    if (user)
      return res.status(400).json({ auth: false, message: "email exits" });

    newuser.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      res.status(200).json({
        success: true,
       user: newuser.firstname + newuser.lastname,
       date_of_Birth: newuser.dob,
        id : newuser._id,          ///change
        email : newuser.email,
        messege: 'success',
        status: 200,
      });
    });
  });
});

// login user
app.post('/api/login', function(req,res){
    let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });
    
        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id
                        ,email : user.email
                    });
                });    
            });
          });
        }
    });
});


//logout user
app.get('/api/logout',auth,function(req,res){
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.sendStatus(200);
    });

}); 

//add data in dashboard
// adding new user (sign-up route)
app.post("/register", function (req, res) {
  // taking a user
  const newuser = new Dashboard(req.body);
    newuser.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }else{
        jwt.sign({newuser}, 'secretkey', (err, token) => {
          res.json({
            success: true,
         user: newuser.firstname + newuser.lastname,
         date_of_Birth: newuser.dob,
          id : newuser._id,
          token: token,          ///change
          email : newuser.email,
          messege: 'success',
          status: 200,
          });
        }); 
}
      
});

// //mock user
// const user = {
//   id: 1, 
//   username: 'brad',
//   email: 'brad@gmail.com'
// }

// jwt.sign({user}, 'secretkey',  (err, token) => {
//   res.json({
//     username: user.username,
//     email: user.email,
//     token
//   });
// }); 
 


      // jwt.sign({newuser}, 'secretkey', (err, token) => {
      //   res.status(200).json({
      //     success: true,
      //    user: newuser.firstname + newuser.lastname,
      //    date_of_Birth: newuser.dob,
      //     id : newuser._id,
      //     token: token,          ///change
      //     email : newuser.email,
      //     messege: 'success',
      //     status: 200,
      //   });
      // }); 
   
    
  });


//dashboard model
app.get('/user', autht,function(req,res) {
  jwt.verify(req.token, 'secretkey', (err, user) => {
    //const user = authData;
    if(err) {
      res.sendStatus(403);
    } else { 
      res.json({
        message: 'requested user data...',
        //name: user.username,
       user
      });
    }
  });
      
})
// app.get('/user', autht, (req, res) => {
//  // User.findOne({'email':req.body.email},function(err,user){}
//       dashboard.res.json(users.filter(user => user.username === req.user.firstname));
//     });


app.get("/", function (req, res) {
  res.status(200).send("welcome to login, signup Api");
});

//listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`);
});
