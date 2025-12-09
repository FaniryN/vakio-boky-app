import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Récupération des clubs
  const fetchClubs = async () => {
    setLoading(true);
    setError(null);

    if (!user?.token) {
      navigate("/login", {
        state: { from: location.pathname, message: "Veuillez vous connecter." },
        replace: true,
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/clubs", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        navigate("/login", {
          state: { from: location.pathname, message: "Session expirée." },
          replace: true,
        });
        return;
      }

      const data = await res.json();
      if (data.success) setClubs(data.clubs);
      else setError(data.message || "Erreur lors du chargement des clubs");
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Filtrer les clubs
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || club.categorie === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Catégories uniques pour le filtre
  const categories = [
    ...new Set(clubs.map((club) => club.categorie).filter(Boolean)),
  ];

  const handleDelete = async (clubId) => {
    if (
      !confirm(
        "Voulez-vous vraiment supprimer ce club ? Cette action est irréversible."
      )
    )
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${clubId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchClubs();
        alert("Club supprimé avec succès");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/clubs/${clubId}/join`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();

      if (data.success) {
        alert("Vous avez rejoint le club !");
        fetchClubs();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'adhésion");
    }
  };

  const handleLeaveClub = async (clubId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/clubs/${clubId}/leave`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();

      if (data.success) {
        alert("Vous avez quitté le club");
        fetchClubs();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la désinscription");
    }
  };

  // Vérifier si l'utilisateur est membre d'un club
  const isUserMember = (club) => {
    return club.membres_count > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-800 text-lg"
        >
          Chargement des clubs...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header avec recherche et filtres */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-3xl md:text-5xl font-bold text-blue-900 mb-4"
          >
            Communauté des Clubs Littéraires
          </motion.h1>
          <p className="text-blue-600 text-lg mb-8 max-w-2xl mx-auto">
            Découvrez, rejoignez et animez des clubs de lecture passionnants.
            Partagez vos découvertes, organisez des événements et rencontrez
            d'autres passionnés.
          </p>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Rechercher un club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-48 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/create")}
              className="whitespace-nowrap"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Créer un club
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {clubs.length}
            </div>
            <div className="text-gray-600">Clubs actifs</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {clubs.reduce((total, club) => total + club.membres_count, 0)}
            </div>
            <div className="text-gray-600">Membres total</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {clubs.filter((club) => club.createur_id === user.id).length}
            </div>
            <div className="text-gray-600">Mes clubs</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {clubs.filter((club) => club.membres_count > 0).length}
            </div>
            <div className="text-gray-600">Clubs rejoints</div>
          </div>
        </motion.div>

        {/* Liste des clubs */}
        <AnimatePresence>
          {filteredClubs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-200 p-12 text-center"
            >
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun club trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {clubs.length === 0
                  ? "Soyez le premier à créer un club littéraire !"
                  : "Aucun club ne correspond à votre recherche."}
              </p>
              <Button onClick={() => navigate("/create")}>
                Créer le premier club
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col group"
                >
                  {/* Badge Admin */}
                  {club.createur_id === user.id && (
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                      Admin
                    </div>
                  )}

                  {/* Image du club */}
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={
                        club.image_url
                          ? `http://localhost:5000${club.image_url}`
                          : "/placeholder-club.jpg"
                      }
                      alt={club.nom}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder-club.jpg";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-3 py-1 rounded-bl-lg text-sm">
                      {club.visibilite}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {club.nom}
                      </h3>

                      {/* Menu admin */}
                      {(club.createur_id === user.id || isUserMember(club)) && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenuOpen({
                                ...menuOpen,
                                [club.id]: !menuOpen[club.id],
                              })
                            }
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>

                          <AnimatePresence>
                            {menuOpen[club.id] && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute right-0 top-10 bg-white shadow-xl rounded-lg p-2 min-w-48 z-20 border border-gray-200"
                              >
                                {/* Menu pour admin */}
                                {club.createur_id === user.id && (
                                  <>
                                    <Link
                                      to={`/clubs/${club.id}/edit`}
                                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md text-gray-700"
                                      onClick={() => setMenuOpen({})}
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                      Modifier le club
                                    </Link>
                                    <Link
                                      to={`/clubs/${club.id}/events`}
                                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md text-gray-700"
                                      onClick={() => setMenuOpen({})}
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                      </svg>
                                      Gérer les événements
                                    </Link>
                                    <Link
                                      to={`/clubs/${club.id}/members`}
                                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md text-gray-700"
                                      onClick={() => setMenuOpen({})}
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                        />
                                      </svg>
                                      Gérer les membres
                                    </Link>
                                    <hr className="my-1" />
                                    <button
                                      onClick={() => {
                                        handleDelete(club.id);
                                        setMenuOpen({});
                                      }}
                                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-red-50 rounded-md text-red-600"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
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
                                      Supprimer le club
                                    </button>
                                  </>
                                )}

                                {/* Menu pour membres */}
                                {isUserMember(club) &&
                                  club.createur_id !== user.id && (
                                    <button
                                      onClick={() => {
                                        handleLeaveClub(club.id);
                                        setMenuOpen({});
                                      }}
                                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-red-50 rounded-md text-red-600"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                      </svg>
                                      Quitter le club
                                    </button>
                                  )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {club.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {club.categorie && (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          {club.categorie}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {club.ville && club.pays
                          ? `${club.ville}, ${club.pays}`
                          : "En ligne"}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                        {club.membres_count} membre
                        {club.membres_count !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Créé par {club.createur_nom || "Inconnu"}</span>
                      <span>
                        {new Date(club.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0">
                    <div className="flex gap-3">
                      {isUserMember(club) ? (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate(`/clubs/${club.id}`)}
                            className="flex-1"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Accéder
                          </Button>
                          <Link
                            to={`/clubs/${club.id}/events`}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </Link>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleJoinClub(club.id)}
                          className="flex-1"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Rejoindre
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
