// Schema for Camera Model
const { Sequelize } = require('sequelize');

const sequelize = require('../Model/db'); // get MySQL connection

// Define a model - must be equal to mysql schema! 
const Camera = sequelize.define('camera', {
    cameraID: {
        type: Sequelize.INTEGER,
        allowNull: false, unique: true,
        primaryKey: true, autoIncrement: true
    },
    user_id: { // FK for user
        type: Sequelize.INTEGER,
        allowNull: false, unique: true
    },
    camera_name: Sequelize.STRING,
    friendly_name: Sequelize.STRING,
    sensitivity: Sequelize.INTEGER,
    last_detected: Sequelize.DATE,
    subscription_plan: { // FK for subscription_plan
        type: Sequelize.INTEGER,
        allowNull: false, unique: true
    },
    camera_endpoint: Sequelize.STRING,
    country: Sequelize.STRING,
    gps_location: Sequelize.STRING,
    site_name: Sequelize.STRING,
    brand_model: Sequelize.STRING,
    azimuth_bearing: Sequelize.STRING,
    camera_web_admin: Sequelize.STRING,
    public_ip_address: Sequelize.STRING,
    input_method: Sequelize.INTEGER,
    current_status: Sequelize.INTEGER,
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
    tableName: 'camera'
},
);

//Sync the model with the database
sequelize.sync();

module.exports = Camera;