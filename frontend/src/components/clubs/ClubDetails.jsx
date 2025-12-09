import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function ClubDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: "", media_url: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClub = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setClub(data.club);
      } else {
        setError(data.message || "Erreur lors du chargement du club");
      }
    } catch (error) {
      console.error("Erreur chargement club:", error);
      setError("Erreur de connexion au serveur");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${id}/posts`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      console.log("📝 Posts reçus:", data);
      if (data.success) setPosts(data.posts);
    } catch (error) {
      console.error("Erreur chargement posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
    fetchPosts();
  }, [id]);

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, content: e.target.value });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, media_url: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.content.trim()) {
      alert("Le contenu ne peut pas être vide");
      return;
    }

    const formData = new FormData();
    formData.append("content", newPost.content);

    if (newPost.media_url) {
      formData.append("media_url", newPost.media_url);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${id}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("📨 Réponse création post:", data);

      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewPost({ content: "", media_url: null });
        setPreview(null);
        alert("Post publié avec succès !");
      } else {
        alert(data.message || "Erreur lors de la publication");
      }
    } catch (error) {
      console.error("Erreur publication:", error);
      alert("Erreur lors de la publication");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-club.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-800 text-lg"
        >
          Chargement du club...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg">
          Club non trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête du club */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image du club */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(club.image_url)}
                alt={club.nom}
                className="w-full md:w-64 h-48 object-cover rounded-xl shadow-md"
                onError={(e) => {
                  e.target.src = "/placeholder-club.jpg";
                }}
              />
            </div>

            {/* Informations du club */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-blue-900">{club.nom}</h1>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Retour
                  </Button>
                  {user && club.createur_id === user.id && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/clubs/${id}/edit`)}
                    >
                      Modifier
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      (window.location.href = `/clubs/${id}/events`)
                    }
                  >
                    Voir les événements
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-4">{club.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">
                    Catégorie:
                  </span>
                  {club.categorie || "Non spécifiée"}
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">
                    Type:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      club.type === "physique"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {club.type === "physique" ? "Physique" : "Virtuel"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">
                    Localisation:
                  </span>
                  {club.ville && club.pays
                    ? `${club.ville}, ${club.pays}`
                    : "En ligne"}
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">
                    Visibilité:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      club.visibilite === "public"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {club.visibilite}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">
                    Créateur:
                  </span>
                  {club.createur_nom || "Inconnu"}
                </div>
              </div>

              {club.site_web && (
                <div className="mt-4">
                  <a
                    href={club.site_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Site web du club
                  </a>
                </div>
              )}

              {club.regles && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Règles du club:
                  </h3>
                  <p className="text-sm text-blue-700">{club.regles}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Formulaire de nouvelle publication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Publier dans le club
          </h3>

          <textarea
            value={newPost.content}
            onChange={handlePostChange}
            placeholder="Partagez un extrait, une critique, une annonce..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*,video/*,application/pdf"
                onChange={handleMediaChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Images, vidéos ou PDF (max 10MB)
              </p>
            </div>

            <Button
              onClick={handleSubmitPost}
              disabled={!newPost.content.trim()}
              className="flex-shrink-0"
            >
              Publier
            </Button>
          </div>

          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Aperçu:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs max-h-48 object-cover rounded-lg shadow-sm"
              />
              <button
                onClick={() => {
                  setNewPost({ ...newPost, media_url: null });
                  setPreview(null);
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Supprimer l'image
              </button>
            </div>
          )}
        </motion.div>

        {/* Liste des publications */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Publications du club ({posts.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/clubs/${id}/events`)}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Voir les événements
            </Button>
          </div>

          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-md p-8 text-center"
            >
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-4">
                Aucune publication pour le moment.
              </p>
              <p className="text-gray-400 text-sm">
                Soyez le premier à partager dans ce club !
              </p>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <p className="text-gray-800 whitespace-pre-line mb-4">
                  {post.contenu}
                </p>

                {post.media_url && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(post.media_url)}
                      alt="Media post"
                      className="max-w-full max-h-96 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = "/placeholder-media.jpg";
                      }}
                    />
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center">
                    {post.photo_profil ? (
                      <img
                        src={getImageUrl(post.photo_profil)}
                        alt={post.auteur_nom}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                        {post.auteur_nom?.charAt(0) || "A"}
                      </div>
                    )}
                    <span className="font-medium text-blue-600">
                      {post.auteur_nom || "Auteur inconnu"}
                    </span>
                  </div>
                  <span>
                    {new Date(post.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
