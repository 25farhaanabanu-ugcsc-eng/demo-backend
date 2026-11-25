const express = require("express");

const router = express.Router();

const {
    register,
    login
} = require("../controllers/authcontrollers");
const user = require('../models/user')

// Register API
// router.post("/register", register,);

router.post("/", async (req,res)=>{
    try{
        const users = new user(req.body)
        const saveduser =await users.save()
        res.status(201).json({
            message: 'user was successfully submitted',
            data: saveduser
        });
    }
    catch(error) {
        res.status(500).json({
            message: 'Error creating student',
            data: error.message
        })
    }
});

router.get('/', async (req,res) =>{
    try{
        const users=await user.find()
        res.status(200).json({
            message:'student was successfully fetched',
            data: users
        });
    
    }    
    catch(error){
        res.status(500).json({
            message:'error in fetching details',
            data: error.message
    })
    }
});

// Login API
router.post("/login", login);

module.exports = router;
