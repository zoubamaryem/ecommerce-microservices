const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Product Service is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/products', productRoutes);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
