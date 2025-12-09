-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'reading', 'writing', 'social', etc.
    target_value INTEGER NOT NULL, -- e.g., number of books to read
    reward_badge_id INTEGER,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    category VARCHAR(50), -- 'reading', 'writing', 'social', etc.
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_challenges table (user participation in challenges)
CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- Create user_badges table (badges earned by users)
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Add foreign key to challenges table
ALTER TABLE challenges ADD CONSTRAINT fk_challenge_badge
    FOREIGN KEY (reward_badge_id) REFERENCES badges(id);

-- Insert some sample badges
INSERT INTO badges (name, description, icon_url, category, rarity, points) VALUES
('Premier Lecteur', 'A lu son premier livre', '/badges/first-reader.png', 'reading', 'common', 10),
('Lecteur Assidu', 'A lu 10 livres', '/badges/dedicated-reader.png', 'reading', 'common', 50),
('Bibliophile', 'A lu 50 livres', '/badges/bibliophile.png', 'reading', 'rare', 200),
('Auteur Débutant', 'A publié son premier livre', '/badges/first-author.png', 'writing', 'common', 25),
('Auteur Confirmé', 'A publié 5 livres', '/badges/established-author.png', 'writing', 'rare', 150),
('Philanthrope', 'A fait un don à une campagne', '/badges/philanthropist.png', 'social', 'common', 20),
('Mécène', 'A collecté 1000€ pour les campagnes', '/badges/patron.png', 'social', 'epic', 500);

-- Insert some sample challenges
INSERT INTO challenges (title, description, type, target_value, reward_badge_id, end_date) VALUES
('Défi Lecture du Mois', 'Lire 3 livres ce mois-ci', 'reading', 3, 2, CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Défi Écriture', 'Publier votre premier livre', 'writing', 1, 4, CURRENT_TIMESTAMP + INTERVAL '90 days'),
('Défi Solidarité', 'Faire un don à une campagne', 'social', 1, 6, CURRENT_TIMESTAMP + INTERVAL '60 days');

-- Add indexes for performance
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_type ON challenges(type);