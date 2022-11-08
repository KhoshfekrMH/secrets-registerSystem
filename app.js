require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

mongoose.connect(process.env.MONGODB_URL);

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
   res.render("home");
});

app.route("/login")
.get(function (req, res) {
    res.render("login")
})
.post(function (req, res) {
   const  username = req.body.username;
   const password = req.body.password;
   User.findOne({email: username}, function (err, foundUser) {
       if(err) {
           console.log(err);
       } else {
           if(foundUser) {
               if(foundUser.password === password) {
                   res.render("secrets");
               }
           }
       }
   })
});

app.route("/register")
.get(function (req, res) {
    res.render("register");
})
.post(function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function (err) {
        if(err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});



app.listen(3300, function () {
   console.log("server is run on port 3300");
});