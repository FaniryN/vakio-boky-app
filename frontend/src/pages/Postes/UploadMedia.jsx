import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiX, FiImage, FiVideo, FiFile } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useMedias } from "@/hooks/useMedias";

export default function UploadMedia({
  onMediasUploaded,
  maxFiles = 1, // Changé à 1 pour les posts
  accept = "image/*,video/*,application/pdf,.doc,.docx,.txt",
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const { uploadMedias, uploading, error } = useMedias();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichier autorisé`);
      return;
    }

    // Réinitialiser les fichiers précédents
    setSelectedFiles([]);
    setPreviewUrls([]);

    const newFiles = files.map((file) => {
      let type = "document";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      
      return {
        file,
        id: Math.random(),
        type: type,
      };
    });

    setSelectedFiles(newFiles);

    // Créer les previews
    newFiles.forEach((newFile) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls((prev) => [
          ...prev,
          {
            id: newFile.id,
            url: e.target.result,
            type: newFile.type,
          },
        ]);
      };
      reader.readAsDataURL(newFile.file);
    });
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setPreviewUrls((prev) => prev.filter((p) => p.id !== fileId));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    const files = selectedFiles.map((f) => f.file);
    console.log("📤 UploadMedia: Début upload", files);

    const result = await uploadMedias(files);
    console.log("📡 UploadMedia: Résultat upload", result);

    if (result.success) {
      console.log("✅ Upload réussi, médias:", result.medias);
      
      // Formater les médias pour les posts
      const formattedMedias = result.medias.map(media => ({
        url: media.url || media.filePath,
        type: media.fileType || selectedFiles[0].type
      }));
      
      onMediasUploaded(formattedMedias);
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      alert(`Erreur upload: ${result.error}`);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <FiImage className="text-blue-500" size={20} />;
      case "video":
        return <FiVideo className="text-purple-500" size={20} />;
      case "document":
        return <FiFile className="text-green-500" size={20} />;
      default:
        return <FiFile className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-gray-600 mb-2">
          Glissez-déposez votre fichier ici ou cliquez pour sélectionner
        </p>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Choisir un fichier
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Formats: Images (JPG, PNG), Vidéos (MP4), Documents (PDF, Word, TXT)
          <br />
          Max: {maxFiles} fichier • 50MB par fichier
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">
            Fichier sélectionné
          </h4>

          {selectedFiles.map((fileInfo) => {
            const preview = previewUrls.find((p) => p.id === fileInfo.id);

            return (
              <div
                key={fileInfo.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  {preview && fileInfo.type === "image" ? (
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                      {getFileIcon(fileInfo.type)}
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-sm truncate max-w-xs">
                      {fileInfo.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {fileInfo.type}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(fileInfo.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FiX size={18} />
                </button>
              </div>
            );
          })}

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2"
            variant="primary"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Upload en cours...
              </>
            ) : (
              <>
                <FiUpload size={16} />
                Upload le fichier
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}