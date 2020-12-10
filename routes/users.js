const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const {registerValidation,loginValidation} = require('../validation')
const verify = require('../varifytoken');

//getting all users
router.get('/', async (req,res) => {

    const users = await User.find();
    try{
        res.status(200).json(users)
    }catch(err){
        res.status(400).json({message: err})
    }
})

//creating a user
router.post('/register', async (req,res) => {
    //validate before creating a new user
    const {error} = registerValidation(req.body)
    if (error)
    return res.status(400).send({message: error.details[0].message})

    //checking if the user already exist
    const emailExist = await User.findOne({Email: req.body.Email})
    if (emailExist)
       return res.status(400).send("Email already exist!")
    
    //hash the password
    let hashedPassword = bcrypt.hashSync(req.body.Password, 8);

    const user = new User({
        Name: req.body.Name,
        Email: req.body.Email,
        Role: req.body.Role,
        Password: hashedPassword
    })

   try{
   const userSaved = await user.save();
   res.status(201).json({user: user._id})
   }catch(err){
       res.status(400).json({message: err})
   }
   
})

//user Login
router.post('/login', async(req,res) => {
     //validate before creating a new user
     const {error} = loginValidation(req.body)
     if (error)
     return res.status(400).send({message: error.details[0].message})
 
     //checking if the user email exist
     const user = await User.findOne({Email: req.body.Email})
     if (!user)
        return res.status(400).send("Email or Password is wrong!")
     
     //checking password 
     const validPass = await bcrypt.compare(req.body.Password,user.Password)
     if(!validPass)
        return res.status(400).send("Email or Password is wrong!")

    //Create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({"token": token})
     
})

//getting specific user
router.get('/:userId', verify, async (req,res) => {
    
   try{
     const user =  await User.findById(req.params.userId)
     res.status(201).json(user);
   } catch(err) {
    res.status(400).json({message: err})
   }
})


//update specific user
router.patch('/:userId', verify, async (req,res) => {

    if(req.user._id != req.body.userId) return res.status(401).send("You are not permitted for this action!")
    try{
        const user = await User.updateOne({_id: req.params.userId}, {$set: {Name: req.body.Name,Email: req.body.Email}});
        res.status(201).json(user);
    } catch(err) {
     res.status(400).json({message: err})
    }
})


//Delete a specific user
router.delete('/:userId', verify,  async (req,res) => {

    //cheking the user Role
    let userRole;
    try{
        const user = await User.findOne({_id: req.user._id})
        userRole = user.Role;
        res.json(user)
    }catch(err) {
        res.status(400).json({message: err})
       }

    if(req.user._id == req.body.userId || userRole === "Librarian") {
        try{
            const user =  await User.deleteOne({_id: req.params.userId})
            res.status(201).json(user);
        } catch(err) {
        res.status(400).json({message: err})
        }
    }
    else return res.status(401).send("You are not permitted for this action!")
})

module.exports = router;