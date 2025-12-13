import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiEye,
  FiSave,
  FiSend,
  FiCode,
  FiType,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertTriangle,
  FiEdit,
  FiFileText,
} from "react-icons/fi";
import { apiService } from '../../utils/api'; // IMPORT CRITIQUE

export default function AdminSettingsEmail() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchTemplates();
    fetchEmailStats();
  }, [filter]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      // UTILISATION DE apiService POUR LA GESTION AUTOMATIQUE DU TOKEN
      const response = await apiService.get(`/api/admin/settings/email/templates?filter=${filter}`);
      
      console.log('📊 [EmailSettings] Statut:', response.status);
      
      const data = response.data;

      if (data.success) {
        setTemplates(data.templates || []);
        if (!selectedTemplate && data.templates?.length > 0) {
          setSelectedTemplate(data.templates[0]);
        }
        setError(null);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("❌ Erreur chargement templates:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailStats = async () => {
    try {
      const response = await apiService.get('/api/admin/settings/email/stats');
      const data = response.data;

      if (data.success) {
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("❌ Erreur chargement stats email:", err);
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // UTILISATION DE apiService
      const response = await apiService.put(
        `/api/admin/settings/email/templates/${selectedTemplate.id}`,
        {
          name: selectedTemplate.name,
          category: selectedTemplate.category,
          description: selectedTemplate.description,
          subject: selectedTemplate.subject,
          html_content: selectedTemplate.html_content,
          text_content: selectedTemplate.text_content || "",
        }
      );

      const data = response.data;

      if (data.success) {
        setSuccess("Template sauvegardé avec succès");
        await fetchTemplates();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error("❌ Erreur sauvegarde template:", err);
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    if (!selectedTemplate || !testEmail) return;

    try {
      // UTILISATION DE apiService
      const response = await apiService.post('/api/admin/settings/email/test', {
        templateId: selectedTemplate.id,
        email: testEmail,
      });

      const data = response.data;

      if (data.success) {
        setSuccess("Email de test envoyé avec succès");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Erreur lors de l'envoi du test");
      }
    } catch (err) {
      setError("Erreur lors de l'envoi du test");
      console.error("❌ Erreur envoi test:", err);
    }
  };

  const updateTemplate = (field, value) => {
    setSelectedTemplate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const availableVariables = [
    { variable: "{{user_name}}", description: "Nom de l'utilisateur" },
    { variable: "{{user_email}}", description: "Email de l'utilisateur" },
    { variable: "{{platform_name}}", description: "Nom de la plateforme" },
    { variable: "{{current_year}}", description: "Année en cours" },
    { variable: "{{login_link}}", description: "Lien de connexion" },
    { variable: "{{reset_link}}", description: "Lien de réinitialisation" },
    { variable: "{{verification_link}}", description: "Lien de vérification" },
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'auth': return <FiMail className="text-blue-600" />;
      case 'notifications': return <FiAlertTriangle className="text-yellow-600" />;
      case 'marketing': return <FiSend className="text-green-600" />;
      case 'system': return <FiFileText className="text-purple-600" />;
      default: return <FiMail className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'auth': return 'bg-blue-100 text-blue-800';
      case 'notifications': return 'bg-yellow-100 text-yellow-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des templates email...
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
            <FiMail className="text-green-600" />
            Templates Email & Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les templates d'emails et de notifications de votre plateforme
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Templates Totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_templates || templates.length}
                </p>
                <div className="flex items-center mt-1">
                  <FiFileText className="text-blue-500 text-sm mr-1" />
                  <p className="text-sm text-blue-600">
                    {stats.active_templates || 0} actifs
                  </p>
                </div>
              </div>
              <FiMail className="text-gray-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails d'Auth</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.auth_templates || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiMail className="text-blue-500 text-sm mr-1" />
                  <p className="text-sm text-blue-600">
                    Connexion, vérification
                  </p>
                </div>
              </div>
              <FiMail className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.notification_templates || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiAlertTriangle className="text-yellow-500 text-sm mr-1" />
                  <p className="text-sm text-yellow-600">
                    Alertes système
                  </p>
                </div>
              </div>
              <FiAlertTriangle className="text-yellow-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Marketing</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.marketing_templates || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiSend className="text-green-500 text-sm mr-1" />
                  <p className="text-sm text-green-600">
                    Newsletters, promotions
                  </p>
                </div>
              </div>
              <FiSend className="text-green-600 text-2xl" />
            </div>
          </div>
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
          {/* Templates List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Templates</h3>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous</option>
                    <option value="auth">Authentification</option>
                    <option value="notifications">Notifications</option>
                    <option value="marketing">Marketing</option>
                    <option value="system">Système</option>
                  </select>
                  <button
                    onClick={fetchTemplates}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Actualiser"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(template.category)}
                      <div className="font-medium text-sm">{template.name}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {template.category}
                      </div>
                      {template.is_active && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Actif
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-3">
            {selectedTemplate ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {selectedTemplate.name}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedTemplate.category)}`}>
                          {selectedTemplate.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedTemplate.description}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        {previewMode ? (
                          <>
                            <FiEdit className="w-4 h-4" />
                            Éditer
                          </>
                        ) : (
                          <>
                            <FiEye className="w-4 h-4" />
                            Prévisualiser
                          </>
                        )}
                      </button>
                      <button
                        onClick={saveTemplate}
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
                  {previewMode ? (
                    /* Preview Mode */
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aperçu de l'email
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="bg-white border rounded p-6 shadow-sm">
                            <div className="border-b border-gray-200 pb-4 mb-4">
                              <h3 className="font-bold text-lg text-gray-900">
                                {selectedTemplate.subject}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Expéditeur: Vakio Boky &lt;noreply@vakioboky.com&gt;
                              </p>
                            </div>
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: selectedTemplate.html_content,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Test Email */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                          <FiSend className="w-4 h-4" />
                          Envoyer un email de test
                        </h4>
                        <div className="flex gap-3">
                          <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="votre.email@test.com"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={sendTestEmail}
                            disabled={!testEmail}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <FiSend className="w-4 h-4" />
                            Tester
                          </button>
                        </div>
                        <p className="text-xs text-blue-700 mt-2">
                          Un email de test sera envoyé à cette adresse avec les variables remplacées.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du template
                          </label>
                          <input
                            type="text"
                            value={selectedTemplate.name}
                            onChange={(e) =>
                              updateTemplate("name", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie
                          </label>
                          <select
                            value={selectedTemplate.category}
                            onChange={(e) =>
                              updateTemplate("category", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="auth">Authentification</option>
                            <option value="notifications">Notifications</option>
                            <option value="marketing">Marketing</option>
                            <option value="system">Système</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={selectedTemplate.description}
                          onChange={(e) =>
                            updateTemplate("description", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sujet de l'email
                        </label>
                        <input
                          type="text"
                          value={selectedTemplate.subject}
                          onChange={(e) =>
                            updateTemplate("subject", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contenu HTML
                        </label>
                        <textarea
                          value={selectedTemplate.html_content}
                          onChange={(e) =>
                            updateTemplate("html_content", e.target.value)
                          }
                          rows={12}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder="<html>...</html>"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contenu texte brut (optionnel)
                        </label>
                        <textarea
                          value={selectedTemplate.text_content || ""}
                          onChange={(e) =>
                            updateTemplate("text_content", e.target.value)
                          }
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder="Version texte de l'email..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiMail className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Sélectionnez un template pour commencer l'édition
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Variables Helper */}
        {selectedTemplate && !previewMode && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiType className="text-blue-600" />
              Variables disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableVariables.map((variable) => (
                <div
                  key={variable.variable}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const newValue = textarea.value.substring(0, start) + 
                                     variable.variable + 
                                     textarea.value.substring(end);
                      updateTemplate("html_content", newValue);
                    }
                  }}
                >
                  <code className="text-sm font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {variable.variable}
                  </code>
                  <span className="text-sm text-gray-600">
                    {variable.description}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FiAlertTriangle className="text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Conseil</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cliquez sur une variable pour l'insérer dans votre contenu HTML.
                    Les variables seront automatiquement remplacées lors de l'envoi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}