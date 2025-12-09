-- Migration to add 'type' column to clubs table
-- Run this in your PostgreSQL database

ALTER TABLE clubs ADD COLUMN type VARCHAR(20) DEFAULT 'physique' CHECK (type IN ('physique', 'virtuel'));

-- Update existing clubs to have type 'physique' if not set
UPDATE clubs SET type = 'physique' WHERE type IS NULL;