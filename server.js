//Main Server with MySQL Integration ------------

//Import External Routes ------------
const express = require('express');
const path = require('path');

const app = express();
const port = 8888;

//Import Internal Routes ------------
//note: first go into internal route, then go into internal db model, then go into internal db connection
//      to create the db connection.
const authenticationRoute = require('./Routes/authenticationRoute');
const verifyToken = require('./Secure/verifyToken');
//...

//Apply application Routes ------------
//External application routes (Middleware)
app.use(express.json());

// ------------ Debug ------------ 
// // Temporary middleware to log all incoming requests
// app.use((req, res, next) => {
//     console.log(`Incoming request: ${req.method} ${req.url}`);
//     next();
// });
// -------------------------------

//Internal application routes ------------
app.use('/api/auth', authenticationRoute);
//...

//Protected route for index page (only signed users can access)
app.get('/', verifyToken, (req, res) => {
    console.log("User is authenticated! Entering index page...");
});

//Route for authentication page
app.get('/authentication', (req, res) => {
    console.log("Entering authentication page...");
    res.sendFile(path.join(__dirname, 'Public/Pages/authentication.html'));
});

//Static Routes ------------
app.use(express.static('Public/Pages'));
app.use(express.static('Public'));

//Start the server ------------
app.listen(port, () => {
    console.log('Server started on port ' + port);
});