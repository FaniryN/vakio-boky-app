// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiHeart, FiUsers } from 'react-icons/fi';
// import { useCampaigns } from '@/hooks/useCampaigns';
// import CampaignCard from '@/components/fundraising/CampaignCard';
// import DonationModal from '@/components/fundraising/DonationModal';
// import Button from '@/components/ui/Button';

// export default function FundraisingPage() {
//   const { campaigns, loading, error, fetchCampaigns } = useCampaigns();
  
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

//   const handleDonate = (campaign) => {
//     setSelectedCampaign(campaign);
//     setIsDonationModalOpen(true);
//   };

//   const handleDonationSuccess = () => {
//     setIsDonationModalOpen(false);
//     setSelectedCampaign(null);
//     fetchCampaigns(); // Recharger pour mettre à jour les montants
//   };

//   if (loading && campaigns.length === 0) {
//     return (
//       <div className="min-h-screen pt-20 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-blue-900">Chargement des campagnes...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <FiHeart className="text-4xl text-red-500" />
//             <h1 className="text-4xl font-bold text-gray-900 font-mono">
//               Collecte de Fonds Vakio Boky
//             </h1>
//           </div>
//           <p className="text-lg text-gray-700 max-w-2xl mx-auto">
//             Soutenez nos initiatives et contribuez à promouvoir la littérature malgache. 
//             Chaque don fait la différence !
//           </p>
//         </motion.div>

//         {/* Statistiques globales */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
//         >
//           <div className="bg-white rounded-lg shadow-sm p-6 text-center">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <FiHeart className="text-red-500 text-xl" />
//               <h3 className="text-lg font-semibold text-gray-900">Campagnes actives</h3>
//             </div>
//             <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 text-center">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <FiUsers className="text-blue-500 text-xl" />
//               <h3 className="text-lg font-semibold text-gray-900">Soutiens totaux</h3>
//             </div>
//             <p className="text-3xl font-bold text-gray-900">
//               {campaigns.reduce((total, campaign) => total + (campaign.donor_count || 0), 0)}
//             </p>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 text-center">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact global</h3>
//             <p className="text-3xl font-bold text-green-600">100%</p>
//             <p className="text-sm text-gray-600 mt-1">Pour la culture malgache</p>
//           </div>
//         </motion.div>

//         {/* Erreur */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center"
//           >
//             ❌ {error}
//             <Button
//               variant="primary"
//               size="sm"
//               onClick={fetchCampaigns}
//               className="ml-4"
//             >
//               Réessayer
//             </Button>
//           </motion.div>
//         )}

//         {/* Campagnes */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           {campaigns.length === 0 ? (
//             <div className="text-center py-12">
//               <FiHeart className="text-6xl text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 text-lg mb-4">
//                 Aucune campagne de collecte pour le moment
//               </p>
//               <p className="text-gray-400">
//                 Revenez bientôt pour découvrir nos prochaines initiatives !
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {campaigns.map((campaign) => (
//                 <CampaignCard
//                   key={campaign.id}
//                   campaign={campaign}
//                   onDonate={handleDonate}
//                 />
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Modal de don */}
//       <DonationModal
//         campaign={selectedCampaign}
//         isOpen={isDonationModalOpen}
//         onClose={() => setIsDonationModalOpen(false)}
//         onSuccess={handleDonationSuccess}
//       />
//     </div>
//   );
// }
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, 
  FiUsers, 
  FiTrendingUp, 
  FiTarget,
  FiClock,
  FiStar,
  FiArrowRight,
  FiFilter,
  FiX
} from 'react-icons/fi';
import { useCampaigns } from '@/hooks/useCampaigns';
import CampaignCard from '@/components/fundraising/CampaignCard';
import DonationModal from '@/components/fundraising/DonationModal';
import Button from '@/components/ui/Button';

export default function FundraisingPage() {
  const { campaigns, loading, error, fetchCampaigns } = useCampaigns();
  
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleDonate = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDonationModalOpen(true);
  };

  const handleDonationSuccess = () => {
    setIsDonationModalOpen(false);
    setSelectedCampaign(null);
    fetchCampaigns();
  };

  // Statistiques calculées
  const totalRaised = campaigns.reduce((total, campaign) => total + (campaign.amount_raised || 0), 0);
  const totalDonors = campaigns.reduce((total, campaign) => total + (campaign.donor_count || 0), 0);
  const activeCampaigns = campaigns.filter(camp => camp.status === 'active').length;

  // const stats = [
  //   { 
  //     value: `€${totalRaised.toLocaleString()}`, 
  //     label: "Collectés", 
  //     icon: FiTrendingUp, 
  //     color: "green" 
  //   },
  //   { 
  //     value: campaigns.length, 
  //     label: "Campagnes Actives", 
  //     icon: FiHeart, 
  //     color: "red" 
  //   },
  //   { 
  //     value: totalDonors, 
  //     label: "Soutiens", 
  //     icon: FiUsers, 
  //     color: "blue" 
  //   },
  //   { 
  //     value: "100%", 
  //     label: "Impact Culturel", 
  //     icon: FiTarget, 
  //     color: "purple" 
  //   }
  // ];

  const filters = [
    { id: 'all', label: 'Toutes les campagnes' },
    { id: 'active', label: 'En cours' },
    { id: 'ending', label: 'Bientôt terminées' },
    { id: 'successful', label: 'Réussies' }
  ];

  if (loading && campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Chargement des campagnes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 to-red-800 bg-clip-text text-transparent mb-6"
          >
            Collecte de Fonds Vakio Boky
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Soutenez nos initiatives et contribuez à promouvoir la littérature malgache. 
            Chaque don fait la différence pour notre culture !
          </motion.p>
        </motion.div>

        {/* Section Statistiques
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-semibold text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section> */}

        {/* Barre de filtres */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                    <FiHeart className="text-white text-lg" />
                  </div>
                  Campagnes de Collecte
                </h2>
                <p className="text-gray-600">
                  Découvrez et soutenez nos projets pour la littérature malgache
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-600">
                  <FiFilter size={16} />
                  <span className="text-sm font-medium">Filtrer :</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filterItem) => (
                    <button
                      key={filterItem.id}
                      onClick={() => setFilter(filterItem.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        filter === filterItem.id
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {filterItem.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Message d'erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex justify-between items-center shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FiX className="text-red-600" />
              </div>
              <span className="font-medium">{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCampaigns}
              className="border-red-200 text-red-700 hover:bg-red-100"
            >
              Réessayer
            </Button>
          </motion.div>
        )}

        {/* Section Campagnes */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-16"
        >
          {campaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300"
            >
              <FiHeart className="mx-auto text-6xl text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                Aucune campagne active
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Revenez bientôt pour découvrir nos prochaines initiatives de collecte
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Être notifié
                </Button>
                <Button
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                >
                  Proposer un projet
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* En-tête des campagnes */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {campaigns.length} campagne{campaigns.length > 1 ? 's' : ''} à soutenir
                  </h3>
                  <p className="text-gray-600">
                    Faites partie du mouvement pour la littérature malgache
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiTrendingUp className="text-green-500" />
                  <span>€{totalRaised.toLocaleString()} collectés au total</span>
                </div>
              </div>

              {/* Grille de campagnes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <CampaignCard
                      campaign={campaign}
                      onDonate={handleDonate}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </motion.section>

        {/* Section Impact
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">
                Votre Impact sur la Culture Malgache
              </h3>
              <p className="text-red-100 max-w-2xl mx-auto">
                Chaque don contribue directement à la préservation et au développement 
                de la littérature malgache. Ensemble, nous créons un héritage culturel durable.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "50+", label: "Auteurs soutenus" },
                { value: "100+", label: "Livres publiés" },
                { value: "1000+", label: "Lecteurs touchés" },
                { value: "10+", label: "Communautés engagées" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold mb-1">{item.value}</div>
                  <div className="text-red-100 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section> */}

        {/* Section Témoignages
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ils Soutiennent Déjà le Mouvement
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez pourquoi notre communauté croit en l'importance de préserver 
                la littérature malgache
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Marie R.",
                  role: "Donatrice régulière",
                  comment: "Une initiative essentielle pour notre patrimoine culturel. Je suis fière de contribuer !",
                  avatar: "MR"
                },
                {
                  name: "Jean P.",
                  role: "Auteur soutenu",
                  comment: "Grâce à Vakio Boky, j'ai pu publier mon premier roman. Merci à tous les donateurs !",
                  avatar: "JP"
                },
                {
                  name: "Sarah M.",
                  role: "Membre fondatrice",
                  comment: "Voir l'impact concret de nos dons sur la communauté littéraire est incroyable.",
                  avatar: "SM"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 text-center group hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="text-yellow-400 fill-current" size={16} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>*/}
      </div>

      {/* Modal de don */}
      <DonationModal
        campaign={selectedCampaign}
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onSuccess={handleDonationSuccess}
      />
    </div>
  );
}
