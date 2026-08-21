const express = require('express');
const { getScenarios, postSimulateScenario } = require('../controllers/scenario.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getScenarios);
router.post('/simulate', requireAuth, requireRole('ADMIN', 'ANALYST'), postSimulateScenario);

module.exports = router;
