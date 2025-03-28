const Personal = require('../schemas/personal.schema.js');

// ✅ Create a new personal profile
const createNewPersonal = async (req, res) => {
    try {
        const { name, dob, fatherName, motherName, parentNumber, address, phoneNumber } = req.body;

        let {user} = req.body;

        if(!user) user = req.user.id;
        console.log("check for feild error",name, dob, fatherName, motherName, parentNumber, address, phoneNumber ,user)
        if (!user || !name || !dob || !fatherName || !motherName || !parentNumber || !address || !phoneNumber) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        // Check if user already has a profile
        const existingProfile = await Personal.findOne({ user });
        if (existingProfile) {
            return res.status(400).json({ msg: "Profile already exists for this user." });
        }

        const newPersonal = new Personal({
            user,
            name,
            dob,
            fatherName,
            motherName,
            parentNumber,
            address,
            phoneNumber
        });

        await newPersonal.save();
        res.status(201).json({ msg: "Profile created successfully", profile: newPersonal });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// ✅ Update an existing personal profile
const updatePersonal = async (req, res) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.status(400).json({ msg: "User ID is required." });
        }

        // Find and update profile
        const updatedProfile = await Personal.findOneAndUpdate(
            { user },
            { $set: req.body }, // Update only the provided fields
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ msg: "Profile not found." });
        }

        res.status(200).json({ msg: "Profile updated successfully", profile: updatedProfile });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// ✅ Get personal profile by user ID
const getPersonalByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ msg: "User ID is required." });
        }

        const profile = await Personal.findOne({ user: userId }).populate('user');

        if (!profile) {
            return res.status(404).json({ msg: "Profile not found." });
        }

        res.status(200).json({ profile });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

module.exports = { createNewPersonal, updatePersonal, getPersonalByUser };
