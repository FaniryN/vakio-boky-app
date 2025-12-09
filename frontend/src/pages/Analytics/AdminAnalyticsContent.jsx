// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FiBook,
//   FiEye,
//   FiHeart,
//   FiMessageSquare,
//   FiShare2,
//   FiTrendingUp,
//   FiTrendingDown,
//   FiBarChart2,
//   FiTarget,
//   FiAward,
//   FiUsers,
//   FiClock,
//   FiStar,
// } from "react-icons/fi";

// export default function AdminAnalyticsContent() {
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
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/admin/analytics/content?range=${timeRange}`, {
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
//       setError("Erreur lors du chargement des statistiques de contenu");
//       console.error("❌ Erreur chargement analytics contenu:", err);
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
//             <FiBarChart2 className="text-purple-600" />
//             Analytics de Contenu
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Analysez les performances de tous les contenus de la plateforme
//           </p>
//         </div>

//         {/* Time Range Selector */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">Période d'analyse</h3>
//             <select
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="7d">7 derniers jours</option>
//               <option value="30d">30 derniers jours</option>
//               <option value="90d">90 derniers jours</option>
//               <option value="1y">1 an</option>
//             </select>
//           </div>
//         </div>

//         {/* Content Performance Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Lectures</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.totalReads || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiTrendingUp className="text-green-500 text-sm mr-1" />
//                   <p className="text-sm text-green-600">
//                     +{analytics?.readsGrowth || 0}% vs période précédente
//                   </p>
//                 </div>
//               </div>
//               <FiEye className="text-blue-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Interactions Totales</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.totalInteractions || 0}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiHeart className="text-red-500 text-sm mr-1" />
//                   <p className="text-sm text-red-600">
//                     Likes, commentaires, partages
//                   </p>
//                 </div>
//               </div>
//               <FiHeart className="text-red-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Temps de Lecture Moyen</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.avgReadingTime || 0}min
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiClock className="text-orange-500 text-sm mr-1" />
//                   <p className="text-sm text-orange-600">
//                     Par session de lecture
//                   </p>
//                 </div>
//               </div>
//               <FiClock className="text-orange-600 text-2xl" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Taux d'Achèvement</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {analytics?.completionRate || 0}%
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <FiTarget className="text-green-500 text-sm mr-1" />
//                   <p className="text-sm text-green-600">
//                     Livres terminés
//                   </p>
//                 </div>
//               </div>
//               <FiTarget className="text-green-600 text-2xl" />
//             </div>
//           </div>
//         </div>

//         {/* Content Type Performance */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Books Performance */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance des Livres</h3>
//             <div className="space-y-4">
//               {analytics?.booksPerformance?.map((book, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FiBook className="text-blue-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{book.title}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-blue-600">{book.reads}</p>
//                     <p className="text-sm text-gray-600">lectures</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée de performance</p>
//               )}
//             </div>
//           </div>

//           {/* Events Performance */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance des Événements</h3>
//             <div className="space-y-4">
//               {analytics?.eventsPerformance?.map((event, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                       <FiUsers className="text-green-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{event.title}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-green-600">{event.attendees}</p>
//                     <p className="text-sm text-gray-600">participants</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée d'événement</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content Engagement Metrics */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">Métriques d'Engagement par Type</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {analytics?.contentEngagement?.map((content, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="text-center p-4 bg-gray-50 rounded-lg"
//               >
//                 <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                   {content.type === 'books' && <FiBook className="text-purple-600 text-xl" />}
//                   {content.type === 'posts' && <FiMessageSquare className="text-purple-600 text-xl" />}
//                   {content.type === 'events' && <FiUsers className="text-purple-600 text-xl" />}
//                   {content.type === 'challenges' && <FiTarget className="text-purple-600 text-xl" />}
//                 </div>
//                 <p className="text-sm font-medium text-gray-600 capitalize">{content.type}</p>
//                 <p className="text-2xl font-bold text-purple-600 mt-2">{content.engagement}</p>
//                 <p className="text-sm text-gray-600 mt-1">{content.percentage}% du total</p>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-8 col-span-4">Aucune donnée d'engagement</p>
//             )}
//           </div>
//         </div>

//         {/* Top Performing Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Most Read Books */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Livres les Plus Lus</h3>
//             <div className="space-y-4">
//               {analytics?.topBooks?.map((book, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <span className="text-blue-600 font-bold">#{index + 1}</span>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900">{book.title}</h4>
//                       <p className="text-sm text-gray-600">par {book.author}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-blue-600">{book.reads}</p>
//                     <p className="text-sm text-gray-600">lectures</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucun livre trouvé</p>
//               )}
//             </div>
//           </div>

//           {/* Most Engaging Posts */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Publications les Plus Engagées</h3>
//             <div className="space-y-4">
//               {analytics?.topPosts?.map((post, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                       <span className="text-red-600 font-bold">#{index + 1}</span>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h4>
//                       <p className="text-sm text-gray-600">par {post.author}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-red-600">{post.engagement}</p>
//                     <p className="text-sm text-gray-600">interactions</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune publication trouvée</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content Categories and Genres */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Popular Genres */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Genres Populaires</h3>
//             <div className="space-y-4">
//               {analytics?.popularGenres?.map((genre, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between"
//                 >
//                   <span className="text-sm font-medium text-gray-900">{genre.name}</span>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-orange-600">{genre.reads}</p>
//                     <p className="text-sm text-gray-600">{genre.percentage}%</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune donnée de genre</p>
//               )}
//             </div>
//           </div>

//           {/* Content Quality Metrics */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Métriques de Qualité</h3>
//             <div className="space-y-4">
//               {analytics?.qualityMetrics?.map((metric, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
//                       <FiStar className="text-yellow-600 text-sm" />
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">{metric.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-yellow-600">{metric.value}</p>
//                     <p className="text-sm text-gray-600">{metric.unit}</p>
//                   </div>
//                 </motion.div>
//               )) || (
//                 <p className="text-gray-500 text-center py-8">Aucune métrique de qualité</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content Trends */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">Tendances de Contenu</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {analytics?.contentTrends?.map((trend, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="text-center p-4 bg-gray-50 rounded-lg"
//               >
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
//                   trend.trend === 'up' ? 'bg-green-100' :
//                   trend.trend === 'down' ? 'bg-red-100' : 'bg-blue-100'
//                 }`}>
//                   {trend.trend === 'up' && <FiTrendingUp className="text-green-600 text-2xl" />}
//                   {trend.trend === 'down' && <FiTrendingDown className="text-red-600 text-2xl" />}
//                   {trend.trend === 'stable' && <FiBarChart2 className="text-blue-600 text-2xl" />}
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">{trend.metric}</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">{trend.value}</p>
//                 <p className={`text-sm mt-1 ${
//                   trend.trend === 'up' ? 'text-green-600' :
//                   trend.trend === 'down' ? 'text-red-600' : 'text-blue-600'
//                 }`}>
//                   {trend.change}% vs période précédente
//                 </p>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-8 col-span-3">Aucune donnée de tendance</p>
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
  FiBook,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiTarget,
  FiAward,
  FiUsers,
  FiClock,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

export default function AdminAnalyticsContent() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vakio_token");
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/admin/analytics/content?range=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
        setNote(data.note || "");
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des statistiques de contenu");
      console.error("❌ Erreur chargement analytics contenu:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRangeLabel = () => {
    switch (timeRange) {
      case "7d":
        return "7 derniers jours";
      case "30d":
        return "30 derniers jours";
      case "90d":
        return "90 derniers jours";
      case "1y":
        return "1 an";
      default:
        return "30 derniers jours";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des statistiques de contenu...
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
            <FiBarChart2 className="text-purple-600" />
            Analytics de Contenu
          </h1>
          <p className="text-gray-600 mt-2">
            Analysez les performances de tous les contenus de la plateforme
          </p>
          {note && (
            <div className="mt-3 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-lg inline-flex items-center">
              <FiAlertCircle className="mr-2" />
              <span className="text-sm">{note}</span>
            </div>
          )}
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Période d'analyse
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Données réelles de votre base
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              📚 Analyse du contenu pour:{" "}
              <span className="font-semibold">{getRangeLabel()}</span>
            </p>
          </div>
        </div>

        {/* Content Performance Overview - DONNÉES RÉELLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Reads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Lectures
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalReads?.toLocaleString() || 0}
                </p>
                <div className="flex items-center mt-1">
                  {analytics?.readsGrowth >= 0 ? (
                    <>
                      <FiTrendingUp className="text-green-500 text-sm mr-1" />
                      <p className="text-sm text-green-600">
                        +{analytics?.readsGrowth || 0}% croissance
                      </p>
                    </>
                  ) : (
                    <>
                      <FiTrendingDown className="text-red-500 text-sm mr-1" />
                      <p className="text-sm text-red-600">
                        {analytics?.readsGrowth || 0}% croissance
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiEye className="text-blue-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Estimations basées sur livres</p>
            </div>
          </motion.div>

          {/* Total Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Interactions Totales
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalInteractions?.toLocaleString() || 0}
                </p>
                <div className="flex items-center mt-1">
                  <FiHeart className="text-red-500 text-sm mr-1" />
                  <p className="text-sm text-red-600">
                    Likes, commentaires, partages
                  </p>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FiHeart className="text-red-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Interactions estimées</p>
            </div>
          </motion.div>

          {/* Avg Reading Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Temps de Lecture Moyen
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.avgReadingTime || 0}min
                </p>
                <div className="flex items-center mt-1">
                  <FiClock className="text-orange-500 text-sm mr-1" />
                  <p className="text-sm text-orange-600">
                    Par session de lecture
                  </p>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FiClock className="text-orange-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Valeur estimée</p>
            </div>
          </motion.div>

          {/* Completion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taux d'Achèvement
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.completionRate || 0}%
                </p>
                <div className="flex items-center mt-1">
                  <FiTarget className="text-green-500 text-sm mr-1" />
                  <p className="text-sm text-green-600">Livres terminés</p>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiTarget className="text-green-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Valeur estimée</p>
            </div>
          </motion.div>
        </div>

        {/* Content Type Performance - DONNÉES RÉELLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Books Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiBook className="mr-2 text-blue-600" />
              Performance des Livres ({analytics?.booksPerformance?.length || 0}
              )
            </h3>
            {analytics?.booksPerformance?.length > 0 ? (
              <div className="space-y-4">
                {analytics.booksPerformance.map((book, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiBook className="text-blue-600 text-sm" />
                      </div>
                      <div className="max-w-xs">
                        <span className="text-sm font-medium text-gray-900 block truncate">
                          {book.title || "Sans titre"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Statut: {book.status || "Inconnu"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {book.reads}
                      </p>
                      <p className="text-sm text-gray-600">lectures</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiBook className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucun livre dans la base</p>
                <p className="text-sm text-gray-400 mt-1">
                  Ajoutez des livres pour voir les statistiques
                </p>
              </div>
            )}
          </div>

          {/* Content Engagement Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiBarChart2 className="mr-2 text-purple-600" />
              Engagement par Type de Contenu
            </h3>
            {analytics?.contentEngagement?.length > 0 ? (
              <div className="space-y-4">
                {analytics.contentEngagement.map((content, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        {content.type === "books" && (
                          <FiBook className="text-purple-600 text-sm" />
                        )}
                        {content.type === "posts" && (
                          <FiMessageSquare className="text-purple-600 text-sm" />
                        )}
                        {content.type === "events" && (
                          <FiUsers className="text-purple-600 text-sm" />
                        )}
                        {content.type === "challenges" && (
                          <FiTarget className="text-purple-600 text-sm" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {content.type === "books"
                          ? "Livres"
                          : content.type === "posts"
                          ? "Publications"
                          : content.type === "events"
                          ? "Événements"
                          : "Défis"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        {content.engagement}
                      </p>
                      <p className="text-sm text-gray-600">
                        {content.percentage}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiBarChart2 className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune donnée d'engagement</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Content - DONNÉES RÉELLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Read Books */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiBook className="mr-2 text-blue-600" />
              Livres les Plus Lus
            </h3>
            {analytics?.topBooks?.length > 0 ? (
              <div className="space-y-4">
                {analytics.topBooks.map((book, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="max-w-xs">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {book.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          par {book.author || "Auteur inconnu"}
                        </p>
                        {book.status && (
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                            {book.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {book.reads}
                      </p>
                      <p className="text-sm text-gray-600">lectures</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiBook className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucun livre trouvé</p>
              </div>
            )}
          </div>

          {/* Popular Genres */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiHeart className="mr-2 text-orange-600" />
              Genres Populaires
            </h3>
            {analytics?.popularGenres?.length > 0 ? (
              <div className="space-y-4">
                {analytics.popularGenres.map((genre, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <FiHeart className="text-orange-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {genre.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {genre.reads}
                      </p>
                      <p className="text-sm text-gray-600">
                        {genre.percentage}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiHeart className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Aucun genre spécifié</p>
                <p className="text-sm text-gray-400 mt-1">
                  Les utilisateurs n'ont pas défini de préférences
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Quality Metrics - DONNÉES RÉELLES */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Métriques de Qualité du Contenu
          </h3>
          {analytics?.qualityMetrics?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.qualityMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiStar className="text-yellow-600 text-xl" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{metric.unit}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiStar className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">
                Aucune métrique de qualité disponible
              </p>
            </div>
          )}
        </div>

        {/* Content Trends - DONNÉES RÉELLES */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Tendances de Contenu ({getRangeLabel()})
          </h3>
          {analytics?.contentTrends?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.contentTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center p-4 bg-gray-50 rounded-lg border"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      trend.trend === "up"
                        ? "bg-green-100 border-2 border-green-200"
                        : trend.trend === "down"
                        ? "bg-red-100 border-2 border-red-200"
                        : "bg-blue-100 border-2 border-blue-200"
                    }`}
                  >
                    {trend.trend === "up" && (
                      <FiTrendingUp className="text-green-600 text-2xl" />
                    )}
                    {trend.trend === "down" && (
                      <FiTrendingDown className="text-red-600 text-2xl" />
                    )}
                    {trend.trend === "stable" && (
                      <FiBarChart2 className="text-blue-600 text-2xl" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {trend.metric}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {trend.value}
                  </p>
                  <p
                    className={`text-sm mt-1 font-medium ${
                      trend.trend === "up"
                        ? "text-green-600"
                        : trend.trend === "down"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {trend.change >= 0 ? "+" : ""}
                    {trend.change}% vs période précédente
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiTrendingUp className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">
                Aucune donnée de tendance disponible
              </p>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <FiAlertCircle className="text-purple-600 text-xl mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">
                À propos des données de contenu
              </h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>
                  ✅ <span className="font-medium">Livres réels</span> : Données
                  extraites de la table "livres"
                </li>
                <li>
                  ✅ <span className="font-medium">Auteurs</span> : Jointure
                  avec table "utilisateur"
                </li>
                <li>
                  ⚠️ <span className="font-medium">Métriques d'engagement</span>{" "}
                  : Estimations jusqu'à implémentation tracking
                </li>
                <li>
                  📈 <span className="font-medium">Tendances</span> : Basées sur
                  données disponibles
                </li>
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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center mx-auto"
          >
            <FiActivity className="mr-2" />
            Actualiser les statistiques de contenu
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Données actualisées à {new Date().toLocaleTimeString("fr-FR")}
          </p>
        </div>
      </div>
    </div>
  );
}
