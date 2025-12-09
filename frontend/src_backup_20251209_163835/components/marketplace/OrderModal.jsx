// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FiX, FiPackage, FiMapPin, FiCreditCard } from "react-icons/fi";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import PaymentModal from "./PaymentModal";

// export default function OrderModal({
//   product,
//   isOpen,
//   onClose,
//   onSubmit,
//   loading = false,
// }) {
//   const [quantity, setQuantity] = useState(1);
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [orderData, setOrderData] = useState(null);

//   if (!isOpen || !product) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (quantity < 1 || quantity > product.stock_quantity) {
//       alert("❌ Quantité invalide");
//       return;
//     }

//     if (!shippingAddress.trim()) {
//       alert("❌ Veuillez saisir une adresse de livraison");
//       return;
//     }

//     const orderDetails = {
//       product_id: product.id,
//       quantity,
//       shipping_address: shippingAddress,
//     };

//     try {
//       // Create the order first
//       const result = await onSubmit(orderDetails);

//       if (result && result.order) {
//         // Store order data and show payment modal
//         setOrderData({
//           id: result.order.id,
//           amount: result.order.total_amount,
//         });
//         setShowPaymentModal(true);
//       }
//     } catch (error) {
//       console.error('Order creation error:', error);
//     }
//   };

//   const handlePaymentSuccess = (payment) => {
//     setShowPaymentModal(false);
//     onClose();
//     alert('✅ Commande et paiement confirmés avec succès !');
//   };

//   const totalAmount = (product.price * quantity).toFixed(2);

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
//         className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
//             <FiPackage />
//             Passer commande
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <FiX size={24} />
//           </button>
//         </div>

//         {/* Produit */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex gap-4">
//             <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
//               {product.image_url ? (
//                 <img
//                   src={product.image_url}
//                   alt={product.name}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               ) : (
//                 <FiPackage className="text-2xl text-blue-400" />
//               )}
//             </div>

//             <div className="flex-1">
//               <h3 className="font-semibold text-blue-900 mb-1">
//                 {product.name}
//               </h3>
//               <p className="text-2xl font-bold text-green-600 mb-2">
//                 {new Intl.NumberFormat("fr-FR", {
//                   style: "currency",
//                   currency: "EUR",
//                 }).format(product.price)}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Stock:{" "}
//                 <span className="font-semibold">{product.stock_quantity}</span>{" "}
//                 unités
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Formulaire */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Quantité */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Quantité
//             </label>
//             <Input
//               type="number"
//               min="1"
//               max={product.stock_quantity}
//               value={quantity}
//               onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//               required
//             />
//           </div>

//           {/* Adresse de livraison */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <FiMapPin />
//               Adresse de livraison
//             </label>
//             <textarea
//               value={shippingAddress}
//               onChange={(e) => setShippingAddress(e.target.value)}
//               placeholder="Saisissez votre adresse complète de livraison..."
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               rows="3"
//               required
//             />
//           </div>

//           <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Sous-total:</span>
//               <span>{(product.price * quantity).toFixed(2)} €</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Livraison:</span>
//               <span className="text-green-600">Gratuite</span>
//             </div>
//             <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
//               <span>Total:</span>
//               <span className="text-lg text-green-600">{totalAmount} €</span>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={onClose}
//               disabled={loading}
//               className="flex-1"
//             >
//               Annuler
//             </Button>
//             <Button
//               type="submit"
//               variant="primary"
//               disabled={loading || product.stock_quantity === 0}
//               className="flex-1"
//             >
//               {loading ? "Traitement..." : "Passer au paiement"}
//               <FiCreditCard className="ml-2" />
//             </Button>
//           </div>
//         </form>
//       </motion.div>

//       {/* Payment Modal */}
//       {orderData && (
//         <PaymentModal
//           isOpen={showPaymentModal}
//           onClose={() => setShowPaymentModal(false)}
//           orderId={orderData.id}
//           amount={orderData.amount}
//           onPaymentSuccess={handlePaymentSuccess}
//         />
//       )}
//     </motion.div>
//   );
// }
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiPackage, FiMapPin, FiCreditCard, FiSmartphone, FiCheck, FiDollarSign, FiWifi } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function OrderModal({
  product,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mvola");
  const [orderStep, setOrderStep] = useState("details"); // "details" ou "payment"

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setShippingAddress("");
      setPhone("");
      setPaymentMethod("mvola");
      setOrderStep("details");
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const paymentMethods = [
    {
      id: 'mvola',
      name: 'MVola',
      icon: FiSmartphone,
      color: 'bg-purple-500',
      description: 'Paiement via MVola (Telma)',
      testPhone: '03322222222'
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: FiSmartphone,
      color: 'bg-orange-500',
      description: 'Paiement via Orange Money',
      testPhone: '03411111111'
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      icon: FiSmartphone,
      color: 'bg-red-500',
      description: 'Paiement via Airtel Money',
      testPhone: '03233333333'
    },
    {
      id: 'stripe',
      name: 'Carte Bancaire',
      icon: FiCreditCard,
      color: 'bg-blue-500',
      description: 'Paiement sécurisé par carte',
      testCard: '4242 4242 4242 4242'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: FiDollarSign,
      color: 'bg-blue-400',
      description: 'Payer avec votre compte PayPal'
    }
  ];

  const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantity < 1 || quantity > product.stock_quantity) {
      alert("❌ Quantité invalide");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("❌ Veuillez saisir une adresse de livraison");
      return;
    }

    if (['mvola', 'orange_money', 'airtel_money'].includes(paymentMethod) && !phone.trim()) {
      alert("❌ Veuillez saisir votre numéro de téléphone pour le paiement mobile");
      return;
    }

    const orderData = {
      product_id: product.id,
      quantity,
      shipping_address: shippingAddress,
      phone: phone.trim(),
      payment_method: paymentMethod,
      total_amount: product.price * quantity
    };

    try {
      await onSubmit(orderData);
    } catch (error) {
      console.error('Order submission error:', error);
    }
  };

  const totalAmount = (product.price * quantity).toFixed(2);

  const renderDetailsStep = () => (
    <>
      {/* Produit */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FiPackage className="text-2xl text-blue-400" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              {product.name}
            </h3>
            <p className="text-2xl font-bold text-green-600 mb-2">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(product.price)}
            </p>
            <p className="text-sm text-gray-600">
              Stock:{" "}
              <span className="font-semibold">{product.stock_quantity}</span>{" "}
              unités
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={(e) => { e.preventDefault(); setOrderStep("payment"); }} className="p-6 space-y-4">
        {/* Quantité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantité
          </label>
          <Input
            type="number"
            min="1"
            max={product.stock_quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />
        </div>

        {/* Adresse de livraison */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FiMapPin />
            Adresse de livraison
          </label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Saisissez votre adresse complète de livraison..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            required
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sous-total:</span>
            <span>{(product.price * quantity).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Livraison:</span>
            <span className="text-green-600">Gratuite</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-lg text-green-600">{totalAmount} €</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || product.stock_quantity === 0}
            className="flex-1"
          >
            Continuer vers le paiement
            <FiCreditCard className="ml-2" />
          </Button>
        </div>
      </form>
    </>
  );

  const renderPaymentStep = () => (
    <>
      {/* En-tête retour */}
      <div className="p-6 border-b border-gray-200 flex items-center gap-4">
        <button
          onClick={() => setOrderStep("details")}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Retour
        </button>
        <h3 className="text-lg font-semibold text-gray-900 flex-1 text-center">
          Sélection du paiement
        </h3>
        <div className="w-6"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Méthodes de paiement */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Choisissez votre méthode de paiement</h4>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <motion.button
                key={method.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPaymentMethod(method.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${paymentMethod === method.id 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center mb-2`}>
                    <method.icon className="text-white text-lg" />
                  </div>
                  
                  <span className="font-medium text-gray-900 text-sm mb-1">
                    {method.name}
                  </span>
                  
                  <span className="text-xs text-gray-600">
                    {method.description}
                  </span>
                </div>
                
                {paymentMethod === method.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiCheck className="text-white text-xs" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Champ téléphone pour mobile money */}
        {['mvola', 'orange_money', 'airtel_money'].includes(paymentMethod) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre numéro de téléphone {selectedPaymentMethod?.name}
              {process.env.NODE_ENV === 'development' && (
                <span className="ml-2 text-xs text-gray-500">
                  (Test: {selectedPaymentMethod?.testPhone})
                </span>
              )}
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={`Ex: ${selectedPaymentMethod?.testPhone || '034 12 345 67'}`}
              required
            />
          </div>
        )}

        {/* Résumé */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Produit:</span>
            <span className="text-sm font-medium">{product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Quantité:</span>
            <span className="text-sm font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Méthode de paiement:</span>
            <span className="text-sm font-medium capitalize">
              {paymentMethod.replace('_', ' ')}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total à payer:</span>
            <span className="text-lg text-green-600">{totalAmount} €</span>
          </div>
        </div>

        {/* Note simulation */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <FiWifi className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Mode Développement</p>
                <p className="text-xs text-yellow-700">
                  Les paiements sont simulés. Aucun vrai argent ne sera débité.
                  {selectedPaymentMethod?.testPhone && ` Utilisez ${selectedPaymentMethod.testPhone} pour tester.`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOrderStep("details")}
            disabled={loading}
            className="flex-1"
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || product.stock_quantity === 0}
            className="flex-1"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Traitement...
              </span>
            ) : (
              <>
                Confirmer et payer
                <FiCheck className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );

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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <FiPackage />
            {orderStep === "details" ? "Passer commande" : "Paiement"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {orderStep === "details" ? renderDetailsStep() : renderPaymentStep()}
      </motion.div>
    </motion.div>
  );
}