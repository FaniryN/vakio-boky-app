import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend, FiUser, FiTrash2, FiEdit } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function PostComments({
  post,
  onCommentAdded,
  onCommentDeleted,
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const auth = useAuth();
  const currentUser = auth.user?.user;
  const token = auth.user?.token;

  // Charger les commentaires
  const loadComments = async () => {
    if (!post?.id) return;

    setLoadingComments(true);
    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/${post.id}`
      );
      const data = await response.json();

      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Erreur chargement commentaires:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contenu: newComment }),
        }
      );

      const data = await response.json();

      if (data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
        onCommentAdded?.(data.comment);
      }
    } catch (error) {
      console.error("Erreur ajout commentaire:", error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Supprimer ce commentaire ?")) return;

    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        onCommentDeleted?.(commentId);
      }
    } catch (error) {
      console.error("Erreur suppression commentaire:", error);
    }
  };

  // Modifier un commentaire
  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contenu: editContent }),
        }
      );

      const data = await response.json();

      if (data.comment) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? data.comment : c))
        );
        setEditingComment(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Erreur modification commentaire:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [post?.id]);

  return (
    <div className="border-t border-gray-100 pt-4">
      {/* Liste des commentaires */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {loadingComments ? (
          <div className="text-center py-2 text-gray-500">Chargement...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-2 text-gray-500 text-sm">
            Aucun commentaire
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-600 text-sm" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {editingComment === comment.id ? (
                  // Mode édition
                  <div className="flex gap-2">
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      ✓
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingComment(null)}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  // Mode affichage
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm text-blue-900">
                        {comment.user_nom}
                      </p>

                      {/* Actions (auteur seulement) */}
                      {currentUser?.id === comment.user_id && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditContent(comment.contenu);
                            }}
                            className="p-1 hover:bg-gray-200 rounded text-gray-600"
                          >
                            <FiEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{comment.contenu}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(comment.created_at).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center rounded-md bg-white border border-blue-400 text-blue-900 placeholder:text-blue-400 px-3 py-2 gap-2"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            required
            className="outline-none w-full bg-transparent text-sm gap-2"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="flex items-center rounded-full bg-blue-500 text-white hover:bg-blue-600 p-3"
          >
            <FiSend size={14} />
          </button>
        </motion.div>
      </form>
    </div>
  );
}
