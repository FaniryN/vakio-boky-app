import { useState } from "react";
import { FiX, FiFlag, FiUser, FiMessageSquare } from "react-icons/fi";

export default function ReportModal({
  contentId,
  contentType,
  reportedUserId,
  reportedUserName,
  onClose
}) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = {
    post: ['Contenu inapproprié', 'Harcèlement', 'Spam', 'Autre'],
    comment: ['Commentaire inapproprié', 'Harcèlement', 'Spam', 'Autre'],
    user: ['Compte faux', 'Harcèlement', 'Contenu inapproprié', 'Autre']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch('https://vakio-boky-backend.onrender.com/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content_id: contentId,
          content_type: contentType,
          reason: reason,
          description: description,
          reported_user_id: reportedUserId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Signalement envoyé !');
        onClose();
      } else {
        alert(data.error || 'Erreur');
      }
    } catch (err) {
      alert('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <FiFlag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Signaler</h2>
                <p className="text-sm text-gray-600">Aidez-nous à modérer</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block font-medium mb-3">Raison *</label>
            <div className="space-y-2">
              {reasons[contentType]?.map((option) => (
                <label key={option} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="reason"
                    value={option}
                    checked={reason === option}
                    onChange={(e) => setReason(e.target.value)}
                    className="mr-3 text-red-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails..."
              rows={3}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}