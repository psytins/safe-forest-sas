//API route for Authentication using CRUD
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const multer = require('multer');
const FormData = require('form-data');
const upload = multer({ storage: multer.memoryStorage() });
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
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
        size_from: req.body.size_from,
        size_to: req.body.size_to,
        double_positive: req.body.double_positive,
        time_to_live: req.body.time_to_live,
        down_status_email: req.body.down_status_email,
        user: req.body.user,
        pass: req.body.pass,
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
    const className = req.body.class_name;
    const blob = req.body.formData;

    const newDetection = new Detection({
        camera_id: camID,
        description: className,
        date: now,
        image: blob,
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

async function simulateDetection(camID, className) {
    try {
        const now = new Date().toISOString(); // Storing in UTC (convert to local in frontend)

        const newDetection = new Detection({
            camera_id: camID,
            description: className,
            date: now,
            image: null, // temp
        });

        const camera = await Camera.findOne({ where: { cameraID: camID } });

        if (!camera || camera.current_status === 0) {
            throw new Error('Camera not found or it is offline');
        }

        const savedEntry = await newDetection.save();
        camera.last_detected = now;
        await camera.save();

        return savedEntry; // Return saved detection entry if needed
    } catch (error) {
        throw new Error(`Error simulating detection for camera ${camID}: ${error.message}`);
    }
}

//Change camera status
router.post('/change-status', (req, res) => {
    const camID = req.body.cameraID;
    Camera.findOne({ where: { cameraID: camID } }).then(camera => {
        if (!camera) { // don't found camera
            return res.status(401).json({ error: 'Camera not found' });
        } else {
            if (camera.current_status === 1) {
                // Turn off
                stopCapture(camID)
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

async function changeStatus(camID) {
    try {
        const camera = await Camera.findOne({ where: { cameraID: camID } });

        if (!camera) {
            throw new Error('Camera not found');
        }
        if (camera.current_status === 1) {
            // Turn off
            stopCapture(camID)
            camera.current_status = 0
            await camera.save()
        } else if (camera.current_status === 0) {
            // Turn on
            camera.current_status = 1
            await camera.save()
        } else {
            throw new Error('Something went wrong...');
        }

        return camera; // Return updated camera object if needed
    } catch (error) {
        throw new Error(`Error changing status for camera ${camID}: ${error.message}`);
    }
}

//Update Changes
router.post('/update-camera-details', async (req, res) => {
    const { cameraID, camera_name, subscription_plan, sensitivity, public_ip_address, user, pass } = req.body;

    try {
        const camera = await Camera.findByPk(cameraID);

        if (!camera) {
            return res.status(404).json({ error: 'Camera not found' });
        }

        // Update camera details
        camera.camera_name = camera_name;
        camera.sensitivity = sensitivity;
        camera.subscription_plan = subscription_plan;
        camera.public_ip_address = public_ip_address;
        camera.user = user;
        camera.pass = pass;

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

// Setup ffmpeg - not using
const ffmpegProcesses = {};
router.post('/setup-ffmpeg', async (req, res) => {
    const camID = req.body.cameraID;
    const camIP = req.body.cameraIP;
    const user = req.body.user;
    const pass = req.body.pass;
    const rtspFile = 'h264_hd.sdp';

    try {
        // Check if camera exists
        const camera = await Camera.findOne({ where: { cameraID: camID } });
        if (!camera) {
            return res.status(404).json({ error: 'Camera not found' });
        }

        //Check if there is already a ffmepg process for this camera
        if (ffmpegProcesses[camID]) {
            // Kill the existing process
            ffmpegProcesses[camID].kill();
        }

        const directoryPath = path.join(__dirname, `../Public/Pages/hls/${camID}`);
        const streamFilesPath = path.join(directoryPath, 'stream.m3u8');
        // create directory
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        } else {
            // Erase existing files in the directory
            fs.readdirSync(directoryPath).forEach(file => {
                const filePath = path.join(directoryPath, file);
                fs.unlinkSync(filePath);
            });
        }

        // Configure and start ffmpeg
        const absolutePath = path.resolve(directoryPath);
        const ffmpegCommand = 'ffmpeg';
        const ffmpegArgs = [
            '-i', `rtsp://${user}:${pass}@${camIP}/${rtspFile}`,
            '-c:v', 'libx264',
            '-hls_time', '2',
            '-hls_list_size', '10',
            '-hls_flags', 'delete_segments',
            '-f', 'hls',
            path.join(absolutePath, 'stream.m3u8'),
        ];

        const childProcess = spawn(ffmpegCommand, ffmpegArgs);

        // Store the process in the dictionary
        ffmpegProcesses[camID] = childProcess;

        childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        childProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        childProcess.on('error', (error) => {
            console.error(`Error starting ffmpeg: ${error.message}`);
            return res.status(500).json({ message: `Error starting ffmpeg: ${error.message}` });

        });

        childProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`ffmpeg process exited with code ${code}`);
            } else {
                console.log('ffmpeg process exited successfully');
            }
        });

        const timeout = 15000;
        const interval = 1000;
        const endTime = Date.now() + timeout;
        while (Date.now() < endTime) {
            if (fs.existsSync(streamFilesPath)) {
                return res.status(201).json(childProcess);
            }
            // Wait for interval milliseconds before checking again
            sleep(interval);
        }

        return res.status(500).json({ message: `File not found` }); // Timeout reached, file not found

    } catch (error) {
        return res.status(500).json({ error: `Error in /setup-ffmpeg route: ${error.message}` });
    }
});

let cameraIntervals = {};

// Function to upload frame to detection endpoint
async function uploadFrameToDetection(imageBuffer) {
    try {
        const form = new FormData();
        form.append('image', imageBuffer, { contentType: 'image/png', filename: 'frame.png' });

        const response = await axios.post('http://0.0.0.0:5000/detect', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading frame to detection:', error);
        throw error;
    }
}

// Function to capture and process frame
async function captureAndProcessFrame(imageURL, cameraID) {
    try {
        const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        const img = await loadImage(buffer);

        const canvas = createCanvas(img.width, img.height);
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);

        const dataURL = canvas.toDataURL('image/png');
        console.log(`Captured frame for camera ${cameraID}`);

        const imageBuffer = Buffer.from(dataURL.split(',')[1], 'base64');
        const detectionResult = await uploadFrameToDetection(imageBuffer);

        // Process detection result as needed
        console.log(`Total detected: ${detectionResult.result_class_ids.length} for cam ${cameraID}`);
        detectionResult.result_class_ids.forEach(result_id => {
            if (detectionResult.class_list[result_id] === "Fumo") {
                console.log(`Found smoke for cam ${cameraID}`);
                // Handle smoke detection
                simulateDetection(cameraID, "Fumo");
                return false;
            } else if (detectionResult.class_list[result_id] === "Pessoa") {
                console.log(`Found people for cam ${cameraID}`);
                // Handle people detection
                simulateDetection(cameraID, "Pessoa");
                return false;
            }
        });

    } catch (error) {
        console.error(`Error capturing and processing frame for camera ${cameraID}:`, error);
        throw error;
    }
}

// Endpoint to start capturing frames for a camera
router.post('/start-capture', async (req, res) => {
    const { cameraID, imageURL } = req.body;

    if (cameraIntervals[cameraID]) {
        return res.status(400).json({ error: 'Capture already in progress for this camera' });
    }

    const captureFrame = async () => {
        try {
            await captureAndProcessFrame(imageURL, cameraID);
        } catch (error) {
            console.error(`Error capturing and processing frame for camera ${cameraID}:`, error);
            changeStatus(cameraID);
        }
    };

    cameraIntervals[cameraID] = setInterval(captureFrame, 60000); // Capture every 60 seconds
    res.status(201).json({ message: 'Started capturing frames' });
});

// Endpoint to stop capturing frames for a camera
router.post('/stop-capture', (req, res) => {
    const { cameraID } = req.body;

    if (cameraIntervals[cameraID]) {
        clearInterval(cameraIntervals[cameraID]);
        delete cameraIntervals[cameraID];
        return res.status(201).json({ message: 'Stopped capturing frames' });
    }

    res.status(400).json({ error: 'No processing for this camera' });

});

function stopCapture(cameraID) {
    return new Promise((resolve, reject) => {
        try {
            if (cameraIntervals[cameraID]) {
                clearInterval(cameraIntervals[cameraID]);
                delete cameraIntervals[cameraID];
                resolve({ message: 'Stopped capturing frames' });
            } else {
                reject(new Error('No processing for this camera'));
            }
        } catch (error) {
            reject(error);
        }
    });
}

// Endpoint to get the status of frame capture for a camera
router.get('/capture-status/:cameraID', (req, res) => {
    const { cameraID } = req.params;
    if (cameraIntervals[cameraID]) {
        return res.status(201).json({ message: 'Capture in progress' });
    }
    res.status(400).json({ error: 'No processing for this camera' });
});

// Aux Functions
const sleep = (milliseconds) => {
    const start = Date.now();
    while (Date.now() - start < milliseconds) { }
};

module.exports = router;