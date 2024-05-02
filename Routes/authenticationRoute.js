//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');
//DB Model for authentication
const User = require('../Model/authenticationModel');

// CREATE - register
router.post('/account-regist', (req, res) => {
    //const hashedPassword = await bcrypt.hash(password, 10);
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

    // Validate Register
    if (!newRegist.first_name || !newRegist.last_name || !newRegist.password
        || !newRegist.email || !newRegist.phone || !newRegist.region) {
        return res.status(400).json({ error: 'Please fill all required fields.' });
    }
    else if (User.findOne({ where: { email: authEntry.email } })) {
        return res.status(406).json({ error: 'Email already exists.' });
    }
    else if(newRegist.password != req.body.cpassword)
    {
        return res.status(400).json({ error: 'Password dont match.' });
    }
    else {
        newRegist.save()
            .then(savedEntry => {
                res.status(201).json(savedEntry);
            })
            .catch(error => {
                console.error('Error saving regist entry:', error);
                res.status(500).json({ error: 'Error saving regist entry' });
            });
    }
});

// READ - login
router.post('/account-authentication', (req, res) => {
    const authEntry = new User({
        password: req.body.password,
        email: req.body.email,
    });

    if (!authEntry.password || !authEntry.email) {
        return res.status(400).json({ error: 'Please fill all required fields.' });
    }
    else {
        User.findOne({ where: { email: authEntry.email, password: authEntry.password } })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                //Generate a new token
                const authToken = require('../Secure/authToken')(user);
                //Store it in a new cookie ---
                res.cookie('token', authToken, { httpOnly: true });
                // ---

                const name = user.first_name + " " + user.last_name;
                const email = user.email;
                const country = user.country;
                const ref_code = user.reference_code;
                res.json({ message: 'Login successful', name, email, country, ref_code });
            })
            .catch(error => {
                console.error('Error during login:', error);
                res.status(500).json({ error: 'Error during login' });
            });
    }
});

// SignOUT
router.post('/account-signout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sign out successful' });
});

//UPDATE

//DELETE

module.exports = router;
