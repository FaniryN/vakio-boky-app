// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FiUsers,
//   FiUserCheck,
//   FiUserX,
//   FiTrendingUp,
//   FiTrendingDown,
//   FiActivity,
//   FiClock,
//   FiCalendar,
//   FiBarChart2,
//   FiTarget,
//   FiEye,
//   FiHeart,
//   FiMessageSquare,
//   FiShare2,
//   FiAward,
// } from "react-icons/fi";

// export default function AdminAnalyticsUsers() {
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
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/analytics/users?range=${timeRange}`, {
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
//       setError("Erreur lors du chargement des statistiques utilisateurs");
//       console.error("❌ Erreur chargement analytics utilisateurs:", err);
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
//             <FiUsers className="text-green-600" />
//             Analytics Utilisateurs
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Analysez l'engagement, la rétention et les comportements des utilisateurs
//           </p>
//         </div>

//         {/* Time Range Selector */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
//             <select
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="7d">7 derniers jours</option>
//               <option value="30d">30 derniers jours</option>
//               <option value="90d">90 derniers jours</option>
//               <option value="1y">1 an</option>
//             </select>
//           </div>
//         </div>

//         {/* User Metrics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs (DAU)</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.dailyActiveUsers || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiTrendingUp className="text-green-500 text-sm mr-1" />
//                   <p className="text-sm text-green-600">
//                     +{analytics?.dauGrowth || 0}% vs hier
//                   </p>
//                 </div>
//               </div>
//               <FiUserCheck className="text-blue-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Utilisateurs Mensuels (MAU)</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.monthlyActiveUsers || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiActivity className="text-blue-500 text-sm mr-1" />
//                   <p className="text-sm text-blue-600">
//                     {analytics?.mauPercentage || 0}% du total
//                   </p>
//                 </div>
//               </div>
//               <FiActivity className="text-green-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Taux de Rétention</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.retentionRate || 0}%
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiTarget className="text-purple-500 text-sm mr-1" />
//                   <p className="text-sm text-purple-600">
//                     7 jours après inscription
//                   </p>
//                 </div>
//               </div>
//               <FiTarget className="text-purple-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Score d'Engagement Moyen</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.avgEngagementScore || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiBarChart2 className="text-orange-500 text-sm mr-1" />
//                   <p className="text-sm text-orange-600">
//                     Sur 100 points
//                   </p>
//                 </div>
//               </div>
//               <FiBarChart2 className="text-orange-600 text-2xl" />
//             </div>
//           </div>
//         </div>

//         {/* User Activity and Engagement */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Daily Activity Pattern */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Motif d'Activité Quotidienne</h3>
//             <div className="space-y-4">
//               {analytics?.dailyActivityPattern?.map((hour, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                       <FiClock className="text-green-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">
//                       {hour.hour}:00
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-green-600">{hour.users}</p>
//                     <p className="text-sm text-gray-600">{hour.percentage}% d'activité</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée d'activité</p>
//               )}
//             </div>
//           </div>

//           {/* User Engagement Categories */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Catégories d'Engagement</h3>
//             <div className="space-y-4">
//               {analytics?.engagementCategories?.map((category, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       category.level === 'high' ? 'bg-green-100' :
//                       category.level === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
//                     }`}>
//                       {category.level === 'high' && <FiTrendingUp className="text-green-600 text-sm" />}
//                       {category.level === 'medium' && <FiActivity className="text-yellow-600 text-sm" />}
//                       {category.level === 'low' && <FiTrendingDown className="text-red-600 text-sm" />}
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{category.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-blue-600">{category.users}</p>
//                     <p className="text-sm text-gray-600">{category.percentage}%</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée d'engagement</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* User Behavior Analytics */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">Comportements Utilisateurs</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {analytics?.userBehaviors?.map((behavior, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="text-center p-4 bg-gray-50 rounded-lg"
//               >
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                   {behavior.icon === 'eye' && <FiEye className="text-blue-600 text-xl" />}
//                   {behavior.icon === 'heart' && <FiHeart className="text-blue-600 text-xl" />}
//                   {behavior.icon === 'message' && <FiMessageSquare className="text-blue-600 text-xl" />}
//                   {behavior.icon === 'share' && <FiShare2 className="text-blue-600 text-xl" />}
//                   {behavior.icon === 'award' && <FiAward className="text-blue-600 text-xl" />}
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">{behavior.name}</p>
//                 <p className="text-2xl font-bold text-blue-600 mt-2">{behavior.count}</p>
//                 <p className="text-sm text-gray-600 mt-1">{behavior.percentage}% des utilisateurs</p>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-8 col-span-4">Aucune donnée de comportement</p>
//             )}
//           </div>
//         </div>

//         {/* Cohort Analysis */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* User Retention Cohorts */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Analyse de Cohorte - Rétention</h3>
//             <div className="space-y-4">
//               {analytics?.cohortRetention?.map((cohort, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                       <FiCalendar className="text-purple-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{cohort.cohort}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-purple-600">{cohort.retention}%</p>
//                     <p className="text-sm text-gray-600">{cohort.users} utilisateurs</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée de cohorte</p>
//               )}
//             </div>
//           </div>

//           {/* User Segmentation */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Segmentation Utilisateurs</h3>
//             <div className="space-y-4">
//               {analytics?.userSegments?.map((segment, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       segment.type === 'power' ? 'bg-yellow-100' :
//                       segment.type === 'regular' ? 'bg-blue-100' :
//                       segment.type === 'casual' ? 'bg-green-100' : 'bg-gray-100'
//                     }`}>
//                       <FiUsers className={`text-sm ${
//                         segment.type === 'power' ? 'text-yellow-600' :
//                         segment.type === 'regular' ? 'text-blue-600' :
//                         segment.type === 'casual' ? 'text-green-600' : 'text-gray-600'
//                       }`} />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{segment.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-blue-600">{segment.users}</p>
//                     <p className="text-sm text-gray-600">{segment.percentage}%</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée de segmentation</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* User Journey and Funnel */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">Entonnoir d'Utilisation</h3>
//           <div className="space-y-4">
//             {analytics?.userFunnel?.map((step, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">{step.step}</h4>
//                     <p className="text-sm text-gray-600">{step.description}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="flex items-center gap-4">
//                     <div>
//                       <p className="text-lg font-bold text-blue-600">{step.users}</p>
//                       <p className="text-sm text-gray-600">Utilisateurs</p>
//                     </div>
//                     <div>
//                       <p className="text-lg font-bold text-green-600">{step.conversion}%</p>
//                       <p className="text-sm text-gray-600">Conversion</p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-8">Aucune donnée d'entonnoir</p>
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
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiTarget,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiAward,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

export default function AdminAnalyticsUsers() {
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
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/analytics/users?range=${timeRange}`, {
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
      setError("Erreur lors du chargement des statistiques utilisateurs");
      console.error("❌ Erreur chargement analytics utilisateurs:", err);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des statistiques utilisateurs...
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
            <FiUsers className="text-green-600" />
            Analytics Utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Analysez l'engagement, la rétention et les comportements des utilisateurs
          </p>
          {note && (
            <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg inline-flex items-center">
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
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>👥 Analyse des utilisateurs pour: <span className="font-semibold">{getRangeLabel()}</span></p>
          </div>
        </div>

        {/* User Metrics Overview - DONNÉES RÉELLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* DAU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs (DAU)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.dailyActiveUsers || 0}
                </p>
                <div className="flex items-center mt-1">
                  {analytics?.dauGrowth >= 0 ? (
                    <>
                      <FiTrendingUp className="text-green-500 text-sm mr-1" />
                      <p className="text-sm text-green-600">
                        +{analytics?.dauGrowth || 0}% vs hier
                      </p>
                    </>
                  ) : (
                    <>
                      <FiTrendingDown className="text-red-500 text-sm mr-1" />
                      <p className="text-sm text-red-600">
                        {analytics?.dauGrowth || 0}% vs hier
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUserCheck className="text-blue-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Actifs aujourd'hui</p>
            </div>
          </motion.div>

          {/* MAU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Mensuels (MAU)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.monthlyActiveUsers || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiActivity className="text-green-500 text-sm mr-1" />
                  <p className="text-sm text-green-600">
                    {analytics?.mauPercentage || 0}% du total
                  </p>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiActivity className="text-green-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Actifs sur {getRangeLabel()}</p>
            </div>
          </motion.div>

          {/* Retention Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Rétention</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.retentionRate || 0}%
                </p>
                <div className="flex items-center mt-1">
                  <FiTarget className="text-purple-500 text-sm mr-1" />
                  <p className="text-sm text-purple-600">
                    7 jours après inscription
                  </p>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiTarget className="text-purple-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Basé sur cohortes récentes</p>
            </div>
          </motion.div>

          {/* Engagement Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score d'Engagement Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.avgEngagementScore || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiBarChart2 className="text-orange-500 text-sm mr-1" />
                  <p className="text-sm text-orange-600">
                    Sur 100 points
                  </p>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FiBarChart2 className="text-orange-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Basé sur activité</p>
            </div>
          </motion.div>
        </div>

        {/* User Activity and Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Engagement Categories - DONNÉES RÉELLES */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiUsers className="mr-2 text-blue-600" />
              Répartition par Rôle
            </h3>
            {analytics?.engagementCategories?.length > 0 ? (
              <div className="space-y-4">
                {analytics.engagementCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        category.level === 'high' ? 'bg-red-100' :
                        category.level === 'medium' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {category.level === 'high' && <FiTrendingUp className="text-red-600 text-sm" />}
                        {category.level === 'medium' && <FiActivity className="text-purple-600 text-sm" />}
                        {category.level === 'low' && <FiTrendingDown className="text-blue-600 text-sm" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{category.users}</p>
                      <p className="text-sm text-gray-600">{category.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiUsers className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune donnée de rôle disponible</p>
              </div>
            )}
          </div>

          {/* User Behaviors - DONNÉES RÉELLES */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiHeart className="mr-2 text-red-600" />
              Préférences des Utilisateurs
            </h3>
            {analytics?.userBehaviors?.length > 0 ? (
              <div className="space-y-4">
                {analytics.userBehaviors.map((behavior, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <FiHeart className="text-red-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{behavior.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{behavior.count}</p>
                      <p className="text-sm text-gray-600">{behavior.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiHeart className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune préférence spécifiée</p>
                <p className="text-sm text-gray-400 mt-1">Les utilisateurs n'ont pas défini de genre préféré</p>
              </div>
            )}
          </div>
        </div>

        {/* Cohort Analysis - DONNÉES RÉELLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Retention Cohorts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiCalendar className="mr-2 text-purple-600" />
              Analyse de Cohorte - Rétention
            </h3>
            {analytics?.cohortRetention?.length > 0 ? (
              <div className="space-y-4">
                {analytics.cohortRetention.map((cohort, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiCalendar className="text-purple-600 text-sm" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{cohort.cohort}</span>
                        <p className="text-xs text-gray-500">{cohort.users} inscrits</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        cohort.retention >= 50 ? 'text-green-600' : 
                        cohort.retention >= 30 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {cohort.retention}%
                      </p>
                      <p className="text-sm text-gray-600">rétention</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiCalendar className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune donnée de cohorte</p>
                <p className="text-sm text-gray-400 mt-1">Insufficient data for cohort analysis</p>
              </div>
            )}
          </div>

          {/* User Segmentation - DONNÉES RÉELLES */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiBarChart2 className="mr-2 text-yellow-600" />
              Segmentation Utilisateurs
            </h3>
            {analytics?.userSegments?.length > 0 ? (
              <div className="space-y-4">
                {analytics.userSegments.map((segment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        segment.type === 'power' ? 'bg-yellow-100' :
                        segment.type === 'regular' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        <FiUsers className={`text-sm ${
                          segment.type === 'power' ? 'text-yellow-600' :
                          segment.type === 'regular' ? 'text-blue-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{segment.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{segment.users}</p>
                      <p className="text-sm text-gray-600">{segment.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiBarChart2 className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune donnée de segmentation</p>
              </div>
            )}
          </div>
        </div>

        {/* User Journey and Funnel - DONNÉES RÉELLES */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiTarget className="mr-2 text-green-600" />
            Entonnoir d'Utilisation
          </h3>
          {analytics?.userFunnel?.length > 0 ? (
            <div className="space-y-4">
              {analytics.userFunnel.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{step.step}</h4>
                      <p className="text-sm text-gray-600">Étape du parcours utilisateur</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{step.users}</p>
                        <p className="text-sm text-gray-600">Utilisateurs</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${
                          step.conversion >= 70 ? 'text-green-600' :
                          step.conversion >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {step.conversion}%
                        </p>
                        <p className="text-sm text-gray-600">Conversion</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiTarget className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">Aucune donnée d'entonnoir disponible</p>
              <p className="text-sm text-gray-400 mt-1">Données d'engagement à collecter</p>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <FiAlertCircle className="text-green-600 text-xl mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">À propos des données utilisateurs</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ <span className="font-medium">Rôles réels</span> : Basé sur la colonne "role" de la table utilisateur</li>
                <li>✅ <span className="font-medium">Préférences</span> : Basé sur "genre_prefere" des utilisateurs</li>
                <li>✅ <span className="font-medium">Activité</span> : Calculée à partir de "updated_at"</li>
                <li>⚠️ <span className="font-medium">Engagement détaillé</span> : Nécessite un système de tracking</li>
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
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <FiActivity className="mr-2" />
            Actualiser les statistiques utilisateurs
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Analyse basée sur {getRangeLabel()}
          </p>
        </div>
      </div>
    </div>
  );
}