const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const token = signToken(user);
  res.json({ token, user: user.toJSON() });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  res.json({ user: user.toJSON() });
});

module.exports = { login, me };
