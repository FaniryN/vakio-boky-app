// import React from 'react';

// const BookCard = ({ book, onEdit, onDelete, showActions = false }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       {book.couverture_url && (
//         <img 
//           src={book.couverture_url} 
//           alt={book.titre}
//           className="w-full h-48 object-cover rounded-md mb-4"
//         />
//       )}
      
//       <h3 className="text-xl font-bold text-gray-800 mb-2">{book.titre}</h3>
//       <p className="text-gray-600 mb-2">Auteur: {book.auteur_nom}</p>
//       <p className="text-gray-500 text-sm mb-3">Genre: {book.genre}</p>
      
//       {book.description && (
//         <p className="text-gray-700 mb-4 line-clamp-3">{book.description}</p>
//       )}
      
//       <div className="flex justify-between items-center">
//         <span className={`px-2 py-1 rounded-full text-xs ${
//           book.statut === 'publié' ? 'bg-green-100 text-green-800' :
//           book.statut === 'brouillon' ? 'bg-yellow-100 text-yellow-800' :
//           'bg-gray-100 text-gray-800'
//         }`}>
//           {book.statut}
//         </span>
        
//         {showActions && (
//           <div className="space-x-2">
//             <button 
//               onClick={() => onEdit(book)}
//               className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//             >
//               Modifier
//             </button>
//             <button 
//               onClick={() => onDelete(book.id)}
//               className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//             >
//               Supprimer
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookCard;
import React from 'react';
import SafeImage from '@/components/ui/SafeImage';

const BookCard = ({ book, onEdit, onDelete, showActions = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <SafeImage
        src={book.couverture_url}
        alt={book.titre}
        fallbackType="book"
        fallbackText={book.titre}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{book.titre}</h3>
      <p className="text-gray-600 mb-2">Auteur: {book.auteur_nom}</p>
      <p className="text-gray-500 text-sm mb-3">Genre: {book.genre}</p>
      
      {book.description && (
        <p className="text-gray-700 mb-4 line-clamp-3">{book.description}</p>
      )}
      
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs ${
          book.statut === 'publié' ? 'bg-green-100 text-green-800' :
          book.statut === 'brouillon' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {book.statut}
        </span>
        
        {showActions && (
          <div className="space-x-2">
            <button 
              onClick={() => onEdit(book)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Modifier
            </button>
            <button 
              onClick={() => onDelete(book.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;