-- Migration to add 'file_url' column to marketplace table for ebook files
-- Run this in your PostgreSQL database

ALTER TABLE marketplace ADD COLUMN file_url TEXT;

-- Optional: Add a comment for clarity
COMMENT ON COLUMN marketplace.file_url IS 'URL to the ebook file (PDF, EPUB, etc.) for download and offline reading';