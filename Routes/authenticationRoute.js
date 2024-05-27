//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');
//DB Model for authentication
const User = require('../Model/authenticationModel');
const Contact = require('../Model/contactModel')

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
        || !newRegist.email || !newRegist.phone || !newRegist.country) {
        return res.status(401).json({ error: 'Please fill all required fields.' });
    }

    User.findOne({ where: { email: newRegist.email } }).then(user => {
        if (user) { // found existing email
            return res.status(402).json({ error: 'Email already exists.' });
        } else {
            if (newRegist.password != req.body.cpassword) {
                return res.status(403).json({ error: 'Password dont match.' });
            }
            else {
                newRegist.save()
                    .then(savedEntry => {
                        return res.status(201).json(savedEntry);
                    })
                    .catch(error => {
                        console.error('Error saving regist entry:', error);
                        return res.status(500).json({ error: 'Error saving regist entry' });
                    });
            }
        }
    });
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

                const userID = user.userID;
                const name = user.first_name + " " + user.last_name;
                const email = user.email;
                const country = user.country;
                const ref_code = user.reference_code;
                return res.json({ message: 'Login successful', userID, name, email, country, ref_code });
            })
            .catch(error => {
                console.error('Error during login:', error);
                return res.status(500).json({ error: 'Error during login' });
            });
    }
});

// SignOUT
router.post('/account-signout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Sign out successful' });
});

// UPDATE - change password
router.post('/account-change-password', (req, res) => {
    const searchUser = new User({
        userID: req.body.userID,
    });

    current_password = req.body.current_password;
    new_password = req.body.new_password;
    confirm_new_password = req.body.confirm_new_password;

    // Validate Register
    if (!current_password || !new_password || !confirm_new_password) {
        return res.status(401).json({ error: 'Please fill all required fields.' });
    }

    User.findOne({ where: { userID: searchUser.userID } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user.password !== current_password) {
                return res.status(402).json({ error: 'Current Password is wrong.' });
            } else {
                if (new_password !== confirm_new_password) {
                    return res.status(403).json({ error: 'Password dont match.' });
                }
                else {
                    // save the new password
                    user.password = new_password;
                    user.save();
                    return res.json({ message: 'Changed password.' });
                }
            }
        })
        .catch(error => {
            console.error('Error updating user entry:', error);
            return res.status(500).json({ error: 'Error updating user entry' });
        });
});

//DELETE - ACCOUNT
router.post('/account-delete', (req, res) => {
    const searchUser = new User({
        userID: req.body.userID,
    });

    User.destroy({ where: { userID: searchUser.userID } })
        .then(rowsDestroyed => {
            res.json({ message: `Deleted ${rowsDestroyed} row(s).` });
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            return res.status(500).json({ error: 'Error deleting user' });
        });
});

// ADD - Contacts
router.post('/add-contacts', (req, res) => {
    const newRegist = new Contact({
        user_id: req.body.userID,
        email_address: req.body.email,
    });

    // Validate Contact Register - TODO: Limit to 20 contacts max.
    // ...
    Contact.findOne({ where: { email_address: newRegist.email_address } }).then(contact => {
        if (contact) { // found existing camera
            return res.status(402).json({ error: 'Email already exists' });
        } else {
            newRegist.save()
                .then(savedEntry => {
                    return res.status(201).json(savedEntry);
                })
                .catch(error => {
                    console.error('Error saving regist entry:', error);
                    return res.status(500).json({ error: 'Error saving regist entry' });
                });
        }
    });
});

// List Contacts
router.post('/list-contacts', (req, res) => {
    Contact.findAll(
        {
            where: {
                user_id: req.body.userID
            }
        }
    )
        .then(contacts => {
            return res.json({ contacts });

        })
        .catch(error => {
            console.error('Error during contact listing:', error);
            return res.status(500).json({ error: 'Error during contact listing' });
        });
});

//DELETE - Contacts
router.post('/contact-delete', (req, res) => {
    const searchContact = new Contact({
        contactID: req.body.contactID,
    });

    Contact.destroy({ where: { contactID: searchContact.contactID } })
        .then(rowsDestroyed => {
            res.json({ message: `Deleted ${rowsDestroyed} row(s).` });
        })
        .catch(error => {
            console.error('Error deleting contact:', error);
            return res.status(500).json({ error: 'Error deleting contac' });
        });
});


module.exports = router;
