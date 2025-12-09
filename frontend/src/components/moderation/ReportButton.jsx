import { useState } from "react";
import { FiFlag } from "react-icons/fi";
import ReportModal from "./ReportModal";

export default function ReportButton({ 
  contentId, 
  contentType, 
  reportedUserId,
  reportedUserName,
  contentPreview = "",
  className = "",
  variant = "icon"
}) {
  const [showModal, setShowModal] = useState(false);

  const handleReport = () => {
    const token = localStorage.getItem('vakio_token');
    if (!token) {
      alert('Veuillez vous connecter pour signaler');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleReport}
        className={`${
          variant === 'icon' 
            ? 'p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg'
            : 'flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg'
        } ${className}`}
        title="Signaler ce contenu"
      >
        <FiFlag className="w-4 h-4" />
        {variant !== 'icon' && <span>Signaler</span>}
      </button>

      {showModal && (
        <ReportModal
          contentId={contentId}
          contentType={contentType}
          reportedUserId={reportedUserId}
          reportedUserName={reportedUserName}
          contentPreview={contentPreview}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}