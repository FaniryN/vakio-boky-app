import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiShare2,
  FiFacebook,
  FiTwitter,
  FiLink,
  FiMessageCircle,
} from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function ShareModal({ post, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const shareUrl = `${window.location.origin}/post/${post.id}`;
  const shareText = `Découvrez ce post de ${
    post.auteur_nom
  } sur Vakio Boky: "${post.contenu.substring(0, 100)}..."`;

  const shareOptions = [
    {
      name: "Facebook",
      icon: <FiFacebook className="text-blue-600" />,
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      name: "Twitter",
      icon: <FiTwitter className="text-blue-400" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      name: "WhatsApp",
      icon: <FiMessageCircle className="text-green-500" />,
      url: `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`,
      color: "bg-green-50 hover:bg-green-100",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Vakio Boky",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Partager ce post</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Options */}
            <div className="p-6">
              {navigator.share && (
                <div className="mb-6">
                  <Button
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-2 py-3"
                    variant="primary"
                  >
                    <FiShare2 />
                    Partager via...
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Partagez avec vos applications
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-6">
                {shareOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${option.color} border rounded-lg p-4 flex flex-col items-center gap-2 transition-colors`}
                  >
                    <div className="text-2xl">{option.icon}</div>
                    <span className="text-sm font-medium">{option.name}</span>
                  </a>
                ))}
              </div>

              <div className="border rounded-lg p-3 bg-gray-50">
                <p className="text-sm font-medium mb-2">Lien de partage</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded text-sm bg-white"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant={copied ? "success" : "outline"}
                    size="sm"
                  >
                    <FiLink className="mr-1" />
                    {copied ? "Copié!" : "Copier"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
