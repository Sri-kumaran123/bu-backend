const Subject = require('../schemas/subject.schema.js');

// Get all subjects
const getAllSubject = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// Insert a new subject
const insertNewSubject = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({ msg: "Name and Code are required" });
        }

        const newSubject = new Subject({ name, code });
        await newSubject.save();
        
        res.status(201).json({ msg: "Subject created successfully", subject: newSubject });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// Edit an existing subject
const editSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedSubject = await Subject.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedSubject) {
            return res.status(404).json({ msg: "Subject not found" });
        }

        res.status(200).json({ msg: "Subject updated successfully", subject: updatedSubject });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// Delete a subject
const deleteOneSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSubject = await Subject.findByIdAndDelete(id);

        if (!deletedSubject) {
            return res.status(404).json({ msg: "Subject not found" });
        }

        res.status(200).json({ msg: "Subject deleted successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

module.exports = { getAllSubject, insertNewSubject, editSubject, deleteOneSubject };
