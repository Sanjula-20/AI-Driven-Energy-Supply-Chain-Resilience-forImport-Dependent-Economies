const express = require('express');
const { getEvents } = require('../controllers/event.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getEvents);

module.exports = router;
