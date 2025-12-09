import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiTarget } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function CampaignCard({ campaign, onDonate }) {
  const progress = campaign.target_amount > 0 
    ? Math.min((campaign.current_amount / campaign.target_amount) * 100, 100)
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA'
    }).format(amount);
  };

  const getDaysRemaining = () => {
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();
  const isActive = daysRemaining > 0 && campaign.status === 'active';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Image de la campagne */}
      <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
        {campaign.image_url ? (
          <img 
            src={campaign.image_url} 
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiHeart className="text-4xl text-pink-400" />
          </div>
        )}
        
        {/* Badge statut */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : 'Terminée'}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        {/* Progression */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Collecté</span>
            <span>{formatCurrency(campaign.current_amount)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{progress.toFixed(1)}%</span>
            {campaign.target_amount > 0 && (
              <span>Objectif: {formatCurrency(campaign.target_amount)}</span>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <FiUsers className="text-blue-500" />
            <span>{campaign.donor_count || 0} donateurs</span>
          </div>
          <div className="flex items-center gap-1">
            <FiTarget className="text-orange-500" />
            <span>{daysRemaining} jours restants</span>
          </div>
        </div>

        {/* Bouton de don */}
        <Button
          variant={isActive ? "primary" : "secondary"}
          onClick={() => onDonate(campaign)}
          disabled={!isActive}
          className="w-full flex items-center justify-center gap-2"
        >
          <FiHeart />
          {isActive ? 'Faire un don' : 'Campagne terminée'}
        </Button>
      </div>
    </motion.div>
  );
}