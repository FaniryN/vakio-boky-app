import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation basique
    if (!formData.name || !formData.email || !formData.message) {
      setError('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Email invalide.');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Envoi email via EmailJS...');
      
      // TES CLÉS EMAILJS ICI :
      const serviceID = 'service_z677nyy';
      const templateID = 'template_br9wwbb';
      const publicKey = 'WBgfZB8Vl4vTsHiUZ';

      const templateParams = {
  from_name: formData.name,     // Devient {{from_name}} dans le template
  from_email: formData.email,   // Devient {{from_email}}
  message: formData.message,    // Devient {{message}}
  date: new Date().toLocaleString('fr-FR') // Devient {{date}}
  // Note : 'to_email' et 'reply_to' ne sont plus nécessaires ici,
  // car ils sont déjà définis dans le template EmailJS.
};

      console.log('🔧 Configuration:', { serviceID, templateID, publicKey });
      console.log('📝 Données:', templateParams);

      const result = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );

      console.log('✅ Email envoyé avec succès:', result);
      
      // Réinitialiser le formulaire
      setFormData({ name: '', email: '', message: '' });
      setSuccess(true);
      
      // Cacher le message de succès après 5 secondes
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error('❌ Erreur EmailJS:', error);
      
      // Messages d'erreur plus clairs
      if (error.text?.includes('Invalid template ID')) {
        setError('Erreur de configuration du template email.');
      } else if (error.text?.includes('Invalid user ID')) {
        setError('Clé API incorrecte.');
      } else {
        setError(`Erreur d'envoi: ${error.message || 'Veuillez réessayer.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
    >
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Envoyez-nous un message
        </h3>
        <p className="text-gray-600">
          Notre équipe vous répond dans les 24h
        </p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <div className="flex items-center gap-3 text-green-700">
            <FiCheckCircle className="text-xl" />
            <div>
              <p className="font-semibold">Message envoyé avec succès !</p>
              <p className="text-sm mt-1">
                Vous recevrez une confirmation par email. Merci !
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <p className="text-red-700 font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Champ Nom */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-500" />
              <span>Votre nom *</span>
            </div>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>

        {/* Champ Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <div className="flex items-center gap-2">
              <FiMail className="text-gray-500" />
              <span>Votre email *</span>
            </div>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="john@exemple.com"
            required
            disabled={loading}
          />
        </div>

        {/* Champ Message */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <div className="flex items-center gap-2">
              <FiMessageSquare className="text-gray-500" />
              <span>Votre message *</span>
            </div>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            placeholder="Décrivez votre projet, votre question ou votre suggestion..."
            required
            disabled={loading}
          />
        </div>

        {/* Bouton d'envoi */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <FiSend />
              <span>Envoyer le message</span>
            </>
          )}
        </motion.button>

        <p className="text-gray-500 text-sm text-center mt-4">
          * Champs obligatoires. Vos données sont traitées avec confidentialité.
        </p>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          <strong>💡 Fonctionnalité :</strong> Ce formulaire utilise EmailJS pour envoyer 
          directement les messages depuis votre navigateur. Aucun serveur backend n'est nécessaire.
        </p>
      </div>
    </motion.div>
  );
};

export default ContactForm;