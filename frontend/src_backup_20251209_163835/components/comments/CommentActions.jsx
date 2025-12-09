import { useState } from "react";
import { FiHeart, FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { useCommentActions } from "@/hooks/useCommentActions";
import ReportButton from "@/components/moderation/ReportButton";

export default function CommentActions({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
  onReply,
  showReply = true,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.contenu);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { loading, toggleLike, updateComment, deleteComment, replyToComment } =
    useCommentActions();

  const isAuthor = currentUserId === comment.user_id;

  // Gestion du like
  // const handleLike = async () => {
  //   const result = await toggleLike(comment.id);
  //   if (result.success && onUpdate) {
  //     onUpdate({ ...comment, user_liked: result.liked, likes_count: result.likes_count });
  //   }
  // };
  // Dans CommentActions.js - Mettre à jour handleLike
  const handleLike = async () => {
    const result = await toggleLike(comment.id);

    if (result.success) {
      // Mettre à jour l'état local
      onUpdate({
        ...comment,
        user_liked: result.liked,
        likes_count: result.likes_count,
      });
    } else {
      console.error("❌ Erreur like:", result.error);
      // Optionnel: afficher un message à l'utilisateur
    }
  };
  // Gestion de la modification
  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    const result = await updateComment(comment.id, editContent);
    if (result.success && onUpdate) {
      onUpdate(result.comment);
      setIsEditing(false);
    }
  };

  // Gestion de la suppression
  const handleDelete = async () => {
    if (!confirm("Supprimer ce commentaire ?")) return;

    const result = await deleteComment(comment.id);
    if (result.success && onDelete) {
      onDelete(comment.id);
    }
  };

  // Gestion de la réponse
  const handleReply = async () => {
    if (!replyContent.trim()) return;

    const result = await replyToComment(comment.id, replyContent);
    if (result.success && onReply) {
      onReply(result.reply);
      setShowReplyForm(false);
      setReplyContent("");
    }
  };

  if (isEditing) {
    return (
      <div className="mt-2 space-y-2">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full border border-blue-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          rows="2"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            disabled={loading || !editContent.trim()}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            <FiSave size={12} />
            Sauvegarder
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
          >
            <FiX size={12} />
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {/* Actions principales */}
      <div className="flex items-center gap-4 text-sm">
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 ${
            comment.user_liked
              ? "text-red-500 font-semibold"
              : "text-gray-500 hover:text-red-500"
          }`}
        >
          <FiHeart
            size={14}
            fill={comment.user_liked ? "currentColor" : "none"}
          />
          <span>{comment.likes_count || 0}</span>
        </button>

        {/* Répondre */}
        {showReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
          >
            {/* <FiReply size={14} /> */}
            <span>Répondre</span>
          </button>
        )}

        {/* Actions auteur */}
        {/* {isAuthor && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <FiEdit size={14} />
              <span>Modifier</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500"
            >
              <FiTrash2 size={14} />
              <span>Supprimer</span>
            </button>
          </>
        )} */}
        {isAuthor ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <FiEdit size={14} />
              <span>Modifier</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500"
            >
              <FiTrash2 size={14} />
              <span>Supprimer</span>
            </button>
          </>
        ) : (
          <ReportButton
            contentId={comment.id}
            contentType="comment"
            reportedUserId={comment.user_id}
            reportedUserName={comment.user_nom}
            contentPreview={comment.contenu}
            variant="text"
            size="sm"
            className="flex items-center gap-1 text-gray-500 hover:text-red-500"
          />
        )}
      </div>

      {/* Formulaire de réponse */}
      {showReplyForm && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Écrivez votre réponse..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleReply}
            disabled={loading || !replyContent.trim()}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            Répondre
          </button>
          <button
            onClick={() => setShowReplyForm(false)}
            className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
