const express = require('express');
const { getRisk } = require('../controllers/risk.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getRisk);

module.exports = router;
