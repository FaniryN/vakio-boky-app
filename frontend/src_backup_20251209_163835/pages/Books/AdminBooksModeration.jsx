import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBook,
  FiCheck,
  FiX,
  FiEye,
  FiSearch,
  FiFilter,
  FiStar,
  FiDownload,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiRefreshCw,
  FiMessageSquare,
  FiEdit,
  FiTrash2,
  FiEyeOff,
  FiMail,
  FiArchive,
  FiCopy,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiMoreVertical
} from "react-icons/fi";

export default function AdminBooksModeration() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [bookToReject, setBookToReject] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    titre: '',
    description: '',
    genre: '',
    isbn: '',
    statut: 'brouillon'
  });
  const [expandedRows, setExpandedRows] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [statusFilter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      if (!token) {
        setError(
          "Token d'authentification manquant - Veuillez vous reconnecter"
        );
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/books?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expirée - Veuillez vous reconnecter");
          localStorage.removeItem("vakio_user");
          return;
        }
        if (response.status === 403) {
          setError("Accès refusé - Droits administrateur requis");
          return;
        }
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBooks(data.books || []);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("❌ Erreur chargement livres:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.auteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.auteur_email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ==================== FONCTIONS CRUD ====================

  const handleApproveBook = async (bookId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr d'approuver ce livre ? Il sera publié et visible par tous les utilisateurs."
      )
    ) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/admin/books/${bookId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        showSuccess(data.message || "Livre approuvé avec succès");
      } else {
        alert(data.error || "Erreur lors de l'approbation");
      }
    } catch (err) {
      console.error("❌ Erreur approbation livre:", err);
      alert("Erreur lors de l'approbation du livre");
    }
  };

  const handleRejectBook = async (bookId) => {
    if (!rejectReason || rejectReason.trim().length < 10) {
      alert(
        "Veuillez fournir un motif de rejet détaillé (au moins 10 caractères)"
      );
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/admin/books/${bookId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        setShowRejectModal(false);
        setBookToReject(null);
        setRejectReason("");
        showSuccess(data.message || "Livre rejeté avec succès");
      } else {
        alert(data.error || "Erreur lors du rejet");
      }
    } catch (err) {
      console.error("❌ Erreur rejet livre:", err);
      alert("Erreur lors du rejet du livre");
    }
  };

  const handleFeatureBook = async (bookId, featured) => {
    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/admin/books/${bookId}/feature`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ featured }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        showSuccess(data.message || "Livre mis à jour avec succès");
      } else {
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("❌ Erreur mise en avant livre:", err);
      alert("Erreur lors de la mise à jour du livre");
    }
  };

  const handleEditBook = async (bookId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBookToEdit(data.book);
        setEditFormData({
          titre: data.book.titre || '',
          description: data.book.description || '',
          genre: data.book.genre || '',
          isbn: data.book.isbn || '',
          statut: data.book.statut || 'brouillon'
        });
        setShowEditModal(true);
      } else {
        alert(data.error || 'Erreur lors du chargement du livre');
      }
    } catch (err) {
      console.error('❌ Erreur chargement livre:', err);
      alert('Erreur lors du chargement du livre');
    }
  };

  const handleSaveEdit = async () => {
    if (!bookToEdit) return;

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/books/${bookToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        setShowEditModal(false);
        setBookToEdit(null);
        showSuccess('Livre modifié avec succès');
      } else {
        alert(data.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error('❌ Erreur modification livre:', err);
      alert('Erreur lors de la modification');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce livre ? Cette action est irréversible.')) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        showSuccess('Livre supprimé avec succès');
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('❌ Erreur suppression livre:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUnpublishBook = async (bookId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir dépublier ce livre ? Il ne sera plus visible par les utilisateurs.')) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      // Mettre à jour le statut en brouillon
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          ...editFormData,
          statut: 'brouillon'
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        showSuccess('Livre dépublié avec succès');
      } else {
        alert(data.error || 'Erreur lors du dépublication');
      }
    } catch (err) {
      console.error('❌ Erreur dépublication livre:', err);
      alert('Erreur lors du dépublication');
    }
  };

  const handleArchiveBook = async (bookId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir archiver ce livre ?')) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          ...editFormData,
          statut: 'archivé'
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        showSuccess('Livre archivé avec succès');
      } else {
        alert(data.error || 'Erreur lors de l\'archivage');
      }
    } catch (err) {
      console.error('❌ Erreur archivage livre:', err);
      alert('Erreur lors de l\'archivage');
    }
  };

  const handleRequestChanges = async (bookId) => {
    const changes = prompt('Quelles modifications sont nécessaires ? (Décrivez en détail)');
    
    if (!changes || changes.trim().length < 10) {
      alert('Veuillez fournir une description détaillée des modifications nécessaires');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      // Créer une notification pour l'auteur
      const response = await fetch(`http://localhost:5000/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: bookToEdit?.auteur_id,
          titre: "📝 Modifications requises",
          message: `Votre livre nécessite des modifications : ${changes}`,
          type: 'book',
          lien: `/books/${bookId}/edit`
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBooks();
        showSuccess('Demande de modifications envoyée à l\'auteur');
      } else {
        alert(data.error || 'Erreur lors de la demande');
      }
    } catch (err) {
      console.error('❌ Erreur demande modifications:', err);
      alert('Erreur lors de la demande de modifications');
    }
  };

  // ==================== FONCTIONS DE SÉLECTION ====================

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(filteredBooks.map(book => book.id));
    }
    setSelectAll(!selectAll);
    setShowBulkActions(!selectAll);
  };

  const handleBulkAction = async (action) => {
    if (selectedBooks.length === 0) {
      alert('Veuillez sélectionner au moins un livre');
      return;
    }

    const confirmMessage = {
      approve: `Êtes-vous sûr de vouloir approuver ${selectedBooks.length} livre(s) ?`,
      reject: `Êtes-vous sûr de vouloir rejeter ${selectedBooks.length} livre(s) ?`,
      delete: `Êtes-vous sûr de vouloir supprimer définitivement ${selectedBooks.length} livre(s) ?`,
      archive: `Êtes-vous sûr de vouloir archiver ${selectedBooks.length} livre(s) ?`
    }[action];

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      for (const bookId of selectedBooks) {
        if (action === 'approve') {
          await handleApproveBook(bookId);
        } else if (action === 'delete') {
          await handleDeleteBook(bookId);
        } else if (action === 'archive') {
          await handleArchiveBook(bookId);
        }
      }
      
      setSelectedBooks([]);
      setSelectAll(false);
      setShowBulkActions(false);
      showSuccess(`${selectedBooks.length} livre(s) ${action === 'approve' ? 'approuvé(s)' : action === 'delete' ? 'supprimé(s)' : 'archivé(s)'} avec succès`);
    } catch (err) {
      console.error(`❌ Erreur action groupée ${action}:`, err);
      alert(`Erreur lors de l'action ${action}`);
    }
  };

  const toggleRowExpand = (bookId) => {
    if (expandedRows.includes(bookId)) {
      setExpandedRows(expandedRows.filter(id => id !== bookId));
    } else {
      setExpandedRows([...expandedRows, bookId]);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "publié":
        return "bg-green-100 text-green-800 border border-green-200";
      case "brouillon":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "rejeté":
        return "bg-red-100 text-red-800 border border-red-200";
      case "archivé":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "publié":
        return "Publié";
      case "brouillon":
        return "En attente";
      case "rejeté":
        return "Rejeté";
      case "archivé":
        return "Archivé";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des livres...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <FiCheck className="text-green-600" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiBook className="text-blue-600" />
                Modération des Livres
              </h1>
              <p className="text-gray-600 mt-2">
                Approuvez, rejetez ou mettez en avant les livres soumis par les auteurs
              </p>
            </div>
            <button
              onClick={fetchBooks}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Livres</p>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              </div>
              <FiBook className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {books.filter((b) => b.statut === "brouillon").length}
                </p>
              </div>
              <FiAlertTriangle className="text-yellow-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-green-600">
                  {books.filter((b) => b.statut === "publié").length}
                </p>
              </div>
              <FiCheck className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">
                  {books.filter((b) => b.statut === "rejeté").length}
                </p>
              </div>
              <FiX className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && selectedBooks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium text-blue-800">
                  {selectedBooks.length} livre(s) sélectionné(s)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <FiCheck size={16} />
                    Approuver
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <FiX size={16} />
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <FiArchive size={16} />
                    Archiver
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-sm flex items-center gap-2"
                  >
                    <FiTrash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedBooks([]);
                  setSelectAll(false);
                  setShowBulkActions(false);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  onClick={fetchBooks}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un livre, auteur ou genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">En attente (Brouillons)</option>
                <option value="published">Publiés</option>
                <option value="rejected">Rejetés</option>
                <option value="archived">Archivés</option>
                <option value="all">Tous les statuts</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredBooks.length} livre(s) trouvé(s) sur {books.length} au total
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    {/* Espace pour l'icône d'expansion */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <>
                    <motion.tr
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={() => handleSelectBook(book.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRowExpand(book.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedRows.includes(book.id) ? (
                            <FiChevronUp size={16} />
                          ) : (
                            <FiChevronDown size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {book.couverture_url ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={book.couverture_url}
                                alt={book.titre}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center ${
                                book.couverture_url ? "hidden" : ""
                              }`}
                            >
                              <FiBook className="text-gray-400 text-xl" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {book.titre || "Sans titre"}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {book.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {book.auteur_nom || "Auteur inconnu"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {book.auteur_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {book.genre || "Non spécifié"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                            book.statut
                          )}`}
                        >
                          {getStatusLabel(book.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {book.created_at
                            ? new Date(book.created_at).toLocaleDateString("fr-FR")
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {/* Voir détails */}
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Voir détails"
                          >
                            <FiEye size={18} />
                          </button>

                          {/* Modifier */}
                          <button
                            onClick={() => handleEditBook(book.id)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit size={18} />
                          </button>

                          {/* Actions conditionnelles par statut */}
                          {book.statut === "brouillon" && (
                            <>
                              {/* Approuver */}
                              <button
                                onClick={() => handleApproveBook(book.id)}
                                className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                title="Approuver"
                              >
                                <FiCheck size={18} />
                              </button>
                              
                              {/* Rejeter */}
                              <button
                                onClick={() => {
                                  setBookToReject(book);
                                  setShowRejectModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Rejeter"
                              >
                                <FiX size={18} />
                              </button>
                              
                              {/* Demander modifications */}
                              <button
                                onClick={() => handleRequestChanges(book.id)}
                                className="text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                                title="Demander modifications"
                              >
                                <FiMessageSquare size={18} />
                              </button>
                            </>
                          )}

                          {book.statut === "publié" && (
                            <>
                              {/* Mettre en avant/Retirer */}
                              <button
                                onClick={() => handleFeatureBook(book.id, !book.featured)}
                                className={`p-2 rounded-lg transition-colors ${
                                  book.featured
                                    ? "text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50"
                                    : "text-purple-600 hover:text-purple-900 hover:bg-purple-50"
                                }`}
                                title={book.featured ? "Retirer des recommandations" : "Mettre en avant"}
                              >
                                <FiStar size={18} />
                              </button>
                              
                              {/* Dépublier */}
                              <button
                                onClick={() => handleUnpublishBook(book.id)}
                                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Dépublier"
                              >
                                <FiEyeOff size={18} />
                              </button>
                            </>
                          )}

                          {/* Archiver */}
                          <button
                            onClick={() => handleArchiveBook(book.id)}
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Archiver"
                          >
                            <FiArchive size={18} />
                          </button>

                          {/* Supprimer */}
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 size={18} />
                          </button>

                          {/* Menu déroulant pour plus d'options */}
                          <div className="relative">
                            <button
                              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Plus d'options"
                            >
                              <FiMoreVertical size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Ligne détaillée */}
                    {expandedRows.includes(book.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">Description :</p>
                              <p className="text-gray-600 mt-1">{book.description || "Aucune description"}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">ISBN :</p>
                              <p className="text-gray-600 mt-1">{book.isbn || "Non spécifié"}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Dernière modification :</p>
                              <p className="text-gray-600 mt-1">
                                {book.updated_at
                                  ? new Date(book.updated_at).toLocaleString("fr-FR")
                                  : "Jamais modifié"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <FiBook className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun livre trouvé</p>
              {(searchTerm || statusFilter !== "pending") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("pending");
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
        </div>

        {/* Book Detail Modal */}
        {showDetailModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedBook.titre}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {selectedBook.couverture_url && (
                    <img
                      src={selectedBook.couverture_url}
                      alt={selectedBook.titre}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Auteur
                      </label>
                      <p className="text-gray-900">{selectedBook.auteur_nom}</p>
                      <p className="text-sm text-gray-600">
                        {selectedBook.auteur_email}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Genre
                      </label>
                      <p className="text-gray-900">
                        {selectedBook.genre || "Non spécifié"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        ISBN
                      </label>
                      <p className="text-gray-900">
                        {selectedBook.isbn || "Non spécifié"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Statut
                      </label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          selectedBook.statut
                        )}`}
                      >
                        {getStatusLabel(selectedBook.statut)}
                      </span>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Date de création
                      </label>
                      <p className="text-gray-900">
                        {new Date(selectedBook.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedBook.description || "Aucune description"}
                    </div>
                  </div>

                  {selectedBook.rejection_reason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <label className="text-sm font-medium text-red-700">
                        Motif du rejet
                      </label>
                      <p className="text-red-700 mt-1">
                        {selectedBook.rejection_reason}
                      </p>
                    </div>
                  )}

                  {selectedBook.featured && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <label className="text-sm font-medium text-yellow-700">
                        ⭐ Mise en avant
                      </label>
                      <p className="text-yellow-700 mt-1">
                        Ce livre est actuellement mis en avant sur la page d'accueil
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                {selectedBook.statut === "brouillon" && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveBook(selectedBook.id);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiCheck className="inline mr-2" />
                      Approuver
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setBookToReject(selectedBook);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FiX className="inline mr-2" />
                      Rejeter
                    </button>
                  </>
                )}

                {selectedBook.statut === "publié" && (
                  <>
                    <button
                      onClick={() => {
                        handleFeatureBook(selectedBook.id, !selectedBook.featured);
                        setShowDetailModal(false);
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        selectedBook.featured
                          ? "bg-gray-600 text-white hover:bg-gray-700"
                          : "bg-yellow-600 text-white hover:bg-yellow-700"
                      }`}
                    >
                      <FiStar />
                      {selectedBook.featured
                        ? "Retirer des recommandations"
                        : "Mettre en avant"}
                    </button>
                    <button
                      onClick={() => {
                        handleUnpublishBook(selectedBook.id);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiEyeOff />
                      Dépublier
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    handleEditBook(selectedBook.id);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiEdit />
                  Modifier
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && bookToReject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-red-600">
                Rejeter le livre
              </h2>
              <p className="text-gray-600 mb-4">
                Vous êtes sur le point de rejeter le livre :<br />
                <strong>"{bookToReject.titre}"</strong> par{" "}
                {bookToReject.auteur_nom}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif du rejet *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Expliquez pourquoi ce livre est rejeté (minimum 10 caractères)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {rejectReason.length}/10 caractères minimum
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleRejectBook(bookToReject.id)}
                  disabled={rejectReason.trim().length < 10}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Confirmer le rejet
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setBookToReject(null);
                    setRejectReason("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && bookToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                Modifier le livre
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={editFormData.titre}
                    onChange={(e) => setEditFormData({...editFormData, titre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={editFormData.genre}
                    onChange={(e) => setEditFormData({...editFormData, genre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={editFormData.isbn}
                    onChange={(e) => setEditFormData({...editFormData, isbn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={editFormData.statut}
                    onChange={(e) => setEditFormData({...editFormData, statut: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="publié">Publié</option>
                    <option value="rejeté">Rejeté</option>
                    <option value="archivé">Archivé</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setBookToEdit(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}