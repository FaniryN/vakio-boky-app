import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'vakio_boky',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function migrateClubsType() {
  try {
    console.log('🔄 Starting clubs type migration...');

    // Check if type column exists
    const checkColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'clubs' AND column_name = 'type'
    `);

    if (checkColumn.rows.length === 0) {
      console.log('📝 Adding type column to clubs table...');

      await pool.query(`
        ALTER TABLE clubs
        ADD COLUMN type VARCHAR(20) DEFAULT 'physique'
        CHECK (type IN ('physique', 'virtuel'))
      `);

      console.log('✅ Type column added successfully');
    } else {
      console.log('ℹ️ Type column already exists');
    }

    // Update existing clubs without type
    const updateResult = await pool.query(`
      UPDATE clubs
      SET type = 'physique'
      WHERE type IS NULL
    `);

    console.log(`📊 Updated ${updateResult.rowCount} existing clubs`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateClubsType();