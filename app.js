var express=require("express");
var bodyParser=require("body-parser");
const bcrypt=require("bcryptjs");
var passport=require("passport");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/budget', {useNewUrlParser: true, useUnifiedTopology: true});
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/sign_up', function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email =req.body.email;
    var pass = req.body.password;

    var data = {
        "firstname": firstname,
        "lastname": lastname,
        "email":email,
        "password":pass
    }
    db.collection('person').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");

    });

    return res.redirect('login.html');
})


app.get('/', function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('register.html');
}).listen(9000)


console.log("server listening at port 9000");