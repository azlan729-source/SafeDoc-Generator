const express = require('express');
const router = express.Router();
const { health, adminTest } = require('../controllers/testController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// GET /api/health
router.get('/health', health);

// GET /api/admin/test
router.get('/admin/test', authMiddleware, authorizeRoles('admin'), adminTest);

module.exports = router;
