// import { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";

// export const useBooks = () => {
//   const [books, setBooks] = useState([]);
//   const [myBooks, setMyBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const auth = useAuth();
//   const token = auth.user?.token;

//   const getAuthHeaders = () => {
//     const headers = {
//       "Content-Type": "application/json",
//     };

//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }

//     return headers;
//   };

//   const showSuccess = (message) => {
//     setSuccess(message);
//     setTimeout(() => setSuccess(""), 3000);
//   };

//   const handleError = (err, defaultMessage) => {
//     const errorMessage = err.message || defaultMessage;
//     setError(errorMessage);
//     console.error("Erreur livres:", err);
//     throw new Error(errorMessage);
//   };

//   // Récupérer tous les livres publiés
//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch("https://vakio-boky-backend.onrender.com/api/books", {
//         method: "GET",
//         headers: getAuthHeaders(),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setBooks(Array.isArray(data) ? data : []);
//       return data;
//     } catch (err) {
//       handleError(err, "Erreur lors du chargement des livres");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer mes livres
//   const fetchMyBooks = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch(
//         "https://vakio-boky-backend.onrender.com/api/books/mes-livres",
//         {
//           method: "GET",
//           headers: getAuthHeaders(),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       const booksData = data.books || data || [];
//       setMyBooks(Array.isArray(booksData) ? booksData : []);
//       return booksData;
//     } catch (err) {
//       handleError(err, "Erreur lors du chargement de vos livres");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Récupérer un livre spécifique
//   const fetchBook = async (id) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/books/${id}`, {
//         method: "GET",
//         headers: getAuthHeaders(),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data.book || data;
//     } catch (err) {
//       handleError(err, "Erreur lors du chargement du livre");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Créer un livre
//   const createBook = async (bookData) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch("https://vakio-boky-backend.onrender.com/api/books", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(bookData),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       showSuccess(data.message || "Livre créé avec succès");
//       await fetchMyBooks();
//       return data;
//     } catch (err) {
//       handleError(err, "Erreur lors de la création du livre");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Modifier un livre
//   const updateBook = async (id, bookData) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/books/${id}`, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(bookData),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       showSuccess(data.message || "Livre modifié avec succès");
//       await Promise.all([fetchBooks(), fetchMyBooks()]);
//       return data;
//     } catch (err) {
//       handleError(err, "Erreur lors de la modification du livre");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Supprimer un livre
//   const deleteBook = async (id) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch(`https://vakio-boky-backend.onrender.com/api/books/${id}`, {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       showSuccess(data.message || "Livre supprimé avec succès");
//       await Promise.all([fetchBooks(), fetchMyBooks()]);
//       return data;
//     } catch (err) {
//       handleError(err, "Erreur lors de la suppression du livre");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearError = () => setError("");
//   const clearSuccess = () => setSuccess("");

//   // Réinitialiser les états
//   const reset = () => {
//     setBooks([]);
//     setMyBooks([]);
//     setError("");
//     setSuccess("");
//     setLoading(false);
//   };

//   return {
//     // State
//     books,
//     myBooks,
//     loading,
//     error,
//     success,

//     // Actions
//     fetchBooks,
//     fetchMyBooks,
//     fetchBook,
//     createBook,
//     updateBook,
//     deleteBook,
//     clearError,
//     clearSuccess,
//     reset,

//     // Setters
//     setBooks,
//     setMyBooks,
//   };
// };
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL = "https://vakio-boky-backend.onrender.com/api";

// Fonction pour générer des images SVG sécurisées pour les livres
const generateBookCoverSvg = (title, width = 400, height = 600) => {
  const text = title || 'Livre';
  const encodedText = encodeURIComponent(text.substring(0, 20));
  const colors = ['4A5568', '2D3748', '4C51BF', '2B6CB0', '2F855A'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${randomColor}'/%3E%3Crect x='20' y='20' width='${width-40}' height='${height-40}' fill='%231A202C' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial,sans-serif' font-size='28' fill='white' text-anchor='middle' dy='.3em'%3E${encodedText}%3C/text%3E%3C/svg%3E`;
};

// Fonction pour valider et sécuriser les URLs d'images
const ensureSafeImageUrl = (url, title, type = 'book') => {
  if (!url) {
    return generateBookCoverSvg(title);
  }
  
  // Si c'est déjà une URL valide (http, https, ou data:image)
  if (url.startsWith('http') || url.startsWith('data:image')) {
    return url;
  }
  
  // Si c'est un chemin relatif, le rendre absolu
  if (url.startsWith('/uploads/') || url.startsWith('/assets/')) {
    return `${API_BASE_URL.replace('/api', '')}${url}`;
  }
  
  // Sinon, générer une image SVG
  return generateBookCoverSvg(title);
};

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

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const safeBooks = Array.isArray(data) 
        ? data.map(book => ({
            ...book,
            couverture_url: ensureSafeImageUrl(book.couverture_url, book.titre)
          }))
        : [];
      
      setBooks(safeBooks);
      return safeBooks;
    } catch (err) {
      handleError(err, "Erreur lors du chargement des livres");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/books/mes-livres`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const booksData = data.books || data || [];
      
      const safeBooks = Array.isArray(booksData)
        ? booksData.map(book => ({
            ...book,
            couverture_url: ensureSafeImageUrl(book.couverture_url, book.titre)
          }))
        : [];
      
      setMyBooks(safeBooks);
      return safeBooks;
    } catch (err) {
      handleError(err, "Erreur lors du chargement de vos livres");
    } finally {
      setLoading(false);
    }
  };

  const fetchBook = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const book = data.book || data;
      
      if (book) {
        book.couverture_url = ensureSafeImageUrl(book.couverture_url, book.titre);
      }
      
      return book;
    } catch (err) {
      handleError(err, "Erreur lors du chargement du livre");
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData) => {
    try {
      setLoading(true);
      setError("");
      
      const safeBookData = {
        ...bookData,
        couverture_url: ensureSafeImageUrl(bookData.couverture_url, bookData.titre)
      };
      
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(safeBookData),
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

  const updateBook = async (id, bookData) => {
    try {
      setLoading(true);
      setError("");
      
      const safeBookData = {
        ...bookData,
        couverture_url: ensureSafeImageUrl(bookData.couverture_url, bookData.titre)
      };
      
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(safeBookData),
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

  const deleteBook = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
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

  const reset = () => {
    setBooks([]);
    setMyBooks([]);
    setError("");
    setSuccess("");
    setLoading(false);
  };

  return {
    books,
    myBooks,
    loading,
    error,
    success,
    fetchBooks,
    fetchMyBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    clearError,
    clearSuccess,
    reset,
    setBooks,
    setMyBooks,
  };
};