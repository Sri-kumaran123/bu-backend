const User = require('../schemas/user.schema'); // Import User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id.toString(), email: user.email }, 'yourAccessSecretKey', { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id.toString(), email: user.email }, 'yourRefreshSecretKey', { expiresIn: '7d' });
};


const protected = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "Unauthorized ❌ No token provided" });
        }

        const accessToken = token.split(' ')[1];

        jwt.verify(accessToken, 'yourAccessSecretKey', async (err, decoded) => {
            if (err) {
                console.log("JWT Verification Error:", err);
                return res.status(403).json({ msg: "Invalid or expired token ❌" });
            }

            console.log("Decoded Token:", decoded); // Debugging: Ensure id & email are present
            
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(404).json({ msg: "User not found ❌" });
            }

            next();
        });

    } catch (err) {
        console.error("Protected Middleware Error:", err.message);
        res.status(500).json({ msg: "Server side error ❌" });
    }
};



const login = async (req, res) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) return res.status(404).json({msg:"User email not found"});
        
        const isMatch = await user.comparePassword(password);

        if(!isMatch) return res.status(401).json({msg:"Invalid credentials"});

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // 🔹 Store refresh token in an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production (HTTPS only)
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ msg: "Login successful ✅", accessToken });




    } catch (err){
        console.log(err.message);
        res.status(500).json({msg:"Server side error"});
    }

}

const register = async (req, res) =>{
    try {
        const {email, password, username} = req.body;

        const user = await User.findOne({email});

        if(user) return res.status(401).json({msg:"User email already exist"});


        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({ msg: "User registered successfully ✅" });


    } catch(err) {
        console.log(err.message);
        res.status(500).json({msg:"Server side error"});
    }

}


const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(403).json({ msg: "Refresh token required ❌" });

        jwt.verify(token, 'yourRefreshSecretKey', (err, decoded) => {
            if (err) return res.status(403).json({ msg: "Invalid refresh token ❌" });
            console.log(decoded)

            const newAccessToken = generateAccessToken({ id: decoded.id, email:decoded.email });

            res.status(200).json({ accessToken: newAccessToken });
        });

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ msg: "Server side error ❌" });
    }
};

// 🔹 Logout Route
const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ msg: "Logged out successfully ✅" });
};

const getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user) return res.status(404).json({msg:"User not found"});

        res.status(200).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({msg:"Seerver side error"});
    }
}

module.exports = {protected, login, register, logout, refreshToken, getOneUser}