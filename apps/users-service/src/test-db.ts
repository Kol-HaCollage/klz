const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { testConnection, query } = require('./database/connection');

// Load environment variables
dotenv.config();

const runMigration = async () => {
  try {
    // Import the database functions

    console.log('Testing database connection...');
    await testConnection();

    console.log('Reading migration file...');
    const migrationPath = path.join(
      __dirname,
      'database',
      'migrations',
      '001-create-users.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running users table migration...');
    await query(migrationSQL);

    console.log('Migration completed successfully!');

    // Test that the table was created
    const result = await query('SELECT COUNT(*) FROM users');
    console.log('Users table created. Current count:', result.rows[0].count);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
};

runMigration();
