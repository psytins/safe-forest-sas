// Schema for Authentication Model
const { Sequelize } = require('sequelize');

const sequelize = require('../Model/db'); // get MySQL connection

// Define a model - must be equal to mysql schema! 
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, unique: true,
        primaryKey: true, autoIncrement: true
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

//Sync the model with the database
sequelize.sync();

module.exports = User;