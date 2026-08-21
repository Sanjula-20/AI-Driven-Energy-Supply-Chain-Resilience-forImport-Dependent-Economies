const express = require('express');
const { getSuppliers, getSupplierById } = require('../controllers/supplier.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, getSuppliers);
router.get('/:id', requireAuth, getSupplierById);

module.exports = router;
