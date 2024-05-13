//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');
//DB Model for authentication
const Camera = require('../Model/cameraModel');

// CREATE - register
router.post('/regist', (req, res) => {
    const newRegist = new Camera({
        user: req.body.userID,
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
        last_1_day: req.body.last_1_day,
        last_7_days: req.body.last_7_days,
        last_30_days: req.body.last_30_days,
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

router.get('/list-cameras', (req, res) => {
    Camera.findAll()
        .then(cameras => {
            return res.json({cameras});

        })
        .catch(error => {
            console.error('Error during camera listing:', error);
            return res.status(500).json({ error: 'Error during camera listing' });
        });
});

// ...

module.exports = router;