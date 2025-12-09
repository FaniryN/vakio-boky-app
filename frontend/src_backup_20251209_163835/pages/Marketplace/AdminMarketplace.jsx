import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPackage,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AddProductModal from "@/components/marketplace/AddProductModal";
import EditProductModal from "@/components/marketplace/EditProductModal";
// import AdminNav from "@/components/admin/AdminNav";

export default function AdminMarketplace() {
  const {
    adminProducts = [],
    loading,
    error,
    fetchAdminProducts,
    deleteProduct,
    addProduct,
    updateProduct,
  } = useMarketplace();

  const { isAdmin, isAuthenticated } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminProducts();
    }
  }, [isAuthenticated]);

  const filteredProducts = adminProducts.filter(
    (product) =>
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error("❌ Erreur suppression:", error);
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      const token = localStorage.getItem("vakio_token");
      const response = await fetch(`http://localhost:5000/api/marketplace/admin/${productId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the products list
        fetchAdminProducts();
      } else {
        throw new Error(data.error || "Erreur lors de l'approbation");
      }
    } catch (error) {
      console.error("❌ Erreur approbation:", error);
      setError("Erreur lors de l'approbation du produit");
    }
  };

  const handleRejectProduct = async (productId) => {
    const reason = prompt("Raison du rejet (optionnel):");
    try {
      const token = localStorage.getItem("vakio_token");
      const response = await fetch(`http://localhost:5000/api/marketplace/admin/${productId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the products list
        fetchAdminProducts();
      } else {
        throw new Error(data.error || "Erreur lors du rejet");
      }
    } catch (error) {
      console.error("❌ Erreur rejet:", error);
      setError("Erreur lors du rejet du produit");
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setShowAddModal(false);
    } catch (error) {
      console.error("❌ Erreur ajout produit:", error);
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      await updateProduct(productId, productData);
      setEditingProduct(null);
    } catch (error) {
      console.error("❌ Erreur modification produit:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des produits...
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiPackage className="text-blue-600" />
              Administration Marketplace
            </h1>
            <p className="text-gray-600 mt-2">
              Gérer les produits du marketplace Vakio Boky
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Ajouter un produit
          </Button>
        </div>

      {/* Barre de recherche et stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-80"
          />

          <div className="flex gap-4 text-sm text-gray-600">
            <span>Total: {adminProducts.length} produits</span>
            <span>
              Approuvés:{" "}
              {adminProducts.filter((p) => p?.status === "approved").length}
            </span>
            <span>
              En attente:{" "}
              {adminProducts.filter((p) => p?.status === "pending").length}
            </span>
            <span>
              Rejetés:{" "}
              {adminProducts.filter((p) => p?.status === "rejected").length}
            </span>
          </div>
        </div>
      </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <Button
              variant="primary"
              size="sm"
              onClick={fetchAdminProducts}
              className="ml-4"
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Tableau des produits */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? "Aucun produit correspondant à votre recherche"
                  : "Aucun produit trouvé"}
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="mt-4"
              >
                <FiPlus className="mr-2" />
                Ajouter un produit
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
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
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {product.image_url ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={product.image_url}
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FiPackage className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={
                            product.stock_quantity > 10
                              ? "text-green-600"
                              : product.stock_quantity > 0
                              ? "text-orange-600"
                              : "text-red-600"
                          }
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : product.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : product.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status === "approved" ? (
                            <>
                              <FiEye className="inline mr-1" />
                              Approuvé
                            </>
                          ) : product.status === "pending" ? (
                            <>
                              <FiEyeOff className="inline mr-1" />
                              En attente
                            </>
                          ) : product.status === "rejected" ? (
                            <>
                              <FiEyeOff className="inline mr-1" />
                              Rejeté
                            </>
                          ) : (
                            <>
                              <FiEyeOff className="inline mr-1" />
                              {product.status}
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {product.status === "pending" && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApproveProduct(product.id)}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              >
                                <FiEye />
                                Approuver
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRejectProduct(product.id)}
                                className="flex items-center gap-1"
                              >
                                <FiEyeOff />
                                Rejeter
                              </Button>
                            </>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                            className="flex items-center gap-1"
                          >
                            <FiEdit />
                            Modifier
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
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

        {/* Modales */}
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchAdminProducts();
          }}
        />

        <EditProductModal
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchAdminProducts();
          }}
        />
      </div>
    </div>
  );
}
