// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   FiShoppingCart, 
//   FiPackage, 
//   FiCreditCard, 
//   FiTrendingUp,
//   FiUsers,
//   FiStar,
//   FiDownload,
//   FiBookOpen,
//   FiArrowRight,
//   FiX
// } from "react-icons/fi";
// import { useMarketplace } from "@/hooks/useMarketplace";
// import { useAuth } from "@/hooks/useAuth";
// import ProductCard from "@/components/marketplace/ProductCard";
// import OrderModal from "@/components/marketplace/OrderModal";
// import ConfirmationModal from "@/components/marketplace/ConfirmationModal";
// import Button from "@/components/ui/Button";
// import { useEmail } from "@/hooks/useEmail";
// import { saveEbook, getEbook } from "@/utils/offlineStorage";

// export default function Marketplace() {
//   const { products, orders, loading, error, createOrder, fetchUserOrders } =
//     useMarketplace();

//   const { user } = useAuth();
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [lastOrder, setLastOrder] = useState(null);
//   const [orderLoading, setOrderLoading] = useState(false);

//   const { sendOrderConfirmation } = useEmail();

//   const handleOrderProduct = (product) => {
//     setSelectedProduct(product);
//     setIsOrderModalOpen(true);
//   };

//   const handleCloseOrderModal = () => {
//     setIsOrderModalOpen(false);
//     setSelectedProduct(null);
//   };

//   const handleSubmitOrder = async (orderData) => {
//     setOrderLoading(true);

//     try {
//       console.log("🔄 Création de commande...", orderData);

//       const result = await createOrder(orderData);
//       console.log("✅ Commande créée:", result);

//       const userEmail = user?.email || user?.user?.email;

//       if (userEmail) {
//         try {
//           console.log("📧 Envoi email de confirmation à:", userEmail);

//           await sendOrderConfirmation({
//             user: {
//               first_name:
//                 user?.first_name || user?.user?.first_name || "Client",
//               email: userEmail,
//             },
//             order: {
//               order_number:
//                 result.id || result.order_number || `CMD-${Date.now()}`,
//               created_at: result.created_at || new Date().toISOString(),
//             },
//             orderItems: [
//               {
//                 product_name: selectedProduct?.name || "Produit",
//                 quantity: orderData.quantity || 1,
//                 price: selectedProduct?.price || 0,
//               },
//             ],
//           });

//           console.log("✅ Email de confirmation envoyé !");
//         } catch (emailError) {
//           console.error("⚠️ Email non envoyé:", emailError);
//         }
//       } else {
//         console.warn("⚠️ Aucun email trouvé. User object:", user);
//       }
//       setLastOrder({
//         order: result,
//         product: selectedProduct,
//       });
//       setIsConfirmationModalOpen(true);
//       setIsOrderModalOpen(false);

//       await fetchUserOrders();
//     } catch (error) {
//       console.error("❌ Erreur lors de la commande:", error);
//       alert(`Erreur: ${error.message}`);
//     } finally {
//       setOrderLoading(false);
//     }
//   };

//   const handleCloseConfirmation = () => {
//     setIsConfirmationModalOpen(false);
//     setLastOrder(null);
//   };

//   const handleDownload = async (product) => {
//     if (!product.file_url) return;

//     try {
//       const existing = await getEbook(product.id);
//       if (existing) {
//         const url = window.URL.createObjectURL(existing.blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${product.name}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         return;
//       }

//       const response = await fetch(product.file_url);
//       const blob = await response.blob();

//       await saveEbook({
//         id: product.id,
//         name: product.name,
//         blob: blob,
//         downloadedAt: new Date().toISOString(),
//       });

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${product.name}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error('Download failed:', error);
//       alert('Erreur lors du téléchargement');
//     }
//   };

//   const handleRead = (product) => {
//     window.location.href = `/reader?id=${product.id}`;
//   };

//   const isProductOwned = (productId) => {
//     return orders.some(order => order.product_id === productId && order.status === 'confirmed');
//   };

//   // Statistiques pour l'en-tête
//   const stats = [
//     { value: products.length, label: "Produits Disponibles", icon: FiPackage, color: "blue" },
//     { value: orders.filter(order => order.status === 'confirmed').length, label: "Commandes Confirmées", icon: FiCreditCard, color: "green" },
//     { value: products.reduce((total, product) => total + (product.sales_count || 0), 0), label: "Ventes Total", icon: FiTrendingUp, color: "purple" },
//     { value: "100%", label: "Satisfaction", icon: FiStar, color: "amber" }
//   ];

//   if (loading && products.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-20 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="mt-4 text-gray-600 text-lg">Chargement des produits...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-20 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* En-tête principal */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-16"
//         >
//           <motion.h1
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6"
//           >
//             Marketplace Vakio Boky
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
//           >
//             Découvrez nos produits exclusifs et soutenez l'initiative Vakio Boky. 
//             Chaque achat contribue à promouvoir la littérature malgache.
//           </motion.p>
//         </motion.div>

//         {/* Section Statistiques */}
//         <motion.section
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="mb-16"
//         >
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 + index * 0.1 }}
//                 whileHover={{ y: -5, scale: 1.02 }}
//                 className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all duration-300"
//               >
//                 <div className={`w-16 h-16 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
//                   <stat.icon className="text-white text-2xl" />
//                 </div>
//                 <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
//                 <div className="text-gray-600 font-semibold text-sm">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>

//         {/* Section Produits */}
//         <motion.section
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="mb-16"
//         >
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
//                   <FiPackage className="text-white text-xl" />
//                 </div>
//                 Nos Produits
//               </h2>
//               <p className="text-gray-600 text-lg">Découvrez notre collection exclusive de livres et produits dérivés</p>
//             </div>
            
//             <div className="flex items-center gap-3 text-sm text-gray-500">
//               <FiShoppingCart className="text-green-500" />
//               <span>{products.length} produits disponibles</span>
//             </div>
//           </div>

//           {/* Message d'erreur */}
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex justify-between items-center shadow-lg"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
//                   <FiX className="text-red-600" />
//                 </div>
//                 <span className="font-medium">{error}</span>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => window.location.reload()}
//                 className="border-red-200 text-red-700 hover:bg-red-100"
//               >
//                 Réessayer
//               </Button>
//             </motion.div>
//           )}

//           {/* Grille de produits */}
//           {products.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300"
//             >
//               <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
//               <h3 className="text-2xl font-semibold text-gray-600 mb-2">
//                 Aucun produit disponible
//               </h3>
//               <p className="text-gray-500 mb-6 max-w-md mx-auto">
//                 Revenez bientôt pour découvrir nos nouvelles collections
//               </p>
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
//             >
//               {products.map((product, index) => (
//                 <motion.div
//                   key={product.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ y: -5 }}
//                 >
//                   <ProductCard
//                     product={product}
//                     onOrder={handleOrderProduct}
//                     isOwned={isProductOwned(product.id)}
//                     onDownload={handleDownload}
//                     onRead={handleRead}
//                   />
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </motion.section>

//         {/* Section Commandes utilisateur */}
//         {user && orders.length > 0 && (
//           <motion.section
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.0 }}
//             className="mb-16"
//           >
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
//                   <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
//                     <FiCreditCard className="text-white text-xl" />
//                   </div>
//                   Mes Commandes
//                 </h2>
//                 <p className="text-gray-600 text-lg">Suivez l'état de vos achats et téléchargez vos produits</p>
//               </div>
              
//               <div className="flex items-center gap-3 text-sm text-gray-500">
//                 <FiTrendingUp className="text-blue-500" />
//                 <span>{orders.length} commande{orders.length > 1 ? 's' : ''}</span>
//               </div>
//             </div>

//             <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
//               <div className="p-6 space-y-4">
//                 {orders.map((order, index) => (
//                   <motion.div
//                     key={order.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
//                         <FiPackage className="text-blue-600 text-xl" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900 text-lg">
//                           {order.product_name}
//                         </h3>
//                         <p className="text-sm text-gray-600">
//                           Quantité: {order.quantity} • Total: {order.total_amount} €
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span
//                             className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
//                               order.status === "confirmed"
//                                 ? "bg-green-100 text-green-800 border border-green-200"
//                                 : "bg-yellow-100 text-yellow-800 border border-yellow-200"
//                             }`}
//                           >
//                             {order.status === "confirmed" ? "✅ Confirmée" : "⏳ En attente"}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {new Date(order.created_at).toLocaleDateString("fr-FR")}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {order.status === "confirmed" && (
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="border-blue-200 text-blue-600 hover:bg-blue-50"
//                         onClick={() => {
//                           const product = products.find(p => p.id === order.product_id);
//                           if (product) handleDownload(product);
//                         }}
//                       >
//                         <FiDownload className="mr-2" />
//                         Télécharger
//                       </Button>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </motion.section>
//         )}
//       </div>

//       {/* Modal de commande */}
//       <OrderModal
//         product={selectedProduct}
//         isOpen={isOrderModalOpen}
//         onClose={handleCloseOrderModal}
//         onSubmit={handleSubmitOrder}
//         loading={orderLoading}
//       />

//       {/* Modal de confirmation */}
//       <ConfirmationModal
//         isOpen={isConfirmationModalOpen}
//         onClose={handleCloseConfirmation}
//         order={lastOrder?.order}
//         product={lastOrder?.product}
//       />
//     </div>
//   );
// }
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiShoppingCart, 
  FiPackage, 
  FiCreditCard, 
  FiTrendingUp,
  FiUsers,
  FiStar,
  FiDownload,
  FiBookOpen,
  FiArrowRight,
  FiX,
  FiSmartphone,
  FiCheckCircle
} from "react-icons/fi";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";
import ProductCard from "@/components/marketplace/ProductCard";
import OrderModal from "@/components/marketplace/OrderModal";
import ConfirmationModal from "@/components/marketplace/ConfirmationModal";
import Button from "@/components/ui/Button";
import { useEmail } from "@/hooks/useEmail";
import { saveEbook, getEbook } from "@/utils/offlineStorage";
import { usePayment } from "@/hooks/usePayment";

export default function Marketplace() {
  const { products, orders, loading, error, createOrder, fetchUserOrders, updateOrderPaymentStatus } =
    useMarketplace();

  const { user } = useAuth();
  const { paymentLoading, paymentError, simulatePayment } = usePayment();
  const { sendOrderConfirmation } = useEmail();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const handleOrderProduct = (product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitOrder = async (orderData) => {
    setOrderLoading(true);

    try {
      console.log("🔄 Création de commande...", orderData);

      const result = await createOrder(orderData);
      console.log("✅ Commande créée:", result);

      const userEmail = user?.email || user?.user?.email;
      const userName = user?.first_name || user?.user?.first_name || "Client";

      // SIMULATION DE PAIEMENT
      console.log("💳 Début du processus de paiement...");
      
      let paymentResult;
      try {
        paymentResult = await simulatePayment({
          orderId: result.id || `CMD-${Date.now()}`,
          amount: selectedProduct?.price * (orderData.quantity || 1),
          currency: 'MGA',
          customerName: userName,
          customerEmail: userEmail,
          customerPhone: orderData.phone || this.getTestPhone(orderData.payment_method),
          paymentMethod: orderData.payment_method
        });

        console.log("✅ Paiement simulé:", paymentResult);
        
        // Mettre à jour la commande avec le statut de paiement
        if (updateOrderPaymentStatus) {
          await updateOrderPaymentStatus(result.id, {
            payment_status: paymentResult.status === 'completed' ? 'paid' : 'failed',
            payment_method: orderData.payment_method,
            transaction_id: paymentResult.transactionId
          });
        }

        setPaymentInfo({
          method: orderData.payment_method,
          status: paymentResult.status,
          transactionId: paymentResult.transactionId,
          amount: paymentResult.amount,
          mock: true
        });

      } catch (paymentError) {
        console.error("❌ Échec du paiement:", paymentError);
        setPaymentInfo({
          method: orderData.payment_method,
          status: 'failed',
          error: paymentError.message,
          mock: true
        });
        throw new Error(`Paiement échoué: ${paymentError.message}`);
      }

      // ENVOI EMAIL
      if (userEmail) {
        try {
          console.log("📧 Envoi email de confirmation à:", userEmail);

          await sendOrderConfirmation({
            user: {
              first_name: userName,
              email: userEmail,
            },
            order: {
              order_number: result.id || result.order_number || `CMD-${Date.now()}`,
              created_at: result.created_at || new Date().toISOString(),
              total_amount: selectedProduct?.price * (orderData.quantity || 1),
              payment_method: orderData.payment_method,
              payment_status: paymentResult.status
            },
            orderItems: [
              {
                product_name: selectedProduct?.name || "Produit",
                quantity: orderData.quantity || 1,
                price: selectedProduct?.price || 0,
              },
            ],
          });

          console.log("✅ Email de confirmation envoyé !");
        } catch (emailError) {
          console.error("⚠️ Email non envoyé:", emailError);
        }
      } else {
        console.warn("⚠️ Aucun email trouvé. User object:", user);
      }

      setLastOrder({
        order: result,
        product: selectedProduct,
      });
      
      setIsConfirmationModalOpen(true);
      setIsOrderModalOpen(false);

      await fetchUserOrders();
    } catch (error) {
      console.error("❌ Erreur lors de la commande:", error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setOrderLoading(false);
    }
  };

  const getTestPhone = (paymentMethod) => {
    const testPhones = {
      'mvola': '03322222222',
      'orange_money': '03411111111',
      'airtel_money': '03233333333',
      'stripe': 'N/A',
      'paypal': 'N/A'
    };
    return testPhones[paymentMethod] || '03400000000';
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationModalOpen(false);
    setLastOrder(null);
    setPaymentInfo(null);
  };

  const handleDownload = async (product) => {
    if (!product.file_url) return;

    try {
      const existing = await getEbook(product.id);
      if (existing) {
        const url = window.URL.createObjectURL(existing.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }

      const response = await fetch(product.file_url);
      const blob = await response.blob();

      await saveEbook({
        id: product.id,
        name: product.name,
        blob: blob,
        downloadedAt: new Date().toISOString(),
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleRead = (product) => {
    window.location.href = `/reader?id=${product.id}`;
  };

  const isProductOwned = (productId) => {
    return orders.some(order => order.product_id === productId && order.status === 'confirmed');
  };

  // Statistiques pour l'en-tête
  const stats = [
    { value: products.length, label: "Produits Disponibles", icon: FiPackage, color: "blue" },
    { value: orders.filter(order => order.status === 'confirmed').length, label: "Commandes Confirmées", icon: FiCreditCard, color: "green" },
    { value: products.reduce((total, product) => total + (product.sales_count || 0), 0), label: "Ventes Total", icon: FiTrendingUp, color: "purple" },
    { value: "100%", label: "Satisfaction", icon: FiStar, color: "amber" }
  ];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Chargement des produits...</p>
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
            className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6"
          >
            Marketplace Vakio Boky
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Découvrez nos produits exclusifs et soutenez l'initiative Vakio Boky. 
            Chaque achat contribue à promouvoir la littérature malgache.
          </motion.p>
          
          {/* Bannière mode développement */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium border border-yellow-300"
            >
              <FiSmartphone className="text-yellow-600" />
              <span>Mode Développement: Paiements simulés avec MVola, Orange Money, Airtel Money</span>
            </motion.div>
          )}
        </motion.div>

        {/* Section Statistiques */}
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
        </motion.section>

        {/* Section Produits */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                  <FiPackage className="text-white text-xl" />
                </div>
                Nos Produits
              </h2>
              <p className="text-gray-600 text-lg">Découvrez notre collection exclusive de livres et produits dérivés</p>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FiShoppingCart className="text-green-500" />
              <span>{products.length} produits disponibles</span>
              {process.env.NODE_ENV === 'development' && (
                <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Paiements simulés
                </span>
              )}
            </div>
          </div>

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
                onClick={() => window.location.reload()}
                className="border-red-200 text-red-700 hover:bg-red-100"
              >
                Réessayer
              </Button>
            </motion.div>
          )}

          {/* Grille de produits */}
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300"
            >
              <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                Aucun produit disponible
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Revenez bientôt pour découvrir nos nouvelles collections
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <ProductCard
                    product={product}
                    onOrder={handleOrderProduct}
                    isOwned={isProductOwned(product.id)}
                    onDownload={handleDownload}
                    onRead={handleRead}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Section Commandes utilisateur */}
        {user && orders.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mb-16"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                    <FiCreditCard className="text-white text-xl" />
                  </div>
                  Mes Commandes
                </h2>
                <p className="text-gray-600 text-lg">Suivez l'état de vos achats et téléchargez vos produits</p>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <FiTrendingUp className="text-blue-500" />
                <span>{orders.length} commande{orders.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                        <FiPackage className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {order.product_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantité: {order.quantity} • Total: {order.total_amount} €
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                              order.status === "confirmed"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            }`}
                          >
                            {order.status === "confirmed" ? "✅ Confirmée" : "⏳ En attente"}
                          </span>
                          {order.payment_method && (
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                              {order.payment_method === 'mvola' ? 'MVola' : 
                               order.payment_method === 'orange_money' ? 'Orange Money' :
                               order.payment_method === 'airtel_money' ? 'Airtel Money' : 
                               order.payment_method}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {order.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          const product = products.find(p => p.id === order.product_id);
                          if (product) handleDownload(product);
                        }}
                      >
                        <FiDownload className="mr-2" />
                        Télécharger
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Modal de commande */}
      <OrderModal
        product={selectedProduct}
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        onSubmit={handleSubmitOrder}
        loading={orderLoading || paymentLoading}
      />

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmation}
        order={lastOrder?.order}
        product={lastOrder?.product}
        payment={paymentInfo}
      />
    </div>
  );
}