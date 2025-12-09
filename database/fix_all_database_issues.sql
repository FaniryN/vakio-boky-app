-- =====================================================
-- COMPLETE DATABASE FIX FOR VAKIO BOKY INITIATIVE
-- Run this entire script in your PostgreSQL database
-- =====================================================

-- 1. Add missing column to posts table for landing page testimonials
ALTER TABLE posts ADD COLUMN IF NOT EXISTS approved_for_landing BOOLEAN DEFAULT false;

-- 2. Create challenges and badges system tables
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    target_value INTEGER NOT NULL,
    reward_badge_id INTEGER,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    category VARCHAR(50),
    rarity VARCHAR(20) DEFAULT 'common',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Add foreign key constraint
ALTER TABLE challenges ADD CONSTRAINT fk_challenge_badge
    FOREIGN KEY (reward_badge_id) REFERENCES badges(id);

-- 3. Create reading statistics tables
CREATE TABLE IF NOT EXISTS reading_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES livres(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    pages_read INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reading_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES livres(id) ON DELETE CASCADE,
    current_page INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
);

-- 4. Add file_url column to marketplace for ebooks
ALTER TABLE marketplace ADD COLUMN IF NOT EXISTS file_url TEXT;
COMMENT ON COLUMN marketplace.file_url IS 'URL to the ebook file (PDF, EPUB, etc.) for download and offline reading';

-- 5. Add type column to clubs table
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'physique' CHECK (type IN ('physique', 'virtuel'));
UPDATE clubs SET type = 'physique' WHERE type IS NULL;

-- 6. Create campaigns/fundraising tables (if they don't exist)
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    organizer_id INTEGER REFERENCES utilisateur(id),
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create payments table for marketplace
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    payment_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Add payment_status to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_start_time ON reading_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book_id ON reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);

-- 10. Insert sample data for challenges and badges
INSERT INTO badges (name, description, icon_url, category, rarity, points) VALUES
('Premier Lecteur', 'A lu son premier livre', '/badges/first-reader.png', 'reading', 'common', 10),
('Lecteur Assidu', 'A lu 10 livres', '/badges/dedicated-reader.png', 'reading', 'common', 50),
('Bibliophile', 'A lu 50 livres', '/badges/bibliophile.png', 'reading', 'rare', 200),
('Auteur Débutant', 'A publié son premier livre', '/badges/first-author.png', 'writing', 'common', 25),
('Auteur Confirmé', 'A publié 5 livres', '/badges/established-author.png', 'writing', 'rare', 150),
('Philanthrope', 'A fait un don à une campagne', '/badges/philanthropist.png', 'social', 'common', 20),
('Mécène', 'A collecté 1000€ pour les campagnes', '/badges/patron.png', 'social', 'epic', 500)
ON CONFLICT (name) DO NOTHING;

INSERT INTO challenges (title, description, type, target_value, reward_badge_id, end_date) VALUES
('Défi Lecture du Mois', 'Lire 3 livres ce mois-ci', 'reading', 3, (SELECT id FROM badges WHERE name = 'Lecteur Assidu'), CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Défi Écriture', 'Publier votre premier livre', 'writing', 1, (SELECT id FROM badges WHERE name = 'Auteur Débutant'), CURRENT_TIMESTAMP + INTERVAL '90 days'),
('Défi Solidarité', 'Faire un don à une campagne', 'social', 1, (SELECT id FROM badges WHERE name = 'Philanthrope'), CURRENT_TIMESTAMP + INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- 11. Insert sample campaigns
INSERT INTO campaigns (title, description, goal_amount, organizer_id, end_date) VALUES
('Soutien aux jeunes auteurs malgaches', 'Aide-nous à publier les œuvres de jeunes talents malgaches', 5000.00, 1, CURRENT_TIMESTAMP + INTERVAL '60 days'),
('Bibliothèque numérique communautaire', 'Créons une bibliothèque accessible à tous les malgaches', 10000.00, 1, CURRENT_TIMESTAMP + INTERVAL '90 days')
ON CONFLICT DO NOTHING;

-- 12. Insert sample events
INSERT INTO events (title, description, event_date, location, max_participants, image_url, price, status) VALUES
('Rencontre littéraire avec des auteurs malgaches', 'Venez rencontrer et échanger avec des auteurs talentueux de Madagascar. Discussions autour de la littérature malgache et francophone.', CURRENT_TIMESTAMP + INTERVAL '7 days', 'Bibliothèque Nationale de Madagascar, Antananarivo', 50, '/events/literary-meeting.jpg', 0.00, 'active'),
('Atelier d''écriture créative', 'Apprenez les techniques de base de l''écriture créative. Cet atelier est ouvert à tous les niveaux, des débutants aux auteurs confirmés.', CURRENT_TIMESTAMP + INTERVAL '14 days', 'Centre Culturel Français, Antananarivo', 25, '/events/writing-workshop.jpg', 5000.00, 'active'),
('Salon du livre numérique', 'Découvrez les dernières publications numériques. Rencontrez les éditeurs et auteurs du numérique à Madagascar.', CURRENT_TIMESTAMP + INTERVAL '21 days', 'Hôtel Carlton, Antananarivo', 100, '/events/digital-book-fair.jpg', 10000.00, 'active'),
('Webinaire: L''avenir de la littérature à Madagascar', 'Discussion en ligne sur l''évolution de la littérature malgache et les défis du numérique. Session interactive avec Q&A.', CURRENT_TIMESTAMP + INTERVAL '3 days', 'En ligne - Zoom', 200, '/events/webinar-literature.jpg', 0.00, 'active'),
('Club de lecture: Les Contes de Madagascar', 'Rejoignez notre club de lecture mensuel. Ce mois-ci, nous lisons "Les Contes de Madagascar" de Jacques Rabemananjara.', CURRENT_TIMESTAMP + INTERVAL '10 days', 'Café littéraire Le Jardin, Antananarivo', 15, '/events/reading-club.jpg', 2000.00, 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- END OF DATABASE FIX SCRIPT
-- =====================================================

-- Verification queries (run these after the script to verify)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'approved_for_landing';
-- SELECT COUNT(*) as challenges_count FROM challenges;
-- SELECT COUNT(*) as badges_count FROM badges;