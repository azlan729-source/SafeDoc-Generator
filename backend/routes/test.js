const express = require('express');
const router = express.Router();
const { health } = require('../controllers/testController');

// GET /api/health
router.get('/health', health);

module.exports = router;
