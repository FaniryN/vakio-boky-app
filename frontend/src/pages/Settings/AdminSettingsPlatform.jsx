import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiGlobe,
  FiUsers,
  FiShield,
  FiMail,
  FiDatabase,
  FiSave,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminSettingsPlatform() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  // Fonction pour nettoyer tous les tokens
  const clearAllTokens = () => {
    localStorage.removeItem('vakio_token');
    localStorage.removeItem('vakio_user');
    localStorage.removeItem('user');
    sessionStorage.removeItem('vakio_token');
    sessionStorage.removeItem('vakio_user');
  };

  // Fonction pour vérifier et gérer les erreurs 401
  const handleUnauthorized = (response) => {
    if (response.status === 401) {
      clearAllTokens();
      navigate('/login', { 
        state: { 
          message: 'Votre session a expiré. Veuillez vous reconnecter.',
          type: 'error'
        }
      });
      return true;
    }
    return false;
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vakio_token");
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/admin/settings/platform",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Vérifier l'erreur 401
      if (handleUnauthorized(response)) {
        setError("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings || {});
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des paramètres");
      console.error("❌ Erreur chargement paramètres:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("vakio_token");
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/admin/settings/platform",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ settings }),
        }
      );

      // Vérifier l'erreur 401
      if (handleUnauthorized(response)) {
        setError("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess("Paramètres sauvegardés avec succès");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error("❌ Erreur sauvegarde paramètres:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const tabs = [
    {
      id: "general",
      label: "Général",
      icon: <FiSettings className="w-5 h-5" />,
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: <FiUsers className="w-5 h-5" />,
    },
    { id: "content", label: "Contenu", icon: <FiGlobe className="w-5 h-5" /> },
    {
      id: "security",
      label: "Sécurité",
      icon: <FiShield className="w-5 h-5" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiMail className="w-5 h-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des paramètres...
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
            <FiSettings className="text-blue-600" />
            Paramètres de la Plateforme
          </h1>
          <p className="text-gray-600 mt-2">
            Configurez les paramètres généraux de votre plateforme Vakio Boky
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <FiCheckCircle className="w-5 h-5" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <FiAlertTriangle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tabs.find((tab) => tab.id === activeTab)?.label}
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={fetchSettings}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Actualiser
                    </button>
                    <button
                      onClick={saveSettings}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FiSave className="w-4 h-4" />
                      )}
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom de la plateforme
                        </label>
                        <input
                          type="text"
                          value={settings.platform_name || ""}
                          onChange={(e) =>
                            updateSetting("platform_name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Vakio Boky"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Version de la plateforme
                        </label>
                        <input
                          type="text"
                          value={settings.platform_version || ""}
                          onChange={(e) =>
                            updateSetting("platform_version", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1.0.0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description de la plateforme
                      </label>
                      <textarea
                        value={settings.platform_description || ""}
                        onChange={(e) =>
                          updateSetting("platform_description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Plateforme littéraire collaborative..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Langue par défaut
                        </label>
                        <select
                          value={settings.default_language || "fr"}
                          onChange={(e) =>
                            updateSetting("default_language", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="mg">Malagasy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fuseau horaire
                        </label>
                        <select
                          value={settings.timezone || "Indian/Antananarivo"}
                          onChange={(e) =>
                            updateSetting("timezone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Indian/Antananarivo">
                            Madagascar (UTC+3)
                          </option>
                          <option value="Europe/Paris">Paris (UTC+1)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="maintenance_mode"
                        checked={settings.maintenance_mode || false}
                        onChange={(e) =>
                          updateSetting("maintenance_mode", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="maintenance_mode"
                        className="text-sm font-medium text-gray-700"
                      >
                        Mode maintenance activé
                      </label>
                    </div>
                  </div>
                )}

                {/* User Settings */}
                {activeTab === "users" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Inscription ouverte
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="registration_open"
                            checked={settings.registration_open !== false}
                            onChange={(e) =>
                              updateSetting(
                                "registration_open",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="registration_open"
                            className="text-sm text-gray-600"
                          >
                            Permettre les nouvelles inscriptions
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vérification email requise
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="email_verification_required"
                            checked={
                              settings.email_verification_required !== false
                            }
                            onChange={(e) =>
                              updateSetting(
                                "email_verification_required",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="email_verification_required"
                            className="text-sm text-gray-600"
                          >
                            Exiger la vérification des emails
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Limite de publications par jour
                        </label>
                        <input
                          type="number"
                          value={settings.daily_post_limit || 10}
                          onChange={(e) =>
                            updateSetting(
                              "daily_post_limit",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Limite de commentaires par heure
                        </label>
                        <input
                          type="number"
                          value={settings.hourly_comment_limit || 20}
                          onChange={(e) =>
                            updateSetting(
                              "hourly_comment_limit",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôles utilisateur par défaut
                      </label>
                      <select
                        value={settings.default_user_role || "user"}
                        onChange={(e) =>
                          updateSetting("default_user_role", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="author">Auteur</option>
                        <option value="moderator">Modérateur</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Content Settings */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Modération automatique activée
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="auto_moderation"
                            checked={settings.auto_moderation !== false}
                            onChange={(e) =>
                              updateSetting("auto_moderation", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="auto_moderation"
                            className="text-sm text-gray-600"
                          >
                            Activer la modération automatique
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approbation requise pour les publications
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="content_approval_required"
                            checked={
                              settings.content_approval_required || false
                            }
                            onChange={(e) =>
                              updateSetting(
                                "content_approval_required",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="content_approval_required"
                            className="text-sm text-gray-600"
                          >
                            Nécessiter l'approbation des publications
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Taille maximale des fichiers (MB)
                        </label>
                        <input
                          type="number"
                          value={settings.max_file_size || 10}
                          onChange={(e) =>
                            updateSetting(
                              "max_file_size",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Formats de fichiers autorisés
                        </label>
                        <input
                          type="text"
                          value={
                            settings.allowed_file_types ||
                            "jpg,jpeg,png,pdf,doc,docx"
                          }
                          onChange={(e) =>
                            updateSetting("allowed_file_types", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="jpg,jpeg,png,pdf"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mots-clés interdits (séparés par des virgules)
                      </label>
                      <textarea
                        value={settings.forbidden_keywords || ""}
                        onChange={(e) =>
                          updateSetting("forbidden_keywords", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="mot1,mot2,mot3"
                      />
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tentatives de connexion max
                        </label>
                        <input
                          type="number"
                          value={settings.max_login_attempts || 5}
                          onChange={(e) =>
                            updateSetting(
                              "max_login_attempts",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="3"
                          max="20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée du blocage (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.lockout_duration || 30}
                          onChange={(e) =>
                            updateSetting(
                              "lockout_duration",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="5"
                          max="1440"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Forcer le changement de mot de passe
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="force_password_change"
                            checked={settings.force_password_change || false}
                            onChange={(e) =>
                              updateSetting(
                                "force_password_change",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="force_password_change"
                            className="text-sm text-gray-600"
                          >
                            Obliger le changement périodique
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée de validité des mots de passe (jours)
                        </label>
                        <input
                          type="number"
                          value={settings.password_validity_days || 90}
                          onChange={(e) =>
                            updateSetting(
                              "password_validity_days",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="30"
                          max="365"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Politiques de sécurité
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="two_factor_required"
                            checked={settings.two_factor_required || false}
                            onChange={(e) =>
                              updateSetting(
                                "two_factor_required",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="two_factor_required"
                            className="text-sm text-gray-600"
                          >
                            Authentification à deux facteurs obligatoire pour
                            les admins
                          </label>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="session_timeout"
                            checked={settings.session_timeout !== false}
                            onChange={(e) =>
                              updateSetting("session_timeout", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="session_timeout"
                            className="text-sm text-gray-600"
                          >
                            Déconnexion automatique après inactivité
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notifications par email activées
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="email_notifications_enabled"
                            checked={
                              settings.email_notifications_enabled !== false
                            }
                            onChange={(e) =>
                              updateSetting(
                                "email_notifications_enabled",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="email_notifications_enabled"
                            className="text-sm text-gray-600"
                          >
                            Activer les notifications par email
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notifications push activées
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="push_notifications_enabled"
                            checked={
                              settings.push_notifications_enabled !== false
                            }
                            onChange={(e) =>
                              updateSetting(
                                "push_notifications_enabled",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="push_notifications_enabled"
                            className="text-sm text-gray-600"
                          >
                            Activer les notifications push
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Types de notifications
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            key: "new_user_registration",
                            label: "Nouvelles inscriptions",
                          },
                          {
                            key: "new_content_published",
                            label: "Nouveau contenu publié",
                          },
                          { key: "content_reported", label: "Contenu signalé" },
                          { key: "user_banned", label: "Utilisateur banni" },
                          { key: "system_alerts", label: "Alertes système" },
                          {
                            key: "weekly_reports",
                            label: "Rapports hebdomadaires",
                          },
                        ].map((notification) => (
                          <div
                            key={notification.key}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="checkbox"
                              id={notification.key}
                              checked={settings[notification.key] !== false}
                              onChange={(e) =>
                                updateSetting(
                                  notification.key,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor={notification.key}
                              className="text-sm text-gray-600"
                            >
                              {notification.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email expéditeur par défaut
                        </label>
                        <input
                          type="email"
                          value={settings.default_sender_email || ""}
                          onChange={(e) =>
                            updateSetting(
                              "default_sender_email",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="noreply@vakioboky.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom expéditeur par défaut
                        </label>
                        <input
                          type="text"
                          value={settings.default_sender_name || ""}
                          onChange={(e) =>
                            updateSetting("default_sender_name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Vakio Boky"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}