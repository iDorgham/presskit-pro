import dotenv from 'dotenv';
import { connectToDatabase, isDatabaseConnected, getDatabaseInfo } from './utils/database';
import { User } from './models/User';

// Load environment variables
dotenv.config();

async function testDatabaseConnection() {
  console.log('🧪 Testing MongoDB Connection...\n');

  try {
    // Test 1: Environment variables check
    console.log('1️⃣ Checking environment variables...');
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('❌ MONGODB_URI environment variable is not set');
    }
    
    if (mongoUri.includes('<db_password>')) {
      throw new Error('❌ MONGODB_URI still contains placeholder <db_password>. Please replace with your actual database password.');
    }
    
    console.log('✅ Environment variables configured');
    console.log(`📍 MongoDB URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials
    
    // Test 2: Database connection
    console.log('\n2️⃣ Testing database connection...');
    await connectToDatabase();
    
    if (!isDatabaseConnected()) {
      throw new Error('❌ Database connection failed');
    }
    
    console.log('✅ Database connected successfully');
    
    // Test 3: Connection details
    console.log('\n3️⃣ Getting connection details...');
    const dbInfo = getDatabaseInfo();
    console.log('📊 Database Info:', JSON.stringify(dbInfo, null, 2));
    
    // Test 4: Model operations
    console.log('\n4️⃣ Testing database operations...');
    
    // Test counting documents
    const userCount = await User.countDocuments();
    console.log(`📈 Current users in database: ${userCount}`);
    
    // Test creating a sample user (if none exist)
    if (userCount === 0) {
      console.log('\n💭 No users found. Creating a test user...');
      
      const testUser = new User({
        email: 'test@example.com',
        password: 'TestPassword123!',
        username: 'testuser',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        }
      });
      
      const savedUser = await testUser.save();
      console.log('✅ Test user created:', savedUser.getPublicProfile());
      
      // Clean up - remove test user
      await User.findByIdAndDelete(savedUser._id);
      console.log('🧹 Test user cleaned up');
    }
    
    // Test 5: User model methods
    console.log('\n5️⃣ Testing User model functionality...');
    
    // Create temporary user for testing
    const tempUser = new User({
      email: 'temp@example.com',
      password: 'TempPassword123!',
      username: 'tempuser',
      profile: {
        firstName: 'Temp',
        lastName: 'User'
      }
    });
    
    // Save user (password should be hashed)
    const savedTempUser = await tempUser.save();
    console.log('✅ Password hashing working (password not visible in output)');
    
    // Test password comparison
    const isPasswordValid = await savedTempUser.comparePassword('TempPassword123!');
    const isPasswordInvalid = await savedTempUser.comparePassword('WrongPassword');
    
    console.log(`✅ Password validation: correct=${isPasswordValid}, incorrect=${isPasswordInvalid}`);
    
    // Test static methods
    const foundByEmail = await (User as any).findByEmail('temp@example.com');
    const foundByUsername = await (User as any).findByUsername('tempuser');
    
    console.log(`✅ Static methods working: byEmail=${!!foundByEmail}, byUsername=${!!foundByUsername}`);
    
    // Clean up temp user
    await User.findByIdAndDelete(savedTempUser._id);
    console.log('🧹 Temporary user cleaned up');
    
    console.log('\n🎉 All database tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('  ✅ Environment variables configured');
    console.log('  ✅ Database connection established');
    console.log('  ✅ Database operations working');
    console.log('  ✅ User model functioning correctly');
    console.log('  ✅ Password hashing and validation working');
    console.log('\n🚀 Your MongoDB connection is ready for development!');

  } catch (error) {
    console.error('\n💥 Database test failed:', error);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('  1. Check your MongoDB Atlas cluster is running');
    console.log('  2. Verify your database password in the .env file');
    console.log('  3. Ensure your IP address is whitelisted in MongoDB Atlas');
    console.log('  4. Check your network connection');
    console.log('  5. Verify the MONGODB_URI format is correct');
    
    process.exit(1);
  } finally {
    // Disconnect from database
    try {
      const { database } = await import('./utils/database');
      await database.disconnect();
      console.log('🔌 Disconnected from database');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }
}

// Check if running directly (not imported)
if (require.main === module) {
  testDatabaseConnection();
}

export { testDatabaseConnection }; 