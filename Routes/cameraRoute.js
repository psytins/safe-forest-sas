//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');
//DB Model for authentication
const Camera = require('../Model/cameraModel');
const Detection = require('../Model/detectionModel');
const { Sequelize } = require('sequelize');

// CREATE - register
router.post('/regist', (req, res) => {
    const newRegist = new Camera({
        user_id: req.body.userID,
        camera_name: req.body.camera_name,
        friendly_name: req.body.friendly_name,
        sensitivity: req.body.sensitivity,
        last_detected: req.body.last_detected,
        subscription_plan: req.body.subscription_plan,
        camera_endpoint: req.body.camera_endpoint,
        country: req.body.country,
        gps_location: req.body.gps_location,
        site_name: req.body.site_name,
        brand_model: req.body.brand_model,
        azimuth_bearing: req.body.azimuth_bearing,
        camera_web_admin: req.body.camera_web_admin,
        public_ip_address: req.body.public_ip_address,
        input_method: req.body.input_method,
        current_status: req.body.current_status,
    });

    // Validate Camera Register
    // ...
    Camera.findOne({ where: { camera_name: newRegist.camera_name } }).then(camera => {
        if (camera) { // found existing camera
            return res.status(402).json({ error: 'Use another camera name' });
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

router.post('/list-cameras', (req, res) => {
    Camera.findAll(
        {
            where: {
                user_id: req.body.userID
            }
        }
    )
        .then(cameras => {
            return res.json({ cameras });

        })
        .catch(error => {
            console.error('Error during camera listing:', error);
            return res.status(500).json({ error: 'Error during camera listing' });
        });
});

router.post('/list-last-detection', (req, res) => {
    Camera.hasMany(Detection, {
        foreignKey: 'camera_id',
        sourceKey: 'cameraID'
    });
    Detection.belongsTo(Camera, {
        foreignKey: 'camera_id',
        targetKey: 'cameraID'
    });
    Detection.findAll(
        {
            include: [{
                model: Camera,
                where: { user_id: req.body.userID },
                required: true,
            }]
        }
    )
        .then(detections => {
            return res.json({ detections });

        })
        .catch(error => {
            console.error('Error during detection listing:', error);
            return res.status(500).json({ error: 'Error during detection listing' });
        });
});

router.post('/overall-detection', async (req, res) => {

    Camera.hasMany(Detection, {
        foreignKey: 'camera_id',
        sourceKey: 'cameraID'
    });
    Detection.belongsTo(Camera, {
        foreignKey: 'camera_id',
        targetKey: 'cameraID'
    });

    const now = new Date();
    const dateTime24HB = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dateTime7DB = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateTime30DB = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const last24Hours = await Detection.findAll({
        include: [{
            model: Camera,
            where: { user_id: req.body.userID },
            required: true,
        }],
        where: {
            createdAt: {
                [Sequelize.Op.gte]: dateTime24HB.toISOString().split('T')[0]
            },
            time: {
                [Sequelize.Op.gte]: dateTime24HB.toTimeString().split(' ')[0]
            }
        }
    });

    const last7Days = await Detection.findAll({
        include: [{
            model: Camera,
            where: { user_id: req.body.userID },
            required: true,
        }],
        where: {
            createdAt: {
                [Sequelize.Op.gte]: dateTime7DB.toISOString().split('T')[0]
            },
            time: {
                [Sequelize.Op.gte]: dateTime7DB.toTimeString().split(' ')[0]
            }
        }
    });

    const last30Days = await Detection.findAll({
        include: [{
            model: Camera,
            where: { user_id: req.body.userID },
            required: true,
        }],
        where: {
            createdAt: {
                [Sequelize.Op.gte]: dateTime30DB.toISOString().split('T')[0]
            },
            time: {
                [Sequelize.Op.gte]: dateTime30DB.toTimeString().split(' ')[0]
            }
        }
    });

    return res.json({
        last24Hours,
        last7Days,
        last30Days
    });
});
// ...



module.exports = router;