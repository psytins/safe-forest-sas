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

    try {
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

        let bodyText;
        let bodyHTML;
        switch (req.body.alertType) {
            case 0:
                bodyText = 'The status of your camera has been changed.';
                bodyHTML = `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                            <h1 style="color: #22252E; text-align: center;">Safe-Forest Camera Status Update</h1>
                            <p>Hello,</p>
                            <p>We wanted to inform you that the status of your camera has been changed. Here are the details:</p>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Camera ID:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${req.body.camera.cameraID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>New Status:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${req.body.camera.current_status ? 'Online' : 'Offline'}</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px;">If you did not make this change or if you have any questions, please login into your dashboard or contact our support team immediately.</p>
                            <p>Thank you for using Safe-Forest.</p>
                            <p style="margin-top: 40px; text-align: center;">&copy; 2024 Safe-Forest</p>
                        </div>
                    </div>
                `;
                break;
            case 1:
                bodyText = 'Your camera has detected motion.';
                bodyHTML = `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                            <h1 style="color: #22252E; text-align: center;">Safe-Forest Camera Alert</h1>
                            <p>Hello,</p>
                            <p>Your camera has detected motion (people). Here are the details:</p>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Camera ID:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${req.body.camera.cameraID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Detection Type:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">Motion (People)</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px;">If you did not expect this detection or if you have any questions, please contact our support team immediately.</p>
                            <p>Thank you for using Safe-Forest.</p>
                            <p style="margin-top: 40px; text-align: center;">&copy; 2024 Safe-Forest</p>
                        </div>
                    </div>
                `;
                break;
            case 2:
                bodyText = 'Your camera has detected smoke.';
                bodyHTML = `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                            <h1 style="color: #22252E; text-align: center;">Safe-Forest Smoke Alert</h1>
                            <p>Hello,</p>
                            <p>Your camera has detected smoke. Here are the details:</p>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Camera ID:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${req.body.camera.cameraID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Detection Type:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">Smoke</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px;">If you did not expect this detection or if you have any questions, please contact our support team immediately.</p>
                            <p>Thank you for using Safe-Forest.</p>
                            <p style="margin-top: 40px; text-align: center;">&copy; 2024 Safe-Forest</p>
                        </div>
                    </div>
                `;
                break;
            default:
                bodyText = 'Your camera has detected an unknown event.';
                bodyHTML = `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                            <h1 style="color: #22252E; text-align: center;">Safe-Forest Camera Alert</h1>
                            <p>Hello,</p>
                            <p>Your camera has detected an unknown event. Here are the details:</p>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Camera ID:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${req.body.camera.cameraID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Detection Type:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">Unknown</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px;">If you did not expect this detection or if you have any questions, please contact our support team immediately.</p>
                            <p>Thank you for using Safe-Forest.</p>
                            <p style="margin-top: 40px; text-align: center;">&copy; 2024 Safe-Forest</p>
                        </div>
                    </div>
                `;
        }

        const mailOptions = {
            from: 'Safe-Forest <grupodois31@gmail.com>',
            to: req.body.to,
            subject: req.body.subject,
            text: bodyText,
            html: bodyHTML,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent:', result);
        return res.json({ message: 'Email sent successfully.' });
    } catch (error) {
        if (error.message.includes('invalid_grant')) {
            // Handle invalid grant error by removing the invalid token and re-authenticating
            console.error('Invalid grant error:', error);
            try {
                fs.unlinkSync(process.env.EMAIL_TOKEN); // Remove the invalid token
                globalOAuth2Client = null; // Reset the OAuth2 client
                initializeOAuth2Client(); // Re-initialize the OAuth2 client
                // Send an instruction to re-authenticate
                return res.status(401).json({ error: 'Invalid grant error. Please re-authenticate.' });
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                return res.status(500).json({ error: 'Failed to refresh token' });
            }
        } else {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
    }
});

// Function to refresh the OAuth2 token
const refreshToken = async () => {
    if (!globalOAuth2Client) {
        throw new Error('OAuth2 client is not initialized');
    }

    const newTokens = await globalOAuth2Client.refreshAccessToken();
    const token = newTokens.credentials;
    globalOAuth2Client.setCredentials(token);

    // Save the new token to a file or database
    fs.writeFileSync(process.env.EMAIL_TOKEN, JSON.stringify(token));
};

module.exports = router;
