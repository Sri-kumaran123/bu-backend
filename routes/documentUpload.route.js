const express = require('express');
const upload = require('../middleware/uploadMidleware'); // File upload middleware
const { uploadNewDocument, getDocumentByUser, getAllDocuments, setAsOldDocument, getDocumentByNew, deleteDocument } = require('../controllers/documentupload.controller');

const documentRouter = express.Router();

documentRouter.post('/upload', upload.single('file'), uploadNewDocument);
documentRouter.get('/user/:userId', getDocumentByUser);
documentRouter.get('/all', getAllDocuments);
documentRouter.put('/mark-old/:documentId', setAsOldDocument);
documentRouter.get('/new', getDocumentByNew);
documentRouter.delete('/deleted/:id',deleteDocument);

module.exports = documentRouter;
