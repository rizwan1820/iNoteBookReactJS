const express = require('express');
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'RIZWAN IS GOOOD BOY%&';

//ROUTE1: craete a  user using: POST"/api/auth/createuser" .No Login Require
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),

    body('email', 'Enter a valid email').isEmail(),

    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),


], async (req, res) => {

    //if there are errors return bad request and the errors
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //check whether email exist already
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry a user witth this email already exist" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);


        // .then(user => res.json(user))
        //     .catch(err => {
        //         console.log(err)
        //         res.json({ error: 'Please enter a unique value email', message: err.message })
        res.json(authtoken)
        //catch error
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server error");
    }
})

//ROUTE 2: Authenticate a user using: POST"/api/auth/login" .No Login Require

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()


], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Kindly enter valid credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Kindly enter valid credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json(authtoken)


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server error");
    }
})
//ROUTE 3: GET LOGGED IN USER DETAIL using: POST"/api/auth/getuser" .Login Require

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userID = req.user.id;
        const user = await User.findById(userID).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server error");

    }

})
module.exports = router