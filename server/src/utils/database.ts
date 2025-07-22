import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

interface ConnectionOptions {
  maxPoolSize?: number;
  socketTimeoutMS?: number;
  serverSelectionTimeoutMS?: number;
  bufferCommands?: boolean;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(retries: number = 5): Promise<void> {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    if (mongoUri.includes('<db_password>')) {
      throw new Error('MONGODB_URI contains placeholder <db_password>. Please replace with your actual database password.');
    }

    const options: ConnectionOptions = {
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS || '45000'),
      serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT_MS || '5000'),
      bufferCommands: false,
    };

    let lastError: Error;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Attempting to connect to MongoDB (attempt ${attempt}/${retries})...`);
        
        await mongoose.connect(mongoUri, options);
        
        this.isConnected = true;
        console.log('✅ Successfully connected to MongoDB');
        
        // Set up connection event listeners
        this.setupEventListeners();
        
        return;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error);
        
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Exponential backoff, max 30s
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to connect to MongoDB after ${retries} attempts. Last error: ${lastError!.message}`);
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnectionDetails() {
    const connection = mongoose.connection;
    return {
      readyState: connection.readyState,
      host: connection.host,
      port: connection.port,
      name: connection.name,
      isConnected: this.isConnected,
    };
  }

  private setupEventListeners(): void {
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      this.isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await this.disconnect();
        process.exit(0);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });
  }
}

// Export singleton instance
export const database = DatabaseConnection.getInstance();

// Helper function for quick connection
export const connectToDatabase = async (retries?: number): Promise<void> => {
  return database.connect(retries);
};

// Helper function to check connection
export const isDatabaseConnected = (): boolean => {
  return database.getConnectionStatus();
};

// Helper function to get connection details
export const getDatabaseInfo = () => {
  return database.getConnectionDetails();
}; 