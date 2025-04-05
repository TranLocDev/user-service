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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);    
app.use('/api/s3', s3Routes);

// Service routes
// Thêm các service routes tại đây
app.use('/api/product', authMiddleware, createServiceProxy('product'));
// app.use('/api/order', createServiceProxy('order'));
// app.use('/api/payment', createServiceProxy('payment'));

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