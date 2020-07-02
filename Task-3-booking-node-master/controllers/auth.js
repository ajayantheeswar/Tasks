const user = require('../models/customer');
const adminUser = require('../Models/adminUser');
const tokenHash = require('../utils/webtoken');
const jwt = require('jsonwebtoken');

exports.createAdmin = (req,res,next) =>{
    console.log(req.body);
    adminUser.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })
    .then(user => {
        //console.log(tokenHash);
        const Auth_token = jwt.sign(user.dataValues.id,tokenHash.token);
        console.log(Auth_token);
        res.status(200).json({token : Auth_token , message: "Auth Success" , userId:user.dataValues.id});
    }).catch(error =>{ 
        error.message = "This Username is Already Taken";
        res.status(401).json(error);
    }
    );
}

exports.authAdmin = (req,res,next) => {
    adminUser.findAll({
        where:{
            email : req.body.email,
            password :req.body.password
        }        
    }).then(users => {
        console.log(users);
        if(users.length !== 0){
            const User = users[0];
            const Auth_token = jwt.sign(User.dataValues.id,tokenHash.token);
            res.status(200).json({token : Auth_token , message: "Auth Success",userId: User.dataValues.id});
        }else{
            res.status(401).json({message : "Username Does not Exist"});
        }
        
      }).catch(error => {
        res.status(401).json({message : "Wrong Credientails"});
      });
}


exports.createCustomer = (req,res,next) =>{
    console.log(req.body);
    user.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })
    .then(user => {
        //console.log(tokenHash);
        const Auth_token = jwt.sign(user.dataValues.id,tokenHash.token);
        console.log(Auth_token);
        res.status(200).json({token : Auth_token , message: "Auth Success" , userId: user.dataValues.id});
    }).catch(error =>{ 
        error.message = "This Username is Already Taken";
        res.status(401).json(error);
    }
    );
}

exports.authCustomer = (req,res,next) => {
    user.findAll({
        where:{
            email : req.body.email,
            password :req.body.password
        }        
    }).then(users => {
        console.log(users);
        if(users.length !== 0){
            const User = users[0];
            const Auth_token = jwt.sign(User.dataValues.id,tokenHash.token);
            res.status(200).json({token : Auth_token , message: "Auth Success" ,userId : User.dataValues.id});
        }else{
            res.status(401).json({message : "Username Does not Exists"});
        }
        
      }).catch(error => {
        res.status(401).json({message : "Invalid Credientials"});
      });
}

/*exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};
*/

