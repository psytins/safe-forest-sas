// Schema for Detection Model
const { Sequelize } = require('sequelize');

const sequelize = require('../Model/db'); // get MySQL connection

// Define a model - must be equal to mysql schema! 
const Detection = sequelize.define('detection', {
    detectionID: {
        type: Sequelize.INTEGER,
        allowNull: false, unique: true,
        primaryKey: true, autoIncrement: true
    },
    camera_id: { // FK for camera
        type: Sequelize.INTEGER,
        allowNull: false, unique: true
    },
    description: Sequelize.STRING,
    time: {
        type: Sequelize.TIME,
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
    tableName: 'detection'
},
);

//Sync the model with the database
sequelize.sync();

module.exports = Detection;