const User = require('../models/userModel');
const bcyrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/', (req, res) => {
    res.send("User Router")
})

// User SignUp Api
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if(user) {
            return res.status(401).json({ msg: "User Already Exists!!!" });
        }
        const passwordHash = await bcyrpt.hash(password, 12);
        const newUser = new User ( {
            email: email,
            password: passwordHash
        })
        await newUser.save();
        res.json({ msg: "Sign Up Success!!" });
    }catch(err) {
        return res.status(500).json({msg: err.message});
    }
})

// User Sign In
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if(!user)
            return res.status(400).json({msg: "User Does Not Exist"});
        const isMatch = await bcyrpt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.KEY, { expiresIn: '1d' });
        res.json(token)  
    }catch(err) {
        return res.status(503).json({ msg: err.message });
    }
})

// User Token verification
router.get('/verify', async (req, res) => {
    try {
        const token = req.header("Authorization");
        if( !token ) {
            return res.send(false)
        }
        jwt.verify(token, process.env.KEY, async (err, verified) =>{
            if(err)
                return res.send(false)
            const user = await User.findById(verified.id) 
            if(!user)
                return res.send(false);

            return res.send(true);
        })
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})

// Delete User
router.delete('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ msg: "User Deleted!" })
    }catch (err) {
        return res.status(500).json({msg: err.message});
    }
})
module.exports = router;