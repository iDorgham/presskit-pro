import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectToDatabase, isDatabaseConnected, getDatabaseInfo } from './src/utils/database';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true,
}));
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
}));

// Body parser
app.use(express.json());

// Enhanced health check route with database status
app.get('/api/health', async (req, res) => {
  try {
    const dbInfo = getDatabaseInfo();
    const isConnected = isDatabaseConnected();
    
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: isConnected,
        readyState: dbInfo.readyState,
        host: dbInfo.host,
        name: dbInfo.name
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Database connection test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    // Import User model dynamically to test connection
    const { User } = await import('./src/models/User');
    const userCount = await User.countDocuments();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      connectionDetails: getDatabaseInfo()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: (error as Error).message
    });
  }
});

// Initialize database connection on startup
export const initializeDatabase = async (): Promise<void> => {
  try {
    await connectToDatabase();
    console.log('🚀 Database initialized successfully');
  } catch (error) {
    console.error('💥 Failed to initialize database:', error);
    throw error;
  }
};

// TODO: Add your routes here

export default app; 