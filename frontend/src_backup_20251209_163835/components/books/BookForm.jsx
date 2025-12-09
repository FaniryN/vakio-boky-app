import React, { useState, useEffect } from "react";
import { useMedias } from "@/hooks/useMedias";

const BookForm = ({ book, onSubmit, onCancel }) => {
  const { uploadMedias, uploading } = useMedias();

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    couverture_url: "",
    genre: "",
    isbn: "",
    statut: "brouillon",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData(book);
      if (book.couverture_url) {
        setPreviewUrl(book.couverture_url);
      }
    }
  }, [book]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, couverture_url: "" }));
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    try {
      const result = await uploadMedias([selectedFile]);

      if (result.success && result.medias && result.medias.length > 0) {
        return result.medias[0].url;
      } else {
        console.error("Erreur upload:", result.error);
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalFormData = { ...formData };

    if (selectedFile) {
      const uploadedImageUrl = await uploadImage();
      if (uploadedImageUrl) {
        finalFormData.couverture_url = uploadedImageUrl;
      } else {
        alert("Erreur lors de l'upload de l'image");
        return;
      }
    }

    onSubmit(finalFormData);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, couverture_url: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {book ? "Modifier le livre" : "Nouveau livre"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Couverture du livre
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Aperçu de la couverture"
                  className="max-h-40 max-w-full object-contain mb-2 rounded"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Supprimer l'image
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Cliquez pour sélectionner une image
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés: JPEG, PNG, WebP (max 5MB)
                </p>
              </div>
            )}
          </div>

          {isUploading && (
            <p className="text-sm text-blue-600 mt-2">Upload en cours...</p>
          )}
        </div>

        {/* Champ URL de couverture (optionneIIe) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OU URL de la couverture
          </label>
          <input
            type="url"
            name="couverture_url"
            value={formData.couverture_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!selectedFile}
          />
          <p className="text-xs text-gray-500 mt-1">
            Utilisez ce champ si vous avez déjà une URL d'image
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="brouillon">Brouillon</option>
            <option value="publié">Publié</option>
            <option value="archivé">Archivé</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isUploading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isUploading || uploading}
        >
          {isUploading ? "Upload..." : book ? "Modifier" : "Créer"}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
