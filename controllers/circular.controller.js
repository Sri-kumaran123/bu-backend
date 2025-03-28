const Circular = require('../schemas/circular.schema');
const File = require('../schemas/file.schema');
const fs = require('fs');
const path = require('path');
const addCircluar = async (req, res) =>{
    try {
        if(!req.file){
            return res.status(400).json({msg:"No file uploaded"});
        }

        const newFile = new File({
            filePath:req.file.path
        });

        const savedFile = await newFile.save();

        const newCircular = new Circular({
            content:req.body.content,
            file:savedFile.id
        });

        const savedCircular = await newCircular.save();

        res.status(201).json({msg:"Circular uploaded successfully"});
    } catch (err) {
        console.log(err.message);
        res.status(500).json({msg:"Server side error"});
    }
}

const deleteCircular = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the circular by ID
        const circular = await Circular.findById(id);
        if (!circular) {
            return res.status(404).json({ msg: "Circular not found" });
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
        await Circular.findByIdAndDelete(id);

        res.status(200).json({ msg: "Circular deleted successfully" });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const getAllCircular = async (req, res)  =>{
    try {
        const circular = await Circular.find({});

        res.status(200).json(circular);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({msg:"Sever side error"});
    }
}

module.exports = { addCircluar, deleteCircular, getAllCircular };