import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiVideo, 
  FiUsers, 
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiPlus,
  FiFilter
} from 'react-icons/fi';
// import InteractiveCalendar from '../../components/calendar/InteractiveCalendar';
import InteractiveCalendar from './components/calendar/InteractiveCalendar'; // ✅ CORRECT
import LiveSessionManager from '../../components/live/LiveSessionManager';

const EventsCalendarPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    {
      id: 'calendar',
      label: 'Calendrier des Événements',
      icon: FiCalendar,
      description: 'Explorez tous les événements littéraires à venir',
      color: 'blue'
    },
    {
      id: 'live',
      label: 'Sessions Live',
      icon: FiVideo,
      description: 'Participez aux discussions en direct avec les auteurs',
      color: 'purple'
    }
  ];

  // // Données mock pour les statistiques
  // const stats = [
  //   { value: "12", label: "Événements ce mois", icon: FiCalendar, color: "blue" },
  //   { value: "8", label: "Sessions Live", icon: FiVideo, color: "purple" },
  //   { value: "150+", label: "Participants", icon: FiUsers, color: "green" },
  //   { value: "95%", label: "Taux de satisfaction", icon: FiClock, color: "amber" }
  // ];

  // // Événements à venir (mock data)
  // const upcomingEvents = [
  //   {
  //     id: 1,
  //     title: "Rencontre avec l'auteur malgache",
  //     date: "2024-01-15",
  //     time: "18:00",
  //     type: "live",
  //     participants: 45,
  //     description: "Discussion interactive avec un auteur local"
  //   },
  //   {
  //     id: 2,
  //     title: "Club de lecture mensuel",
  //     date: "2024-01-20",
  //     time: "14:00",
  //     type: "event",
  //     participants: 32,
  //     description: "Échange autour du livre du mois"
  //   }
  // ];

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
            className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6"
          >
            Événements & Sessions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Découvrez les événements littéraires et participez aux sessions interactives 
            avec notre communauté de passionnés
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

        {/* Navigation par onglets stylisée */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm mb-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section Événements à venir (toujours visible) */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          {/* <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"> */}
            {/* <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                  <FiClock className="text-white text-lg" />
                </div>
                Prochains Événements
              </h2>
              <p className="text-gray-600">Ne manquez pas ces rendez-vous importants</p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Voir tout
              <FiArrowRight size={16} />
            </button>
          </div> */}

          {/* <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.type === 'live' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {event.type === 'live' ? '🔴 Live' : '📅 Événement'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock size={14} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers size={14} />
                    <span>{event.participants} participants</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div> */}
        </motion.section>

        {/* Contenu principal des onglets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                          <FiCalendar className="text-white text-lg" />
                        </div>
                        Calendrier des Événements
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Parcourez et planifiez votre participation aux événements
                      </p>
                    </div>
                    {/* <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold">
                      <FiPlus size={16} />
                      Nouvel Événement
                    </button> */}
                  </div>
                  <InteractiveCalendar />
                </div>
              </motion.div>
            )}

            {activeTab === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                          <FiVideo className="text-white text-lg" />
                        </div>
                        Sessions Live
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Rejoignez les discussions en direct avec auteurs et lecteurs
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold">
                        <FiFilter size={16} />
                        Filtrer
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold">
                        <FiPlus size={16} />
                        Nouvelle Session
                      </button>
                    </div>
                  </div>
                  <LiveSessionManager />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Organisez Votre Propre Événement
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Partagez votre passion pour la littérature en créant un événement ou 
              une session live pour la communauté Vakio Boky
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg">
              Proposer un Événement
            </button>
          </div> */}
        </motion.section>
      </div>
    </div>
  );
};

export default EventsCalendarPage;
