import { existsSync } from 'fs';
import { resolve } from 'path';

const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN'
];

function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0], 10);
  
  if (major < 18) {
    console.error('❌ Node.js version must be 18 or higher');
    return false;
  }
  console.log('✅ Node.js version:', version);
  return true;
}

function checkEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) {
    console.error('❌ .env.local file is missing');
    console.log('ℹ️  Copy .env.local.example to .env.local and fill in the values');
    return false;
  }
  console.log('✅ .env.local file exists');
  return true;
}

function checkRequiredEnvVars() {
  const missing = requiredEnvVars.filter(name => !process.env[name]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    return false;
  }
  console.log('✅ All required environment variables are set');
  return true;
}

function main() {
  console.log('🔍 Checking development environment...\n');
  
  const checks = [
    checkNodeVersion(),
    checkEnvFile(),
    checkRequiredEnvVars()
  ];
  
  if (checks.every(check => check)) {
    console.log('\n✨ Development environment is ready!');
    process.exit(0);
  } else {
    console.log('\n❌ Please fix the issues above before continuing');
    process.exit(1);
  }
}

main(); 