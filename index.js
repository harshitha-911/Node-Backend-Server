const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log every request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Endpoint to create a file
app.post('/createFile', (req, res) => {
    const { filename, content, password } = req.body;
    if (!filename || !content) {
        return res.status(400).send('Filename and content are required.');
    }

    // Check if file with the same name exists
    if (fs.existsSync(filename)) {
        return res.status(400).send('File already exists.');
    }

    // Write file to disk
    fs.writeFile(filename, content, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file.');
        }
        res.status(200).send('File created successfully.');
    });
});

// Endpoint to get a list of uploaded files
app.get('/getFiles', (req, res) => {
    fs.readdir('.', (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching files.');
        }
        res.status(200).json(files);
    });
});

// Endpoint to get file content
app.get('/getFile', (req, res) => {
    const { filename, password } = req.query;
    if (!filename) {
        return res.status(400).send('Filename parameter is required.');
    }

    // Check if file exists
    if (!fs.existsSync(filename)) {
        return res.status(400).send('File not found.');
    }

    // Read file content
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file.');
        }
        res.status(200).send(data);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
