import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../backend/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Running migration...');

    // Read the SQL file
    const sqlFile = path.join(__dirname, '../database/add_challenges_and_badges.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL
    await pool.query(sql);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();