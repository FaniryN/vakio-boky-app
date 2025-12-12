import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiCheck, FiArrowLeft, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isReset, setIsReset] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('resetToken');
    const email = localStorage.getItem('resetEmail');
    
    if (!token || !email) {
      navigate('/forgot-password');
    } else {
      setResetToken(token);
    }
  }, [navigate]);

  useEffect(() => {
    // Calculer la force du mot de passe
    const calculateStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      return strength;
    };
    
    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message) setMessage('');
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 75) return 'bg-green-500';
    if (passwordStrength >= 50) return 'bg-yellow-500';
    if (passwordStrength >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    if (passwordStrength >= 75) return 'Fort';
    if (passwordStrength >= 50) return 'Moyen';
    if (passwordStrength >= 25) return 'Faible';
    return 'Très faible';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessageType('error');
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setMessageType('error');
      setMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordStrength < 50) {
      setMessageType('warning');
      setMessage('Votre mot de passe est faible. Pour plus de sécurité, ajoutez des majuscules, chiffres ou caractères spéciaux.');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const email = localStorage.getItem('resetEmail');
      
      const response = await fetch('https://vakio-boky-backend.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: resetToken,
          newPassword: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage('✅ Mot de passe réinitialisé avec succès !');
        setIsReset(true);
        
        // Animation avant nettoyage
        setTimeout(() => {
          localStorage.removeItem('resetEmail');
          localStorage.removeItem('resetToken');
          localStorage.removeItem('devResetCode');
        }, 2000);
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessageType('error');
      setMessage('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  // Écran de succès amélioré
  if (isReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="bg-white rounded-2xl shadow-2xl border border-green-200 p-8 w-full max-w-md text-center relative overflow-hidden"
          >
            {/* Effet de fond */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20" />
            
            {/* Confetti animation */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  initial={{ 
                    y: -50,
                    x: Math.random() * 100 - 50,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: 400,
                    opacity: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Icône animée */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
              className="relative z-10"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FiCheck size={32} />
              </div>
            </motion.div>
            
            {/* Titre */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-3 relative z-10"
            >
              Félicitations !
            </motion.h2>
            
            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 mb-8 relative z-10"
            >
              Votre mot de passe a été réinitialisé avec succès.
              <br />
              <span className="font-medium text-green-600">Vous pouvez maintenant vous connecter.</span>
            </motion.p>
            
            {/* Barre de progression */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative z-10"
            >
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 3, 
                    ease: "linear" 
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                />
              </div>
              
              {/* Compte à rebours */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center gap-3 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Redirection vers la connexion...</span>
                </div>
                <motion.span
                  key="countdown"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 1,
                    repeat: 3,
                    repeatType: "reverse"
                  }}
                  className="font-bold text-green-600"
                >
                  3s
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Bouton de retour accéléré */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8 relative z-10"
            >
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Aller à la connexion maintenant
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Formulaire principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8 w-full max-w-md"
      >
        {/* Bouton retour */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/verify-code')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </motion.button>

        {/* En-tête */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="bg-blue-800 text-white rounded-lg px-4 py-3 inline-block mb-4"
          >
            <span className="block font-bold text-lg">#Vakio_Boky</span>
            <span className="block text-sm font-light">Communauté Littéraire</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-900 text-2xl font-bold mb-2"
          >
            Nouveau mot de passe
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-600 text-sm"
          >
            Choisissez un mot de passe sécurisé et unique
          </motion.p>
        </div>

        {/* Formulaire */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Nouveau mot de passe */}
          <div className="space-y-3">
            <label className="text-blue-900 text-sm font-medium block">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Input
                variant="primary"
                size="lg"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                icon={<FiLock className="text-blue-400" />}
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            
            {/* Indicateur de force */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Force du mot de passe :</span>
                  <span className={`font-medium ${
                    passwordStrength >= 75 ? 'text-green-600' :
                    passwordStrength >= 50 ? 'text-yellow-600' :
                    passwordStrength >= 25 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-2 rounded-full ${getStrengthColor()}`}
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <FiShield size={12} className={
                      formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'
                    } />
                    <span>Au moins 8 caractères</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShield size={12} className={
                      /[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'
                    } />
                    <span>Une majuscule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShield size={12} className={
                      /[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'
                    } />
                    <span>Un chiffre</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div className="space-y-2">
            <label className="text-blue-900 text-sm font-medium block">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Input
                variant="primary"
                size="lg"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Répétez le mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                icon={<FiLock className="text-blue-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs flex items-center gap-1"
              >
                <FiShield />
                Les mots de passe ne correspondent pas
              </motion.p>
            )}
            
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 text-xs flex items-center gap-1"
              >
                <FiCheck />
                Les mots de passe correspondent
              </motion.p>
            )}
          </div>

          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl flex items-start gap-3 ${
                  messageType === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : messageType === 'warning'
                    ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {messageType === 'success' && <FiCheck className="text-green-600 text-lg mt-0.5" />}
                {messageType === 'warning' && <FiShield className="text-yellow-600 text-lg mt-0.5" />}
                {messageType === 'error' && <FiShield className="text-red-600 text-lg mt-0.5" />}
                <div>
                  <p className="font-medium">{message}</p>
                  {messageType === 'success' && (
                    <p className="text-sm mt-1 text-green-600">
                      Vous serez redirigé vers la page de connexion...
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton de réinitialisation */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword || passwordStrength < 25}
              className="w-full disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Réinitialisation en cours...
                </span>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 pt-6 border-t border-blue-100 text-center"
        >
          <p className="text-blue-400 text-xs mb-2">
            🔒 Conseils de sécurité :
          </p>
          <div className="text-gray-500 text-xs space-y-1">
            <p>• Utilisez un mot de passe unique pour Vakio Boky</p>
            <p>• Évitez les mots courants ou informations personnelles</p>
            <p>• Changez régulièrement votre mot de passe</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}