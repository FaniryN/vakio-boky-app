import { useState } from "react";

export default function BookModal({ livre, isOpen, onClose }) {
  if (!isOpen || !livre) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-lg">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          &times;
        </button>

        {/* Contenu du livre */}
        <img
          src={livre.couverture_url}
          alt={livre.titre}
          className="w-full h-60 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{livre.titre}</h2>
        <p className="text-gray-600 mb-2 line-clamp-4">
          {livre.description || "Aucune description disponible."}
        </p>
        <p className="text-sm text-gray-500 mb-1">Genre: {livre.genre}</p>
        {livre.isbn && <p className="text-sm text-gray-500 mb-2">ISBN: {livre.isbn}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
          <button
            onClick={() => window.location.href = "/login"}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}
