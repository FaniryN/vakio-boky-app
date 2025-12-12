import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiShoppingCart,
  FiCreditCard,
  FiUser,
  FiPackage,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiAlertTriangle,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
// import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const ordersPerPage = 10;

  // Statistiques dynamiques
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calcul des statistiques quand les commandes changent
  useEffect(() => {
    calculateStats();
  }, [orders]);

  // Filtrage des commandes
  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const calculateStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const confirmedOrders = orders.filter(order => order.status === 'confirmed' || order.status === 'paid').length;
    
    const totalRevenue = orders
      .filter(order => order.status === 'confirmed' || order.status === 'paid')
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    
    const averageOrderValue = confirmedOrders > 0 ? totalRevenue / confirmedOrders : 0;

    setStats({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      totalRevenue,
      averageOrderValue,
    });
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term (order ID, customer, product name, or shipping address)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchLower)) ||
        (order.product_name && order.product_name.toLowerCase().includes(searchLower)) ||
        (order.shipping_address && order.shipping_address.toLowerCase().includes(searchLower))
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.token) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch("https://vakio-boky-backend.onrender.com/api/marketplace/admin/orders", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Utiliser les données directement depuis l'API qui incluent déjà les noms de produits
        const enhancedOrders = data.orders.map(order => ({
          ...order,
          customer_name: `Utilisateur ${order.user_id}`, // Fallback si pas de nom
        }));
        
        setOrders(enhancedOrders);
      } else {
        throw new Error(data.error || "Erreur lors du chargement des commandes");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur récupération commandes:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/marketplace/admin/orders/${orderId}/confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Mettre à jour le statut localement
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, status: 'confirmed', payment_status: 'paid' }
            : order
        ));
      } else {
        throw new Error(data.error || "Erreur lors de la confirmation");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur confirmation commande:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = null) => {
    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/marketplace/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ 
          status: newStatus, 
          tracking_number: trackingNumber 
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Mettre à jour la commande localement
        setOrders(orders.map(order =>
          order.id === orderId
            ? { 
                ...order, 
                status: newStatus, 
                tracking_number: trackingNumber,
                updated_at: new Date().toISOString()
              }
            : order
        ));
        setShowOrderModal(false);
        setSelectedOrder(null);
      } else {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur mise à jour statut:", err);
    }
  };

  const createDispute = async (orderId, reason, description) => {
    try {
      setError(null);
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/marketplace/admin/orders/${orderId}/dispute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ reason, description }),
      });

      const data = await response.json();

      if (data.success) {
        // Mettre à jour le statut du litige localement
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, dispute_status: 'open', has_dispute: true }
            : order
        ));
      } else {
        throw new Error(data.error || "Erreur lors de la création du litige");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur création litige:", err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      case 'paid':
        return 'Payée';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'refunded':
        return 'Remboursée';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Non authentifié
          </h2>
          <p className="text-gray-600">
            Veuillez vous connecter pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des commandes...
            </span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiShoppingCart className="text-blue-600" />
            Gestion des Commandes
          </h1>
          <p className="text-gray-600 mt-2">
            Confirmer et gérer les commandes des utilisateurs
          </p>
        </div>

        {/* Stats Dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FiShoppingCart className="text-blue-600 text-2xl" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FiCreditCard className="text-yellow-600 text-2xl" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingOrders}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FiCheck className="text-green-600 text-2xl" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.confirmedOrders}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FiDollarSign className="text-purple-600 text-2xl" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par ID, client, produit ou adresse..."
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
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="paid">Payée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
                <option value="refunded">Remboursée</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredOrders.length} commande(s) trouvée(s)
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
              onClick={fetchOrders}
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingCart className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
              <Button
                variant="primary"
                onClick={fetchOrders}
                className="mt-4"
              >
                Actualiser
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <FiSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande ne correspond à vos critères de recherche</p>
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
                      Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
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
                  {paginatedOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {order.customer_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiPackage className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.product_name || `Produit #${order.product_id}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              Quantité: {order.quantity}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <FiEye />
                            Détails
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => confirmOrder(order.id)}
                              className="flex items-center gap-1"
                            >
                              <FiCheck />
                              Confirmer
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const reason = prompt("Motif du litige:");
                              if (reason) {
                                const description = prompt("Description du litige:");
                                if (description) {
                                  createDispute(order.id, reason, description);
                                }
                              }
                            }}
                            className="flex items-center gap-1 text-orange-600 border-orange-300 hover:bg-orange-50"
                          >
                            <FiAlertTriangle />
                            Litige
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de{' '}
                  <span className="font-medium">{startIndex + 1}</span>
                  {' '}à{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + ordersPerPage, filteredOrders.length)}
                  </span>
                  {' '}sur{' '}
                  <span className="font-medium">{filteredOrders.length}</span>
                  {' '}résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded-l-md"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="rounded-none"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-r-md"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Détails de la commande #{selectedOrder.id}</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <p className="text-sm text-gray-900">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut Paiement</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.payment_status === 'paid' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant</label>
                    <p className="text-sm text-gray-900 font-semibold">{formatPrice(selectedOrder.total_amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantité</label>
                    <p className="text-sm text-gray-900">{selectedOrder.quantity}</p>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{selectedOrder.product_name || `Produit #${selectedOrder.product_id}`}</p>
                    <p className="text-sm text-gray-600">Quantité: {selectedOrder.quantity}</p>
                    {selectedOrder.product_id && (
                      <p className="text-sm text-gray-600">ID Produit: {selectedOrder.product_id}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de livraison</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-line">{selectedOrder.shipping_address}</p>
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mettre à jour le statut</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                      >
                        Confirmer la commande
                      </Button>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            const tracking = prompt("Numéro de suivi:");
                            if (tracking) updateOrderStatus(selectedOrder.id, 'shipped', tracking);
                          }}
                        >
                          Marquer comme expédiée
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                        >
                          Marquer comme livrée
                        </Button>
                      </>
                    )}
                    {['confirmed', 'shipped'].includes(selectedOrder.status) && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      >
                        Annuler la commande
                      </Button>
                    )}
                    {selectedOrder.status === 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'refunded')}
                      >
                        Marquer comme remboursée
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
