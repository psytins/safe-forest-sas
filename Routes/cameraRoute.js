//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const upload = multer({ storage: multer.memoryStorage() });
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
        public_ip_address: req.body.list-cameras_ip_address,
        input_method: req.body.input_method,
        current_status: req.body.current_status,
        size_from: req.body.size_from,
        size_to: req.body.size_to,
        double_positive: req.body.double_positive,
        time_to_live: req.body.time_to_live,
        down_status_email: req.body.down_status_email,
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

    console.log(dateTime24HB)
    console.log(dateTime7DB)
    console.log(dateTime30DB)

    const last24Hours = await Detection.findAll({
        include: [{
            model: Camera,
            where: { user_id: req.body.userID },
            required: true,
        }],
        where: {
            date: {
                [Sequelize.Op.gte]: dateTime24HB
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
            date: {
                [Sequelize.Op.gte]: dateTime7DB
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
            date: {
                [Sequelize.Op.gte]: dateTime30DB
            }
        }
    });

    return res.json({
        last24Hours,
        last7Days,
        last30Days
    });
});

// Simulate Detection
router.post('/simulate-detection', (req, res) => {
    const now = new Date().toISOString(); // storing in the database in UTC (in the front-end, convert to local)

    const camID = req.body.cameraID;

    const newDetection = new Detection({
        camera_id: camID,
        description: null,
        date: now,
    });

    Camera.findOne({ where: { cameraID: camID } }).then(camera => {
        if (!camera || camera.current_status === 0) { // don't found camera or it's offline
            return res.status(401).json({ error: 'Camera not found or it is offline!' });
        } else {
            newDetection.save()
                .then(savedEntry => {
                    camera.last_detected = now;
                    camera.save();
                    return res.status(201).json(savedEntry);
                })
                .catch(error => {
                    console.error('Error saving regist entry:', error);
                    return res.status(500).json({ error: 'Error saving regist entry' });
                });
        }
    });
});

//Change camera status
router.post('/change-status', (req, res) => {
    const camID = req.body.cameraID;
    Camera.findOne({ where: { cameraID: camID } }).then(camera => {
        if (!camera) { // don't found camera
            return res.status(401).json({ error: 'Camera not found' });
        } else {
            if (camera.current_status === 1) {
                // Turn off
                camera.current_status = 0
                camera.save()
                return res.status(201).json(camera);
            } else if (camera.current_status === 0) {
                // Turn on
                camera.current_status = 1
                camera.save()
                return res.status(201).json(camera);
            } else {
                return res.status(500).json({ error: 'Something went wrong...' });
            }
        }
    });
});

//Update Changes
router.post('/update-camera-details', async (req, res) => {
    const { cameraID, camera_name, subscription_plan, sensitivity, endpoint } = req.body;

    try {
        const camera = await Camera.findByPk(cameraID);

        if (!camera) {
            return res.status(404).json({ error: 'Camera not found' });
        }

        // Update camera details
        camera.camera_name = camera_name;
        camera.sensitivity = sensitivity;
        camera.subscription_plan = subscription_plan
        camera.camera_endpoint = endpoint;

        await camera.save();

        res.status(200).json({ message: 'Camera details updated successfully', camera });
    } catch (error) {
        console.error('Error updating camera details:', error);
        res.status(500).json({ error: 'Failed to update camera details' });
    }
});

// Detect Single Frames
router.post('/detect-frame', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No image file' });
    }
    try {
        const form = new FormData();
        form.append('image', req.file.buffer, req.file.originalname);

        const response = await axios.post('http://0.0.0.0:5000/detect', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error' });
    }
});

module.exports = router;