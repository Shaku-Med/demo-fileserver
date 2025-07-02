const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { convertToHLS } = require('../services/converter');
const { uploadHLSFiles, uploadFile } = require('../services/storage');
const fs = require('fs');
const os = require('os');
const { encrypt } = require('../Lock/Enc');

router.post('/', upload.single('file'), async (req, res) => {
    try {
        // 
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let urls;
        const isMediaFile = req.file.mimetype.startsWith('video/') || req.file.mimetype.startsWith('audio/');

        if (isMediaFile) {
            // Convert and upload media files
            const outputDir = await convertToHLS(req.file.buffer, os.tmpdir());
            urls = await uploadHLSFiles(outputDir, {
                ...req.body,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype
            }, req, res);
            fs.rmSync(outputDir, { recursive: true, force: true });
        } else {
            // Directly upload non-media files
            let rtrn = await uploadFile(req.file.buffer, {
                ...req.body,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype
            }, req, res);
            urls = [rtrn]
        }

        if(urls && urls.length > 0) {
            const validUrls = urls.filter(url => url !== null && url !== undefined);
            if(validUrls.length > 0) {
                res.json({
                        success: true,
                        message: 'File uploaded successfully',
                        urls: validUrls[validUrls.length - 1],
                        length: validUrls.length
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error processing file',
                });
            }
        } else {
            res.status(500).json({
                success: false,
                message: 'Error processing file',
            });
        }
    } catch (error) {
        // console.error('Upload error:', error);
        
        // Handle specific error messages from storage functions
        if (error.message === 'You need to be logged in to upload files') {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        } else if (error.message === 'We need your github personal access token to upload files.') {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        } else if (error.message === 'Failed to get or create repository') {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error processing file',
        });
    }
});

module.exports = router; 