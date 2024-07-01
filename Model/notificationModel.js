// Schema for Detection Model
const { Sequelize } = require('sequelize');

const sequelize = require('../Model/db'); // get MySQL connection

// Define a model - must be equal to mysql schema! 
const Notification = sequelize.define('notification', {
    notificationID: {
        type: Sequelize.INTEGER,
        allowNull: false, unique: true,
        primaryKey: true, autoIncrement: true
    },
    user_id: { // FK for user
        type: Sequelize.INTEGER,
        allowNull: false, unique: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.STRING,
        allowNull: false
    },
    opened: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
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
    tableName: 'notification'
},
);

//Sync the model with the database
sequelize.sync();

module.exports = Notification;