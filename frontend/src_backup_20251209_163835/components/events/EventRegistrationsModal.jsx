import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUsers, FiMail, FiCalendar } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function EventRegistrationsModal({ event, isOpen, onClose }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      fetchRegistrations();
    }
  }, [isOpen, event]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // Implémenter l'appel API pour récupérer les inscriptions
      const response = await fetch(`http://localhost:5000/api/evenements/${event.id}/registrations`);
      const data = await response.json();
      
      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('❌ Erreur récupération inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const exportToCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Date inscription'];
    const csvData = registrations.map(reg => [
      reg.last_name || '',
      reg.first_name || '',
      reg.email || '',
      formatDate(reg.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscriptions-${event.title}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen || !event) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiUsers className="text-blue-500" />
              Inscriptions - {event.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {registrations.length} participant{registrations.length !== 1 ? 's' : ''} inscrit{registrations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {registrations.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-2"
              >
                Exporter CSV
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Chargement des inscriptions...</span>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune inscription pour le moment</p>
              <p className="text-gray-400 text-sm mt-2">
                Les inscriptions apparaîtront ici quand les utilisateurs s'inscriront à l'événement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* En-tête du tableau */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-semibold text-sm text-gray-700">
                <div className="col-span-4">Participant</div>
                <div className="col-span-5">Email</div>
                <div className="col-span-3">Date d'inscription</div>
              </div>

              {/* Liste des inscriptions */}
              {registrations.map((registration, index) => (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Nom et prénom */}
                  <div className="col-span-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm font-semibold">
                        {registration.first_name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {registration.first_name} {registration.last_name}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-5 flex items-center">
                    <FiMail className="text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm truncate">
                      {registration.email}
                    </span>
                  </div>

                  {/* Date d'inscription */}
                  <div className="col-span-3 flex items-center text-sm text-gray-500">
                    <FiCalendar className="text-gray-400 mr-2 flex-shrink-0" />
                    {formatDate(registration.created_at)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Statistiques */}
          {registrations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{registrations.length}</div>
                  <div className="text-sm text-blue-800">Total inscrits</div>
                </div>
                
                {event.max_participants && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {event.max_participants - registrations.length}
                    </div>
                    <div className="text-sm text-green-800">Places restantes</div>
                  </div>
                )}
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {event.max_participants 
                      ? `${Math.round((registrations.length / event.max_participants) * 100)}%`
                      : '100%'
                    }
                  </div>
                  <div className="text-sm text-purple-800">Taux de remplissage</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}