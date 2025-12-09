-- Table des posts : stocke toutes les publications des utilisateurs
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY, -- ID unique auto-incrémenté
    auteur_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE, -- Référence à l'utilisateur
    contenu TEXT NOT NULL, -- Texte du post (obligatoire)
    type_post VARCHAR(20) DEFAULT 'simple', -- Type: simple, citation, media
    media_url VARCHAR(500), -- URL pour image/vidéo (optionnel)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date de création auto
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date de modification auto
);

-- Table des likes : qui a liké quel post
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE, -- Post liké
    user_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE, -- Utilisateur qui like
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, user_id) -- Empêche de liker plusieurs fois le même post
);

-- Table des commentaires
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE, -- Post commenté
    user_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE, -- Auteur du commentaire
    contenu TEXT NOT NULL, -- Texte du commentaire
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- Table pour les likes de commentaires
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(comment_id, user_id) -- Empêche les doubles likes
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- Table des partages
CREATE TABLE IF NOT EXISTS post_shares (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE, -- Post partagé
    user_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE, -- Utilisateur qui partage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des livres
CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE,
    description TEXT,
    couverture_url VARCHAR(500),
    genre VARCHAR(100),
    isbn VARCHAR(20),
    statut VARCHAR(50) DEFAULT 'brouillon', -- brouillon, publié, archivé
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des extraits
CREATE TABLE extraits (
    id SERIAL PRIMARY KEY,
    livre_id INTEGER REFERENCES livres (id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    chapitre INTEGER,
    page_debut INTEGER,
    page_fin INTEGER,
    statut VARCHAR(50) DEFAULT 'brouillon',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des favoris (lecteurs)
CREATE TABLE livre_favoris (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE,
    livre_id INTEGER REFERENCES livres (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, livre_id)
);

-- Pour clubs si necessaires

CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    categorie VARCHAR(100),
    ville VARCHAR(100),
    pays VARCHAR(100),
    createur_id INT REFERENCES utilisateur (id) ON DELETE SET NULL,
    regles TEXT,
    site_web TEXT,
    visibilite VARCHAR(20) DEFAULT 'public', -- public, privé
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE club_members (
    id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs (id) ON DELETE CASCADE,
    user_id INT REFERENCES utilisateur (id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'membre', -- membre, modérateur, admin
    joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE club_posts (
    id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs (id) ON DELETE CASCADE,
    auteur_id INT REFERENCES utilisateur (id) ON DELETE SET NULL,
    contenu TEXT NOT NULL,
    media_url TEXT,
    type_post VARCHAR(20) DEFAULT 'simple', -- simple, image, video, document
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ///concernant cIubs si pas hors sujet
-- Table des événements de club
CREATE TABLE club_events (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs (id) ON DELETE CASCADE,
    createur_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP,
    type VARCHAR(50) DEFAULT 'rencontre', -- rencontre, webinar, atelier, lecture
    lieu VARCHAR(255),
    max_participants INTEGER,
    lien_visio VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des participants aux événements
CREATE TABLE club_event_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES club_events (id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (event_id, user_id)
);

-- Table des notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur (id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, event, post, member
    lien VARCHAR(500),
    lue BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des événements
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(500) NOT NULL,
  max_participants INTEGER,
  image_url VARCHAR(500),
  price DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des inscriptions aux événements
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES utilisateur(id),
  event_id INTEGER REFERENCES events(id),
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

-- Table pour les produits du marketplace
CREATE TABLE IF NOT EXISTS marketplace (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les commandes
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateur (id),
    product_id INTEGER REFERENCES marketplace (id),
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les paiements
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders (id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    payment_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace (status);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- Table testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'Membre',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table events (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(200),
  event_type VARCHAR(20) DEFAULT 'general' CHECK (event_type IN ('general', 'rencontre', 'webinar', 'atelier', 'lecture')),
  image_url VARCHAR(500),
  current_participants INTEGER DEFAULT 0,
  max_participants INTEGER,
  club_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Colonnes à ajouter à la table users si elles n'existent pas
ALTER TABLE utilisateur 
ADD COLUMN IF NOT EXISTS author_genre VARCHAR(100),
ADD COLUMN IF NOT EXISTS published_works INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS promoted_at TIMESTAMP;


CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    content_id INTEGER NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('post', 'comment', 'user', 'book', 'event')),
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    evidence TEXT,
    reported_user_id INTEGER REFERENCES utilisateur(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES utilisateur(id) ON DELETE SET NULL,
    resolution_notes TEXT
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_reports_content ON reports(content_id, content_type);
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_reported_user ON reports(reported_user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created ON reports(created_at);

-- Table pour la file de modération
CREATE TABLE IF NOT EXISTS moderation_queue (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('post', 'comment', 'user', 'book', 'event')),
    reported_user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    reporter_id INTEGER REFERENCES utilisateur(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'dismissed')),
    reports_count INTEGER DEFAULT 1,
    assigned_to INTEGER REFERENCES utilisateur(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES utilisateur(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    auto_moderated BOOLEAN DEFAULT FALSE
);

-- Table pour l'historique des actions de modération
CREATE TABLE IF NOT EXISTS moderation_actions (
    id SERIAL PRIMARY KEY,
    moderation_queue_id INTEGER REFERENCES moderation_queue(id) ON DELETE CASCADE,
    moderator_id INTEGER NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'warn_user', 'remove_content', 'ban_user', 'suspend_user', 
        'approve_content', 'restore_content', 'edit_content', 'ignore'
    )),
    reason TEXT NOT NULL,
    notes TEXT,
    duration INTEGER, -- En jours pour les bannissements/suspensions
    affected_user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE,
    content_type VARCHAR(20),
    content_id INTEGER,
    is_reversible BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les règles de modération automatique
CREATE TABLE IF NOT EXISTS moderation_rules (
    id SERIAL PRIMARY KEY,
    rule_type VARCHAR(50) NOT NULL,
    condition JSONB NOT NULL,
    action VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES utilisateur(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triggers pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moderation_queue_updated_at 
    BEFORE UPDATE ON moderation_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moderation_rules_updated_at 
    BEFORE UPDATE ON moderation_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vue pour les statistiques de modération
CREATE OR REPLACE VIEW moderation_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_reports,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reports,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_reports,
    COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical_reports,
    AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours
FROM moderation_queue
GROUP BY DATE(created_at);