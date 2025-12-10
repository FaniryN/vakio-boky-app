import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const auth = useAuth();
  const token = auth.user?.token;

  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleError = (err, defaultMessage) => {
    const errorMessage = err.message || defaultMessage;
    setError(errorMessage);
    console.error("Erreur livres:", err);
    throw new Error(errorMessage);
  };

  // Récupérer tous les livres publiés
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/books", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      handleError(err, "Erreur lors du chargement des livres");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer mes livres
  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        "https://vakio-boky-backend.onrender.com/api/books/mes-livres",
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const booksData = data.books || data || [];
      setMyBooks(Array.isArray(booksData) ? booksData : []);
      return booksData;
    } catch (err) {
      handleError(err, "Erreur lors du chargement de vos livres");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un livre spécifique
  const fetchBook = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/books/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.book || data;
    } catch (err) {
      handleError(err, "Erreur lors du chargement du livre");
    } finally {
      setLoading(false);
    }
  };

  // Créer un livre
  const createBook = async (bookData) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/books", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      showSuccess(data.message || "Livre créé avec succès");
      await fetchMyBooks();
      return data;
    } catch (err) {
      handleError(err, "Erreur lors de la création du livre");
    } finally {
      setLoading(false);
    }
  };

  // Modifier un livre
  const updateBook = async (id, bookData) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/books/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      showSuccess(data.message || "Livre modifié avec succès");
      await Promise.all([fetchBooks(), fetchMyBooks()]);
      return data;
    } catch (err) {
      handleError(err, "Erreur lors de la modification du livre");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un livre
  const deleteBook = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`https://vakio-boky-backend.onrender.com/api/books/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      showSuccess(data.message || "Livre supprimé avec succès");
      await Promise.all([fetchBooks(), fetchMyBooks()]);
      return data;
    } catch (err) {
      handleError(err, "Erreur lors de la suppression du livre");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError("");
  const clearSuccess = () => setSuccess("");

  // Réinitialiser les états
  const reset = () => {
    setBooks([]);
    setMyBooks([]);
    setError("");
    setSuccess("");
    setLoading(false);
  };

  return {
    // State
    books,
    myBooks,
    loading,
    error,
    success,

    // Actions
    fetchBooks,
    fetchMyBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    clearError,
    clearSuccess,
    reset,

    // Setters
    setBooks,
    setMyBooks,
  };
};