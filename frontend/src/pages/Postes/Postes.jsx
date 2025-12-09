import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiImage,
  FiVideo,
  FiFile,
  FiX,
  FiEdit,
  FiTrash2,
  FiUser,
  FiPlus,
  FiMinus,
  FiBook,
} from "react-icons/fi";

import ReportButton from "@/components/moderation/ReportButton";
import Button from "@/components/ui/Button";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useMedias } from "@/hooks/useMedias";
import CommentModal from "@/components/comments/CommentModal";
import UploadMedia from "./UploadMedia";
import ReactQuill from "react-quill";
import Modal from "@/components/ui/Modal";
import "react-quill/dist/quill.snow.css";

export default function Postes() {
  const auth = useAuth();
  const user = auth.user?.user;
  const token = auth.user?.token;

  const { posts, loading, error, createPost, toggleLike, sharePost, refetch } =
    usePosts();

  const { uploadMedias } = useMedias();

  const [newPostContent, setNewPostContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [mediaUploadType, setMediaUploadType] = useState("image");
  const [postMedias, setPostMedias] = useState([]);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [showPostOptions, setShowPostOptions] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [editPostMedias, setEditPostMedias] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Ouvrir l'upload avec le type spécifique
  const openMediaUpload = (type) => {
    setMediaUploadType(type);
    setShowMediaUpload(true);
  };

  // Création de post
  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPostContent.trim() && postMedias.length === 0) {
      alert("Le contenu ou un média est requis");
      return;
    }

    setIsCreating(true);

    try {
      let postType = "simple";
      let mediaUrl = null;

      if (postMedias.length > 0) {
        mediaUrl = postMedias[0].url;
        if (postMedias[0].type === "image") postType = "image";
        else if (postMedias[0].type === "video") postType = "video";
        else postType = "document";
      }

      const postData = {
        contenu: newPostContent,
        type_post: postType,
        media_url: mediaUrl,
      };

      const result = await createPost(postData);

      if (result.success) {
        setNewPostContent("");
        setPostMedias([]);
        setShowModal(false);
        await refetch();
      } else {
        alert(result.error || "Erreur lors de la création du post");
      }
    } catch (error) {
      console.error("Erreur création post:", error);
      alert("Erreur lors de la création du post");
    } finally {
      setIsCreating(false);
    }
  };

  const handleMediasUploaded = async (medias) => {
    console.log("📨 Médias reçus:", medias);
    if (medias && medias.length > 0) {
      setPostMedias(medias);
      setShowMediaUpload(false);
    }
  };

  const handleEditMediasUploaded = async (medias) => {
    if (medias && medias.length > 0) {
      setEditPostMedias(medias);
      setShowMediaUpload(false);
    }
  };

  const removeEditMedia = () => {
    setEditPostMedias([]);
  };

  const handleLike = async (postId) => {
    const result = await toggleLike(postId);
    if (!result.success) {
      alert("Erreur lors du like");
    }
  };

  const handleShare = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const result = await sharePost(postId);

    if (result.success) {
      const shareText = `Découvrez ce post de ${post.auteur_nom} sur Vakio Boky`;
      const shareUrl = `${window.location.origin}/post/${postId}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Vakio Boky",
            text: shareText,
            url: shareUrl,
          });
        } catch {
          console.log("Partage annulé");
        }
      } else {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      }
    } else {
      alert("Erreur lors du partage");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette publication ?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        await refetch();
        setShowPostOptions(null);
      } else {
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression post:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleEditPost = async (postId) => {
    if (!editPostContent.trim()) {
      alert("Le contenu ne peut pas être vide");
      return;
    }

    try {
      let postType = "simple";
      if (editPostMedias.length > 0) {
        const mediaType = editPostMedias[0].type;
        if (mediaType.includes("image")) postType = "image";
        else if (mediaType.includes("video")) postType = "video";
        else postType = "document";
      } else {
        const originalPost = posts.find((p) => p.id === postId);
        postType = originalPost?.type_post || "simple";
      }

      const postData = {
        contenu: editPostContent,
        type_post: postType,
        media_url: editPostMedias.length > 0 ? editPostMedias[0].url : null,
      };

      if (editPostMedias.length === 0) {
        postData.media_url = null;
        postData.type_post = "simple";
      }

      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();

      if (data.success) {
        await refetch();
        setEditingPost(null);
        setEditPostContent("");
        setEditPostMedias([]);
      } else {
        alert(data.error || "Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur modification post:", error);
      alert("Erreur lors de la modification");
    }
  };

  const startEditPost = (post) => {
    setEditingPost(post.id);
    setEditPostContent(post.contenu);
    setEditPostMedias(
      post.media_url ? [{ url: post.media_url, type: post.type_post }] : []
    );
  };

  const renderMedia = (post) => {
    if (!post.media_url) return null;

    return (
      <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        {post.type_post === "image" && (
          <img
            src={post.media_url}
            alt="Post media"
            className="w-full max-h-96 object-cover cursor-pointer transition-transform hover:scale-105"
            onClick={() => window.open(post.media_url, "_blank")}
          />
        )}
        {post.type_post === "video" && (
          <video
            src={post.media_url}
            controls
            className="w-full max-h-96 bg-black rounded-lg"
          />
        )}
        {(post.type_post === "document" || post.type_post === "fichier") && (
          <div className="p-4 flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <FiFile className="text-blue-600 text-2xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                Document joint
              </p>
              <a
                href={post.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Télécharger le fichier
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEditForm = (post) => (
    <div className="mb-4 space-y-4">
      <ReactQuill
        theme="snow"
        value={editPostContent}
        onChange={setEditPostContent}
        modules={modules}
        className="bg-white rounded-lg border border-gray-200 min-h-[150px] mb-4"
      />

      {post.media_url && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            Média actuel:
          </p>
          {renderMedia(post)}
          <button
            onClick={removeEditMedia}
            className="mt-3 flex items-center gap-2 text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
          >
            <FiMinus size={14} />
            Supprimer ce média
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => openMediaUpload("image")}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-200 rounded-xl text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium"
        >
          <FiImage size={18} />
          Image
        </button>
        <button
          type="button"
          onClick={() => openMediaUpload("video")}
          className="flex items-center gap-2 px-4 py-2 border-2 border-purple-200 rounded-xl text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 font-medium"
        >
          <FiVideo size={18} />
          Vidéo
        </button>
        <button
          type="button"
          onClick={() => openMediaUpload("file")}
          className="flex items-center gap-2 px-4 py-2 border-2 border-green-200 rounded-xl text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 font-medium"
        >
          <FiFile size={18} />
          Fichier
        </button>
      </div>

      {editPostMedias.length > 0 && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm font-semibold text-green-900 mb-2">
            Nouveau média:
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-800 font-medium">
              {editPostMedias[0].url.split("/").pop()}
            </span>
            <button
              onClick={removeEditMedia}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          size="md"
          onClick={() => handleEditPost(post.id)}
          disabled={!editPostContent.trim()}
          className="flex-1"
        >
          Enregistrer les modifications
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setEditingPost(null);
            setEditPostContent("");
            setEditPostMedias([]);
          }}
        >
          Annuler
        </Button>
      </div>
    </div>
  );

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Chargement des publications...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête simplifié et professionnel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-100"
          >
            <FiBook className="text-2xl text-blue-600" />
            <div>
              <h1 className="font-bold text-xl text-gray-900">
                Fil d'Actualité
              </h1>
              <p className="text-sm text-gray-600">
                Partagez vos découvertes littéraires
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Formulaire de création amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 backdrop-blur-sm"
        >
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  {user?.nom ? (
                    <span className="text-white font-bold text-lg">
                      {user.nom.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <FiUser className="text-white" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.nom}</h3>
                  <p className="text-sm text-gray-500">
                    Quoi de neuf dans vos lectures ?
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-text bg-gray-50/50 hover:border-blue-300 transition-all duration-200"
                onClick={() => setShowModal(true)}
              >
                {newPostContent ? (
                  <div
                    className="text-gray-800 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: newPostContent }}
                  />
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    <FiBook className="mx-auto text-2xl mb-2" />
                    <p>
                      Partagez vos impressions de lecture, citations favorites
                      ou recommandations...
                    </p>
                  </div>
                )}
              </motion.div>

              {postMedias.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiFile className="text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900 text-sm">
                          Fichier prêt à être publié
                        </p>
                        <p className="text-green-700 text-sm">
                          {postMedias[0].url.split("/").pop()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPostMedias([])}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openMediaUpload("image")}
                  className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  title="Ajouter une image"
                >
                  <FiImage size={20} />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Image
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openMediaUpload("video")}
                  className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
                  title="Ajouter une vidéo"
                >
                  <FiVideo size={20} />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Vidéo
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openMediaUpload("file")}
                  className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 group"
                  title="Ajouter un document"
                >
                  <FiFile size={20} />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Document
                  </span>
                </motion.button>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={
                    isCreating ||
                    (!newPostContent.trim() && postMedias.length === 0)
                  }
                  className="px-8 font-semibold"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Publication...
                    </div>
                  ) : (
                    "Publier"
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>

        {/* Modal d'édition */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          className="max-w-4xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Créer une publication
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <ReactQuill
              theme="snow"
              value={newPostContent}
              onChange={setNewPostContent}
              modules={modules}
              className="bg-white rounded-lg border border-gray-200 min-h-[300px] mb-6"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                size="lg"
              >
                Annuler
              </Button>
              <Button onClick={() => setShowModal(false)} size="lg">
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal d'upload de médias */}
        <AnimatePresence>
          {showMediaUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={() => setShowMediaUpload(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {mediaUploadType === "image" && "📷 Ajouter une image"}
                    {mediaUploadType === "video" && "🎥 Ajouter une vidéo"}
                    {mediaUploadType === "file" && "📄 Ajouter un document"}
                  </h3>
                  <button
                    onClick={() => setShowMediaUpload(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <UploadMedia
                  onMediasUploaded={
                    editingPost
                      ? handleEditMediasUploaded
                      : handleMediasUploaded
                  }
                  maxFiles={1}
                  accept={
                    mediaUploadType === "image"
                      ? "image/*"
                      : mediaUploadType === "video"
                      ? "video/*"
                      : "application/pdf,.doc,.docx,.txt,.ppt,.pptx"
                  }
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des posts améliorée */}
        <AnimatePresence>
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            >
              <FiBook className="mx-auto text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucune publication
              </h3>
              <p className="text-gray-500">
                Soyez le premier à partager vos découvertes littéraires !
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  {/* En-tête du post */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        {post.auteur_nom ? (
                          <span className="text-white font-bold text-xl">
                            {post.auteur_nom.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <FiUser className="text-white" size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {post.auteur_nom || "Utilisateur"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {new Date(post.created_at).toLocaleDateString(
                            "fr-FR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {user?.id === post.auteur_id && (
                      //     <div className="relative">
                      //       <motion.button
                      //         whileHover={{ scale: 1.1 }}
                      //         whileTap={{ scale: 0.9 }}
                      //         onClick={() =>
                      //           setShowPostOptions(
                      //             showPostOptions === post.id ? null : post.id
                      //           )
                      //         }
                      //         className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                      //       >
                      //         <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
                      //         <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
                      //         <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      //       </motion.button>

                      //       <AnimatePresence>
                      //         {showPostOptions === post.id && (
                      //           <motion.div
                      //             initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      //             animate={{ opacity: 1, scale: 1, y: 0 }}
                      //             exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      //             className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10 min-w-40"
                      //           >
                      //             <button
                      //               onClick={() => {
                      //                 startEditPost(post);
                      //                 setShowPostOptions(null);
                      //               }}
                      //               className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors"
                      //             >
                      //               <FiEdit size={16} />
                      //               Modifier
                      //             </button>
                      //             <button
                      //               onClick={() => handleDeletePost(post.id)}
                      //               className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-sm font-medium text-red-600 transition-colors"
                      //             >
                      //               <FiTrash2 size={16} />
                      //               Supprimer
                      //             </button>
                      //           </motion.div>
                      //         )}
                      //       </AnimatePresence>
                      //     </div>
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setShowPostOptions(
                              showPostOptions === post.id ? null : post.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </motion.button>

                        <AnimatePresence>
                          {showPostOptions === post.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8, y: -10 }}
                              className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10 min-w-48"
                            >
                              {user?.id === post.auteur_id ? (
                                <>
                                  <button
                                    onClick={() => {
                                      startEditPost(post);
                                      setShowPostOptions(null);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700"
                                  >
                                    <FiEdit size={16} />
                                    Modifier
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-sm font-medium text-red-600"
                                  >
                                    <FiTrash2 size={16} />
                                    Supprimer
                                  </button>
                                </>
                              ) : (
                                <ReportButton
                                  contentId={post.id}
                                  contentType="post"
                                  reportedUserId={post.auteur_id}
                                  reportedUserName={post.auteur_nom}
                                  contentPreview={post.contenu
                                    .replace(/<[^>]*>/g, "")
                                    .substring(0, 100)}
                                  variant="text"
                                  className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-sm font-medium text-red-600"
                                  onReportSubmitted={() =>
                                    setShowPostOptions(null)
                                  }
                                />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Contenu du post */}
                  {editingPost === post.id ? (
                    renderEditForm(post)
                  ) : (
                    <>
                      <div className="mb-6">
                        <div
                          className="text-gray-800 leading-relaxed text-lg prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: post.contenu }}
                        />
                        {renderMedia(post)}
                      </div>

                      <div className="flex items-center space-x-8 text-gray-600 text-sm mb-4 px-2">
                        <span className="font-medium">
                          {post.likes_count || 0} j'aime
                        </span>
                        <span className="font-medium">
                          {post.comments_count || 0} commentaires
                        </span>
                        <span className="font-medium">
                          {post.shares_count || 0} partages
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                            post.user_liked
                              ? "text-red-600 bg-red-50 border border-red-200"
                              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                          }`}
                        >
                          <FiHeart
                            size={20}
                            fill={post.user_liked ? "currentColor" : "none"}
                          />
                          <span>J'aime</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedPostForComments(post)}
                          className="flex items-center space-x-3 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200 font-medium"
                        >
                          <FiMessageCircle size={20} />
                          <span>Commenter</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleShare(post.id)}
                          className="flex items-center space-x-3 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200 font-medium"
                        >
                          <FiShare2 size={20} />
                          <span>Partager</span>
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Modal des commentaires */}
        <CommentModal
          post={selectedPostForComments}
          isOpen={!!selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
          onCommentAdded={refetch}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mt-6 text-center shadow-lg"
          >
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
