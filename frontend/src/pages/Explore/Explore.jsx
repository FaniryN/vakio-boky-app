import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBook,
  FiUser,
  FiSearch,
  FiStar,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiImage,
  FiVideo,
  FiFile,
  FiX,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiFilter,
  FiTrendingUp,
  FiAward,
  FiBarChart2,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useBooks } from "../../hooks/useBooks.jsx";
import BookCard from "../../components/books/BookCard.jsx";
import BookForm from "../../components/books/BookForm.jsx";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import { useMedias } from "../../hooks/useMedias";
import CommentModal from "../../components/comments/CommentModal";
import UploadMedia from "../Postes/UploadMedia";
import ReactQuill from "react-quill";
import Modal from "../../components/ui/Modal";
import "react-quill/dist/quill.snow.css";

export default function Explore() {
  const nav = useNavigate();
  const { user } = useAuth();

  // Books state
  const {
    books,
    myBooks,
    loading: booksLoading,
    error: booksError,
    fetchBooks,
    fetchMyBooks,
    createBook,
    updateBook,
    deleteBook,
    clearError,
  } = useBooks();

  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [activeBookTab, setActiveBookTab] = useState("public");

  // Clubs state
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubsError, setClubsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Posts state
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    createPost,
    toggleLike,
    sharePost,
    refetch,
  } = usePosts();
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

  // Navigation entre sections
  const [activeSection, setActiveSection] = useState("livres");
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Détection de la section active
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["livres", "clubs", "publications"];
      const scrollY = window.scrollY + 100;

      // Détection de la section active
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Afficher/cacher la navigation flottante
      setShowFloatingNav(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation vers une section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Load books
  useEffect(() => {
    loadBooks();
  }, [activeBookTab]);

  const loadBooks = async () => {
    try {
      if (activeBookTab === "public") {
        await fetchBooks();
      } else {
        await fetchMyBooks();
      }
    } catch (err) {
      console.error("Erreur chargement livres:", err);
    }
  };

  // Load clubs
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setClubsLoading(true);
    setClubsError(null);

    if (!user?.token) {
      setClubsError("Veuillez vous connecter pour voir les clubs.");
      setClubsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://vakio-boky-backend.onrender.com/api/clubs",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (res.status === 401 || res.status === 403) {
        setClubsError("Session expirée.");
        return;
      }

      const data = await res.json();
      if (data.success) setClubs(data.clubs);
      else setClubsError(data.message || "Erreur lors du chargement des clubs");
    } catch (err) {
      console.error(err);
      setClubsError("Erreur lors du chargement des clubs");
    } finally {
      setClubsLoading(false);
    }
  };

  // Filtered clubs
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || club.categorie === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    ...new Set(clubs.map((club) => club.categorie).filter(Boolean)),
  ];

  // Book handlers
  const handleCreateBook = async (bookData) => {
    try {
      await createBook(bookData);
      setShowBookForm(false);
      loadBooks();
    } catch (err) {
      console.error("Erreur création livre:", err);
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      await updateBook(editingBook.id, bookData);
      setEditingBook(null);
      loadBooks();
    } catch (err) {
      console.error("Erreur modification livre:", err);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      try {
        await deleteBook(id);
        loadBooks();
      } catch (err) {
        console.error("Erreur suppression livre:", err);
      }
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
  };

  const currentBooks = activeBookTab === "public" ? books : myBooks;

  // Club handlers
  const handleJoinClub = async (clubId) => {
    try {
      const res = await fetch(
        `https://vakio-boky-backend.onrender.com/api/clubs/${clubId}/join`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();

      if (data.success) {
        alert("Vous avez rejoint le club !");
        fetchClubs();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'adhésion");
    }
  };

  const isUserMember = (club) => {
    return club.membres_count > 0;
  };

  // Post handlers
  const openMediaUpload = (type) => {
    setMediaUploadType(type);
    setShowMediaUpload(true);
  };

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
        `https://vakio-boky-backend.onrender.com/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` },
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
        `https://vakio-boky-backend.onrender.com/api/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
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
      <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        {post.type_post === "image" && (
          <img
            src={post.media_url}
            alt="Post media"
            className="w-full max-h-96 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
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
          <div className="p-6 flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
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
        className="bg-white rounded-xl border border-gray-200 min-h-[150px] mb-4"
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
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

  // Composant de navigation flottante
  const FloatingSectionNavigator = () => {
    const sections = [
      { id: "livres", label: "Livres", icon: FiBook, color: "blue" },
      { id: "clubs", label: "Clubs", icon: FiUsers, color: "green" },
      {
        id: "publications",
        label: "Publications",
        icon: FiFileText,
        color: "purple",
      },
    ];

    const currentIndex = sections.findIndex(
      (section) => section.id === activeSection
    );
    const nextSection = sections[currentIndex + 1];
    const prevSection = sections[currentIndex - 1];

    return (
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-40 flex flex-col gap-3"
          >
            {/* Bouton section précédente */}
            {prevSection && (
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(prevSection.id)}
                className={`bg-gradient-to-r from-${prevSection.color}-600 to-${prevSection.color}-700 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl flex items-center gap-3 font-semibold group`}
              >
                <FiArrowUp className="group-hover:-translate-y-0.5 transition-transform" />
                <div className="text-left">
                  <div className="text-sm opacity-90">Retour à</div>
                  <div>{prevSection.label}</div>
                </div>
              </motion.button>
            )}

            {/* Bouton section suivante */}
            {nextSection && (
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(nextSection.id)}
                className={`bg-gradient-to-r from-${nextSection.color}-600 to-${nextSection.color}-700 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl flex items-center gap-3 font-semibold group`}
              >
                <div className="text-left">
                  <div className="text-sm opacity-90">Continuer vers</div>
                  <div>{nextSection.label}</div>
                </div>
                <FiArrowDown className="group-hover:translate-y-0.5 transition-transform" />
              </motion.button>
            )}

            {/* Navigation rapide */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-4"
            >
              <div className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Navigation rapide
              </div>
              <div className="flex gap-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      activeSection === section.id
                        ? `bg-${section.color}-600 text-white shadow-lg`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {section.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6"
          >
            Explorez l'Univers Littéraire
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Découvrez des livres captivants, rencontrez des auteurs talentueux
            et plongez dans vos genres préférés au sein de notre communauté
          </motion.p>
        </motion.div>

        {/* Barre de navigation sticky */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm mb-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
              {[
                { id: "livres", label: "📚 Bibliothèque", icon: FiBook },
                { id: "clubs", label: "👥 Clubs Littéraires", icon: FiUsers },
                {
                  id: "publications",
                  label: "💬 Fil d'Actualité",
                  icon: FiFileText,
                },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Barre de recherche principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative group">
            <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-hover:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un livre, un auteur, un genre..."
              className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Section Livres */}
        <motion.section
          id="livres"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-20 scroll-mt-32"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                  <FiBook className="text-white text-xl" />
                </div>
                Bibliothèque
              </h2>
              <p className="text-gray-600 text-lg">
                Découvrez et gérez votre collection de livres
              </p>
            </div>

            <Button
              onClick={() => setShowBookForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl font-semibold"
            >
              <FiPlus className="mr-2" />
              Nouveau Livre
            </Button>
          </div>

          {/* Navigation par onglets */}
          <div className="flex space-x-1 bg-gray-100/80 rounded-2xl p-2 mb-8 max-w-md backdrop-blur-sm">
            {[
              { id: "public", label: "Livres Publiés" },
              { id: "mes-livres", label: "Mes Livres" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeBookTab === tab.id
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
                onClick={() => setActiveBookTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {booksError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex justify-between items-center shadow-lg"
            >
              <span className="font-medium">{booksError}</span>
              <button
                onClick={clearError}
                className="text-red-700 hover:text-red-900 p-1 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </motion.div>
          )}

          {/* Modal de formulaire de livre */}
          <AnimatePresence>
            {(showBookForm || editingBook) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
                >
                  <BookForm
                    book={editingBook}
                    onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
                    onCancel={() => {
                      setShowBookForm(false);
                      setEditingBook(null);
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grille de livres */}
          {booksLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-lg">Chargement des livres...</span>
              </div>
            </div>
          ) : currentBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300"
            >
              <FiBookOpen className="mx-auto text-6xl text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                {activeBookTab === "public"
                  ? "Aucun livre publié"
                  : "Votre bibliothèque est vide"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {activeBookTab === "public"
                  ? "Soyez le premier à publier un livre dans la communauté"
                  : "Commencez par ajouter votre premier livre à votre collection"}
              </p>
              <Button
                onClick={() => setShowBookForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <FiPlus className="mr-2" />
                Ajouter un livre
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {currentBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <BookCard
                    book={book}
                    onEdit={handleEditBook}
                    onDelete={handleDeleteBook}
                    showActions={activeBookTab === "mes-livres"}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Section Clubs */}
        <motion.section
          id="clubs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-20 scroll-mt-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <FiUsers className="text-white text-xl" />
              </div>
              Clubs Littéraires
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Rejoignez des communautés passionnées et partagez vos découvertes
              littéraires
            </p>
          </div>

          {/* Barre de recherche et filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="relative w-full lg:w-96">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Rechercher un club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white"
              />
            </div>

            <div className="relative w-full lg:w-64">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-12 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 appearance-none bg-white cursor-pointer transition-all duration-300"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {clubsError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center shadow-lg"
            >
              {clubsError}
            </motion.div>
          )}

          {clubsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
                <span className="text-lg">Chargement des clubs...</span>
              </div>
            </div>
          ) : filteredClubs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center"
            >
              <FiUsers className="mx-auto text-6xl text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Aucun club trouvé
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {clubs.length === 0
                  ? "Soyez le premier à créer un club littéraire et à rassembler une communauté de passionnés !"
                  : "Aucun club ne correspond à votre recherche. Essayez d'autres termes."}
              </p>
              <Button
                onClick={() => nav("/create")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-2xl font-semibold"
              >
                Créer un club
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200"
                >
                  {/* Badge Admin */}
                  {club.createur_id === user?.id && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold z-10 shadow-lg">
                      👑 Admin
                    </div>
                  )}

                  {/* Image du club */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={
                        club.image_url
                          ? `https://vakio-boky-backend.onrender.com${club.image_url}`
                          : "/placeholder-club.jpg"
                      }
                      alt={club.nom}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder-club.jpg";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-black/80 text-white px-3 py-2 rounded-bl-2xl text-sm font-medium">
                      {club.visibilite}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white truncate">
                        {club.nom}
                      </h3>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {club.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      {club.categorie && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FiBook className="w-4 h-4 mr-3 text-blue-500" />
                          <span className="font-medium">{club.categorie}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500">
                        <FiUsers className="w-4 h-4 mr-3 text-green-500" />
                        <span className="font-medium">
                          {club.membres_count} membre
                          {club.membres_count !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <FiAward className="w-4 h-4 mr-3 text-amber-500" />
                        <span className="font-medium">
                          Créé par {club.createur_nom || "Inconnu"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>Actif depuis</span>
                      <span>
                        {new Date(club.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {isUserMember(club) ? (
                        <Button
                          size="lg"
                          variant="primary"
                          onClick={() => nav(`/clubs/${club.id}`)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Accéder au club
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          variant="primary"
                          onClick={() => handleJoinClub(club.id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          Rejoindre le club
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Section Publications */}
        <motion.section
          id="publications"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-20 scroll-mt-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <FiFileText className="text-white text-xl" />
              </div>
              Fil d'Actualité
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Partagez vos découvertes, discutez avec la communauté et restez
              connecté
            </p>
          </div>

          {/* Formulaire de création de post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-12 backdrop-blur-sm"
          >
            <form onSubmit={handleCreatePost} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {user?.nom ? (
                    <span className="text-white font-bold text-xl">
                      {user.nom.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <FiUser className="text-white text-xl" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {user?.nom}
                  </h3>
                  <p className="text-gray-500">
                    Partagez vos impressions de lecture...
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-text bg-gray-50/50 hover:border-blue-400 transition-all duration-300"
                onClick={() => setShowModal(true)}
              >
                {newPostContent ? (
                  <div
                    className="text-gray-800 prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: newPostContent }}
                  />
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    <FiEdit className="mx-auto text-3xl mb-3" />
                    <p className="text-lg">
                      Cliquez pour commencer à écrire...
                    </p>
                    <p className="text-sm mt-2">
                      Partagez vos citations favorites, vos critiques ou vos
                      découvertes
                    </p>
                  </div>
                )}
              </motion.div>

              {postMedias.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FiFile className="text-green-600 text-xl" />
                      <div>
                        <p className="font-semibold text-green-900">
                          Fichier prêt à être publié
                        </p>
                        <p className="text-green-700 text-sm">
                          {postMedias[0].url.split("/").pop()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPostMedias([])}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-xl"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex gap-2">
                  {[
                    {
                      type: "image",
                      icon: FiImage,
                      color: "blue",
                      label: "Image",
                    },
                    {
                      type: "video",
                      icon: FiVideo,
                      color: "purple",
                      label: "Vidéo",
                    },
                    {
                      type: "file",
                      icon: FiFile,
                      color: "green",
                      label: "Document",
                    },
                  ].map(({ type, icon: Icon, color, label }) => (
                    <motion.button
                      key={type}
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openMediaUpload(type)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                        text-${color}-600 bg-${color}-50 hover:bg-${color}-100 border border-${color}-200 hover:border-${color}-300`}
                    >
                      <Icon size={18} />
                      {label}
                    </motion.button>
                  ))}
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
                    className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Publication en cours...
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
            className="max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Créer une publication
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              <ReactQuill
                theme="snow"
                value={newPostContent}
                onChange={setNewPostContent}
                modules={modules}
                className="bg-white rounded-xl border border-gray-200 min-h-[400px] mb-8"
              />
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  size="lg"
                  className="px-8 py-3 rounded-2xl"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  size="lg"
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowMediaUpload(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {mediaUploadType === "image" && "📷 Ajouter une image"}
                      {mediaUploadType === "video" && "🎥 Ajouter une vidéo"}
                      {mediaUploadType === "file" && "📄 Ajouter un document"}
                    </h3>
                    <button
                      onClick={() => setShowMediaUpload(false)}
                      className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
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

          {/* Liste des posts */}
          <AnimatePresence>
            {postsLoading && posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 p-16 text-center"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-600">
                  Chargement des publications...
                </h3>
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 p-16 text-center"
              >
                <FiFileText className="mx-auto text-6xl text-gray-300 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  Aucune publication
                </h3>
                <p className="text-gray-500 text-lg mb-8">
                  Soyez le premier à partager vos découvertes littéraires !
                </p>
                <Button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-2xl font-semibold"
                >
                  Créer une publication
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
                  >
                    {/* En-tête du post */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          {post.auteur_nom ? (
                            <span className="text-white font-bold text-2xl">
                              {post.auteur_nom.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <FiUser className="text-white text-xl" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl">
                            {post.auteur_nom || "Utilisateur"}
                          </h3>
                          <p className="text-gray-500">
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
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setShowPostOptions(
                                showPostOptions === post.id ? null : post.id
                              )
                            }
                            className="p-3 hover:bg-gray-100 rounded-2xl text-gray-500 transition-colors"
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
                                className="absolute right-0 top-14 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-10 min-w-48"
                              >
                                <button
                                  onClick={() => {
                                    startEditPost(post);
                                    setShowPostOptions(null);
                                  }}
                                  className="w-full px-6 py-4 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors rounded-t-2xl"
                                >
                                  <FiEdit size={18} />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="w-full px-6 py-4 text-left hover:bg-red-50 flex items-center gap-3 text-sm font-medium text-red-600 transition-colors rounded-b-2xl"
                                >
                                  <FiTrash2 size={18} />
                                  Supprimer
                                </button>
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
                        <div className="mb-8">
                          <div
                            className="text-gray-800 leading-relaxed text-lg prose prose-lg max-w-none mb-6"
                            dangerouslySetInnerHTML={{ __html: post.contenu }}
                          />
                          {renderMedia(post)}
                        </div>

                        <div className="flex items-center space-x-8 text-gray-600 text-sm mb-6 px-2">
                          <span className="font-semibold flex items-center gap-2">
                            <FiHeart className="text-red-500" />
                            {post.likes_count || 0} j'aime
                          </span>
                          <span className="font-semibold flex items-center gap-2">
                            <FiMessageCircle className="text-blue-500" />
                            {post.comments_count || 0} commentaires
                          </span>
                          <span className="font-semibold flex items-center gap-2">
                            <FiShare2 className="text-green-500" />
                            {post.shares_count || 0} partages
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                          {[
                            {
                              icon: FiHeart,
                              label: "J'aime",
                              action: () => handleLike(post.id),
                              active: post.user_liked,
                              color: "red",
                            },
                            {
                              icon: FiMessageCircle,
                              label: "Commenter",
                              action: () => setSelectedPostForComments(post),
                              color: "blue",
                            },
                            {
                              icon: FiShare2,
                              label: "Partager",
                              action: () => handleShare(post.id),
                              color: "green",
                            },
                          ].map(
                            ({ icon: Icon, label, action, active, color }) => (
                              <motion.button
                                key={label}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={action}
                                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-200 font-semibold flex-1 mx-2 justify-center
                                ${
                                  active
                                    ? `text-${color}-600 bg-${color}-50 border border-${color}-200`
                                    : `text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200`
                                }`}
                              >
                                <Icon
                                  size={20}
                                  fill={active ? "currentColor" : "none"}
                                />
                                <span>{label}</span>
                              </motion.button>
                            )
                          )}
                        </div>
                      </>
                    )}
                  </motion.article>
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

          {postsError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl mt-8 text-center shadow-lg"
            >
              <p className="font-semibold text-lg">{postsError}</p>
            </motion.div>
          )}
        </motion.section>

        {/* Section Statistiques */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-20"
        >
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Communauté en Chiffres</h2>
            <p className="text-gray-600 text-lg">Rejoignez une communauté grandissante de passionnés de lecture</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "1,200+", label: "Livres", icon: FiBook, color: "blue" },
              { value: "350+", label: "Auteurs", icon: FiUser, color: "green" },
              { value: "15+", label: "Genres", icon: FiTrendingUp, color: "purple" },
              { value: "5,000+", label: "Lecteurs", icon: FiUsers, color: "orange" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div> */}
        </motion.section>
      </div>

      {/* Navigation flottante */}
      <FloatingSectionNavigator />
    </div>
  );
}
