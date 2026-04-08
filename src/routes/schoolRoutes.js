const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { addSchool, listSchools } = require('../controllers/schoolController');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

router.post('/addSchool', limiter, addSchool);
router.get('/listSchools', limiter, listSchools);

module.exports = router;
