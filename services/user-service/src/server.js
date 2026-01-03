const app = require('./app');
const { initDatabase } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Démarrer le serveur
const startServer = async () => {
  try {
    // Initialiser la base de données
    await initDatabase();
    console.log('✅ Database initialized successfully');

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 User Service is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API: http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
