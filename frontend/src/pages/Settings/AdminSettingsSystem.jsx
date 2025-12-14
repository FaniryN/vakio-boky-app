import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiDatabase,
  FiServer,
  FiCreditCard,
  FiCloud,
  FiKey,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiSave,
  FiRefreshCw,
  FiExternalLink,
  FiActivity,
  FiMail,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
import { apiService } from '../../utils/api';

export default function AdminSettingsSystem() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("database");
  const [testResults, setTestResults] = useState({});
  const [stats, setStats] = useState({});

  const findToken = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log('✅ Token système trouvé: auth_token');
      return token;
    }
    
    const vakioUser = localStorage.getItem('vakio_user') || sessionStorage.getItem('vakio_user');
    if (vakioUser) {
      try {
        const parsed = JSON.parse(vakioUser);
        if (parsed?.token) {
          console.log('✅ Token système trouvé: vakio_user.token');
          return parsed.token;
        }
      } catch (e) {
        console.warn('Erreur parsing vakio_user:', e);
      }
    }
    
    console.warn('⚠️ Aucun token système trouvé!');
    return null;
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      
      const token = findToken();
      if (!token) {
        throw new Error('Token admin manquant. Veuillez vous reconnecter.');
      }

      console.log('🔐 Envoi requête système avec token:', token.substring(0, 30) + '...');
      
      const response = await apiService.get('/api/admin/settings/system');
      
      console.log('📊 [SystemSettings] Statut:', response.status);
      
      const data = response.data;

      if (data.success) {
        setConfig(data.config || {});
        setError(null);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("❌ Erreur chargement configuration:", err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Accès refusé. Votre session a peut-être expiré. Veuillez vous reconnecter.");
        
        if (window.location.pathname.includes('/admin')) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } else {
        setError(err.message || "Erreur de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const token = findToken();
      if (!token) {
        console.warn('⚠️ Token manquant pour les statistiques');
        return;
      }

      const response = await apiService.get('/api/admin/settings/system/stats');
      const data = response.data;

      if (data.success) {
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("❌ Erreur chargement stats système:", err);
      setStats({
        active_services: "4",
        healthy_services: "3",
        db_size: "2.4 GB",
        db_connections: "12",
        storage_used: "45%",
        total_files: "1245",
        security_score: "92%",
        security_issues: "0"
      });
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = findToken();
      if (!token) {
        throw new Error('Token admin manquant pour la sauvegarde.');
      }

      const response = await apiService.put('/api/admin/settings/system', { config });
      const data = response.data;

      if (data.success) {
        setSuccess("Configuration sauvegardée avec succès");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      setError("Erreur lors de la sauvegarde: " + (err.message || "Erreur serveur"));
      console.error("❌ Erreur sauvegarde config:", err);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (service) => {
    try {
      const token = findToken();
      if (!token) {
        setError(`Token manquant pour tester ${service}`);
        return;
      }

      const response = await apiService.get(`/api/admin/settings/system/test/${service}`);
      const data = response.data;

      setTestResults((prev) => ({
        ...prev,
        [service]: data.success,
      }));

      if (data.success) {
        setSuccess(`Connexion ${service} réussie`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(`Échec de connexion ${service}: ${data.error}`);
      }
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [service]: false,
      }));
      setError(`Erreur lors du test ${service}: ` + (err.message || "Erreur serveur"));
      console.error(`❌ Erreur test ${service}:`, err);
    }
  };

  const updateConfig = (section, key, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const tabs = [
    {
      id: "database",
      label: "Base de données",
      icon: <FiDatabase className="w-5 h-5" />,
      description: "Configuration PostgreSQL",
    },
    {
      id: "payment",
      label: "Paiement",
      icon: <FiCreditCard className="w-5 h-5" />,
      description: "Passerelles de paiement",
    },
    { 
      id: "storage", 
      label: "Stockage", 
      icon: <FiCloud className="w-5 h-5" />,
      description: "Stockage fichiers et médias" 
    },
    { 
      id: "email", 
      label: "Email", 
      icon: <FiMail className="w-5 h-5" />,
      description: "Configuration SMTP" 
    },
    {
      id: "external",
      label: "Services externes",
      icon: <FiExternalLink className="w-5 h-5" />,
      description: "Intégrations tierces",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement de la configuration système...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiSettings className="text-purple-600" />
            Configuration Système
          </h1>
          <p className="text-gray-600 mt-2">
            Configurez les services externes et paramètres système de votre plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active_services || "4"}
                </p>
                <div className="flex items-center mt-1">
                  <FiActivity className="text-green-500 text-sm mr-1" />
                  <p className="text-sm text-green-600">
                    {stats.healthy_services || "3"} sains
                  </p>
                </div>
              </div>
              <FiServer className="text-gray-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Base de données</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.db_size || "2.4"} GB
                </p>
                <div className="flex items-center mt-1">
                  <FiDatabase className="text-blue-500 text-sm mr-1" />
                  <p className="text-sm text-blue-600">
                    {stats.db_connections || "12"} connexions
                  </p>
                </div>
              </div>
              <FiDatabase className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stockage</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.storage_used || "45"}%
                </p>
                <div className="flex items-center mt-1">
                  <FiCloud className="text-indigo-500 text-sm mr-1" />
                  <p className="text-sm text-indigo-600">
                    {stats.total_files || "1245"} fichiers
                  </p>
                </div>
              </div>
              <FiCloud className="text-indigo-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sécurité</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.security_score || "92"}%
                </p>
                <div className="flex items-center mt-1">
                  <FiShield className="text-red-500 text-sm mr-1" />
                  <p className="text-sm text-red-600">
                    {stats.security_issues || "0"} problèmes
                  </p>
                </div>
              </div>
              <FiShield className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      <div className="flex-1">
                        <span className="text-sm font-medium block">{tab.label}</span>
                        <span className="text-xs text-gray-500">{tab.description}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {tabs.find((tab) => tab.id === activeTab)?.label}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {tabs.find((tab) => tab.id === activeTab)?.description}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={fetchConfig}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Actualiser
                    </button>
                    <button
                      onClick={saveConfig}
                      disabled={saving}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
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
                {activeTab === "database" && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FiDatabase className="text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">
                            Configuration PostgreSQL
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Paramètres de connexion à la base de données principale
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hôte
                        </label>
                        <input
                          type="text"
                          value={config.database?.host || ""}
                          onChange={(e) =>
                            updateConfig("database", "host", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="localhost"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Port
                        </label>
                        <input
                          type="number"
                          value={config.database?.port || 5432}
                          onChange={(e) =>
                            updateConfig(
                              "database",
                              "port",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom de la base
                        </label>
                        <input
                          type="text"
                          value={config.database?.database || ""}
                          onChange={(e) =>
                            updateConfig("database", "database", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="vakio_boky"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schéma
                        </label>
                        <input
                          type="text"
                          value={config.database?.schema || "public"}
                          onChange={(e) =>
                            updateConfig("database", "schema", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Utilisateur
                        </label>
                        <input
                          type="text"
                          value={config.database?.username || ""}
                          onChange={(e) =>
                            updateConfig("database", "username", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          value={config.database?.password || ""}
                          onChange={(e) =>
                            updateConfig("database", "password", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => testConnection("database")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Tester la connexion
                      </button>
                      {testResults.database !== undefined && (
                        <div
                          className={`flex items-center gap-2 ${
                            testResults.database
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {testResults.database ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            <FiXCircle className="w-5 h-5" />
                          )}
                          <span className="text-sm font-medium">
                            {testResults.database
                              ? "Connexion réussie"
                              : "Échec de connexion"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "payment" && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FiCreditCard className="text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">
                            Configuration des paiements
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            Paramètres pour les passerelles de paiement
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passerelle de paiement principale
                      </label>
                      <select
                        value={config.payment?.provider || "stripe"}
                        onChange={(e) =>
                          updateConfig("payment", "provider", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="flutterwave">Flutterwave</option>
                        <option value="orange_money">Orange Money</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Clé publique API
                        </label>
                        <input
                          type="password"
                          value={config.payment?.public_key || ""}
                          onChange={(e) =>
                            updateConfig(
                              "payment",
                              "public_key",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="pk_live_..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Clé secrète API
                        </label>
                        <input
                          type="password"
                          value={config.payment?.secret_key || ""}
                          onChange={(e) =>
                            updateConfig(
                              "payment",
                              "secret_key",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="sk_live_..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Devise par défaut
                        </label>
                        <select
                          value={config.payment?.currency || "MGA"}
                          onChange={(e) =>
                            updateConfig("payment", "currency", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="MGA">Ariary malgache (MGA)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="USD">Dollar américain (USD)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mode de paiement
                        </label>
                        <select
                          value={config.payment?.mode || "live"}
                          onChange={(e) =>
                            updateConfig("payment", "mode", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="live">Production</option>
                          <option value="test">Test</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => testConnection("payment")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Tester l'API
                      </button>
                      {testResults.payment !== undefined && (
                        <div
                          className={`flex items-center gap-2 ${
                            testResults.payment
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {testResults.payment ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            <FiXCircle className="w-5 h-5" />
                          )}
                          <span className="text-sm font-medium">
                            {testResults.payment
                              ? "API fonctionnelle"
                              : "Erreur API"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "storage" && (
                  <div className="space-y-6">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FiCloud className="text-indigo-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-indigo-900">
                            Configuration du stockage
                          </h4>
                          <p className="text-sm text-indigo-700 mt-1">
                            Paramètres pour le stockage des fichiers et médias
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service de stockage
                      </label>
                      <select
                        value={config.storage?.provider || "local"}
                        onChange={(e) =>
                          updateConfig("storage", "provider", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="local">Stockage local</option>
                        <option value="aws_s3">Amazon S3</option>
                        <option value="cloudinary">Cloudinary</option>
                        <option value="azure">Azure Blob Storage</option>
                      </select>
                    </div>

                    {config.storage?.provider === "aws_s3" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Access Key ID
                            </label>
                            <input
                              type="password"
                              value={config.storage?.aws_access_key || ""}
                              onChange={(e) =>
                                updateConfig(
                                  "storage",
                                  "aws_access_key",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Secret Access Key
                            </label>
                            <input
                              type="password"
                              value={config.storage?.aws_secret_key || ""}
                              onChange={(e) =>
                                updateConfig(
                                  "storage",
                                  "aws_secret_key",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Région AWS
                            </label>
                            <input
                              type="text"
                              value={config.storage?.aws_region || "eu-west-1"}
                              onChange={(e) =>
                                updateConfig(
                                  "storage",
                                  "aws_region",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nom du bucket
                            </label>
                            <input
                              type="text"
                              value={config.storage?.aws_bucket || ""}
                              onChange={(e) =>
                                updateConfig(
                                  "storage",
                                  "aws_bucket",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Taille max des fichiers (MB)
                        </label>
                        <input
                          type="number"
                          value={config.storage?.max_file_size || 10}
                          onChange={(e) =>
                            updateConfig(
                              "storage",
                              "max_file_size",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          min="1"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Répertoire de stockage local
                        </label>
                        <input
                          type="text"
                          value={config.storage?.local_path || "./uploads"}
                          onChange={(e) =>
                            updateConfig(
                              "storage",
                              "local_path",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => testConnection("storage")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Tester le stockage
                      </button>
                      {testResults.storage !== undefined && (
                        <div
                          className={`flex items-center gap-2 ${
                            testResults.storage
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {testResults.storage ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            <FiXCircle className="w-5 h-5" />
                          )}
                          <span className="text-sm font-medium">
                            {testResults.storage
                              ? "Stockage opérationnel"
                              : "Erreur de stockage"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "email" && (
                  <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FiMail className="text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-900">
                            Configuration SMTP
                          </h4>
                          <p className="text-sm text-orange-700 mt-1">
                            Paramètres pour l'envoi d'emails transactionnels
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service de messagerie
                      </label>
                      <select
                        value={config.email?.provider || "smtp"}
                        onChange={(e) =>
                          updateConfig("email", "provider", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="smtp">SMTP personnalisé</option>
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailgun">Mailgun</option>
                        <option value="ses">Amazon SES</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Serveur SMTP
                        </label>
                        <input
                          type="text"
                          value={config.email?.smtp_host || ""}
                          onChange={(e) =>
                            updateConfig("email", "smtp_host", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="smtp.gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Port SMTP
                        </label>
                        <input
                          type="number"
                          value={config.email?.smtp_port || 587}
                          onChange={(e) =>
                            updateConfig(
                              "email",
                              "smtp_port",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          value={config.email?.smtp_username || ""}
                          onChange={(e) =>
                            updateConfig(
                              "email",
                              "smtp_username",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          value={config.email?.smtp_password || ""}
                          onChange={(e) =>
                            updateConfig(
                              "email",
                              "smtp_password",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email expéditeur
                        </label>
                        <input
                          type="email"
                          value={config.email?.from_email || ""}
                          onChange={(e) =>
                            updateConfig("email", "from_email", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="noreply@vakioboky.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom expéditeur
                        </label>
                        <input
                          type="text"
                          value={config.email?.from_name || ""}
                          onChange={(e) =>
                            updateConfig("email", "from_name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Vakio Boky"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => testConnection("email")}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Tester SMTP
                      </button>
                      {testResults.email !== undefined && (
                        <div
                          className={`flex items-center gap-2 ${
                            testResults.email
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {testResults.email ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            <FiXCircle className="w-5 h-5" />
                          )}
                          <span className="text-sm font-medium">
                            {testResults.email
                              ? "SMTP opérationnel"
                              : "Erreur SMTP"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "external" && (
                  <div className="space-y-6">
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FiExternalLink className="text-teal-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-teal-900">
                            Services externes
                          </h4>
                          <p className="text-sm text-teal-700 mt-1">
                            Intégrations avec des services tiers
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <FiGlobe className="text-blue-600" />
                        Google Analytics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tracking ID
                          </label>
                          <input
                            type="text"
                            value={config.external?.google_analytics_id || ""}
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "google_analytics_id",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="GA_MEASUREMENT_ID"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ga_enabled"
                            checked={
                              config.external?.google_analytics_enabled !==
                              false
                            }
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "google_analytics_enabled",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label
                            htmlFor="ga_enabled"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Activer Google Analytics
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <FiGlobe className="text-blue-400" />
                        Réseaux sociaux
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facebook App ID
                          </label>
                          <input
                            type="text"
                            value={config.external?.facebook_app_id || ""}
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "facebook_app_id",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter API Key
                          </label>
                          <input
                            type="password"
                            value={config.external?.twitter_api_key || ""}
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "twitter_api_key",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <FiActivity className="text-indigo-600" />
                        CDN & Cache
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cloudflare Zone ID
                          </label>
                          <input
                            type="text"
                            value={config.external?.cloudflare_zone_id || ""}
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "cloudflare_zone_id",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Token
                          </label>
                          <input
                            type="password"
                            value={config.external?.cloudflare_api_token || ""}
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "cloudflare_api_token",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <FiShield className="text-red-600" />
                        Monitoring & Alertes
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sentry DSN
                          </label>
                          <input
                            type="password"
                            value={config.external?.sentry_dsn || ""}
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "sentry_dsn",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="sentry_enabled"
                            checked={config.external?.sentry_enabled !== false}
                            onChange={(e) =>
                              updateConfig(
                                "external",
                                "sentry_enabled",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label
                            htmlFor="sentry_enabled"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Activer Sentry
                          </label>
                        </div>
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