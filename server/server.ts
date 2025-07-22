import app, { initializeDatabase } from './app';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🏥 Health check available at http://localhost:${PORT}/api/health`);
      console.log(`🔍 Database test available at http://localhost:${PORT}/api/db-test`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 