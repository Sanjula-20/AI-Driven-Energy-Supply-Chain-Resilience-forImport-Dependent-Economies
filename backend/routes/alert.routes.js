const express = require('express');
const { getAlerts } = require('../controllers/alert.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getAlerts);

module.exports = router;
