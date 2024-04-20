// Simple Server with mysql - for now it works...
const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();

// Connect to MySQL DB
const sequelize = new Sequelize('safeforest', 'root', 'password', { // for the future the pwd can't be here
    dialect: 'mysql',
    host: '127.0.0.1',
});

// Define a model
const User = sequelize.define('User', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    country: Sequelize.STRING,
    reference_code: Sequelize.STRING,
    logo: Sequelize.STRING, //temp string
});

// Sync the model with the database
sequelize.sync();

// Middleware
app.use(express.json());

// Endpoints
// GET
app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});
// POST
app.post('/users', async (req, res) => {
    const { first_name, last_name, password, email, phone, country, reference_code, logo } = req.body;
    const user = await User.create({ first_name, last_name, password, email, phone, country, reference_code, logo });
    res.json(user);
});

// Protection middleware (temporary)
app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token !== 'secret-token') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});