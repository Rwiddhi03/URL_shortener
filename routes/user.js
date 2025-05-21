const express = require("express")
const {v4: uuidv4} = require("uuid")
const User = require("../models/users")
const {setUser , getUser} = require("../services/auth")

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        console.log("User created:", user);
        return res.render("home");
    } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).send("Error saving user.");
    }
});


router.get('/signup' , (req , res)=>{
    return res.render("signup")
})

router.get('/login' , (req , res)=>{
    return res.render("login")
})

router.post("/login" , async(req , res)=>{
    const {email , password} = req.body
    const user = await User.findOne({email , password})
    if(!user){
        return res.render("login" , {
            error: "Incorrect username or password"
        })
    }
    const token  = setUser(user)
    res.cookie("uid" , token)
    console.log("Login successful")
    return res.render("home")
})

module.exports = router