// Wrap async route handlers so thrown errors reach the error middleware
// instead of crashing the process or hanging the request.
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Express recognizes error middleware by its 4-argument signature.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err.message);

  res.status(statusCode).json({
    message: err.message || 'Internal server error.',
    stack: isProd ? undefined : err.stack,
  });
}

module.exports = { asyncHandler, notFound, errorHandler };
