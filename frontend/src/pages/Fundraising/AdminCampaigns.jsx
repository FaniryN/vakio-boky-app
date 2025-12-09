// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FiPlus, FiEdit, FiTrash2, FiEye, FiUsers, FiTrendingUp } from 'react-icons/fi';
// import { useCampaigns } from '@/hooks/useCampaigns';
// import { useAuth } from '@/hooks/useAuth';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import CreateCampaignModal from '@/components/fundraising/CreateCampaignModal';
// import EditCampaignModal from '@/components/fundraising/EditCampaignModal';

// export default function AdminCampaigns() {
//   const { campaigns, loading, error, fetchCampaigns } = useCampaigns();
//   const { isAdmin, isAuthenticated } = useAuth();

//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [editingCampaign, setEditingCampaign] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [showModerationModal, setShowModerationModal] = useState(false);

//   useEffect(() => {
//     if (isAuthenticated && isAdmin) {
//       fetchCampaigns();
//     }
//   }, [isAuthenticated, isAdmin]);

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

//   const filteredCampaigns = campaigns.filter(campaign => {
//     const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'EUR'
//     }).format(amount);
//   };

//   const getProgressPercentage = (campaign) => {
//     return Math.min((campaign.current_amount / campaign.target_amount) * 100, 100);
//   };

//   const handleDeleteCampaign = async (campaignId) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/${campaignId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Erreur lors de la suppression');
//       }

//       await fetchCampaigns();
//       alert('Campagne supprimée avec succès');
//     } catch (error) {
//       console.error('❌ Erreur suppression:', error);
//       alert('Erreur lors de la suppression de la campagne');
//     }
//   };

//   const handleApproveCampaign = async (campaignId) => {
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/admin/${campaignId}/approve`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchCampaigns();
//         alert('Campagne approuvée avec succès');
//       } else {
//         alert(data.error || 'Erreur lors de l\'approbation');
//       }
//     } catch (error) {
//       console.error('❌ Erreur approbation:', error);
//       alert('Erreur lors de l\'approbation de la campagne');
//     }
//   };

//   const handleRejectCampaign = async (campaignId, reason) => {
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/admin/${campaignId}/reject`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ reason })
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchCampaigns();
//         alert('Campagne rejetée');
//       } else {
//         alert(data.error || 'Erreur lors du rejet');
//       }
//     } catch (error) {
//       console.error('❌ Erreur rejet:', error);
//       alert('Erreur lors du rejet de la campagne');
//     }
//   };

//   const handleFeatureCampaign = async (campaignId, featured) => {
//     try {
//       const token = localStorage.getItem('vakio_token');
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/admin/${campaignId}/feature`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ featured })
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchCampaigns();
//         alert(featured ? 'Campagne mise en avant' : 'Campagne retirée des mises en avant');
//       } else {
//         alert(data.error || 'Erreur lors de la mise à jour');
//       }
//     } catch (error) {
//       console.error('❌ Erreur mise en avant:', error);
//       alert('Erreur lors de la mise à jour de la campagne');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="ml-3 text-gray-600">Chargement des campagnes...</span>
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
//               <FiTrendingUp className="text-green-600" />
//               Administration Campagnes
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Gérer les campagnes de collecte de fonds Vakio Boky
//             </p>
//           </div>
          
//           <Button
//             variant="primary"
//             onClick={() => setIsCreateModalOpen(true)}
//             className="flex items-center gap-2"
//           >
//             <FiPlus />
//             Nouvelle campagne
//           </Button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Campagnes</p>
//                 <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
//               </div>
//               <FiEye className="text-blue-600 text-xl" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Montant Total Collecté</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {formatAmount(campaigns.reduce((sum, camp) => sum + parseFloat(camp.current_amount), 0))}
//                 </p>
//               </div>
//               <FiTrendingUp className="text-green-600 text-xl" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Campagnes Actives</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {campaigns.filter(camp => camp.status === 'active').length}
//                 </p>
//               </div>
//               <FiUsers className="text-purple-600 text-xl" />
//             </div>
//           </div>
//         </div>

//         {/* Barre de recherche et filtres */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Input
//                 placeholder="Rechercher une campagne..."
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
//                 <option value="active">Active</option>
//                 <option value="completed">Terminée</option>
//                 <option value="rejected">Rejetée</option>
//               </select>
//             </div>
//             <div className="text-sm text-gray-600">
//               {filteredCampaigns.length} campagne(s) trouvée(s)
//             </div>
//           </div>
//         </div>

//         {/* Tableau des campagnes */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {filteredCampaigns.length === 0 ? (
//             <div className="text-center py-12">
//               <FiTrendingUp className="text-4xl text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">
//                 {searchTerm ? 'Aucune campagne correspondante' : 'Aucune campagne trouvée'}
//               </p>
//               <Button
//                 variant="primary"
//                 onClick={() => setIsCreateModalOpen(true)}
//                 className="mt-4"
//               >
//                 <FiPlus className="mr-2" />
//                 Créer une campagne
//               </Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Campagne
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Progression
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Montants
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
//                   {filteredCampaigns.map((campaign) => (
//                     <motion.tr
//                       key={campaign.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0">
//                             {campaign.image_url ? (
//                               <img
//                                 className="h-10 w-10 rounded-lg object-cover"
//                                 src={campaign.image_url}
//                                 alt={campaign.title}
//                               />
//                             ) : (
//                               <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
//                                 <FiTrendingUp className="text-gray-400" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {campaign.title}
//                             </div>
//                             <div className="text-sm text-gray-500 line-clamp-1">
//                               {campaign.description}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="w-32">
//                           <div className="flex justify-between text-xs text-gray-600 mb-1">
//                             <span>{getProgressPercentage(campaign).toFixed(1)}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-green-500 h-2 rounded-full"
//                               style={{ width: `${getProgressPercentage(campaign)}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div>Collecté: {formatAmount(campaign.current_amount)}</div>
//                         <div className="text-gray-500">Objectif: {formatAmount(campaign.target_amount)}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           campaign.status === 'active' 
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {campaign.status === 'active' ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium">
//                         <div className="flex gap-2 flex-wrap">
//                           {campaign.status === 'pending' && (
//                             <>
//                               <Button
//                                 variant="success"
//                                 size="sm"
//                                 onClick={() => handleApproveCampaign(campaign.id)}
//                                 className="flex items-center gap-1"
//                               >
//                                 <FiCheck />
//                                 Approuver
//                               </Button>
//                               <Button
//                                 variant="danger"
//                                 size="sm"
//                                 onClick={() => {
//                                   const reason = prompt('Motif du rejet:');
//                                   if (reason) handleRejectCampaign(campaign.id, reason);
//                                 }}
//                                 className="flex items-center gap-1"
//                               >
//                                 <FiX />
//                                 Rejeter
//                               </Button>
//                             </>
//                           )}
//                           <Button
//                             variant={campaign.featured ? "warning" : "outline"}
//                             size="sm"
//                             onClick={() => handleFeatureCampaign(campaign.id, !campaign.featured)}
//                             className="flex items-center gap-1"
//                           >
//                             <FiTrendingUp />
//                             {campaign.featured ? 'Retirer' : 'Mettre en avant'}
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             onClick={() => setEditingCampaign(campaign)}
//                             className="flex items-center gap-1"
//                           >
//                             <FiEdit />
//                             Modifier
//                           </Button>
//                           <Button
//                             variant="danger"
//                             size="sm"
//                             onClick={() => handleDeleteCampaign(campaign.id)}
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
//       <CreateCampaignModal
//         isOpen={isCreateModalOpen}
//         onClose={() => setIsCreateModalOpen(false)}
//         onSuccess={() => {
//           setIsCreateModalOpen(false);
//           fetchCampaigns();
//         }}
//       />

//       <EditCampaignModal
//         campaign={editingCampaign}
//         isOpen={!!editingCampaign}
//         onClose={() => setEditingCampaign(null)}
//         onSuccess={() => {
//           setEditingCampaign(null);
//           fetchCampaigns();
//         }}
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
  FiEye, 
  FiUsers, 
  FiTrendingUp,
  FiSearch,
  FiCheck,
  FiX,
  FiStar
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
// import AdminNav from '@/components/admin/AdminNav';

export default function AdminCampaigns() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCampaigns();
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm, statusFilter]);

  const filterCampaigns = () => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.token) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch("https://vakio-boky-backend.onrender.com/api/campaigns/admin/all", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCampaigns(data.campaigns || []);
      } else {
        throw new Error(data.error || "Erreur lors du chargement des campagnes");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur récupération campagnes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchCampaigns();
      } else {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur suppression:', err);
    }
  };

  const handleApproveCampaign = async (campaignId) => {
    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/admin/${campaignId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchCampaigns();
      } else {
        throw new Error(data.error || "Erreur lors de l'approbation");
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur approbation:', err);
    }
  };

  const handleRejectCampaign = async (campaignId) => {
    const reason = prompt('Motif du rejet:');
    if (!reason) return;

    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/admin/${campaignId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();

      if (data.success) {
        await fetchCampaigns();
      } else {
        throw new Error(data.error || "Erreur lors du rejet");
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur rejet:', err);
    }
  };

  const handleFeatureCampaign = async (campaignId, featured) => {
    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/admin/${campaignId}/feature`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ featured })
      });

      const data = await response.json();

      if (data.success) {
        await fetchCampaigns();
      } else {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur mise en avant:', err);
    }
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      setError(null);
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/campaigns", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();

      if (data.success) {
        setIsCreateModalOpen(false);
        await fetchCampaigns();
      } else {
        throw new Error(data.error || "Erreur lors de la création");
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur création campagne:', err);
    }
  };

  const handleUpdateCampaign = async (campaignId, campaignData) => {
    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();

      if (data.success) {
        setEditingCampaign(null);
        await fetchCampaigns();
      } else {
        throw new Error(data.error || "Erreur lors de la modification");
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur modification campagne:', err);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getProgressPercentage = (campaign) => {
    if (!campaign.target_amount || campaign.target_amount === 0) return 0;
    return Math.min((campaign.current_amount / campaign.target_amount) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejetée';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* <AdminNav /> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des campagnes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* <AdminNav /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiTrendingUp className="text-green-600" />
              Administration Campagnes
            </h1>
            <p className="text-gray-600 mt-2">
              Gérer les campagnes de collecte de fonds Vakio Boky
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Nouvelle campagne
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campagnes</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
              <FiEye className="text-blue-600 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant Total Collecté</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatAmount(campaigns.reduce((sum, camp) => sum + parseFloat(camp.current_amount || 0), 0))}
                </p>
              </div>
              <FiTrendingUp className="text-green-600 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campagnes Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(camp => camp.status === 'active').length}
                </p>
              </div>
              <FiUsers className="text-purple-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campagnes en Avant</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(camp => camp.featured).length}
                </p>
              </div>
              <FiStar className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une campagne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Active</option>
                <option value="pending">En attente</option>
                <option value="completed">Terminée</option>
                <option value="rejected">Rejetée</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredCampaigns.length} campagne(s) trouvée(s)
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <Button
              variant="primary"
              size="sm"
              onClick={fetchCampaigns}
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Tableau des campagnes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <FiTrendingUp className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune campagne trouvée</p>
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4"
              >
                <FiPlus className="mr-2" />
                Créer une campagne
              </Button>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <FiSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune campagne ne correspond à vos critères de recherche</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-4"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campagne
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progression
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dons
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
                  {filteredCampaigns.map((campaign) => (
                    <motion.tr
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {campaign.image_url ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={campaign.image_url}
                                alt={campaign.title}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FiTrendingUp className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                              {campaign.description}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(campaign.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{getProgressPercentage(campaign).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(campaign)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium text-green-600">
                          {formatAmount(campaign.current_amount || 0)}
                        </div>
                        <div className="text-gray-500">
                          sur {formatAmount(campaign.target_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {campaign.donor_count || 0} donateurs
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                        {campaign.featured && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              <FiStar className="w-3 h-3 mr-1" />
                              En avant
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2 flex-wrap">
                          {campaign.status === 'pending' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleApproveCampaign(campaign.id)}
                                className="flex items-center gap-1"
                              >
                                <FiCheck />
                                Approuver
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRejectCampaign(campaign.id)}
                                className="flex items-center gap-1"
                              >
                                <FiX />
                                Rejeter
                              </Button>
                            </>
                          )}
                          <Button
                            variant={campaign.featured ? "warning" : "outline"}
                            size="sm"
                            onClick={() => handleFeatureCampaign(campaign.id, !campaign.featured)}
                            className="flex items-center gap-1"
                          >
                            <FiStar />
                            {campaign.featured ? 'Retirer' : 'Mettre en avant'}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingCampaign(campaign)}
                            className="flex items-center gap-1"
                          >
                            <FiEdit />
                            Modifier
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="flex items-center gap-1"
                          >
                            <FiTrash2 />
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

      {/* Modale de création */}
      {isCreateModalOpen && (
        <CreateCampaignModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCampaign}
        />
      )}

      {/* Modale d'édition */}
      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSubmit={handleUpdateCampaign}
        />
      )}
    </div>
  );
}

// Composants modales simplifiés pour l'exemple
function CreateCampaignModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    start_date: '',
    end_date: '',
    image_url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Créer une nouvelle campagne</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant cible</label>
              <input
                type="number"
                required
                value={formData.target_amount}
                onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de début</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de fin</label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Créer la campagne
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCampaignModal({ campaign, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description,
    target_amount: campaign.target_amount,
    start_date: campaign.start_date?.split('T')[0],
    end_date: campaign.end_date?.split('T')[0],
    image_url: campaign.image_url || '',
    status: campaign.status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(campaign.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Modifier la campagne</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant cible</label>
              <input
                type="number"
                required
                value={formData.target_amount}
                onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="pending">En attente</option>
                <option value="completed">Terminée</option>
                <option value="rejected">Rejetée</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de début</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de fin</label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Modifier la campagne
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}