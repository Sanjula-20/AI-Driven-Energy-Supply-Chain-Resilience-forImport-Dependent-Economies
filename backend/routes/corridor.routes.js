const express = require('express');
const { getCorridors, getCorridorByCode } = require('../controllers/corridor.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getCorridors);
router.get('/:code', requireAuth, getCorridorByCode);

module.exports = router;
