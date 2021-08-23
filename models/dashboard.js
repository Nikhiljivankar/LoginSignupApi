const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const confiq=require('../config/config').get(process.env.NODE_ENV);
const mongoose=require('mongoose');

const dashboardSchema=mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        maxlength: 100
    },
    lastname:{
        type: String,
        required: true,
        maxlength: 100
    },
    dob:{
        type: Date,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    
    token:{
        type: String
    }
});


// find by token
dashboardSchema.statics.findByToken=function(token,cb){
    var user=this;

    jwt.verify(token,confiq.SECRET,function(err,decode){
        user.findOne({"_id": decode, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
};


// app.get('/user', authenticateToken, (req, res) => {

//     res.json(posts.filter(post => post.username === req.user.name));
//   });
  
const conn= mongoose.createConnection('mongodb://localhost:27017/Dashboards');
  


    module.exports=conn.model('Dashboard',  dashboardSchema);
  

// app.get("/user", (req,res)=>{
//     collection.find({}).toArray((err,result)=>{
//       if(err){return response.status(500).send(err);}
//       res.send(result);
//     });
//   });