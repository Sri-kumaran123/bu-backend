const userauth = require('./userauth.router.js');
const subjectRoute = require('./subject.route.js');
const batchRoute = require('./batch.route.js');
const semesterRoute = require('./semester.route.js');
const semestermarksRoute = require('./semestermark.route.js');
const studentRoute = require('./student.route.js');
const personalRoute = require('./personal.route.js');
const documentRouter = require('./documentUpload.route.js');
const fileRoute = require('./getfile.js');
const getuserRoute = require('./getuser.js');
const circularRoute = require('./circular.route.js');
const eventRoute = require('./event.route.js');

module.exports = {
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
}