const express = require('express');
const eventRoute = express.Router();
const Event = require('../schemas/events.schema');
const File = require('../schemas/file.schema');
const upload = require('../middleware/uploadMidleware');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// 📌 Create an Event (with Image Upload)
eventRoute.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, desc, time, location } = req.body;

        // Ensure a file was uploaded
        let file = null;
        if (req.file) {
            file = await File.create({
                filePath: req.file.path,
                originalName: req.file.originalname
            });
        }

        // Create event
        const newEvent = new Event({
            title,
            desc,
            time,
            location,
            image: file ? file._id : null
        });

        await newEvent.save();
        res.status(201).json({ msg: "Event created successfully", event: newEvent });

    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// 📌 Get All Events
eventRoute.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('image').populate('user'); // Populate file & user details
        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// 📌 Delete an Event (and its associated image)
eventRoute.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the event
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        // Delete associated image if it exists
        if (event.image) {
            const file = await File.findById(event.image);
            if (file) {
                const filePath = path.join(__dirname, '../uploads', file.filePath);

                // Check if file exists before deleting
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete file from local storage
                }

                // Remove file reference from database
                await File.findByIdAndDelete(event.image);
            }
        }

        // Delete event from database
        await Event.findByIdAndDelete(id);
        
        res.status(200).json({ msg: "Event and associated file deleted successfully" });

    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// 📌 Add User to an Event
eventRoute.put('/:id/add-user', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        console.log(id, userId)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Invalid user ID" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        // Prevent duplicate user entries
        if (event.user.includes(userId)) {
            return res.status(400).json({ msg: "User already added to this event" });
        }

        event.user.push(userId);
        await event.save();

        res.status(200).json({ msg: "User added to event", event });

    } catch (err) {
        console.error("Error adding user to event:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

eventRoute.get('/checkuserisin/:id', async (req, res)=>{
    try {
        eventid = req.params.id;
        userid= req.user._id;
        if (!mongoose.Types.ObjectId.isValid(eventid) || !mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ msg: "Invalid Event ID or User ID" });
        }

        const event = await Event.findById(eventid);
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        // Check if the user's ID is inside the event's `user` array
        const isUserRegistered = event.user.includes(userid);

        res.json({ isRegistered: isUserRegistered });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({msg:"Server side error"});
    }
})

module.exports = eventRoute;
