import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiUser, FiX, FiCornerDownLeft } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import CommentActions from "./CommentActions";

export default function CommentModal({
  post,
  isOpen,
  onClose,
  onCommentAdded,
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  const auth = useAuth();
  const currentUser = auth.user?.user;
  const token = auth.user?.token;

  // Dans CommentModal.jsx - Remplacer l'organisation des commentaires

  // Fonction pour organiser les commentaires en arborescence (côté frontend)
  // Dans CommentModal.jsx - REMPLACER la fonction organizeComments

// Fonction SIMPLIFIÉE pour organiser les commentaires
const organizeComments = (flatComments) => {
  if (!flatComments || !Array.isArray(flatComments)) {
    console.log("❌ flatComments n'est pas un tableau:", flatComments);
    return [];
  }

  console.log("📝 Organisation de", flatComments.length, "commentaires");

  const commentMap = new Map();
  const rootComments = [];

  // Étape 1: Créer un map de tous les commentaires
  flatComments.forEach(comment => {
    if (comment && comment.id) {
      commentMap.set(comment.id, { ...comment, replies: [] });
    }
  });

  // Étape 2: Organiser en arborescence
  flatComments.forEach(comment => {
    if (!comment) return;
    
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies.push(commentMap.get(comment.id));
      }
      // Si parent non trouvé, ignorer (c'est une réponse orpheline)
    } else {
      rootComments.push(commentMap.get(comment.id));
    }
  });

  // Étape 3: Trier les commentaires racine par date (plus récents en premier)
  rootComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  console.log("🌳 Arborescence organisée:", rootComments.length, "commentaires racine");
  return rootComments;
};

// Charger les commentaires - VERSION CORRECTE
const loadComments = async () => {
  if (!post?.id) {
    console.log("❌ Pas d'ID de post");
    return;
  }

  setLoadingComments(true);
  try {
    console.log("🔄 Chargement des commentaires pour le post:", post.id);
    
    const response = await fetch(
      `https://vakio-boky-backend.onrender.com/api/comments/posts/${post.id}/comments`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("📦 Données reçues du serveur:", data);

    if (data.success && data.comments) {
      console.log("✅ Commentaires chargés:", data.comments.length);
      
      // Organiser les commentaires côté frontend
      const organizedComments = organizeComments(data.comments);
      setComments(organizedComments);
    } else {
      console.error("❌ Erreur dans la réponse:", data);
      setComments([]);
    }
  } catch (error) {
    console.error("❌ Erreur chargement commentaires:", error);
    setComments([]);
  } finally {
    setLoadingComments(false);
  }
};
  // Dans loadComments, utiliser l'organisation côté frontend
  


  // Ajouter un commentaire principal
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      console.log("➕ Ajout d'un commentaire:", newComment);

      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/posts/${post.id}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contenu: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Réponse ajout commentaire:", data);

      if (data.success) {
        // Recharger tous les commentaires pour avoir la structure à jour
        await loadComments();
        setNewComment("");
        onCommentAdded?.(data.comment);
      } else {
        console.error("❌ Erreur lors de l'ajout:", data.error);
        alert(data.error || "Erreur lors de l'ajout du commentaire");
      }
    } catch (error) {
      console.error("❌ Erreur ajout commentaire:", error);
      alert("Erreur de connexion lors de l'ajout du commentaire");
    } finally {
      setLoading(false);
    }
  };

  // Fonction récursive pour afficher les commentaires et réponses
  const renderComment = (comment, level = 0) => {
    if (!comment) return null;

    const isReply = level > 0;

    return (
      <div
        key={comment.id}
        className={`${
          isReply ? "ml-8 border-l-2 border-gray-200 pl-4 mt-3" : "mb-6"
        }`}
      >
        <div className="flex gap-3 group">
          <div className="flex-shrink-0">
            <div
              className={`${
                isReply ? "w-8 h-8" : "w-10 h-10"
              } bg-blue-100 rounded-full flex items-center justify-center border border-blue-200`}
            >
              {comment.user_avatar ? (
                <img
                  src={comment.user_avatar}
                  alt={comment.user_nom}
                  className={`${
                    isReply ? "w-8 h-8" : "w-10 h-10"
                  } rounded-full object-cover`}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`${
                  comment.user_avatar ? "hidden" : "flex"
                } items-center justify-center w-full h-full`}
              >
                <FiUser
                  className={`text-blue-600 ${
                    isReply ? "text-sm" : "text-base"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* En-tête du commentaire */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold ${
                      isReply ? "text-sm" : "text-base"
                    } text-blue-900`}
                  >
                    {comment.user_nom || "Utilisateur"}
                  </p>
                  {isReply && (
                    <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                      réponse
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(comment.created_at).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {comment.updated_at &&
                    comment.updated_at !== comment.created_at && (
                      <span className="text-gray-400 ml-2">• modifié</span>
                    )}
                </p>
              </div>
            </div>

            {/* Contenu du commentaire */}
            <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-gray-100 transition-colors border border-gray-200">
              <p
                className={`text-gray-800 ${
                  isReply ? "text-sm" : "text-base"
                } leading-relaxed`}
              >
                {comment.contenu}
              </p>
            </div>

            {/* Actions du commentaire */}
            <div className="mt-3">
              <CommentActions
                comment={comment}
                currentUserId={currentUser?.id}
                onUpdate={(updatedComment) => {
                  console.log("🔄 Mise à jour du commentaire:", updatedComment);
                  loadComments();
                }}
                onDelete={(deletedId) => {
                  console.log("🗑️ Suppression du commentaire:", deletedId);
                  loadComments();
                }}
                onReply={(newReply) => {
                  console.log("💬 Nouvelle réponse:", newReply);
                  loadComments();
                }}
                showReply={true}
              />
            </div>
          </div>
        </div>

        {/* Affichage récursif des réponses */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isOpen && post) {
      console.log("🎯 Ouverture de la modal pour le post:", post.id);
      loadComments();
    } else {
      // Réinitialiser quand la modal se ferme
      setComments([]);
      setNewComment("");
    }
  }, [isOpen, post]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
            <div>
              <h3 className="text-xl font-bold text-blue-900">Commentaires</h3>
              <p className="text-blue-600 text-sm mt-1">
                Publication de {post.auteur_nom}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors duration-200"
            >
              <FiX size={24} className="text-blue-700" />
            </button>
          </div>

          {/* Liste des commentaires */}
          <div className="flex-1 overflow-y-auto p-6">
            {loadingComments ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Chargement des commentaires...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <FiCornerDownLeft
                  className="mx-auto text-gray-300 mb-4"
                  size={48}
                />
                <p className="text-gray-600 text-lg font-medium mb-2">
                  Aucun commentaire
                </p>
                <p className="text-gray-500 text-sm">
                  Soyez le premier à commenter cette publication !
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => renderComment(comment))}
              </div>
            )}
          </div>

          {/* Formulaire d'ajout de commentaire principal */}
          <form
            onSubmit={handleAddComment}
            className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                  {currentUser?.photo_profil ? (
                    <img
                      src={currentUser.photo_profil}
                      alt={currentUser.nom}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-blue-600 text-base" />
                  )}
                </div>
              </div>
              <div className="flex-1 flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Écrivez votre commentaire... ${
                    currentUser ? `en tant que ${currentUser.nom}` : ""
                  }`}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 font-medium"
                >
                  <FiSend size={18} />
                  {loading ? "..." : "Publier"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
