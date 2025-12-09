import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiTag,
} from "react-icons/fi";
// import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/marketplace/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);
      } else {
        throw new Error(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des catégories");
      console.error("❌ Erreur chargement catégories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;

    try {
      const token = localStorage.getItem("vakio_token");
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/marketplace/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (data.success) {
        setCategories([...categories, data.category]);
        setNewCategory({ name: "", description: "" });
        setShowAddModal(false);
      } else {
        throw new Error(data.error || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de la catégorie");
      console.error("❌ Erreur ajout catégorie:", err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.name.trim()) return;

    try {
      const token = localStorage.getItem("vakio_token");
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/marketplace/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCategories(categories.map(cat =>
          cat.id === editingCategory.id ? data.category : cat
        ));
        setEditingCategory(null);
      } else {
        throw new Error(data.error || "Erreur lors de la modification");
      }
    } catch (err) {
      setError("Erreur lors de la modification de la catégorie");
      console.error("❌ Erreur modification catégorie:", err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("vakio_token");
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/marketplace/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCategories(categories.filter(cat => cat.id !== categoryId));
      } else {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la catégorie");
      console.error("❌ Erreur suppression catégorie:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Chargement des catégories...
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
              <FiTag className="text-blue-600" />
              Gestion des Catégories
            </h1>
            <p className="text-gray-600 mt-2">
              Organisez les produits du marketplace par catégories
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Ajouter une catégorie
          </Button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Total: {categories.length} catégories</span>
            <span>
              Produits totaux:{" "}
              {categories.reduce((sum, cat) => sum + cat.product_count, 0)}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <Button
              variant="primary"
              size="sm"
              onClick={fetchCategories}
              className="ml-4"
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiTag className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.product_count} produits</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{category.description}</p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingCategory(category)}
                  className="flex items-center gap-1"
                >
                  <FiEdit />
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  <FiTrash2 />
                  Supprimer
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <FiTag className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Aucune catégorie trouvée
            </p>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus className="mr-2" />
              Créer la première catégorie
            </Button>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Ajouter une catégorie</h3>
              <div className="space-y-4">
                <Input
                  label="Nom de la catégorie"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Ex: Romans"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="Description de la catégorie"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddCategory}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Modifier la catégorie</h3>
              <div className="space-y-4">
                <Input
                  label="Nom de la catégorie"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  placeholder="Ex: Romans"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                    placeholder="Description de la catégorie"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setEditingCategory(null)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdateCategory}
                >
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}