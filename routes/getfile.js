const express = require('express');
const path = require('path');
const File = require('../schemas/file.schema'); // Import File schema

const fileRoute = express.Router();

fileRoute.get('/download/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        // Fetch file details from the database
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ msg: "File not found" });
        }

        // Resolve the file path
        const filePath = path.resolve(file.filePath);

        // Send the file to the client
        res.download(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ msg: "Error downloading file" });
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
});

module.exports = fileRoute;
