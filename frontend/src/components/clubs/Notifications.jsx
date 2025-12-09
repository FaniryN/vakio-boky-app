import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("https://vakio-boky-backend.onrender.com/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.lue).length);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(
        `https://vakio-boky-backend.onrender.com/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch(
        "https://vakio-boky-backend.onrender.com/api/notifications/read-all",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const res = await fetch(
        `https://vakio-boky-backend.onrender.com/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "event":
        return "📅";
      case "post":
        return "📝";
      case "member":
        return "👥";
      default:
        return "💡";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                Notifications
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} non lue(s)` : "Toutes lues"}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-md p-8 text-center"
              >
                <p className="text-gray-500 text-lg">Aucune notification</p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-md p-4 border-l-4 ${
                    notification.lue
                      ? "border-gray-300"
                      : "border-blue-500 bg-blue-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-xl mt-1">
                        {getNotificationIcon(notification.type)}
                      </span>

                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            notification.lue ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          {notification.titre}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleString(
                            "fr-FR"
                          )}
                        </p>

                        {notification.lien && (
                          <Link
                            to={notification.lien}
                            onClick={() => markAsRead(notification.id)}
                            className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Voir les détails →
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.lue && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Marquer comme lu"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Supprimer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
