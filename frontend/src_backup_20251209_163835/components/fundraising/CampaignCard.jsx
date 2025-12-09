import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiCalendar } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function CampaignCard({ campaign, onDonate }) {
  const progress = Math.min((campaign.current_amount / campaign.target_amount) * 100, 100);
  const daysLeft = campaign.end_date 
    ? Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="h-48 bg-gray-200 relative">
        {campaign.image_url ? (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <FiHeart className="text-4xl text-blue-600" />
          </div>
        )}
        
        {/* Badge jours restants */}
        {daysLeft !== null && daysLeft > 0 && (
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="text-sm font-semibold text-blue-600 flex items-center gap-1">
              <FiCalendar size={14} />
              {daysLeft} jour{daysLeft > 1 ? 's' : ''}
            </span>
          </div>
        )}
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
            <span>Collecté: {formatAmount(campaign.current_amount)}</span>
            <span>Objectif: {formatAmount(campaign.target_amount)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-right text-xs text-gray-500 mt-1">
            {progress.toFixed(1)}% atteint
          </div>
        </div>

        {/* Bouton don */}
        <Button
          variant="primary"
          onClick={() => onDonate(campaign)}
          className="w-full flex items-center justify-center gap-2"
        >
          <FiHeart />
          Faire un don
        </Button>
      </div>
    </motion.div>
  );
}