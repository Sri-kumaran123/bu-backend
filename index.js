const express = require('express');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDB = require('./db.js');
const cors = require('cors');

// Routes
// const userauth = require('./routes/userauth.router.js');
const {protected} = require('./controllers/userauth.controller.js');
// const personalRoute = require('./routes/personal.route.js');
// const academyRoute = require('./routes/academic.route.js');

const {
    userauth,
    subjectRoute,
    batchRoute,
    semesterRoute,
    semestermarksRoute,
    studentRoute,
    personalRoute,
    documentRouter,
    fileRoute,
    getuserRoute,
    circularRoute,
    eventRoute
} = require('./routes');


dotenv.config();
const app = express();
connectDB();
app.use(cors({
    origin: "http://localhost:5173",  // Allow only your frontend
    credentials: true,  // Allow cookies if needed
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth',userauth);
app.use('/file',fileRoute);
app.use(protected);
app.use('/user',getuserRoute);
app.use('/subject',subjectRoute);
app.use('/batch',batchRoute);
app.use('/student',studentRoute);
app.use('/personal',personalRoute);
app.use('/semester',semesterRoute);
app.use('/semester-marks',semestermarksRoute);
app.use('/document-route',documentRouter);
app.use('/circular',circularRoute);
app.use('/event',eventRoute);
// app.use('/personal', personalRoute);
// app.use('/education', academyRoute)


app.listen(3000, () => console.log("Server running on port 3000"));