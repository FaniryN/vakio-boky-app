import { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiPackage } from "react-icons/fi";
import { useMarketplace } from "@/hooks/useMarketplace";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AddProductModal({ isOpen, onClose, onSuccess }) {
  const { addProduct, loading } = useMarketplace();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    image_url: "",
    file_url: "",
  });

  const categories = [
    "Livres",
    "Vêtements",
    "Accessoires",
    "Goodies",
    "Édition Limitée",
    "Autre",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      await addProduct(productData);
      onSuccess();

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        image_url: "",
        file_url: "",
      });
    } catch (error) {
      console.error("❌ Erreur ajout produit:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      category: "",
      image_url: "",
      file_url: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiPackage />
            Ajouter un nouveau produit
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du produit */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Livre Vakio Boky Édition Limitée"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Décrivez le produit en détail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="29.99"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité en stock *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => handleChange("stock_quantity", e.target.value)}
                placeholder="100"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image
              </label>
              <Input
                type="url"
                value={formData.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* File URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du fichier (pour ebooks)
              </label>
              <Input
                type="url"
                value={formData.file_url}
                onChange={(e) => handleChange("file_url", e.target.value)}
                placeholder="https://example.com/ebook.pdf"
              />
            </div>

            {/* Aperçu de l'image */}
            {formData.image_url && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aperçu de l'image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <img
                    src={formData.image_url}
                    alt="Aperçu"
                    className="max-h-32 mx-auto rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    L'image s'affichera ici si l'URL est valide
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              <FiPackage className="mr-2" />
              Ajouter le produit
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
