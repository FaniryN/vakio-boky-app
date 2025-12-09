// import React, { useState, useEffect } from "react";
// import { useBooks } from "../../hooks/useBooks.jsx";

// import BookCard from "./BookCard.jsx";
// import BookForm from "./BookForm.jsx";

// const BookList = () => {
//   const {
//     books,
//     myBooks,
//     loading,
//     error,
//     fetchBooks,
//     fetchMyBooks,
//     createBook,
//     updateBook,
//     deleteBook,
//     clearError,
//   } = useBooks();

//   const [showForm, setShowForm] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);
//   const [activeTab, setActiveTab] = useState("public");

//   useEffect(() => {
//     loadBooks();
//   }, [activeTab]);

//   const loadBooks = async () => {
//     try {
//       if (activeTab === "public") {
//         await fetchBooks();
//       } else {
//         await fetchMyBooks();
//       }
//     } catch (err) {
//       // Ignore errors
//     }
//   };

//   const handleCreateBook = async (bookData) => {
//     try {
//       await createBook(bookData);
//       setShowForm(false);
//       loadBooks();
//     } catch (err) {
//       // Ignore errors
//     }
//   };

//   const handleUpdateBook = async (bookData) => {
//     try {
//       await updateBook(editingBook.id, bookData);
//       setEditingBook(null);
//       loadBooks();
//     } catch (err) {
//       // Ignore errors
//     }
//   };

//   const handleDeleteBook = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
//       try {
//         await deleteBook(id);
//         loadBooks();
//       } catch (err) {
//         // Ignore errors
//       }
//     }
//   };

//   const handleEdit = (book) => {
//     setEditingBook(book);
//   };

//   const currentBooks = activeTab === "public" ? books : myBooks;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Gestion des Livres</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//         >
//           Nouveau Livre
//         </button>
//       </div>

//       {/* Navigation par onglets */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`px-4 py-2 font-medium ${
//             activeTab === "public"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("public")}
//         >
//           Livres Publiés
//         </button>
//         <button
//           className={`px-4 py-2 font-medium ${
//             activeTab === "mes-livres"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("mes-livres")}
//         >
//           Mes Livres
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{error}</span>
//           <button
//             onClick={clearError}
//             className="text-red-700 hover:text-red-900"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {(showForm || editingBook) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <BookForm
//               book={editingBook}
//               onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
//               onCancel={() => {
//                 setShowForm(false);
//                 setEditingBook(null);
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg">Chargement...</div>
//         </div>
//       ) : currentBooks.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">
//             {activeTab === "public"
//               ? "Aucun livre publié trouvé"
//               : "Vous n'avez pas encore créé de livres"}
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentBooks.map((book) => (
//             <BookCard
//               key={book.id}
//               book={book}
//               onEdit={handleEdit}
//               onDelete={handleDeleteBook}
//               showActions={activeTab === "mes-livres"}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookList;
import React, { useState, useEffect } from "react";
import { useBooks } from "../../hooks/useBooks.jsx";
import BookCard from "./BookCard.jsx";
import BookForm from "./BookForm.jsx";
import { FiBook, FiPlus, FiFilter, FiSearch, FiRefreshCw } from "react-icons/fi";

const BookList = () => {
  const {
    books,
    myBooks,
    loading,
    error,
    success,
    fetchBooks,
    fetchMyBooks,
    createBook,
    updateBook,
    deleteBook,
    clearError,
    clearSuccess,
  } = useBooks();

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [activeTab, setActiveTab] = useState("public");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadBooks();
  }, [activeTab]);

  const loadBooks = async () => {
    try {
      if (activeTab === "public") {
        await fetchBooks();
      } else {
        await fetchMyBooks();
      }
    } catch (err) {
      console.error("Erreur chargement livres:", err);
    }
  };

  const handleCreateBook = async (bookData) => {
    try {
      await createBook(bookData);
      setShowForm(false);
      loadBooks();
    } catch (err) {
      console.error("Erreur création livre:", err);
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      await updateBook(editingBook.id, bookData);
      setEditingBook(null);
      loadBooks();
    } catch (err) {
      console.error("Erreur modification livre:", err);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      try {
        await deleteBook(id);
        loadBooks();
      } catch (err) {
        console.error("Erreur suppression livre:", err);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  // Filtrer les livres
  const currentBooks = activeTab === "public" ? books : myBooks;
  
  const filteredBooks = currentBooks.filter(book => {
    const matchesSearch = 
      book.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.auteur_nom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || 
      book.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistiques
  const stats = {
    total: currentBooks.length,
    published: currentBooks.filter(b => b.statut === 'publié').length,
    draft: currentBooks.filter(b => b.statut === 'brouillon').length,
    archived: currentBooks.filter(b => b.statut === 'archivé').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête avec succès/erreur */}
      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={clearSuccess} className="text-green-700 hover:text-green-900">
              ×
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-700 hover:text-red-900">
              ×
            </button>
          </div>
        </div>
      )}

      {/* En-tête principal */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiBook className="text-blue-600" />
              Gestion des Livres
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === "public" 
                ? "Découvrez les livres publiés par nos auteurs" 
                : "Gérez votre bibliothèque personnelle"}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={loadBooks}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>
            
            {activeTab === "mes-livres" && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FiPlus />
                Nouveau Livre
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {activeTab === "mes-livres" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Publiés</p>
            <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-yellow-600">Brouillons</p>
            <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Archivés</p>
            <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
          </div>
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "public"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("public")}
            >
              <FiBook className="w-4 h-4" />
              Livres Publiés
              <span className="ml-1 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                {books.length}
              </span>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "mes-livres"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("mes-livres")}
            >
              <FiBook className="w-4 h-4" />
              Mes Livres
              <span className="ml-1 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                {myBooks.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Filtres et recherche */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un livre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            
            {activeTab === "mes-livres" && (
              <div className="flex gap-2">
                <FiFilter className="text-gray-400 mt-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="publié">Publié</option>
                  <option value="brouillon">Brouillon</option>
                  <option value="archivé">Archivé</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            {filteredBooks.length} livre(s) trouvé(s) sur {currentBooks.length}
          </div>
        </div>
      </div>

      {/* Formulaire de création/modification */}
      {(showForm || editingBook) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <BookForm
              book={editingBook}
              onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
              onCancel={() => {
                setShowForm(false);
                setEditingBook(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Liste des livres */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Chargement des livres...</div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiBook className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Aucun livre ne correspond à votre recherche"
              : activeTab === "public"
              ? "Aucun livre publié trouvé"
              : "Vous n'avez pas encore créé de livres"}
          </p>
          {activeTab === "mes-livres" && !searchTerm && statusFilter === "all" && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Créer votre premier livre
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEdit}
              onDelete={handleDeleteBook}
              showActions={activeTab === "mes-livres"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;