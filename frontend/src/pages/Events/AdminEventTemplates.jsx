import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiFileText,
  FiUsers,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

export default function AdminEventTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'conference',
    default_duration: 120,
    default_capacity: 50,
    default_location: '',
    default_description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vakio_token');
      const response = await fetch('http://localhost:5000/api/events/admin/templates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setTemplates(data.templates || []);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des modèles");
      console.error("❌ Erreur chargement modèles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('vakio_token');
      const url = editingTemplate
        ? `http://localhost:5000/api/events/admin/templates/${editingTemplate.id}`
        : 'http://localhost:5000/api/events/admin/templates';

      const method = editingTemplate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTemplates();
        setShowCreateModal(false);
        setEditingTemplate(null);
        resetForm();
        alert(editingTemplate ? 'Modèle modifié avec succès' : 'Modèle créé avec succès');
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      default_duration: template.default_duration,
      default_capacity: template.default_capacity,
      default_location: template.default_location || '',
      default_description: template.default_description || '',
      is_active: template.is_active,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`http://localhost:5000/api/events/admin/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchTemplates();
        alert('Modèle supprimé avec succès');
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDuplicate = async (template) => {
    const duplicatedData = {
      ...template,
      name: `${template.name} (Copie)`,
      id: undefined,
    };

    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch('http://localhost:5000/api/events/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(duplicatedData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTemplates();
        alert('Modèle dupliqué avec succès');
      } else {
        alert(data.error || 'Erreur lors de la duplication');
      }
    } catch (err) {
      console.error('❌ Erreur duplication:', err);
      alert('Erreur lors de la duplication');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'conference',
      default_duration: 120,
      default_capacity: 50,
      default_location: '',
      default_description: '',
      is_active: true,
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'conference':
        return <FiUsers className="text-blue-600" />;
      case 'workshop':
        return <FiFileText className="text-green-600" />;
      case 'networking':
        return <FiUsers className="text-purple-600" />;
      case 'webinar':
        return <FiMapPin className="text-orange-600" />;
      default:
        return <FiCalendar className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'conference':
        return 'Conférence';
      case 'workshop':
        return 'Atelier';
      case 'networking':
        return 'Networking';
      case 'webinar':
        return 'Webinaire';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des modèles...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiFileText className="text-indigo-600" />
            Modèles d'Événements
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les modèles d'événements pour faciliter la création
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Modèles</p>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              </div>
              <FiFileText className="text-indigo-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Modèles Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {templates.filter(t => t.is_active).length}
                </p>
              </div>
              <FiClock className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Types Différents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(templates.map(t => t.type)).size}
                </p>
              </div>
              <FiUsers className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setEditingTemplate(null);
              setShowCreateModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FiPlus />
            Nouveau Modèle
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(template.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{getTypeLabel(template.type)}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  template.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.is_active ? 'Actif' : 'Inactif'}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {template.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiClock className="w-4 h-4" />
                  <span>{template.default_duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiUsers className="w-4 h-4" />
                  <span>{template.default_capacity} participants max</span>
                </div>
                {template.default_location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="w-4 h-4" />
                    <span>{template.default_location}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(template)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                >
                  <FiEdit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDuplicate(template)}
                  className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                >
                  <FiCopy className="w-4 h-4" />
                  Dupliquer
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun modèle d'événement trouvé</p>
            <button
              onClick={() => {
                resetForm();
                setEditingTemplate(null);
                setShowCreateModal(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <FiPlus />
              Créer le premier modèle
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du modèle *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'événement *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="conference">Conférence</option>
                    <option value="workshop">Atelier</option>
                    <option value="networking">Networking</option>
                    <option value="webinar">Webinaire</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée (min) *
                    </label>
                    <input
                      type="number"
                      value={formData.default_duration}
                      onChange={(e) => setFormData({ ...formData, default_duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="15"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacité max *
                    </label>
                    <input
                      type="number"
                      value={formData.default_capacity}
                      onChange={(e) => setFormData({ ...formData, default_capacity: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu par défaut
                  </label>
                  <input
                    type="text"
                    value={formData.default_location}
                    onChange={(e) => setFormData({ ...formData, default_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Salle de conférence, En ligne, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description par défaut
                  </label>
                  <textarea
                    value={formData.default_description}
                    onChange={(e) => setFormData({ ...formData, default_description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Description qui sera pré-remplie lors de la création d'un événement"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Modèle actif
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingTemplate ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingTemplate(null);
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

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={fetchTemplates}
              className="ml-4 underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}