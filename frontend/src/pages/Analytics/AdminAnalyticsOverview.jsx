// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FiBarChart2,
//   FiUsers,
//   FiBook,
//   FiTarget,
//   FiTrendingUp,
//   FiTrendingDown,
//   FiActivity,
//   FiDollarSign,
//   FiCalendar,
//   FiEye,
//   FiHeart,
//   FiMessageSquare,
//   FiShare2,
//   FiAward,
//   FiShoppingCart,
// } from "react-icons/fi";

// export default function AdminAnalyticsOverview() {
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeRange, setTimeRange] = useState('30d');

//   useEffect(() => {
//     fetchAnalytics();
//   }, [timeRange]);

//   const fetchAnalytics = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/analytics/overview?range=${timeRange}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (data.success) {
//         setAnalytics(data.analytics);
//       } else {
//         setError(data.error || "Erreur lors du chargement");
//       }
//     } catch (err) {
//       setError("Erreur lors du chargement des statistiques");
//       console.error("❌ Erreur chargement analytics:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="ml-3 text-gray-600">
//               Chargement des statistiques...
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <FiBarChart2 className="text-blue-600" />
//             Vue d'ensemble de la plateforme
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Métriques clés et santé globale de la plateforme Vakio Boky
//           </p>
//         </div>

//         {/* Time Range Selector */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
//             <select
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="7d">7 derniers jours</option>
//               <option value="30d">30 derniers jours</option>
//               <option value="90d">90 derniers jours</option>
//               <option value="1y">1 an</option>
//             </select>
//           </div>
//         </div>

//         {/* Key Platform Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Utilisateurs Totaux</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics ? analytics.totalUsers : 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiTrendingUp className="text-green-500 text-sm mr-1" />
//                   <p className="text-sm text-green-600">
//                     +{analytics?.userGrowth || 0}% vs période précédente
//                   </p>
//                 </div>
//               </div>
//               <FiUsers className="text-blue-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.activeUsers || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiActivity className="text-green-500 text-sm mr-1" />
//                   <p className="text-sm text-green-600">
//                     {analytics?.activeUsersPercentage || 0}% du total
//                   </p>
//                 </div>
//               </div>
//               <FiActivity className="text-green-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Livres Publiés</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.totalBooks || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiBook className="text-purple-500 text-sm mr-1" />
//                   <p className="text-sm text-purple-600">
//                     +{analytics?.booksGrowth || 0} nouveaux
//                   </p>
//                 </div>
//               </div>
//               <FiBook className="text-purple-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   €{analytics?.totalRevenue || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiDollarSign className="text-green-500 text-sm mr-1" />
//                   <p className="text-sm text-green-600">
//                     +{analytics?.revenueGrowth || 0}% vs période précédente
//                   </p>
//                 </div>
//               </div>
//               <FiDollarSign className="text-green-600 text-2xl" />
//             </div>
//           </div>
//         </div>

//         {/* Platform Health Overview */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Daily Active Users Trend */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Tendance des Utilisateurs Actifs</h3>
//             <div className="space-y-4">
//               {analytics?.dailyActiveUsers?.map((day, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FiUsers className="text-blue-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">
//                       {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-blue-600">{day.users}</p>
//                     <p className="text-sm text-gray-600">{day.percentage}%</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée d'activité</p>
//               )}
//             </div>
//           </div>

//           {/* Content Engagement Metrics */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement par Contenu</h3>
//             <div className="space-y-4">
//               {analytics?.contentEngagement?.map((content, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between"
//                 >
//                   <span className="text-sm font-medium text-gray-900 capitalize">
//                     {content.type}
//                   </span>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-purple-600">{content.engagement}</p>
//                     <p className="text-sm text-gray-600">{content.percentage}%</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée d'engagement</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Feature Usage Analytics */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">Utilisation des Fonctionnalités</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {analytics?.featureUsage?.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="text-center p-4 bg-gray-50 rounded-lg"
//               >
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                   {feature.icon === 'book' && <FiBook className="text-blue-600 text-xl" />}
//                   {feature.icon === 'users' && <FiUsers className="text-blue-600 text-xl" />}
//                   {feature.icon === 'target' && <FiTarget className="text-blue-600 text-xl" />}
//                   {feature.icon === 'shopping' && <FiShoppingCart className="text-blue-600 text-xl" />}
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">{feature.name}</p>
//                 <p className="text-2xl font-bold text-blue-600 mt-2">{feature.usage}</p>
//                 <p className="text-sm text-gray-600 mt-1">{feature.percentage}% des utilisateurs</p>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-8 col-span-4">Aucune donnée d'utilisation</p>
//             )}
//           </div>
//         </div>

//         {/* Revenue and Growth Metrics */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Revenue Breakdown */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Revenus</h3>
//             <div className="space-y-4">
//               {analytics?.revenueBreakdown?.map((source, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                       <FiDollarSign className="text-green-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{source.source}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-green-600">€{source.amount}</p>
//                     <p className="text-sm text-gray-600">{source.percentage}%</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée de revenus</p>
//               )}
//             </div>
//           </div>

//           {/* Growth Metrics */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Métriques de Croissance</h3>
//             <div className="space-y-4">
//               {analytics?.growthMetrics?.map((metric, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FiTrendingUp className="text-blue-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{metric.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-blue-600">{metric.value}</p>
//                     <p className="text-sm text-gray-600">{metric.change}%</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée de croissance</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Platform Health Indicators */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">Indicateurs de Santé de la Plateforme</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {analytics?.healthIndicators?.map((indicator, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="text-center p-4 bg-gray-50 rounded-lg"
//               >
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
//                   indicator.status === 'good' ? 'bg-green-100' :
//                   indicator.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
//                 }`}>
//                   {indicator.status === 'good' && <FiTrendingUp className="text-green-600 text-2xl" />}
//                   {indicator.status === 'warning' && <FiActivity className="text-yellow-600 text-2xl" />}
//                   {indicator.status === 'critical' && <FiTrendingDown className="text-red-600 text-2xl" />}
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">{indicator.name}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">{indicator.value}</p>
//                 <p className={`text-sm mt-1 ${
//                   indicator.status === 'good' ? 'text-green-600' :
//                   indicator.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
//                 }`}>
//                   {indicator.statusText}
//                 </p>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-8 col-span-3">Aucun indicateur de santé</p>
//             )}
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//             <button
//               onClick={fetchAnalytics}
//               className="ml-4 underline hover:no-underline"
//             >
//               Réessayer
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiUsers,
  FiBook,
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiDollarSign,
  FiCalendar,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiAward,
  FiShoppingCart,
  FiDatabase,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminAnalyticsOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/analytics/overview?range=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
        setNote(data.note || "");
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des statistiques");
      console.error("❌ Erreur chargement analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRangeLabel = () => {
    switch(timeRange) {
      case '7d': return '7 derniers jours';
      case '30d': return '30 derniers jours';
      case '90d': return '90 derniers jours';
      case '1y': return '1 an';
      default: return '30 derniers jours';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des statistiques réelles...
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
            <FiBarChart2 className="text-blue-600" />
            Vue d'ensemble de la plateforme
          </h1>
          <p className="text-gray-600 mt-2">
            Métriques clés et santé globale de la plateforme Vakio Boky
          </p>
          {note && (
            <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg inline-flex items-center">
              <FiAlertCircle className="mr-2" />
              <span className="text-sm">{note}</span>
            </div>
          )}
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
              <p className="text-sm text-gray-600 mt-1">Données réelles de votre base</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>📊 Affichage des données réelles pour: <span className="font-semibold">{getRangeLabel()}</span></p>
          </div>
        </div>

        {/* Key Platform Metrics - DONNÉES RÉELLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics ? analytics.totalUsers : 0}
                </p>
                <div className="flex items-center mt-1">
                  {analytics?.userGrowth >= 0 ? (
                    <>
                      <FiTrendingUp className="text-green-500 text-sm mr-1" />
                      <p className="text-sm text-green-600">
                        +{analytics?.userGrowth || 0}% croissance
                      </p>
                    </>
                  ) : (
                    <>
                      <FiTrendingDown className="text-red-500 text-sm mr-1" />
                      <p className="text-sm text-red-600">
                        {analytics?.userGrowth || 0}% croissance
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Dont {analytics?.activeUsers || 0} actifs</p>
            </div>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.activeUsers || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiActivity className="text-green-500 text-sm mr-1" />
                  <p className="text-sm text-green-600">
                    {analytics?.activeUsersPercentage || 0}% du total
                  </p>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiActivity className="text-green-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Mis à jour dans la période</p>
            </div>
          </motion.div>

          {/* Total Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Livres Publiés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalBooks || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiBook className="text-purple-500 text-sm mr-1" />
                  <p className="text-sm text-purple-600">
                    +{analytics?.booksGrowth || 0}% croissance
                  </p>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiBook className="text-purple-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Dans la base de données</p>
            </div>
          </motion.div>

          {/* Revenue - À IMPLÉMENTER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500 opacity-80"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{analytics?.totalRevenue || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiDollarSign className="text-yellow-500 text-sm mr-1" />
                  <p className="text-sm text-yellow-600">
                    À implémenter
                  </p>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiDollarSign className="text-yellow-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p className="text-yellow-600">Système de paiement à ajouter</p>
            </div>
          </motion.div>
        </div>

        {/* Platform Health Overview - DONNÉES RÉELLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Active Users Trend */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiCalendar className="mr-2 text-blue-600" />
              Tendance des Utilisateurs Actifs (7 derniers jours)
            </h3>
            {analytics?.dailyActiveUsers?.length > 0 ? (
              <div className="space-y-4">
                {analytics.dailyActiveUsers.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUsers className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(day.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{day.users}</p>
                      <p className="text-sm text-gray-600">{day.percentage}% du total</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiCalendar className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune donnée d'activité disponible</p>
                <p className="text-sm text-gray-400 mt-1">Les utilisateurs n'ont pas encore mis à jour leur profil</p>
              </div>
            )}
          </div>

          {/* Content Engagement Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiUsers className="mr-2 text-green-600" />
              Répartition par Rôle
            </h3>
            {analytics?.contentEngagement?.length > 0 ? (
              <div className="space-y-4">
                {analytics.contentEngagement.map((role, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        role.type.includes('Admin') ? 'bg-red-100' :
                        role.type.includes('Auteur') ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {role.type.includes('Admin') && <FiUsers className="text-red-600 text-sm" />}
                        {role.type.includes('Auteur') && <FiBook className="text-purple-600 text-sm" />}
                        {role.type.includes('Lecteur') && <FiEye className="text-blue-600 text-sm" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {role.type.toLowerCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{role.engagement}</p>
                      <p className="text-sm text-gray-600">{role.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiUsers className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucun rôle défini</p>
                <p className="text-sm text-gray-400 mt-1">Vérifiez la table utilisateur</p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Usage Analytics - DONNÉES RÉELLES */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Utilisation des Fonctionnalités
          </h3>
          {analytics?.featureUsage?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.featureUsage.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {feature.icon === 'book' && <FiBook className="text-blue-600 text-xl" />}
                    {feature.icon === 'users' && <FiUsers className="text-blue-600 text-xl" />}
                    {feature.icon === 'target' && <FiTarget className="text-blue-600 text-xl" />}
                    {feature.icon === 'shopping' && <FiShoppingCart className="text-blue-600 text-xl" />}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{feature.name}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{feature.usage}</p>
                  <p className="text-sm text-gray-600 mt-1">{feature.percentage}% des utilisateurs</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiActivity className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">Aucune donnée d'utilisation disponible</p>
            </div>
          )}
        </div>

        {/* Revenue and Growth Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiDollarSign className="mr-2 text-green-600" />
              Répartition des Revenus
            </h3>
            {analytics?.revenueBreakdown?.[0]?.amount > 0 ? (
              <div className="space-y-4">
                {analytics.revenueBreakdown.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FiDollarSign className="text-green-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">€{source.amount}</p>
                      <p className="text-sm text-gray-600">{source.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-yellow-50 rounded-lg">
                <FiDollarSign className="text-yellow-500 text-4xl mx-auto mb-3" />
                <p className="text-gray-700">Système de revenus à implémenter</p>
                <p className="text-sm text-gray-500 mt-2">
                  Ajoutez un système de paiement pour suivre les revenus
                </p>
              </div>
            )}
          </div>

          {/* Growth Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiTrendingUp className="mr-2 text-blue-600" />
              Métriques de Croissance ({getRangeLabel()})
            </h3>
            {analytics?.growthMetrics?.length > 0 ? (
              <div className="space-y-4">
                {analytics.growthMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {metric.change >= 0 ? (
                          <FiTrendingUp className="text-green-600 text-sm" />
                        ) : (
                          <FiTrendingDown className="text-red-600 text-sm" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.value}
                      </p>
                      <p className={`text-sm ${
                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiTrendingUp className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune métrique de croissance</p>
              </div>
            )}
          </div>
        </div>

        {/* Platform Health Indicators - DONNÉES RÉELLES */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Indicateurs de Santé de la Plateforme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics?.healthIndicators?.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-lg border"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  indicator.status === 'good' ? 'bg-green-100 border-2 border-green-200' :
                  indicator.status === 'warning' ? 'bg-yellow-100 border-2 border-yellow-200' : 
                  'bg-red-100 border-2 border-red-200'
                }`}>
                  {indicator.status === 'good' && <FiCheckCircle className="text-green-600 text-2xl" />}
                  {indicator.status === 'warning' && <FiAlertCircle className="text-yellow-600 text-2xl" />}
                  {indicator.status === 'critical' && <FiAlertCircle className="text-red-600 text-2xl" />}
                </div>
                <p className="text-sm font-medium text-gray-600">{indicator.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{indicator.value}</p>
                <p className={`text-sm mt-1 font-medium ${
                  indicator.status === 'good' ? 'text-green-600' :
                  indicator.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {indicator.statusText}
                </p>
              </motion.div>
            )) || (
              <div className="col-span-3 text-center py-8">
                <FiDatabase className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucun indicateur de santé disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <FiAlertCircle className="text-blue-600 text-xl mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Informations sur les données affichées</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ <span className="font-medium">Données réelles</span> : Tous les chiffres proviennent de votre base de données</li>
                <li>⚠️ <span className="font-medium">À implémenter</span> : Revenus et métriques avancées d'engagement</li>
                <li>📊 <span className="font-medium">Période</span> : Les données couvrent {getRangeLabel()}</li>
                <li>🔄 <span className="font-medium">Actualisation</span> : Changez la période pour voir différentes statistiques</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAnalytics}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Réessayer le chargement
            </button>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchAnalytics}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FiActivity className="mr-2" />
            Actualiser les statistiques
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
