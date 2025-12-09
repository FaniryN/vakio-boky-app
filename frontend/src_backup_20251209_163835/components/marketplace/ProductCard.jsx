import { motion } from "framer-motion";
import { FiShoppingCart, FiPackage, FiDownload, FiBookOpen } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function ProductCard({ product, onOrder, isOwned = false, onDownload, onRead }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiPackage className="text-4xl text-blue-400" />
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Rupture
          </div>
        )}

        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-blue-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>

          <span
            className={`text-sm ${
              product.stock_quantity > 5
                ? "text-green-600"
                : product.stock_quantity > 0
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {product.stock_quantity > 0
              ? `${product.stock_quantity} en stock`
              : "Rupture de stock"}
          </span>
        </div>

        {isOwned && product.file_url ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDownload(product)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <FiDownload />
              Télécharger
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRead(product)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <FiBookOpen />
              Lire
            </Button>
          </div>
        ) : (
          <Button
            variant={isOutOfStock ? "secondary" : "primary"}
            size="sm"
            onClick={() => onOrder(product)}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2"
          >
            <FiShoppingCart />
            {isOutOfStock ? "Rupture" : "Commander"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
