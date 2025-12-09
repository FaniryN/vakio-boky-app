import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useEmail } from "./useEmail";

export const useMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sendOrderConfirmation } = useEmail();
  const { user } = useAuth();

  const API_BASE_URL = "https://vakio-boky-backend.onrender.com/api";

  // Récupérer tous les produits
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/marketplace`);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Le serveur a renvoyé une réponse non-JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        setProducts(data.products || []);
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur récupération produits:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProducts = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/admin`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Réponse serveur non-JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        setAdminProducts(data.products || []);
      } else {
        throw new Error(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur récupération produits admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    if (!user?.token) {
      throw new Error("Non authentifié");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(productData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Réponse serveur non-JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        setAdminProducts((prev) => [...prev, data.product]);
        return data.product;
      } else {
        throw new Error(data.error || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur ajout produit:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!user?.token) {
      throw new Error("Non authentifié");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/admin/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Réponse serveur non-JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        setAdminProducts((prev) =>
          prev.map((product) =>
            product.id === productId ? data.product : product
          )
        );
        return data.product;
      } else {
        throw new Error(data.error || "Erreur lors de la modification");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur modification produit:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!user?.token) {
      throw new Error("Non authentifié");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/marketplace/admin/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Réponse serveur non-JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        setAdminProducts((prev) =>
          prev.filter((product) => product.id !== productId)
        );
        return data;
      } else {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur suppression produit:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        await fetchProducts();
        return data.order;
      } else {
        throw new Error(data.error || "Erreur lors de la création");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur création commande:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/user/orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Réponse serveur non-JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        throw new Error(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur récupération commandes:", err);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Réponse serveur non-JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        await fetchUserOrders();
        return data;
      } else {
        throw new Error(data.error || "Erreur lors du paiement");
      }
    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur traitement paiement:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user?.token) {
      fetchUserOrders();
    }
  }, [user?.token]);

  return {
    // Données
    products,
    adminProducts,
    orders,
    loading,
    error,

    // Fonctions publiques
    fetchProducts,
    createOrder,
    fetchUserOrders,
    processPayment,

    // ✅ FONCTIONS ADMIN
    fetchAdminProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
