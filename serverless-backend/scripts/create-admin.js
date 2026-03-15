// scripts/create-admin.js
// Run this script to create an admin user in your MongoDB database
// Usage: node scripts/create-admin.js

require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.DB_NAME || 'usersdb';

  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in environment variables');
    console.log('   Create a .env file with your MongoDB connection string');
    process.exit(1);
  }

  console.log('\n🔐 Admin User Creation Script\n');

  try {
    // Get admin details
    const username = await question('Enter admin username (default: admin): ') || 'admin';
    const email = await question('Enter admin email (default: admin@example.com): ') || 'admin@example.com';
    let password = await question('Enter admin password (min 8 chars, uppercase, lowercase, number): ');

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    while (!passwordRegex.test(password)) {
      console.log('❌ Password must be at least 8 characters with uppercase, lowercase, and number');
      password = await question('Enter admin password: ');
    }

    rl.close();

    console.log('\n📡 Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const authUsersCollection = db.collection('auth_users');

    // Check if admin already exists
    const existingAdmin = await authUsersCollection.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingAdmin) {
      console.log('⚠️  User already exists with this email or username');
      console.log('   Email:', existingAdmin.email);
      console.log('   Username:', existingAdmin.username);
      
      const overwrite = await new Promise(resolve => {
        const rl2 = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl2.question('\nDo you want to update this user? (yes/no): ', answer => {
          rl2.close();
          resolve(answer.toLowerCase() === 'yes');
        });
      });

      if (!overwrite) {
        console.log('❌ Operation cancelled');
        await client.close();
        process.exit(0);
      }

      // Update existing user
      const hashedPassword = await bcrypt.hash(password, 10);
      await authUsersCollection.updateOne(
        { _id: existingAdmin._id },
        { 
          $set: { 
            username,
            email,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            updatedAt: new Date()
          } 
        }
      );

      console.log('\n✅ Admin user updated successfully!');
    } else {
      // Create new admin user
      console.log('\n🔒 Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('💾 Creating admin user...');
      const result = await authUsersCollection.insertOne({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        isActive: true
      });

      console.log('\n✅ Admin user created successfully!');
      console.log('   ID:', result.insertedId);
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Username:', username);
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n⚠️  SAVE THESE CREDENTIALS SECURELY AND DELETE THIS OUTPUT!');

    await client.close();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
