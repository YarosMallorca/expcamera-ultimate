const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

let successfulFileLocation = 'device.json';

// Enable all CORS requests
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

// Serve static files (e.g., index.html) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to handle requests for the devices
app.route('/devices')
    .get((req, res) => {
        const jsonFilePath = path.join(__dirname, successfulFileLocation);

        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                res.status(500).send('Error reading JSON file');
            } else {
                res.json(JSON.parse(data));
            }
        });
    })
    .put((req, res) => {
        const jsonFilePath = path.join(__dirname, successfulFileLocation);
        const newDevice = req.body; // Expecting the new device object in the request body

        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return res.status(500).send('Error reading JSON file');
            }

            const jsonData = JSON.parse(data);
            // Check if the device already exists
            const deviceExists = jsonData.devices.some(device =>
                device.ip === newDevice.ip && device.port === newDevice.port &&
                device.username === newDevice.username && device.password === newDevice.password
            );

            if (deviceExists) {
                return res.status(400).send('Device already exists');
            }

            jsonData.devices.push(newDevice); // Add the new device to the devices array

            fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 4), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                    return res.status(500).send('Error writing JSON file');
                }
                res.status(200).send('Device added successfully');
            });
        });
    })
    .delete((req, res) => {
        const jsonFilePath = path.join(__dirname, successfulFileLocation);
        const deviceToDelete = req.body; // Expecting the device object in the request body

        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return res.status(500).send('Error reading JSON file');
            }

            const jsonData = JSON.parse(data);
            // Filter out the device that matches the provided IP and port
            jsonData.devices = jsonData.devices.filter(device => {
                return !(device.ip === deviceToDelete.ip && device.port === deviceToDelete.port);
            });

            // Write the updated data back to the JSON file
            fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 4), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                    return res.status(500).send('Error writing JSON file');
                }
                res.status(200).send('Device deleted successfully');
            });
        });
    });

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
