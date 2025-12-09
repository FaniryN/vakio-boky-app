// import React from "react";
// import { motion } from "framer-motion";
// import { FiCheck, FiPackage, FiTruck, FiMail } from "react-icons/fi";
// import Button from "@/components/ui/Button";

// export default function ConfirmationModal({ isOpen, onClose, order, product }) {
//   if (!isOpen || !order || !product) return null;

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("fr-FR", {
//       style: "currency",
//       currency: "EUR",
//     }).format(price);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-xl shadow-2xl max-w-md w-full"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header avec succès */}
//         <div className="bg-green-500 text-white p-6 rounded-t-xl text-center">
//           <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FiCheck size={32} />
//           </div>
//           <h2 className="text-2xl font-bold">Commande Confirmée !</h2>
//           <p className="opacity-90 mt-2">
//             Votre commande a été passée avec succès
//           </p>
//         </div>

//         {/* Détails de la commande */}
//         <div className="p-6 space-y-6">
//           {/* Produit commandé */}
//           <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//             {product.image_url ? (
//               <img
//                 src={product.image_url}
//                 alt={product.name}
//                 className="w-16 h-16 object-cover rounded-lg"
//               />
//             ) : (
//               <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <FiPackage className="text-blue-600" size={24} />
//               </div>
//             )}
//             <div className="flex-1">
//               <h3 className="font-semibold text-gray-900">{product.name}</h3>
//               <p className="text-sm text-gray-600">
//                 Quantité: {order.quantity} × {formatPrice(product.price)}
//               </p>
//             </div>
//           </div>

//           {/* Informations de livraison */}
//           <div className="space-y-3">
//             <h4 className="font-semibold text-gray-900 flex items-center gap-2">
//               <FiTruck />
//               Livraison
//             </h4>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-700 whitespace-pre-line">
//                 {order.shipping_address}
//               </p>
//             </div>
//           </div>

//           {/* Résumé du prix */}
//           <div className="border-t border-gray-200 pt-4 space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Sous-total:</span>
//               <span>{formatPrice(order.total_amount)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Livraison:</span>
//               <span className="text-green-600">Gratuite</span>
//             </div>
//             <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
//               <span>Total:</span>
//               <span className="text-green-600">
//                 {formatPrice(order.total_amount)}
//               </span>
//             </div>
//           </div>

//           {/* Numéro de commande */}
//           <div className="bg-gray-100 p-3 rounded-lg text-center">
//             <p className="text-sm text-gray-600">Numéro de commande</p>
//             <p className="font-mono font-bold text-gray-900">
//               CMD-{order.id.toString().padStart(6, "0")}
//             </p>
//           </div>

//           {/* Instructions */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <FiMail className="text-yellow-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-yellow-800">
//                   <strong>Prochaine étape :</strong> Vous recevrez un email de
//                   confirmation avec les détails de suivi de votre commande.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3 p-6 border-t border-gray-200">
//           <Button variant="primary" onClick={onClose} className="flex-1">
//             Parfait, merci !
//           </Button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }
import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiPackage, FiTruck, FiMail, FiCreditCard, FiSmartphone, FiWifi } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function ConfirmationModal({ isOpen, onClose, order, product, payment }) {
  if (!isOpen || !order || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getPaymentMethodName = (method) => {
    const names = {
      'mvola': 'MVola',
      'orange_money': 'Orange Money',
      'airtel_money': 'Airtel Money',
      'stripe': 'Carte Bancaire',
      'paypal': 'PayPal'
    };
    return names[method] || method;
  };

  const getPaymentMethodIcon = (method) => {
    if (['mvola', 'orange_money', 'airtel_money'].includes(method)) {
      return FiSmartphone;
    }
    return FiCreditCard;
  };

  const PaymentIcon = payment ? getPaymentMethodIcon(payment.method) : FiCreditCard;

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
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec succès */}
        <div className="bg-green-500 text-white p-6 rounded-t-xl text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">Commande Confirmée !</h2>
          <p className="opacity-90 mt-2">
            Votre commande a été passée avec succès
          </p>
          {payment?.mock && (
            <div className="mt-3 inline-flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs">
              <FiWifi size={12} />
              <span>Paiement simulé</span>
            </div>
          )}
        </div>

        {/* Détails de la commande */}
        <div className="p-6 space-y-6">
          {/* Produit commandé */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiPackage className="text-blue-600" size={24} />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Quantité: {order.quantity} × {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* Informations de paiement */}
          {payment && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <PaymentIcon />
                Paiement {payment.status === 'completed' ? 'réussi' : 'échoué'}
              </h4>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Méthode:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getPaymentMethodName(payment.method)}
                  </span>
                </div>
                
                {payment.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction:</span>
                    <span className="text-sm font-mono text-gray-900 truncate max-w-[150px]">
                      {payment.transactionId}
                    </span>
                  </div>
                )}
                
                {payment.amount && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Montant:</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatPrice(payment.amount)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Statut:</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    payment.status === 'completed' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {payment.status === 'completed' ? '✅ Réussi' : '❌ Échoué'}
                  </span>
                </div>
              </div>
              
              {payment.mock && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 text-center">
                    ⚠️ Ceci est une simulation. Aucun vrai paiement n'a été effectué.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Informations de livraison */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiTruck />
              Livraison
            </h4>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {order.shipping_address}
              </p>
            </div>
          </div>

          {/* Résumé du prix */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total:</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison:</span>
              <span className="text-green-600">Gratuite</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span className="text-green-600">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Numéro de commande */}
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">Numéro de commande</p>
            <p className="font-mono font-bold text-gray-900">
              {order.id?.toString().startsWith('CMD-') ? order.id : `CMD-${order.id?.toString().padStart(6, "0")}`}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FiMail className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Prochaine étape :</strong> Vous recevrez un email de
                  confirmation avec les détails de suivi de votre commande.
                </p>
                {payment?.mock && (
                  <p className="text-xs text-yellow-700 mt-1">
                    <strong>Note :</strong> En production, vous recevrez une vraie confirmation de paiement.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button variant="primary" onClick={onClose} className="flex-1">
            Parfait, merci !
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}