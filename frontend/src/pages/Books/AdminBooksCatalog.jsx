import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiFolder,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiGrid,
  FiList,
  FiStar,
  FiBook,
  FiTag,
  FiLayers,
  FiRefreshCw,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";

export default function AdminBooksCatalog() {
  const [genres, setGenres] = useState([]);
  const [collections, setCollections] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('genres');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'genre',
    is_active: true,
  });

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const fetchCatalogData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      if (!token) {
        setError("Token d'authentification manquant - Veuillez vous reconnecter");
        setLoading(false);
        return;
      }

      // Pour les genres - CORRECTION
const genresResponse = await fetch('https://vakio-boky-backend.onrender.com/api/admin/books/genres', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
      const genresData = await genresResponse.json();

// Ligne ~45 :
const collectionsResponse = await fetch('https://vakio-boky-backend.onrender.com/api/admin/books/collections', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
      const collectionsData = await collectionsResponse.json();

      // Fetch featured books
     const featuredResponse = await fetch('https://vakio-boky-backend.onrender.com/api/admin/books/featured', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
      const featuredData = await featuredResponse.json();

      if (genresData.success) setGenres(genresData.genres || []);
      if (collectionsData.success) setCollections(collectionsData.collections || []);
      if (featuredData.success) setFeaturedBooks(featuredData.books || []);

    } catch (err) {
      console.error("❌ Erreur chargement catalogue:", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      if (!token) {
        alert("Session expirée - Veuillez vous reconnecter");
        return;
      }

      let endpoint, method, url;

      // if (formData.type === 'genre') {
      //   if (editingItem) {
      //     // Pour les genres, on utilise PUT avec body
      //     endpoint = 'genres/update';
      //     method = 'PUT';
      //     url = `https://vakio-boky-backend.onrender.com/api/books/admin/${endpoint}`;
      //   } else {
      //     endpoint = 'genres';
      //     method = 'POST';
      //     url = `https://vakio-boky-backend.onrender.com/api/books/admin/${endpoint}`;
      //   }
      // } else {
      //   endpoint = 'collections';
      //   if (editingItem) {
      //     method = 'PUT';
      //     url = `https://vakio-boky-backend.onrender.com/api/books/admin/${endpoint}/${editingItem.id}`;
      //   } else {
      //     method = 'POST';
      //     url = `https://vakio-boky-backend.onrender.com/api/books/admin/${endpoint}`;
      //   }
      // }
// Dans handleSubmit, simplifiez :

if (formData.type === 'genre') {
  if (editingItem) {
    url = `https://vakio-boky-backend.onrender.com/api/admin/books/genres/update`;
    method = 'PUT';
  } else {
    url = `https://vakio-boky-backend.onrender.com/api/admin/books/genres`;
    method = 'POST';
  }
} else {
  if (editingItem) {
    url = `https://vakio-boky-backend.onrender.com/api/admin/books/collections/${editingItem.id}`;
    method = 'PUT';
  } else {
    url = `https://vakio-boky-backend.onrender.com/api/admin/books/collections`;
    method = 'POST';
  }
}
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData.type === 'genre' && editingItem 
          ? { oldName: editingItem.name, newName: formData.name }
          : formData
        ),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCatalogData();
        setShowCreateModal(false);
        setEditingItem(null);
        resetForm();
        showSuccess(`${formData.type === 'genre' ? 'Genre' : 'Collection'} ${editingItem ? 'modifié' : 'créé'} avec succès`);
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      type: type,
      is_active: item.is_active !== undefined ? item.is_active : true,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (itemId, type) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ce ${type === 'genre' ? 'genre' : 'collection'} ?`)) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      let endpoint, url, method;

      if (type === 'genre') {
  endpoint = 'genres/delete';
  method = 'DELETE';
  url = `https://vakio-boky-backend.onrender.com/api/admin/books/${endpoint}`;
} else {
  endpoint = 'collections';
  method = 'DELETE';
  url = `https://vakio-boky-backend.onrender.com/api/admin/books/${endpoint}/${itemId}`;
}

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: type === 'genre' ? JSON.stringify({ genreName: genres.find(g => g.name === itemId)?.name }) : undefined,
      });

      const data = await response.json();

      if (data.success) {
        await fetchCatalogData();
        showSuccess(`${type === 'genre' ? 'Genre' : 'Collection'} supprimé avec succès`);
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleFeatureBook = async (bookId, featured) => {
    try {
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/books/${bookId}/feature`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ featured }),
});

      const data = await response.json();

      if (data.success) {
        await fetchCatalogData();
        showSuccess(featured ? 'Livre ajouté aux recommandations' : 'Livre retiré des recommandations');
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('❌ Erreur mise en avant livre:', err);
      alert('Erreur lors de la mise à jour du livre');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'genre',
      is_active: true,
    });
  };

  const tabs = [
    { id: 'genres', label: 'Genres', icon: FiTag, count: genres.length },
    { id: 'collections', label: 'Collections', icon: FiLayers, count: collections.length },
    { id: 'featured', label: 'Recommandations', icon: FiStar, count: featuredBooks.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement du catalogue...
            </span>
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
                <FiFolder className="text-green-600" />
                Gestion du Catalogue
              </h1>
              <p className="text-gray-600 mt-2">
                Organisez les genres, collections et recommandations de livres
              </p>
            </div>
            <button
              onClick={fetchCatalogData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  onClick={fetchCatalogData}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Genres</p>
                <p className="text-2xl font-bold text-gray-900">{genres.length}</p>
              </div>
              <FiTag className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collections</p>
                <p className="text-2xl font-bold text-gray-900">{collections.length}</p>
              </div>
              <FiLayers className="text-purple-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recommandations</p>
                <p className="text-2xl font-bold text-gray-900">{featuredBooks.length}</p>
              </div>
              <FiStar className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span className={`ml-1 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              {activeTab !== 'featured' && (
                <button
                  onClick={() => {
                    resetForm();
                    setFormData(prev => ({ ...prev, type: activeTab === 'genres' ? 'genre' : 'collection' }));
                    setEditingItem(null);
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus />
                  Ajouter {activeTab === 'genres' ? 'un genre' : 'une collection'}
                </button>
              )}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'genres' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {genres.map((genre, index) => (
                  <motion.div
                    key={genre.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiTag className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{genre.name}</h3>
                          <p className="text-sm text-gray-600">{genre.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {genre.book_count || 0} livre(s)
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        genre.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {genre.is_active ? 'Actif' : 'Inactif'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(genre, 'genre')}
                        className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiEdit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(genre.name, 'genre')}
                        className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </motion.div>
                ))}

                {genres.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FiTag className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Aucun genre trouvé</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setFormData(prev => ({ ...prev, type: 'genre' }));
                        setEditingItem(null);
                        setShowCreateModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FiPlus />
                      Créer le premier genre
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'collections' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FiLayers className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                          <p className="text-sm text-gray-600">{collection.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {collection.book_count || 0} livre(s)
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        collection.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {collection.is_active ? 'Actif' : 'Inactif'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(collection, 'collection')}
                        className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiEdit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id, 'collection')}
                        className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </motion.div>
                ))}

                {collections.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FiLayers className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Aucune collection trouvée</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setFormData(prev => ({ ...prev, type: 'collection' }));
                        setEditingItem(null);
                        setShowCreateModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FiPlus />
                      Créer la première collection
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'featured' && (
              <div className="space-y-4">
                {featuredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <FiStar className="text-yellow-600" />
                        </div>
                        <div className="flex items-center gap-4">
                          {book.couverture_url && (
                            <img
                              src={book.couverture_url}
                              alt={book.titre}
                              className="w-10 h-14 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{book.titre}</h3>
                            <p className="text-sm text-gray-600">Par {book.auteur_nom}</p>
                            <p className="text-xs text-gray-500">Genre: {book.genre}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFeatureBook(book.id, false)}
                        className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Retirer
                      </button>
                    </div>
                  </motion.div>
                ))}

                {featuredBooks.length === 0 && (
                  <div className="text-center py-12">
                    <FiStar className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun livre en recommandation</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Utilisez la modération pour mettre des livres en avant
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingItem ? `Modifier ${formData.type === 'genre' ? 'le genre' : 'la collection'}` : `Nouveau ${formData.type === 'genre' ? 'genre' : 'collection'}`}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Actif
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingItem ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}