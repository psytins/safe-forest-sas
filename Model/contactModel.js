// Schema for Detection Model
const { Sequelize } = require('sequelize');

const sequelize = require('../Model/db'); // get MySQL connection

// Define a model - must be equal to mysql schema! 
const Contact = sequelize.define('contact', {
    contactID: {
        type: Sequelize.INTEGER,
        allowNull: false, unique: true,
        primaryKey: true, autoIncrement: true
    },
    user_id: { // FK for user
        type: Sequelize.INTEGER,
        allowNull: false, unique: true
    },
    email_address: Sequelize.STRING,
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
    tableName: 'contact'
},
);

//Sync the model with the database
sequelize.sync();

module.exports = Contact;