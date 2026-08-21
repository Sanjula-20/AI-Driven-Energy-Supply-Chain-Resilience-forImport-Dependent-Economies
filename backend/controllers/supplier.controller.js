const { asyncHandler } = require('../middleware/errorHandler');
const Supplier = require('../models/Supplier');

// GET /api/suppliers
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ riskScore: -1 }).lean();
  res.json({ count: suppliers.length, suppliers, isDemoData: true });
});

// GET /api/suppliers/:id
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id).lean();
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found.');
  }
  res.json({ supplier });
});

module.exports = { getSuppliers, getSupplierById };
