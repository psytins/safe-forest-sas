//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
//DB Model for authentication
const User = require('../Model/authenticationModel');

// CREATE
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

// READ
router.get('/account-authentication', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

//UPDATE

//DELETE

module.exports = router;
