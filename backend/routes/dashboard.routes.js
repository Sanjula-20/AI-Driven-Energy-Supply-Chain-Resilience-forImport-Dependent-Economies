const express = require('express');
const { getDashboard, getRiskHistory } = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', requireAuth, getDashboard);
router.get('/risk/history', requireAuth, getRiskHistory);

module.exports = router;
