//Main Server with MySQL Integration -----------

//Import External Routes
const express = require('express');
const path = require('path');

const app = express();
const port = 8888;

//Import Internal Routes
// note: first go into internal route, then go into internal db model, then go into internal db connection
//       to create the db connection.
const authenticationRoute = require('./Routes/authenticationRoute'); 
//...

//Apply application Routes ------------
// External application routes (Middleware)
app.use(express.json());

// Internal application routes
app.use('/api/auth', authenticationRoute);
//...

app.use(express.static('Public/Pages'));

app.use(express.static('Public'));

app.get('/authentication', (req, res) => {
    // Serve the authentication.html file
    res.sendFile(path.join(__dirname, 'Public/Pages/authentication.html'));
});


// Protection middleware (temporary)
// app.use((req, res, next) => {
//     const token = req.headers.authorization;
//     if (token !== 'secret-token') {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     next();
// });


//Start the server --------------
app.listen(port, () => {
    console.log('Server started on port ' + port);
});