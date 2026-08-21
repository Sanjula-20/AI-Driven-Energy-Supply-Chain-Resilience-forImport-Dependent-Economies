const express = require('express');
const { getReserveStatus } = require('../controllers/reserve.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getReserveStatus);

module.exports = router;
