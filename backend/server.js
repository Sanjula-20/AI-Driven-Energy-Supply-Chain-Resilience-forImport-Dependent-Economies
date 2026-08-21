require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const supplierRoutes = require('./routes/supplier.routes');
const corridorRoutes = require('./routes/corridor.routes');
const eventRoutes = require('./routes/event.routes');
const reserveRoutes = require('./routes/reserve.routes');
const riskRoutes = require('./routes/risk.routes');
const scenarioRoutes = require('./routes/scenario.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const alertRoutes = require('./routes/alert.routes');

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EnergyShield AI backend', time: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes); // exposes /api/dashboard and /api/risk/history
app.use('/api/suppliers', supplierRoutes);
app.use('/api/corridors', corridorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reserves', reserveRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/alerts', alertRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] EnergyShield AI backend running on http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
