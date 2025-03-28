const Document = require('../schemas/documentupload.schema');
const File = require('../schemas/file.schema');
const fs = require('fs');
const path = require('path');

const uploadNewDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        // Save file to database
        const newFile = new File({
            filePath: req.file.path
        });

        const savedFile = await newFile.save();

        // Save document details
        const newDocument = new Document({
            user: req.user.id,
            purpose: req.body.purpose,
            file: savedFile._id
        });

        const savedDocument = await newDocument.save();

        res.status(201).json({ msg: "Document uploaded successfully", document: savedDocument });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const getDocumentByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const documents = await Document.find({ user: userId }).populate('file');

        res.status(200).json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find().populate('file') 
        .populate('user', 'username email');
        res.status(200).json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const setAsOldDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            { new: false },
            { new: true }
        );

        res.status(200).json({ msg: "Document marked as old", document: updatedDocument });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const getDocumentByNew = async (req, res) => {
    try {
        const newDocuments = await Document.find({ new: true })
            .populate('file') 
            .populate('user', 'username email'); // Fetch only username and email

        if (newDocuments.length === 0) {
            return res.status(404).json({ msg: "No new documents found" });
        }

        res.status(200).json(newDocuments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
}

const deleteDocument = async (req, res) =>{
     try {
            const { id } = req.params;
            console.log(id,' i run')
            // Find the circular by ID
            const circular = await Document.findById(id);
            if (!circular) {
                return res.status(404).json({ msg: "Document not found" });
            }
    
            // Find the associated file
            const file = await File.findById(circular.file);
            if (file) {
                // Delete the file from the filesystem
                const filePath = path.join(__dirname, '../uploads', file.filePath);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
    
                // Delete the file record from the database
                await File.findByIdAndDelete(file._id);
            }
    
            // Delete the circular record
            await Document.findByIdAndDelete(id);
    
            res.status(200).json({ msg: "Document deleted successfully" });
    
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ msg: "Server side error" });
        }
}
module.exports = { uploadNewDocument, getDocumentByUser, getAllDocuments, setAsOldDocument, getDocumentByNew, deleteDocument };
