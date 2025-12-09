// // // import { useState, useEffect } from 'react';
// // // import { motion } from 'framer-motion';
// // // import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiUsers, FiEye } from 'react-icons/fi';
// // // import { useEvenements } from '@/hooks/useEvenements';
// // // import { useAuth } from '@/hooks/useAuth';
// // // import Button from '@/components/ui/Button';
// // // import Input from '@/components/ui/Input';
// // // import CreateEventModal from '@/components/events/CreateEventModal';
// // // import EditEventModal from '@/components/events/EditEventModal';
// // // import EventRegistrationsModal from '@/components/events/EventRegistrationsModal';

// // // export default function AdminEvents() {
// // //   const { events, loading, error, fetchEvents } = useEvenements();
// // //   const { isAdmin, isAuthenticated } = useAuth();

// // //   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
// // //   const [editingEvent, setEditingEvent] = useState(null);
// // //   const [viewingRegistrations, setViewingRegistrations] = useState(null);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [statusFilter, setStatusFilter] = useState('all');
// // //   const [selectedEvent, setSelectedEvent] = useState(null);
// // //   const [showModerationModal, setShowModerationModal] = useState(false);

// // //   useEffect(() => {
// // //     if (isAuthenticated && isAdmin) {
// // //       fetchEvents();
// // //     }
// // //   }, [isAuthenticated, isAdmin]);

// // //   if (!isAuthenticated || !isAdmin) {
// // //     return (
// // //       <div className="min-h-screen pt-20 flex items-center justify-center">
// // //         <div className="text-center">
// // //           <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
// // //           <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const filteredEvents = events.filter(event => {
// // //     const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
// // //     const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
// // //     return matchesSearch && matchesStatus;
// // //   });

// // //   const formatDate = (dateString) => {
// // //     return new Intl.DateTimeFormat('fr-FR', {
// // //       day: 'numeric',
// // //       month: 'short',
// // //       year: 'numeric',
// // //       hour: '2-digit',
// // //       minute: '2-digit'
// // //     }).format(new Date(dateString));
// // //   };

// // //   const isEventUpcoming = (eventDate) => {
// // //     return new Date(eventDate) > new Date();
// // //   };

// // //   const handleDeleteEvent = async (eventId) => {
// // //     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
// // //       return;
// // //     }

// // //     try {
// // //       const token = localStorage.getItem('vakio_token');
// // //       const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
// // //         method: 'DELETE',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`
// // //         }
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error('Erreur lors de la suppression');
// // //       }

// // //       await fetchEvents();
// // //       alert('Événement supprimé avec succès');
// // //     } catch (error) {
// // //       console.error('❌ Erreur suppression:', error);
// // //       alert('Erreur lors de la suppression de l\'événement');
// // //     }
// // //   };

// // //   const handleApproveEvent = async (eventId) => {
// // //     try {
// // //       const token = localStorage.getItem('vakio_token');
// // //       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/approve`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`
// // //         }
// // //       });

// // //       const data = await response.json();

// // //       if (data.success) {
// // //         await fetchEvents();
// // //         alert('Événement approuvé avec succès');
// // //       } else {
// // //         alert(data.error || 'Erreur lors de l\'approbation');
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur approbation:', error);
// // //       alert('Erreur lors de l\'approbation de l\'événement');
// // //     }
// // //   };

// // //   const handleRejectEvent = async (eventId, reason) => {
// // //     try {
// // //       const token = localStorage.getItem('vakio_token');
// // //       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/reject`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${token}`
// // //         },
// // //         body: JSON.stringify({ reason })
// // //       });

// // //       const data = await response.json();

// // //       if (data.success) {
// // //         await fetchEvents();
// // //         alert('Événement rejeté');
// // //       } else {
// // //         alert(data.error || 'Erreur lors du rejet');
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur rejet:', error);
// // //       alert('Erreur lors du rejet de l\'événement');
// // //     }
// // //   };

// // //   const handleFeatureEvent = async (eventId, featured) => {
// // //     try {
// // //       const token = localStorage.getItem('vakio_token');
// // //       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/feature`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${token}`
// // //         },
// // //         body: JSON.stringify({ featured })
// // //       });

// // //       const data = await response.json();

// // //       if (data.success) {
// // //         await fetchEvents();
// // //         alert(featured ? 'Événement mis en avant' : 'Événement retiré des mises en avant');
// // //       } else {
// // //         alert(data.error || 'Erreur lors de la mise à jour');
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur mise en avant:', error);
// // //       alert('Erreur lors de la mise à jour de l\'événement');
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 pt-20">
// // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //           <div className="flex justify-center items-center py-12">
// // //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
// // //             <span className="ml-3 text-gray-600">Chargement des événements...</span>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 pt-20">
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
// // //         {/* Header */}
// // //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
// // //           <div>
// // //             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
// // //               <FiCalendar className="text-purple-600" />
// // //               Administration Événements
// // //             </h1>
// // //             <p className="text-gray-600 mt-2">
// // //               Gérer les événements Vakio Boky
// // //             </p>
// // //           </div>
          
// // //           <Button
// // //             variant="primary"
// // //             onClick={() => setIsCreateModalOpen(true)}
// // //             className="flex items-center gap-2"
// // //           >
// // //             <FiPlus />
// // //             Nouvel événement
// // //           </Button>
// // //         </div>

// // //         {/* Stats */}
// // //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// // //           <div className="bg-white rounded-lg shadow-sm p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600">Total Événements</p>
// // //                 <p className="text-2xl font-bold text-gray-900">{events.length}</p>
// // //               </div>
// // //               <FiCalendar className="text-purple-600 text-xl" />
// // //             </div>
// // //           </div>
          
// // //           <div className="bg-white rounded-lg shadow-sm p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600">À venir</p>
// // //                 <p className="text-2xl font-bold text-gray-900">
// // //                   {events.filter(event => isEventUpcoming(event.event_date)).length}
// // //                 </p>
// // //               </div>
// // //               <FiEye className="text-green-600 text-xl" />
// // //             </div>
// // //           </div>
          
// // //           <div className="bg-white rounded-lg shadow-sm p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600">Passés</p>
// // //                 <p className="text-2xl font-bold text-gray-900">
// // //                   {events.filter(event => !isEventUpcoming(event.event_date)).length}
// // //                 </p>
// // //               </div>
// // //               <FiUsers className="text-gray-600 text-xl" />
// // //             </div>
// // //           </div>
          
// // //           <div className="bg-white rounded-lg shadow-sm p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-sm font-medium text-gray-600">Total Participants</p>
// // //                 <p className="text-2xl font-bold text-gray-900">
// // //                   {events.reduce((sum, event) => sum + (event.registered_count || 0), 0)}
// // //                 </p>
// // //               </div>
// // //               <FiUsers className="text-blue-600 text-xl" />
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Barre de recherche et filtres */}
// // //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// // //           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
// // //             <div className="flex flex-col sm:flex-row gap-4">
// // //               <Input
// // //                 placeholder="Rechercher un événement..."
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //                 className="md:w-80"
// // //               />
// // //               <select
// // //                 value={statusFilter}
// // //                 onChange={(e) => setStatusFilter(e.target.value)}
// // //                 className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               >
// // //                 <option value="all">Tous les statuts</option>
// // //                 <option value="pending">En attente</option>
// // //                 <option value="active">Actif</option>
// // //                 <option value="completed">Terminé</option>
// // //                 <option value="rejected">Rejeté</option>
// // //               </select>
// // //             </div>
// // //             <div className="text-sm text-gray-600">
// // //               {filteredEvents.length} événement(s) trouvé(s)
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Tableau des événements */}
// // //         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// // //           {filteredEvents.length === 0 ? (
// // //             <div className="text-center py-12">
// // //               <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
// // //               <p className="text-gray-500">
// // //                 {searchTerm ? 'Aucun événement correspondant' : 'Aucun événement trouvé'}
// // //               </p>
// // //               <Button
// // //                 variant="primary"
// // //                 onClick={() => setIsCreateModalOpen(true)}
// // //                 className="mt-4"
// // //               >
// // //                 <FiPlus className="mr-2" />
// // //                 Créer un événement
// // //               </Button>
// // //             </div>
// // //           ) : (
// // //             <div className="overflow-x-auto">
// // //               <table className="min-w-full divide-y divide-gray-200">
// // //                 <thead className="bg-gray-50">
// // //                   <tr>
// // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                       Événement
// // //                     </th>
// // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                       Date & Lieu
// // //                     </th>
// // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                       Participants
// // //                     </th>
// // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                       Statut
// // //                     </th>
// // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                       Actions
// // //                     </th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody className="bg-white divide-y divide-gray-200">
// // //                   {filteredEvents.map((event) => (
// // //                     <motion.tr
// // //                       key={event.id}
// // //                       initial={{ opacity: 0, y: 20 }}
// // //                       animate={{ opacity: 1, y: 0 }}
// // //                       className="hover:bg-gray-50"
// // //                     >
// // //                       <td className="px-6 py-4">
// // //                         <div className="flex items-center">
// // //                           <div className="h-10 w-10 flex-shrink-0">
// // //                             {event.image_url ? (
// // //                               <img
// // //                                 className="h-10 w-10 rounded-lg object-cover"
// // //                                 src={event.image_url}
// // //                                 alt={event.title}
// // //                               />
// // //                             ) : (
// // //                               <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
// // //                                 <FiCalendar className="text-gray-400" />
// // //                               </div>
// // //                             )}
// // //                           </div>
// // //                           <div className="ml-4">
// // //                             <div className="text-sm font-medium text-gray-900">
// // //                               {event.title}
// // //                             </div>
// // //                             <div className="text-sm text-gray-500 line-clamp-1">
// // //                               {event.description}
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <div className="text-sm text-gray-900">{formatDate(event.event_date)}</div>
// // //                         <div className="text-sm text-gray-500">{event.location}</div>
// // //                       </td>
// // //                       <td className="px-6 py-4 text-sm text-gray-900">
// // //                         <div>{event.registered_count || 0} / {event.max_participants || '∞'}</div>
// // //                         {event.price > 0 && (
// // //                           <div className="text-green-600">{event.price} €</div>
// // //                         )}
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// // //                           isEventUpcoming(event.event_date)
// // //                             ? 'bg-green-100 text-green-800'
// // //                             : 'bg-gray-100 text-gray-800'
// // //                         }`}>
// // //                           {isEventUpcoming(event.event_date) ? 'À venir' : 'Passé'}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-6 py-4 text-sm font-medium">
// // //                         <div className="flex gap-2 flex-wrap">
// // //                           {event.status === 'pending' && (
// // //                             <>
// // //                               <Button
// // //                                 variant="success"
// // //                                 size="sm"
// // //                                 onClick={() => handleApproveEvent(event.id)}
// // //                                 className="flex items-center gap-1"
// // //                               >
// // //                                 <FiCheck />
// // //                                 Approuver
// // //                               </Button>
// // //                               <Button
// // //                                 variant="danger"
// // //                                 size="sm"
// // //                                 onClick={() => {
// // //                                   const reason = prompt('Motif du rejet:');
// // //                                   if (reason) handleRejectEvent(event.id, reason);
// // //                                 }}
// // //                                 className="flex items-center gap-1"
// // //                               >
// // //                                 <FiX />
// // //                                 Rejeter
// // //                               </Button>
// // //                             </>
// // //                           )}
// // //                           <Button
// // //                             variant={event.featured ? "warning" : "outline"}
// // //                             size="sm"
// // //                             onClick={() => handleFeatureEvent(event.id, !event.featured)}
// // //                             className="flex items-center gap-1"
// // //                           >
// // //                             <FiTrendingUp />
// // //                             {event.featured ? 'Retirer' : 'Mettre en avant'}
// // //                           </Button>
// // //                           <Button
// // //                             variant="secondary"
// // //                             size="sm"
// // //                             onClick={() => setViewingRegistrations(event)}
// // //                             className="flex items-center gap-1"
// // //                           >
// // //                             <FiUsers />
// // //                             Inscrits
// // //                           </Button>
// // //                           <Button
// // //                             variant="secondary"
// // //                             size="sm"
// // //                             onClick={() => setEditingEvent(event)}
// // //                             className="flex items-center gap-1"
// // //                           >
// // //                             <FiEdit />
// // //                             Modifier
// // //                           </Button>
// // //                           <Button
// // //                             variant="danger"
// // //                             size="sm"
// // //                             onClick={() => handleDeleteEvent(event.id)}
// // //                             className="flex items-center gap-1"
// // //                           >
// // //                             <FiTrash2 />
// // //                             Supprimer
// // //                           </Button>
// // //                         </div>
// // //                       </td>
// // //                     </motion.tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Modales */}
// // //       <CreateEventModal
// // //         isOpen={isCreateModalOpen}
// // //         onClose={() => setIsCreateModalOpen(false)}
// // //         onSuccess={() => {
// // //           setIsCreateModalOpen(false);
// // //           fetchEvents();
// // //         }}
// // //       />

// // //       <EditEventModal
// // //         event={editingEvent}
// // //         isOpen={!!editingEvent}
// // //         onClose={() => setEditingEvent(null)}
// // //         onSuccess={() => {
// // //           setEditingEvent(null);
// // //           fetchEvents();
// // //         }}
// // //       />

// // //       <EventRegistrationsModal
// // //         event={viewingRegistrations}
// // //         isOpen={!!viewingRegistrations}
// // //         onClose={() => setViewingRegistrations(null)}
// // //       />
// // //     </div>
// // //   );
// // // }
// // import { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import { 
// //   FiPlus, 
// //   FiEdit, 
// //   FiTrash2, 
// //   FiCalendar, 
// //   FiUsers, 
// //   FiEye,
// //   FiCheck,
// //   FiX,
// //   FiTrendingUp
// // } from 'react-icons/fi';
// // import { useEvenements } from '@/hooks/useEvenements';
// // import { useAuth } from '@/hooks/useAuth';
// // import Button from '@/components/ui/Button';
// // import Input from '@/components/ui/Input';
// // import CreateEventModal from '@/components/events/CreateEventModal';
// // import EditEventModal from '@/components/events/EditEventModal';
// // import EventRegistrationsModal from '@/components/events/EventRegistrationsModal';

// // export default function AdminEvents() {
// //   const { events, loading, error, fetchEvents } = useEvenements();
// //   const { isAdmin, isAuthenticated } = useAuth();

// //   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
// //   const [editingEvent, setEditingEvent] = useState(null);
// //   const [viewingRegistrations, setViewingRegistrations] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('all');
// //   const [selectedEvent, setSelectedEvent] = useState(null);
// //   const [showModerationModal, setShowModerationModal] = useState(false);

// //   useEffect(() => {
// //     if (isAuthenticated && isAdmin) {
// //       fetchEvents();
// //     }
// //   }, [isAuthenticated, isAdmin]);

// //   if (!isAuthenticated || !isAdmin) {
// //     return (
// //       <div className="min-h-screen pt-20 flex items-center justify-center">
// //         <div className="text-center">
// //           <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
// //           <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const filteredEvents = events.filter(event => {
// //     const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
// //     return matchesSearch && matchesStatus;
// //   });

// //   const formatDate = (dateString) => {
// //     return new Intl.DateTimeFormat('fr-FR', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     }).format(new Date(dateString));
// //   };

// //   const isEventUpcoming = (eventDate) => {
// //     return new Date(eventDate) > new Date();
// //   };

// //   const handleDeleteEvent = async (eventId) => {
// //     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
// //       return;
// //     }

// //     try {
// //       const token = localStorage.getItem('vakio_token');
// //       const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
// //         method: 'DELETE',
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       if (!response.ok) {
// //         throw new Error('Erreur lors de la suppression');
// //       }

// //       await fetchEvents();
// //       alert('Événement supprimé avec succès');
// //     } catch (error) {
// //       console.error('❌ Erreur suppression:', error);
// //       alert('Erreur lors de la suppression de l\'événement');
// //     }
// //   };

// //   const handleApproveEvent = async (eventId) => {
// //     try {
// //       const token = localStorage.getItem('vakio_token');
// //       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/approve`, {
// //         method: 'PUT',
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         await fetchEvents();
// //         alert('Événement approuvé avec succès');
// //       } else {
// //         alert(data.error || 'Erreur lors de l\'approbation');
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur approbation:', error);
// //       alert('Erreur lors de l\'approbation de l\'événement');
// //     }
// //   };

// //   const handleRejectEvent = async (eventId, reason) => {
// //     try {
// //       const token = localStorage.getItem('vakio_token');
// //       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/reject`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({ reason })
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         await fetchEvents();
// //         alert('Événement rejeté');
// //       } else {
// //         alert(data.error || 'Erreur lors du rejet');
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur rejet:', error);
// //       alert('Erreur lors du rejet de l\'événement');
// //     }
// //   };

// //   const handleFeatureEvent = async (eventId, featured) => {
// //     try {
// //       const token = localStorage.getItem('vakio_token');
// //       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/feature`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({ featured })
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         await fetchEvents();
// //         alert(featured ? 'Événement mis en avant' : 'Événement retiré des mises en avant');
// //       } else {
// //         alert(data.error || 'Erreur lors de la mise à jour');
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur mise en avant:', error);
// //       alert('Erreur lors de la mise à jour de l\'événement');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 pt-20">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //           <div className="flex justify-center items-center py-12">
// //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
// //             <span className="ml-3 text-gray-600">Chargement des événements...</span>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 pt-20">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
// //               <FiCalendar className="text-purple-600" />
// //               Administration Événements
// //             </h1>
// //             <p className="text-gray-600 mt-2">
// //               Gérer les événements Vakio Boky
// //             </p>
// //           </div>
          
// //           <Button
// //             variant="primary"
// //             onClick={() => setIsCreateModalOpen(true)}
// //             className="flex items-center gap-2"
// //           >
// //             <FiPlus />
// //             Nouvel événement
// //           </Button>
// //         </div>

// //         {/* Stats */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white rounded-lg shadow-sm p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-gray-600">Total Événements</p>
// //                 <p className="text-2xl font-bold text-gray-900">{events.length}</p>
// //               </div>
// //               <FiCalendar className="text-purple-600 text-xl" />
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-lg shadow-sm p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-gray-600">À venir</p>
// //                 <p className="text-2xl font-bold text-gray-900">
// //                   {events.filter(event => isEventUpcoming(event.event_date)).length}
// //                 </p>
// //               </div>
// //               <FiEye className="text-green-600 text-xl" />
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-lg shadow-sm p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-gray-600">Passés</p>
// //                 <p className="text-2xl font-bold text-gray-900">
// //                   {events.filter(event => !isEventUpcoming(event.event_date)).length}
// //                 </p>
// //               </div>
// //               <FiUsers className="text-gray-600 text-xl" />
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-lg shadow-sm p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm font-medium text-gray-600">Total Participants</p>
// //                 <p className="text-2xl font-bold text-gray-900">
// //                   {events.reduce((sum, event) => sum + (event.registered_count || 0), 0)}
// //                 </p>
// //               </div>
// //               <FiUsers className="text-blue-600 text-xl" />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Barre de recherche et filtres */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
// //             <div className="flex flex-col sm:flex-row gap-4">
// //               <Input
// //                 placeholder="Rechercher un événement..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="md:w-80"
// //               />
// //               <select
// //                 value={statusFilter}
// //                 onChange={(e) => setStatusFilter(e.target.value)}
// //                 className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               >
// //                 <option value="all">Tous les statuts</option>
// //                 <option value="pending">En attente</option>
// //                 <option value="active">Actif</option>
// //                 <option value="completed">Terminé</option>
// //                 <option value="rejected">Rejeté</option>
// //               </select>
// //             </div>
// //             <div className="text-sm text-gray-600">
// //               {filteredEvents.length} événement(s) trouvé(s)
// //             </div>
// //           </div>
// //         </div>

// //         {/* Tableau des événements */}
// //         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //           {filteredEvents.length === 0 ? (
// //             <div className="text-center py-12">
// //               <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
// //               <p className="text-gray-500">
// //                 {searchTerm ? 'Aucun événement correspondant' : 'Aucun événement trouvé'}
// //               </p>
// //               <Button
// //                 variant="primary"
// //                 onClick={() => setIsCreateModalOpen(true)}
// //                 className="mt-4"
// //               >
// //                 <FiPlus className="mr-2" />
// //                 Créer un événement
// //               </Button>
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Événement
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Date & Lieu
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Participants
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Statut
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {filteredEvents.map((event) => (
// //                     <motion.tr
// //                       key={event.id}
// //                       initial={{ opacity: 0, y: 20 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       className="hover:bg-gray-50"
// //                     >
// //                       <td className="px-6 py-4">
// //                         <div className="flex items-center">
// //                           <div className="h-10 w-10 flex-shrink-0">
// //                             {event.image_url ? (
// //                               <img
// //                                 className="h-10 w-10 rounded-lg object-cover"
// //                                 src={event.image_url}
// //                                 alt={event.title}
// //                               />
// //                             ) : (
// //                               <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
// //                                 <FiCalendar className="text-gray-400" />
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div className="ml-4">
// //                             <div className="text-sm font-medium text-gray-900">
// //                               {event.title}
// //                             </div>
// //                             <div className="text-sm text-gray-500 line-clamp-1">
// //                               {event.description}
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <div className="text-sm text-gray-900">{formatDate(event.event_date)}</div>
// //                         <div className="text-sm text-gray-500">{event.location}</div>
// //                       </td>
// //                       <td className="px-6 py-4 text-sm text-gray-900">
// //                         <div>{event.registered_count || 0} / {event.max_participants || '∞'}</div>
// //                         {event.price > 0 && (
// //                           <div className="text-green-600">{event.price} €</div>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// //                           isEventUpcoming(event.event_date)
// //                             ? 'bg-green-100 text-green-800'
// //                             : 'bg-gray-100 text-gray-800'
// //                         }`}>
// //                           {isEventUpcoming(event.event_date) ? 'À venir' : 'Passé'}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 text-sm font-medium">
// //                         <div className="flex gap-2 flex-wrap">
// //                           {event.status === 'pending' && (
// //                             <>
// //                               <Button
// //                                 variant="success"
// //                                 size="sm"
// //                                 onClick={() => handleApproveEvent(event.id)}
// //                                 className="flex items-center gap-1"
// //                               >
// //                                 <FiCheck />
// //                                 Approuver
// //                               </Button>
// //                               <Button
// //                                 variant="danger"
// //                                 size="sm"
// //                                 onClick={() => {
// //                                   const reason = prompt('Motif du rejet:');
// //                                   if (reason) handleRejectEvent(event.id, reason);
// //                                 }}
// //                                 className="flex items-center gap-1"
// //                               >
// //                                 <FiX />
// //                                 Rejeter
// //                               </Button>
// //                             </>
// //                           )}
// //                           <Button
// //                             variant={event.featured ? "warning" : "outline"}
// //                             size="sm"
// //                             onClick={() => handleFeatureEvent(event.id, !event.featured)}
// //                             className="flex items-center gap-1"
// //                           >
// //                             <FiTrendingUp />
// //                             {event.featured ? 'Retirer' : 'Mettre en avant'}
// //                           </Button>
// //                           <Button
// //                             variant="secondary"
// //                             size="sm"
// //                             onClick={() => setViewingRegistrations(event)}
// //                             className="flex items-center gap-1"
// //                           >
// //                             <FiUsers />
// //                             Inscrits
// //                           </Button>
// //                           <Button
// //                             variant="secondary"
// //                             size="sm"
// //                             onClick={() => setEditingEvent(event)}
// //                             className="flex items-center gap-1"
// //                           >
// //                             <FiEdit />
// //                             Modifier
// //                           </Button>
// //                           <Button
// //                             variant="danger"
// //                             size="sm"
// //                             onClick={() => handleDeleteEvent(event.id)}
// //                             className="flex items-center gap-1"
// //                           >
// //                             <FiTrash2 />
// //                             Supprimer
// //                           </Button>
// //                         </div>
// //                       </td>
// //                     </motion.tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Modales */}
// //       <CreateEventModal
// //         isOpen={isCreateModalOpen}
// //         onClose={() => setIsCreateModalOpen(false)}
// //         onSuccess={() => {
// //           setIsCreateModalOpen(false);
// //           fetchEvents();
// //         }}
// //       />

// //       <EditEventModal
// //         event={editingEvent}
// //         isOpen={!!editingEvent}
// //         onClose={() => setEditingEvent(null)}
// //         onSuccess={() => {
// //           setEditingEvent(null);
// //           fetchEvents();
// //         }}
// //       />

// //       <EventRegistrationsModal
// //         event={viewingRegistrations}
// //         isOpen={!!viewingRegistrations}
// //         onClose={() => setViewingRegistrations(null)}
// //       />
// //     </div>
// //   );
// // }
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   FiPlus, 
//   FiEdit, 
//   FiTrash2, 
//   FiCalendar, 
//   FiUsers, 
//   FiEye,
//   FiCheck,
//   FiX,
//   FiTrendingUp
// } from 'react-icons/fi';
// import { useEvenements } from '@/hooks/useEvenements';
// import { useAuth } from '@/hooks/useAuth';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import CreateEventModal from '@/components/events/CreateEventModal';
// import EditEventModal from '@/components/events/EditEventModal';
// import EventRegistrationsModal from '@/components/events/EventRegistrationsModal';

// export default function AdminEvents() {
//   const { events, loading, error, fetchEvents } = useEvenements();
//   const { isAdmin, isAuthenticated } = useAuth();

//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [viewingRegistrations, setViewingRegistrations] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [actionLoading, setActionLoading] = useState(null);

//   useEffect(() => {
//     if (isAuthenticated && isAdmin) {
//       fetchAdminEvents();
//     }
//   }, [isAuthenticated, isAdmin]);

//   const fetchAdminEvents = async () => {
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch('http://localhost:5000/api/events/admin/events', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Erreur lors du chargement des événements');
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         // Mettre à jour le hook useEvenements avec les données admin
//         fetchEvents(); // Cette fonction devrait être modifiée pour accepter des données externes
//       } else {
//         throw new Error(data.error || 'Erreur inconnue');
//       }
//     } catch (error) {
//       console.error('❌ Erreur chargement événements admin:', error);
//     }
//   };

//   if (!isAuthenticated || !isAdmin) {
//     return (
//       <div className="min-h-screen pt-20 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
//           <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
//         </div>
//       </div>
//     );
//   }

//   const filteredEvents = events.filter(event => {
//     const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          event.location?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const formatDate = (dateString) => {
//     try {
//       return new Intl.DateTimeFormat('fr-FR', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       }).format(new Date(dateString));
//     } catch (error) {
//       return 'Date invalide';
//     }
//   };

//   const isEventUpcoming = (eventDate) => {
//     try {
//       return new Date(eventDate) > new Date();
//     } catch (error) {
//       return false;
//     }
//   };

//   const handleDeleteEvent = async (eventId) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
//       return;
//     }

//     setActionLoading(eventId);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents();
//         alert('Événement supprimé avec succès');
//       } else {
//         throw new Error(data.error || 'Erreur lors de la suppression');
//       }
//     } catch (error) {
//       console.error('❌ Erreur suppression:', error);
//       alert('Erreur lors de la suppression de l\'événement: ' + error.message);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleApproveEvent = async (eventId) => {
//     setActionLoading(eventId);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/approve`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents();
//         alert('Événement approuvé avec succès');
//       } else {
//         throw new Error(data.error || 'Erreur lors de l\'approbation');
//       }
//     } catch (error) {
//       console.error('❌ Erreur approbation:', error);
//       alert('Erreur lors de l\'approbation de l\'événement: ' + error.message);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleRejectEvent = async (eventId, reason) => {
//     if (!reason || reason.trim() === '') {
//       alert('Veuillez fournir un motif de rejet');
//       return;
//     }

//     setActionLoading(eventId);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/reject`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ reason })
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents();
//         alert('Événement rejeté');
//       } else {
//         throw new Error(data.error || 'Erreur lors du rejet');
//       }
//     } catch (error) {
//       console.error('❌ Erreur rejet:', error);
//       alert('Erreur lors du rejet de l\'événement: ' + error.message);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleFeatureEvent = async (eventId, featured) => {
//     setActionLoading(eventId);
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`http://localhost:5000/api/events/admin/${eventId}/feature`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ featured })
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchAdminEvents();
//         alert(featured ? 'Événement mis en avant' : 'Événement retiré des mises en avant');
//       } else {
//         throw new Error(data.error || 'Erreur lors de la mise à jour');
//       }
//     } catch (error) {
//       console.error('❌ Erreur mise en avant:', error);
//       alert('Erreur lors de la mise à jour de l\'événement: ' + error.message);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//             <span className="ml-3 text-gray-600">Chargement des événements...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//               <FiCalendar className="text-purple-600" />
//               Administration Événements
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Gérer les événements Vakio Boky
//             </p>
//           </div>
          
//           <Button
//             variant="primary"
//             onClick={() => setIsCreateModalOpen(true)}
//             className="flex items-center gap-2"
//           >
//             <FiPlus />
//             Nouvel événement
//           </Button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Événements</p>
//                 <p className="text-2xl font-bold text-gray-900">{events.length}</p>
//               </div>
//               <FiCalendar className="text-purple-600 text-xl" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">À venir</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {events.filter(event => isEventUpcoming(event.event_date)).length}
//                 </p>
//               </div>
//               <FiEye className="text-green-600 text-xl" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Passés</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {events.filter(event => !isEventUpcoming(event.event_date)).length}
//                 </p>
//               </div>
//               <FiUsers className="text-gray-600 text-xl" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Participants</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {events.reduce((sum, event) => sum + (event.registered_count || 0), 0)}
//                 </p>
//               </div>
//               <FiUsers className="text-blue-600 text-xl" />
//             </div>
//           </div>
//         </div>

//         {/* Barre de recherche et filtres */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Input
//                 placeholder="Rechercher un événement..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="md:w-80"
//               />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">Tous les statuts</option>
//                 <option value="pending">En attente</option>
//                 <option value="active">Actif</option>
//                 <option value="completed">Terminé</option>
//                 <option value="rejected">Rejeté</option>
//               </select>
//             </div>
//             <div className="text-sm text-gray-600">
//               {filteredEvents.length} événement(s) trouvé(s)
//             </div>
//           </div>
//         </div>

//         {/* Tableau des événements */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
//               {error}
//               <button 
//                 onClick={fetchAdminEvents}
//                 className="ml-4 underline hover:no-underline"
//               >
//                 Réessayer
//               </button>
//             </div>
//           )}

//           {filteredEvents.length === 0 ? (
//             <div className="text-center py-12">
//               <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">
//                 {searchTerm || statusFilter !== 'all' ? 'Aucun événement correspondant' : 'Aucun événement trouvé'}
//               </p>
//               <Button
//                 variant="primary"
//                 onClick={() => setIsCreateModalOpen(true)}
//                 className="mt-4"
//               >
//                 <FiPlus className="mr-2" />
//                 Créer un événement
//               </Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Événement
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date & Lieu
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Participants
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Statut
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredEvents.map((event) => (
//                     <motion.tr
//                       key={event.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0">
//                             {event.image_url ? (
//                               <img
//                                 className="h-10 w-10 rounded-lg object-cover"
//                                 src={event.image_url}
//                                 alt={event.title}
//                                 onError={(e) => {
//                                   e.target.style.display = 'none';
//                                   e.target.nextSibling.style.display = 'flex';
//                                 }}
//                               />
//                             ) : null}
//                             <div className={`h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center ${event.image_url ? 'hidden' : 'flex'}`}>
//                               <FiCalendar className="text-gray-400" />
//                             </div>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {event.title || 'Sans titre'}
//                             </div>
//                             <div className="text-sm text-gray-500 line-clamp-1">
//                               {event.description || 'Aucune description'}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{formatDate(event.event_date)}</div>
//                         <div className="text-sm text-gray-500">{event.location || 'Non spécifié'}</div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div>{event.registered_count || 0} / {event.max_participants || '∞'}</div>
//                         {event.price > 0 && (
//                           <div className="text-green-600">{event.price} €</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           event.status === 'active' 
//                             ? 'bg-green-100 text-green-800'
//                             : event.status === 'pending'
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : event.status === 'rejected'
//                             ? 'bg-red-100 text-red-800'
//                             : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {event.status === 'active' ? 'Actif' : 
//                            event.status === 'pending' ? 'En attente' : 
//                            event.status === 'rejected' ? 'Rejeté' : 'Inconnu'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium">
//                         <div className="flex gap-2 flex-wrap">
//                           {event.status === 'pending' && (
//                             <>
//                               <Button
//                                 variant="success"
//                                 size="sm"
//                                 onClick={() => handleApproveEvent(event.id)}
//                                 disabled={actionLoading === event.id}
//                                 className="flex items-center gap-1"
//                               >
//                                 {actionLoading === event.id ? (
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                 ) : (
//                                   <FiCheck />
//                                 )}
//                                 Approuver
//                               </Button>
//                               <Button
//                                 variant="danger"
//                                 size="sm"
//                                 onClick={() => {
//                                   const reason = prompt('Motif du rejet:');
//                                   if (reason) handleRejectEvent(event.id, reason);
//                                 }}
//                                 disabled={actionLoading === event.id}
//                                 className="flex items-center gap-1"
//                               >
//                                 <FiX />
//                                 Rejeter
//                               </Button>
//                             </>
//                           )}
//                           <Button
//                             variant={event.featured ? "warning" : "outline"}
//                             size="sm"
//                             onClick={() => handleFeatureEvent(event.id, !event.featured)}
//                             disabled={actionLoading === event.id}
//                             className="flex items-center gap-1"
//                           >
//                             <FiTrendingUp />
//                             {event.featured ? 'Retirer' : 'Mettre en avant'}
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             onClick={() => setViewingRegistrations(event)}
//                             className="flex items-center gap-1"
//                           >
//                             <FiUsers />
//                             Inscrits
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             onClick={() => setEditingEvent(event)}
//                             className="flex items-center gap-1"
//                           >
//                             <FiEdit />
//                             Modifier
//                           </Button>
//                           <Button
//                             variant="danger"
//                             size="sm"
//                             onClick={() => handleDeleteEvent(event.id)}
//                             disabled={actionLoading === event.id}
//                             className="flex items-center gap-1"
//                           >
//                             <FiTrash2 />
//                             Supprimer
//                           </Button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modales */}
//       <CreateEventModal
//         isOpen={isCreateModalOpen}
//         onClose={() => setIsCreateModalOpen(false)}
//         onSuccess={() => {
//           setIsCreateModalOpen(false);
//           fetchAdminEvents();
//         }}
//       />

//       <EditEventModal
//         event={editingEvent}
//         isOpen={!!editingEvent}
//         onClose={() => setEditingEvent(null)}
//         onSuccess={() => {
//           setEditingEvent(null);
//           fetchAdminEvents();
//         }}
//       />

//       <EventRegistrationsModal
//         event={viewingRegistrations}
//         isOpen={!!viewingRegistrations}
//         onClose={() => setViewingRegistrations(null)}
//       />
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiUsers, 
  FiEye,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import { useEvenements } from '@/hooks/useEvenements';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CreateEventModal from '@/components/events/CreateEventModal';
import EditEventModal from '@/components/events/EditEventModal';
import EventRegistrationsModal from '@/components/events/EventRegistrationsModal';

export default function AdminEvents() {
  const { 
    events, 
    loading, 
    error, 
    fetchAdminEvents, 
    approveEvent, 
    rejectEvent, 
    featureEvent, 
    deleteEvent 
  } = useEvenements();
  
  const { isAdmin, isAuthenticated } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAdminEvents();
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
          <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    } catch (error) {
      return 'Date invalide';
    }
  };

  const isEventUpcoming = (eventDate) => {
    try {
      return new Date(eventDate) > new Date();
    } catch (error) {
      return false;
    }
  };

  const handleApprove = async (eventId) => {
    setActionLoading(eventId);
    const result = await approveEvent(eventId);
    setActionLoading(null);
    
    if (result.success) {
      alert('Événement approuvé avec succès');
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const handleReject = async (eventId) => {
    const reason = prompt('Motif du rejet:');
    if (!reason || reason.trim() === '') {
      alert('Veuillez fournir un motif de rejet');
      return;
    }
    
    setActionLoading(eventId);
    const result = await rejectEvent(eventId, reason);
    setActionLoading(null);
    
    if (result.success) {
      alert('Événement rejeté');
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const handleFeature = async (eventId, featured) => {
    setActionLoading(eventId);
    const result = await featureEvent(eventId, featured);
    setActionLoading(null);
    
    if (result.success) {
      alert(featured ? 'Événement mis en avant' : 'Événement retiré des mises en avant');
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      return;
    }
    
    setActionLoading(eventId);
    const result = await deleteEvent(eventId);
    setActionLoading(null);
    
    if (result.success) {
      alert('Événement supprimé avec succès');
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const getStatusBadge = (status, eventDate) => {
    const statusConfig = {
      active: { 
        label: isEventUpcoming(eventDate) ? 'À venir' : 'Terminé', 
        class: isEventUpcoming(eventDate) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' 
      },
      pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
      rejected: { label: 'Rejeté', class: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { label: 'Inconnu', class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const stats = {
    total: events.length,
    upcoming: events.filter(event => isEventUpcoming(event.event_date) && event.status === 'active').length,
    past: events.filter(event => !isEventUpcoming(event.event_date) && event.status === 'active').length,
    pending: events.filter(event => event.status === 'pending').length,
    totalParticipants: events.reduce((sum, event) => sum + (event.registered_count || 0), 0)
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Chargement des événements...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiCalendar className="text-purple-600" />
              Administration Événements
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez tous les événements de la plateforme Vakio Boky
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Nouvel événement
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FiCalendar className="text-purple-600 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À venir</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
              </div>
              <FiEye className="text-green-600 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.past}</p>
              </div>
              <FiUsers className="text-gray-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <FiCalendar className="text-yellow-600 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
              </div>
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="active">Actifs</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
              {filteredEvents.length} événement(s) trouvé(s)
            </div>
          </div>
        </div>

        {/* Gestion des erreurs */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div>
              <strong>Erreur: </strong>
              {error}
            </div>
            <button 
              onClick={fetchAdminEvents}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Tableau des événements */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Aucun événement correspondant' : 'Aucun événement trouvé'}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche' 
                  : 'Commencez par créer votre premier événement'
                }
              </p>
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <FiPlus />
                Créer un événement
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Événement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Lieu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {event.image_url ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={event.image_url}
                                alt={event.title}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`h-12 w-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center ${event.image_url ? 'hidden' : 'flex'}`}>
                              <FiCalendar className="text-purple-600 text-lg" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                              {event.title || 'Sans titre'}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {event.description || 'Aucune description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(event.event_date)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {event.location || 'Non spécifié'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.registered_count || 0} / {event.max_participants || '∞'}
                        </div>
                        {event.price > 0 ? (
                          <div className="text-sm text-green-600 font-medium">
                            {event.price} €
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Gratuit
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(event.status, event.event_date)}
                        {event.featured && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              <FiTrendingUp className="w-3 h-3" />
                              Mis en avant
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {/* Actions pour événements en attente */}
                          {event.status === 'pending' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleApprove(event.id)}
                                disabled={actionLoading === event.id}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === event.id ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                ) : (
                                  <FiCheck className="w-3 h-3" />
                                )}
                                Approuver
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleReject(event.id)}
                                disabled={actionLoading === event.id}
                                className="flex items-center gap-1"
                              >
                                <FiX className="w-3 h-3" />
                                Rejeter
                              </Button>
                            </>
                          )}

                          {/* Bouton mise en avant */}
                          <Button
                            variant={event.featured ? "warning" : "outline"}
                            size="sm"
                            onClick={() => handleFeature(event.id, !event.featured)}
                            disabled={actionLoading === event.id}
                            className="flex items-center gap-1"
                          >
                            <FiTrendingUp className="w-3 h-3" />
                            {event.featured ? 'Retirer' : 'Mettre en avant'}
                          </Button>

                          {/* Voir les inscrits */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setViewingRegistrations(event)}
                            className="flex items-center gap-1"
                          >
                            <FiUsers className="w-3 h-3" />
                            Inscrits
                          </Button>

                          {/* Modifier */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingEvent(event)}
                            className="flex items-center gap-1"
                          >
                            <FiEdit className="w-3 h-3" />
                            Modifier
                          </Button>

                          {/* Supprimer */}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                            disabled={actionLoading === event.id}
                            className="flex items-center gap-1"
                          >
                            {actionLoading === event.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <FiTrash2 className="w-3 h-3" />
                            )}
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchAdminEvents();
        }}
      />

      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSuccess={() => {
          setEditingEvent(null);
          fetchAdminEvents();
        }}
      />

      <EventRegistrationsModal
        event={viewingRegistrations}
        isOpen={!!viewingRegistrations}
        onClose={() => setViewingRegistrations(null)}
      />
    </div>
  );
}