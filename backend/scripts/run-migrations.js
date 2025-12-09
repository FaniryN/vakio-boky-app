import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'database');

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting database migrations...\n');

    // Get all SQL files in the migrations directory
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure consistent order

    console.log(`📁 Found ${files.length} migration files:\n`);

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      console.log(`📄 Running migration: ${file}`);

      try {
        // Read the SQL file
        const sql = fs.readFileSync(filePath, 'utf8');

        // Split by semicolon and filter out empty statements
        const statements = sql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);

        // Execute each statement
        for (const statement of statements) {
          if (statement.trim()) {
            await client.query(statement);
          }
        }

        console.log(`✅ Successfully executed: ${file}\n`);
      } catch (error) {
        console.error(`❌ Error executing ${file}:`, error.message);

        // Continue with other migrations even if one fails
        if (error.code === '42P07') { // Table already exists
          console.log(`⚠️  Table might already exist, continuing...\n`);
        } else {
          console.log(`⚠️  Continuing with other migrations...\n`);
        }
      }
    }

    console.log('🎉 All migrations completed!\n');

  } catch (error) {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(console.error);
}

export default runMigrations;