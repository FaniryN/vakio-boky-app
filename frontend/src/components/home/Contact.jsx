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

    // Validation
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
      console.log('📤 Envoi email de contact...');
      
      // TES CLÉS EMAILJS - CORRIGÉ :
      const serviceID = 'service_z677nyy';
      const templateID = 'template_psskkv7'; // ⬅️ CHANGE ICI !!!
      const publicKey = 'WBgfZB8Vl4vTsHiUZ';

      // VÉRIFIE les variables de ton template contact_to_admin
      // Regarde dans EmailJS quels {{variables}} sont utilisés
      const templateParams = {
        // Variables PROBABLES (à vérifier dans ton template) :
        from_name: formData.name,     // Probablement {{from_name}}
        from_email: formData.email,   // Probablement {{from_email}}  
        message: formData.message,    // Probablement {{message}}
        subject: 'Nouveau message Vakio Boky', // Peut-être {{subject}}
        date: new Date().toLocaleString('fr-FR'), // Peut-être {{date}}
        
        // AJOUTE AUSSI (si tu veux) :
        to_email: 'fanirynomena11@gmail.com' // Si tu veux spécifier
      };

      console.log('🔧 Configuration:', { serviceID, templateID, publicKey });
      console.log('📝 Données:', templateParams);

      const result = await emailjs.send(
        serviceID,
        templateID, // ⬅️ Utilise template_psskkv7 maintenant
        templateParams,
        publicKey
      );

      console.log('✅ Email de contact envoyé:', result);
      
      // Réinitialiser
      setFormData({ name: '', email: '', message: '' });
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error('❌ Erreur EmailJS:', error);
      
      // Messages d'erreur spécifiques
      if (error.text?.includes('Invalid template ID')) {
        setError('Erreur: Mauvais template ID. Utilise template_psskkv7 pour le contact.');
      } else if (error.text?.includes('recipients address is empty')) {
        setError('Erreur: Champ "To Email" vide dans le template. Vérifie EmailJS dashboard.');
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

      {/* Section debug/test */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col gap-3">
          <button 
            onClick={async () => {
              console.log("🧪 Test template contact...");
              try {
                const result = await emailjs.send(
                  'service_z677nyy',
                  'template_psskkv7',
                  {
                    from_name: 'Test Nom',
                    from_email: 'test@email.com',
                    message: 'Ceci est un test',
                    subject: 'Test technique',
                    date: new Date().toLocaleString('fr-FR'),
                    to_email: 'fanirynomena11@gmail.com'
                  },
                  'WBgfZB8Vl4vTsHiUZ'
                );
                console.log('✅ Test réussi:', result);
                alert('Test réussi ! Vérifie ton email fanirynomena11@gmail.com');
              } catch (err) {
                console.error('❌ Test échoué:', err);
                alert(`Erreur: ${err.text || err.message}`);
              }
            }}
            className="text-sm text-blue-600 underline text-center"
          >
            Tester le template contact_to_admin
          </button>
          
          <p className="text-gray-600 text-sm">
            <strong>💡 Fonctionnalité :</strong> Ce formulaire utilise EmailJS pour envoyer 
            directement les messages depuis votre navigateur. Aucun serveur backend n'est nécessaire.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;