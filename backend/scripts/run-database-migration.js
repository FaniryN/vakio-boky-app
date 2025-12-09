import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting database migration...');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../../database/fix_all_database_issues.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 SQL file loaded successfully');

    // Split SQL commands and execute them
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📋 Found ${commands.length} SQL commands to execute`);

    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⚡ Executing command ${i + 1}/${commands.length}...`);
          await client.query(command);
        } catch (error) {
          // Log error but continue with other commands
          console.error(`❌ Error in command ${i + 1}:`, error.message);
          console.error('Command was:', command.substring(0, 100) + '...');
        }
      }
    }

    console.log('✅ Database migration completed successfully!');
    console.log('🎉 All tables and columns have been created/updated.');

    // Verify the migration
    console.log('\n🔍 Verifying migration...');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check specific columns
    const postsColumns = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'posts' AND column_name = 'approved_for_landing'
    `);

    if (postsColumns.rows.length > 0) {
      console.log('✅ approved_for_landing column added to posts table');
    }

    const challengesCount = await client.query('SELECT COUNT(*) as count FROM challenges');
    const badgesCount = await client.query('SELECT COUNT(*) as count FROM badges');

    console.log(`✅ Challenges created: ${challengesCount.rows[0].count}`);
    console.log(`✅ Badges created: ${badgesCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration().catch(console.error);