// Simple Server with mysql - for now it works...
const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');

const app = express();

// Connect to MySQL DB
const sequelize = new Sequelize('safeforest', 'root', 'password', { // for the future the pwd can't be here
    dialect: 'mysql',
    host: '127.0.0.1',
});

// Define a model - must be equal to mysql schema! 
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, unique: true,
        primaryKey: true, autoIncrement:
            true
    },
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    country: Sequelize.STRING,
    reference_code: Sequelize.STRING,
    logo: Sequelize.STRING, //temp string
    // -- must have in every table:
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    tableName: 'user'
},
);

// Sync the model with the database
sequelize.sync();

// Middleware
app.use(express.json());

// Endpoints ---- User
// GET
app.get('/account-authentication', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});
// POST
app.post('/account-regist', (req, res) => {
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
// --------------------------------------------------

// Protection middleware (temporary)
// app.use((req, res, next) => {
//     const token = req.headers.authorization;
//     if (token !== 'secret-token') {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     next();
// });

//Routes 
app.use(express.static('Public/Pages'));
app.use(express.static('Public'));

app.get('/authentication', (req, res) => {
    // Serve the authentication.html file
    res.sendFile(path.join(__dirname, 'Public/Pages/authentication.html'));
});


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});