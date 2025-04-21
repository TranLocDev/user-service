const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const config = require('./config');
const { morganMiddleware, requestLogger, errorLogger } = require('./middleware/logger');
const { createServiceProxy } = require('./middleware/proxy');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const s3Routes = require('./routes/s3.routes');
const { authMiddleware } = require('./middleware/auth.middleware');

const app = express();

// Connect to MongoDB
connectDB();

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(cookieParser());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Logging middleware
app.use(morganMiddleware);
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use(limiter);
app.use((req, res, next) => {
  console.log(`Nhận yêu cầu: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});
app.use('/api/auth', express.json(), express.urlencoded({ extended: true }), authRoutes);
app.use('/api/users', express.json(), express.urlencoded({ extended: true }), userRoutes);
app.use('/api/s3', express.json(), express.urlencoded({ extended: true }), s3Routes);

// Proxy routes – no body parsers applied
app.use('/api/posts', authMiddleware, createServiceProxy('posts'));

// Error handling
app.use(errorLogger);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
}); 