const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const app = express();
const PORT = 8000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

const connect = mongoose.connect("Your own mongodb");
const db = mongoose.connection;
db.on('error', (error)=> console.log(error));
db.once('open', ()=> console.log('Connected to the mongodb'));
connect.then(()=>{console.log("success")});

const Loginschema = new mongoose.Schema({
    userID: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

app.get('/', function (req, res) {
  res.render("login");
});

app.get('/signup', function (req, res) {
  res.render("signup");
});

app.post("/signup", async (req,res) => {
  const data = {
    userID: req.body.userID,
    password: req.body.password
  }
  const existingUser = await collection.findOne({ userID: data["userID"] });
  if (existingUser) {
        res.send('User already exists. Please choose a different username.');
  }else{
    const salt = 10;
    const hashedPassword = await bcrypt.hash(data["password"], salt);
    data["password"] = hashedPassword;
    const userData = await collection.insertMany(data);
    console.log(userData);
    res.redirect('/');
  }
})

app.post("/login",async(req,res)=>{
  try{
        console.log(req.body);
        const check = await collection.findOne({userID: req.body.userID});
        if(!check){
          res.send("User not found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
          res.render("home");
        }else{
          res.send("Wrong password");
        }
  }catch{
      res.send("wrong data");
  }
})
app.listen(PORT,()=>{
    console.log(`listening on port: ${PORT}`)
});
