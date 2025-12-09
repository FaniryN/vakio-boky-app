import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiDownload,
  FiSave,
  FiX,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    genre_prefere: '',
    bio: ''
  });
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const fetchUsers = async () => {
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

      const response = await fetch('http://localhost:5000/api/admin/users', {
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
        setUsers(data.users || []);
        showSuccess("Liste des utilisateurs actualisée");
      } else {
        setError(data.error || "Erreur lors du chargement des utilisateurs");
      }
    } catch (err) {
      console.error("❌ Erreur chargement utilisateurs:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && user.role !== 'blocked') ||
                         (statusFilter === 'inactive' && user.role === 'blocked');
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(`role-${userId}`);
      
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/promote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newRole }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
        showSuccess(data.message || "Rôle modifié avec succès");
      } else {
        alert(data.error || 'Erreur lors de la mise à jour du rôle');
      }
    } catch (err) {
      console.error('❌ Erreur mise à jour rôle:', err);
      alert('Erreur lors de la mise à jour du rôle');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      setActionLoading(`action-${userId}`);
      
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const actionText = action === 'block' ? 'bloquer' : 'débloquer';
      if (!window.confirm(`Êtes-vous sûr de vouloir ${actionText} cet utilisateur ?`)) {
        setActionLoading(null);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
        showSuccess(data.message || `Utilisateur ${actionText} avec succès`);
      } else {
        alert(data.error || 'Erreur lors de l\'action');
      }
    } catch (err) {
      console.error('❌ Erreur action utilisateur:', err);
      alert('Erreur lors de l\'action sur l\'utilisateur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      nom: user.nom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      genre_prefere: user.genre_prefere || '',
      bio: user.bio || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.nom || !editForm.email) {
      alert("Le nom et l'email sont obligatoires");
      return;
    }

    try {
      setActionLoading('edit');
      
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
        setEditingUser(null);
        showSuccess(data.message || "Utilisateur modifié avec succès");
      } else {
        alert(data.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error('❌ Erreur modification utilisateur:', err);
      alert('Erreur lors de la modification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${user.nom}" ?\n\nCette action est irréversible !`)) {
      return;
    }

    try {
      setActionLoading(`delete-${userId}`);
      
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
        showSuccess(data.message || "Utilisateur supprimé avec succès");
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;

    const actionText = action === 'block' ? 'bloquer' : 'débloquer';
    if (!window.confirm(`Êtes-vous sûr de vouloir ${actionText} ${selectedUsers.length} utilisateur(s) ?`)) {
      return;
    }

    try {
      setActionLoading('bulk');
      
      const userData = JSON.parse(localStorage.getItem("vakio_user"));
      const token = userData?.token;

      const promises = selectedUsers.map(userId =>
        fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }).then(response => response.json())
      );

      const results = await Promise.all(promises);
      const failed = results.filter(result => !result.success);
      
      if (failed.length === 0) {
        await fetchUsers();
        setSelectedUsers([]);
        showSuccess(`${selectedUsers.length} utilisateur(s) ${actionText}(s) avec succès`);
      } else {
        alert(`${failed.length} action(s) ont échoué`);
      }
    } catch (err) {
      console.error('❌ Erreur action groupée:', err);
      alert('Erreur lors de l\'action groupée');
    } finally {
      setActionLoading(null);
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Nom', 'Email', 'Rôle', 'Téléphone', 'Genre préféré', 'Date d\'inscription', 'Statut'],
      ...filteredUsers.map(user => [
        `"${user.nom || ''}"`,
        `"${user.email || ''}"`,
        `"${getRoleLabel(user.role)}"`,
        `"${user.telephone || ''}"`,
        `"${user.genre_prefere || ''}"`,
        user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A',
        user.role === 'blocked' ? 'Bloqué' : 'Actif'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs_vakio_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showSuccess("Export CSV terminé");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border border-red-200';
      case 'editeur': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'auteur': return 'bg-green-100 text-green-800 border border-green-200';
      case 'blocked': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-purple-100 text-purple-800 border border-purple-200';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'editeur': return 'Éditeur';
      case 'auteur': return 'Auteur';
      case 'blocked': return 'Bloqué';
      default: return 'Lecteur';
    }
  };

  const isActionLoading = (type) => actionLoading === type;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des utilisateurs...
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
                <FiUsers className="text-blue-600" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les comptes utilisateurs, rôles et permissions
              </p>
            </div>
            <button
              onClick={fetchUsers}
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
                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <FiUsers className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role !== 'blocked').length}
                </p>
              </div>
              <FiUserCheck className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Bloqués</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'blocked').length}
                </p>
              </div>
              <FiUserX className="text-red-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <FiShield className="text-purple-600 text-2xl" />
            </div>
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
                  onClick={fetchUsers}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="editeur">Éditeur</option>
                <option value="auteur">Auteur</option>
                <option value="lecteur">Lecteur</option>
                <option value="blocked">Bloqué</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Bloqué</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportUsers}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiDownload />
                Exporter CSV
              </button>

              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('block')}
                    disabled={isActionLoading('bulk')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isActionLoading('bulk') ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : null}
                    Bloquer ({selectedUsers.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('unblock')}
                    disabled={isActionLoading('bulk')}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                  >
                    {isActionLoading('bulk') ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : null}
                    Débloquer ({selectedUsers.length})
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredUsers.length} utilisateur(s) trouvé(s) sur {users.length} au total
            {selectedUsers.length > 0 && ` | ${selectedUsers.length} sélectionné(s)`}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={user.role === 'admin'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.photo_profil ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.photo_profil}
                              alt={user.nom}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center ${user.photo_profil ? 'hidden' : ''}`}>
                            <span className="text-gray-600 font-medium">
                              {user.nom?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nom || 'Nom non renseigné'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.genre_prefere || 'Genre non spécifié'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <FiMail className="text-gray-400" />
                        {user.email}
                      </div>
                      {user.telephone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FiPhone className="text-gray-400" />
                          {user.telephone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.role === 'admin' || isActionLoading(`role-${user.id}`)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="lecteur">Lecteur</option>
                        <option value="auteur">Auteur</option>
                        <option value="editeur">Éditeur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={isActionLoading('edit')}
                          className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50"
                          title="Modifier"
                        >
                          <FiEdit size={16} />
                        </button>
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleUserAction(user.id, user.role === 'blocked' ? 'unblock' : 'block')}
                              disabled={isActionLoading(`action-${user.id}`)}
                              className={`p-1 disabled:opacity-50 ${
                                user.role === 'blocked' 
                                  ? 'text-green-600 hover:text-green-900' 
                                  : 'text-red-600 hover:text-red-900'
                              }`}
                              title={user.role === 'blocked' ? 'Débloquer' : 'Bloquer'}
                            >
                              {isActionLoading(`action-${user.id}`) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : (
                                <FiUserX size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={isActionLoading(`delete-${user.id}`)}
                              className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                              title="Supprimer"
                            >
                              {isActionLoading(`delete-${user.id}`) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <FiUsers className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Réinitialiser les filtres
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">Modifier l'utilisateur</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={editForm.nom}
                    onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={editForm.telephone}
                    onChange={(e) => setEditForm({...editForm, telephone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre préféré
                  </label>
                  <input
                    type="text"
                    value={editForm.genre_prefere}
                    onChange={(e) => setEditForm({...editForm, genre_prefere: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  disabled={isActionLoading('edit')}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isActionLoading('edit') ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiSave size={16} />
                  )}
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  disabled={isActionLoading('edit')}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiX size={16} />
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