const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { createTransport } = require('nodemailer');
const fs = require('fs');
const path = require('path');

let globalOAuth2Client = null;

// Function to initialize OAuth2 Client
const initializeOAuth2Client = () => {
    const credentials = JSON.parse(fs.readFileSync(process.env.EMAIL_CRED));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token
    if (fs.existsSync(process.env.EMAIL_TOKEN)) {
        const token = JSON.parse(fs.readFileSync(process.env.EMAIL_TOKEN));
        oAuth2Client.setCredentials(token);

        // Automatically refresh token if necessary
        oAuth2Client.on('tokens', (tokens) => {
            if (tokens.refresh_token) {
                fs.writeFileSync(process.env.EMAIL_TOKEN, JSON.stringify(tokens));
            }
        });

        globalOAuth2Client = oAuth2Client;
    } else {
        // If no token is found, prompt for user authentication
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.send'],
        });
        console.log('Authorize this app by visiting this url:', authUrl);
    }
};

initializeOAuth2Client();

router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    const credentials = JSON.parse(fs.readFileSync(process.env.EMAIL_CRED));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        globalOAuth2Client = oAuth2Client;

        // Save the token to a file or database for future use
        fs.writeFileSync(process.env.EMAIL_TOKEN, JSON.stringify(tokens));

        res.send('Authorization successful! You can now send emails.');
        console.log('Authorization successful! You can now send emails.');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.send('Error during authorization.');
    }
});

router.post('/send-email', async (req, res) => {
    if (!globalOAuth2Client) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    const accessToken = await globalOAuth2Client.getAccessToken();
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_SENDER,
            clientId: globalOAuth2Client._clientId,
            clientSecret: globalOAuth2Client._clientSecret,
            refreshToken: globalOAuth2Client.credentials.refresh_token,
            accessToken: accessToken.token,
        },
    });

    const mailOptions = {
        from: 'Safe-Forest <grupodois31@gmail.com>',
        to: 'duarte.m.rodrigues@sapo.pt',
        subject: req.body.subject,
        text: 'Body',
        html: '<h1>Email body</h1>',
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
    return res.json({ message: 'Email sent successfully.' });
});

module.exports = router;
