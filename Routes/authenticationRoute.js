//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
//DB Model for authentication
const User = require('../Model/authenticationModel');

// CREATE - register
router.post('/account-regist', (req, res) => {
    const newRegist = new User({
        first_name: req.body.fname,
        last_name: req.body.lname,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        country: req.body.region,
        reference_code: req.body.reference_code,
        logo: req.body.logo,
    });

    newRegist.save()
        .then(savedEntry => {
            res.status(201).json(savedEntry);
        })
        .catch(error => {
            console.error('Error saving regist entry:', error);
            res.status(500).json({ error: 'Error saving regist entry' });
        });
});

// READ - login
router.post('/account-authentication', (req, res) => {
    const authEntry = new User({
        password: req.body.password,
        email: req.body.email,
    });

    User.findOne({ email: authEntry.email, password: authEntry.password })
        .then(user => {
            if (!user) {
                alert("Invalid credentials, please try again.")
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            //Generate a new token
            const authToken = require('../Secure/authToken')(user);
            //Store it in a new cookie ---
            res.cookie('token', authToken, {httpOnly: true});
            // ---

            const name = user.first_name + " " + user.last_name;
            res.json({ message: 'Login successful', name });
        })
        .catch(error => {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Error during login' });
        });
});

//UPDATE

//DELETE

module.exports = router;
