import dotenv from 'dotenv';
import { resolve } from 'path';
import connectDB from '../lib/mongodb';
import User from '../models/User';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

async function queryUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('\n=== Querying Users Collection ===\n');
    const users = await User.find({}).lean();

    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  Google ID: ${user.googleId}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Image: ${user.image}`);
        console.log(`  Created At: ${user.createdAt}`);
        console.log(`  Updated At: ${user.updatedAt}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying users:', error);
    process.exit(1);
  }
}

queryUsers();
