const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/app');
const {
  authRouter,
  homeRouter,
  tourRouter,
  eventRouter,
  locationRouter,
  blogRouter,
  contactRouter,
  aboutRouter
} = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicController = require('./controller/publicController');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./routes/swagger');

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'oTo Tours API',
    timestamp: new Date().toISOString()
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Mount Routes
app.get(`${config.apiPrefix}/me`, publicController.getMe.bind(publicController));
app.use(`${config.apiPrefix}/auth`, authRouter);
app.use(`${config.apiPrefix}/home`, homeRouter);
app.use(`${config.apiPrefix}/tours`, tourRouter);
app.use(`${config.apiPrefix}/events`, eventRouter);
app.use(`${config.apiPrefix}/locations`, locationRouter);
app.use(`${config.apiPrefix}/blogs`, blogRouter);
app.use(`${config.apiPrefix}/contact`, contactRouter);
app.use(`${config.apiPrefix}/about`, aboutRouter);
app.use(`${config.apiPrefix}/admin`, adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  const { sequelize } = require('./models');
  sequelize.authenticate()
    .then(() => {
      app.listen(config.port, () => {
        console.log(`oTo Tours Backend API running in ${config.env} mode on port ${config.port}`);
        console.log(`Home:      http://localhost:${config.port}${config.apiPrefix}/home`);
        console.log(`Auth:      http://localhost:${config.port}${config.apiPrefix}/auth`);
        console.log(`Tours:     http://localhost:${config.port}${config.apiPrefix}/tours`);
        console.log(`Events:    http://localhost:${config.port}${config.apiPrefix}/events`);
        console.log(`Locations: http://localhost:${config.port}${config.apiPrefix}/locations`);
        console.log(`Blogs:     http://localhost:${config.port}${config.apiPrefix}/blogs`);
        console.log(`Contact:   http://localhost:${config.port}${config.apiPrefix}/contact`);
        console.log(`About:     http://localhost:${config.port}${config.apiPrefix}/about`);
        console.log(`Docs:      http://localhost:${config.port}/api-docs`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to database on startup:', err);
      process.exit(1);
    });
}

module.exports = app;
