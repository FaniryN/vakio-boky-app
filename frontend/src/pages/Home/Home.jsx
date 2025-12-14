import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/home/Contact";
import BookModal from "@/components/books/BookModal";
import EventModal from "@/pages/Events/EventModal";
import { motion } from "framer-motion";
import {
  FiBook,
  FiUsers,
  FiCalendar,
  FiShoppingBag,
  FiHeart,
  FiAward,
  FiMapPin,
  FiCheckCircle,
  FiMessageCircle,
  FiStar,
  FiArrowRight,
  FiLoader,
  FiUser,
  FiPenTool,
} from "react-icons/fi";

const API_BASE_URL = "https://vakio-boky-backend.onrender.com/api";

export default function Home() {
  const navigate = useNavigate();
  const [landingData, setLandingData] = useState({
    testimonials: [],
    events: [],
    authors: [],
    stats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [livres, setLivres] = useState([]);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Fonction pour gérer les URLs d'images avec fallback LOCAL
  // const getImageUrl = (url, fallbackType = "book") => {
  //   if (!url || url.includes("via.placeholder.com") || url.includes("placeholder.com")) {
  //     // Retourner des images locales selon le type (format PNG)
  //     switch(fallbackType) {
  //       case "book":
  //         return "/assets/images/books/book-default.png";
  //       case "author":
  //         return "/assets/images/authors/author-default.png";
  //       case "event":
  //         return "/assets/images/events/event-default.png";
  //       case "profile":
  //         return "/assets/images/profiles/profile-default.png";
  //       default:
  //         return "/assets/images/default-image.png";
  //     }
  //   }

  //   // Si c'est une URL absolue du backend
  //   if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
  //     return url;
  //   }

  //   // Si c'est une URL relative
  //   if (url.startsWith('/uploads/')) {
  //     return url;
  //   }

  //   return url;
  // };
  // const getImageUrl = (url, fallbackType = "book") => {
  //   // Si pas d'URL ou placeholder, retourner image par défaut
  //   if (!url || url.includes("via.placeholder.com") || url.includes("placeholder.com")) {
  //     // Retourner des images locales selon le type (format PNG)
  //     switch(fallbackType) {
  //       case "book":
  //         return "/assets/images/books/book-default.png";
  //       case "author":
  //         return "/assets/images/authors/author-default.png";
  //       case "event":
  //         return "/assets/images/events/event-default.png";
  //       case "profile":
  //         return "/assets/images/profiles/profile-default.png";
  //       default:
  //         return "/assets/images/default-image.png";
  //     }
  //   }

  //   // CORRECTION SPÉCIFIQUE POUR LE BUG DU BACKEND
  //   // Si l'URL contient le double chemin "/uploads/profiles//uploads/profiles/"
  //   if (url.includes("//uploads/profiles/")) {
  //     // Extraire juste le nom de fichier
  //     const filename = url.split('/').pop(); // "profile-1-1765403913262-560889623.png"
  //     // Retourner le chemin correct
  //     return `/uploads/profiles/${filename}`;
  //   }

  //   // Si c'est une URL absolue du backend
  //   if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
  //     return url;
  //   }

  //   // Si c'est une URL relative normale
  //   if (url.startsWith('/uploads/')) {
  //     return url;
  //   }

  //   return url;
  // };
  const getImageUrl = (url, fallbackType = "book") => {
    // Si pas d'URL ou placeholder, retourner image par défaut
    if (
      !url ||
      url.includes("via.placeholder.com") ||
      url.includes("placeholder.com")
    ) {
      // Retourner des images locales selon le type (format PNG)
      switch (fallbackType) {
        case "book":
          return "/assets/images/books/book-default.png";
        case "author":
          return "/assets/images/authors/author-default.png";
        case "event":
          return "/assets/images/events/event-default.png";
        case "profile":
          return "/assets/images/profiles/profile-default.png";
        default:
          return "/assets/images/default-image.png";
      }
    }

    // CORRECTION COMPLÈTE : Toujours renvoyer l'URL complète vers le backend
    const backendUrl = "https://vakio-boky-backend.onrender.com";

    // 1. Si l'URL est déjà complète (commence par http), la retourner telle quelle
    if (url.startsWith("http")) {
      return url;
    }

    // 2. Si c'est un chemin relatif, ajouter l'URL du backend
    if (url.startsWith("/uploads/")) {
      return `${backendUrl}${url}`;
    }

    // 3. Si l'URL contient le double chemin "/uploads/profiles//uploads/profiles/"
    if (url.includes("//uploads/profiles/")) {
      // Extraire juste le nom de fichier
      const filename = url.split("/").pop(); // "profile-1-1765403913262-560889623.png"
      // Retourner le chemin complet vers le backend
      return `${backendUrl}/uploads/profiles/${filename}`;
    }

    // 4. Sinon, retourner l'URL telle quelle
    return url;
  };
  // 1. Récupération des livres récents DYNAMIQUES depuis la base de données
  useEffect(() => {
    const fetchLivres = async () => {
      try {
        console.log("🔄 Récupération des livres dynamiques depuis l'API...");

        const response = await fetch(`${API_BASE_URL}/books/recent`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📦 Réponse API dynamique:", data);

        // Gérer les livres reçus
        if (data.success && data.books) {
          // Nettoyer les URLs d'images
          const cleanedBooks = data.books.map((book) => ({
            id: book.id,
            titre: book.title || book.titre,
            description: book.description,
            couverture_url: getImageUrl(
              book.cover || book.couverture_url,
              "book"
            ),
            genre: book.category || book.genre,
            auteur: book.author || book.auteur_nom,
            prix: book.price || 0,
            note: book.rating || 0,
            pages: book.pages || 0,
            annee_publication: book.published_year,
            langue: book.language,
            editeur: book.publisher,
            statut: book.status || "publié",
            created_at: book.created_at,
          }));

          console.log(
            `✅ ${cleanedBooks.length} livres dynamiques chargés depuis la base de données`
          );
          console.log("📊 Détails des livres:", cleanedBooks);
          setLivres(cleanedBooks);
        } else {
          console.warn("Format de données inattendu:", data);

          // Si pas de livres dans la base, afficher un message
          if (data.books && data.books.length === 0) {
            console.log("ℹ️ Aucun livre publié dans la base de données");
            setLivres([]);
          } else {
            // Essayer de récupérer tous les livres publiés
            try {
              console.log(
                "🔄 Tentative de récupération de tous les livres publiés..."
              );
              const allBooksResponse = await fetch(`${API_BASE_URL}/books/`);
              if (allBooksResponse.ok) {
                const allBooksData = await allBooksResponse.json();

                if (Array.isArray(allBooksData)) {
                  const publishedBooks = allBooksData
                    .filter((book) => book.statut === "publié")
                    .slice(0, 6)
                    .map((book) => ({
                      id: book.id,
                      titre: book.titre,
                      description: book.description,
                      couverture_url: getImageUrl(book.couverture_url, "book"),
                      genre: book.genre,
                      auteur: book.auteur_nom,
                      statut: book.statut,
                    }));

                  setLivres(publishedBooks);
                  console.log(
                    `✅ ${publishedBooks.length} livres publiés chargés`
                  );
                }
              }
            } catch (fallbackError) {
              console.error("❌ Fallback échoué:", fallbackError);
              setLivres([]);
            }
          }
        }
      } catch (err) {
        console.error("❌ Erreur récupération livres dynamiques:", err);

        // Ne plus utiliser les données mock - afficher un état vide
        setLivres([]);

        // Optionnel: Afficher un message d'erreur à l'utilisateur
        setError(
          "Impossible de charger les livres pour le moment. Veuillez réessayer plus tard."
        );
      }
    };

    fetchLivres();
  }, []);

  // 2. Récupération des données de la page d'accueil
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🌐 Appel API landing data...");

        const response = await fetch(`${API_BASE_URL}/landing/data`);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();

        console.log("✅ Données landing reçues:", {
          testimonials: result.data?.testimonials?.length || 0,
          events: result.data?.events?.length || 0,
          authors: result.data?.authors?.length || 0,
          hasStats: !!result.data?.stats,
        });

        if (result.success) {
          // Nettoyer les URLs d'images dans les données
          const cleanedData = {
            testimonials: result.data.testimonials || [],
            events: (result.data.events || []).map((event) => ({
              ...event,
              image_url: getImageUrl(event.image_url, "event"),
            })),
            authors: (result.data.authors || []).map((author) => ({
              ...author,
              image: getImageUrl(author.image, "author"),
            })),
            stats: result.data.stats || null,
          };

          setLandingData(cleanedData);
        } else {
          throw new Error(result.message || "Erreur inconnue du serveur");
        }
      } catch (error) {
        console.error("❌ Erreur chargement données landing:", error);
        setError(error.message);
        // Données de fallback
        setLandingData({
          testimonials: [],
          events: [],
          authors: [],
          stats: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const openModal = (livre) => {
    setSelectedLivre(livre);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLivre(null);
    setIsModalOpen(false);
  };

  const openEventModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setSelectedEventId(null);
    setIsEventModalOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handlePropos = () => {
    navigate("/propos");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const features = [
    {
      icon: <FiBook className="text-3xl mb-4" />,
      title: "Bibliothèque Digitale",
      description: "Accédez à des milliers de livres numériques et physiques",
    },
    {
      icon: <FiUsers className="text-3xl mb-4" />,
      title: "Communauté Active",
      description: "Échangez avec d'autres passionnés de lecture",
    },
    {
      icon: <FiCalendar className="text-3xl mb-4" />,
      title: "Événements Littéraires",
      description: "Participez à des rencontres et ateliers en ligne",
    },
    {
      icon: <FiShoppingBag className="text-3xl mb-4" />,
      title: "Marketplace",
      description: "Achetez et vendez vos livres en toute sécurité",
    },
    {
      icon: <FiHeart className="text-3xl mb-4" />,
      title: "Soutien aux Auteurs",
      description: "Financez des projets littéraires prometteurs",
    },
    {
      icon: <FiAward className="text-3xl mb-4" />,
      title: "Reconnaissance",
      description: "Gagnez des badges et défis de lecture",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Inscription Rapide",
      desc: "Créez votre profil en 2 minutes seulement",
      icon: <FiCheckCircle className="text-blue-600 text-2xl" />,
    },
    {
      step: "02",
      title: "Exploration",
      desc: "Découvrez livres, auteurs et communautés",
      icon: <FiBook className="text-blue-600 text-2xl" />,
    },
    {
      step: "03",
      title: "Interaction",
      desc: "Participez aux discussions et événements",
      icon: <FiMessageCircle className="text-blue-600 text-2xl" />,
    },
  ];

  // Fonctions utilitaires
  const formatEventDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Date à venir";
    }
  };

  const getEventTypeLabel = (event) => {
    if (event.title?.toLowerCase().includes("rencontre")) return "Rencontre";
    if (event.title?.toLowerCase().includes("webinaire")) return "Webinaire";
    if (event.title?.toLowerCase().includes("atelier")) return "Atelier";
    return "Événement";
  };

  const formatAuthorName = (name) => {
    return name?.charAt(0)?.toUpperCase() || "A";
  };

  const formatTestimonialAuthor = (testimonial) => {
    return (
      testimonial.author?.charAt(0)?.toUpperCase() ||
      testimonial.name?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  const getTestimonialContent = (testimonial) => {
    return (
      testimonial.content ||
      testimonial.contenu ||
      testimonial.message ||
      "Excellent service !"
    );
  };

  const getTestimonialAuthorName = (testimonial) => {
    return testimonial.author || testimonial.name || "Membre";
  };

  const getTestimonialRole = (testimonial) => {
    return testimonial.role || "Membre Vakio Boky";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 font-medium">
            Chargement de votre sanctuaire littéraire...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 overflow-hidden bg-white">
      {/* HERO SECTION */}
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
          style={{ backgroundImage: "url('/assets/images/home.jpeg')" }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-purple-900/40"></div>

        <div className="relative z-10 pt-14 min-h-screen flex flex-col">
          <Header />

          <main
            id="hero"
            className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 animate-fadeIn"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
                Votre{" "}
                <span className="text-blue-300 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Sanctuaire
                </span>
              </h1>

              <h2
                className="text-6xl md:text-8xl mb-12 text-blue-200 animate-fadeIn delay-200 font-serif italic"
                style={{
                  fontFamily: "'UnifrakturCook', cursive",
                  fontWeight: 700,
                  textShadow: "3px 3px 8px rgba(0,0,0,0.7)",
                }}
              >
                Littéraire
              </h2>

              <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn delay-400">
                <p className="text-xl md:text-2xl leading-relaxed font-light text-gray-100 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  « Plongez dans un univers où les mots prennent vie et les
                  discussions éveillent les esprits. Rejoignez notre cercle
                  d'auteurs, de lecteurs et de passionnés des livres. »
                </p>
              </div>

              <div className="flex flex-wrap gap-6 justify-center mt-12 animate-fadeIn delay-600">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Découvrir la plateforme
                </Button>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-br from-white to-blue-50/30"
        id="features"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Pourquoi rejoindre{" "}
              <span className="text-blue-600">Vakio Boky</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez une plateforme complète dédiée à la littérature malagasy
              et francophone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-blue-600 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* HOW IT WORKS SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Comment fonctionne Vakio Boky ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez notre communauté en 3 étapes simples
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100 group"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="flex justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
            >
              Commencer maintenant{" "}
              <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.section>

      {/* SECTION STATISTIQUES */}
      {landingData.stats && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                {
                  value: landingData.stats?.total_books || 0,
                  label: "Livres disponibles",
                },
                {
                  value: landingData.stats?.total_users || 0,
                  label: "Membres actifs",
                },
                {
                  value: landingData.stats?.total_authors || 0,
                  label: "Auteurs locaux",
                },
                {
                  value: landingData.stats?.upcoming_events || 0,
                  label: "Événements à venir",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
                    {stat.value}+
                  </div>
                  <div className="text-blue-100 font-medium text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* TESTIMONIALS SECTION
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Ils parlent de nous
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les expériences de notre communauté
            </p>
          </motion.div>

          {landingData?.testimonials?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {landingData.testimonials
                .slice(0, 6)
                .map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < (testimonial.rating || 5)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
                      "{getTestimonialContent(testimonial)}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {formatTestimonialAuthor(testimonial)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-lg">
                          {getTestimonialAuthorName(testimonial)}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {getTestimonialRole(testimonial)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Aucun témoignage sélectionné pour le moment.
              </p>
              {error && <p className="text-sm text-red-500">Erreur: {error}</p>}
            </div>
          )}
        </div>
      </motion.section> */}

      {/* EVENTS SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden"
        id="events"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Événements à ne pas manquer
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez les prochains événements généraux et de clubs
            </p>
          </motion.div>

          {landingData?.events?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {landingData.events.slice(0, 6).map((event, index) => (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "/assets/images/events/event-default.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl mb-6 flex items-center justify-center">
                      <FiCalendar className="text-white/50 text-4xl" />
                    </div>
                  )}

                  <div className="text-2xl font-bold text-blue-200 mb-2">
                    {formatEventDate(event.event_date)}
                  </div>
                  <div className="inline-block bg-white/20 text-white text-sm px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
                    {getEventTypeLabel(event)}
                  </div>
                  <h3 className="text-2xl font-bold mt-2 mb-4 text-white leading-tight line-clamp-2">
                    {event.title || "Événement sans titre"}
                  </h3>
                  {event.description && (
                    <p className="text-blue-100 text-base mb-4 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-3 text-blue-100 mb-6">
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-blue-200 text-lg" />
                      <span className="text-base">
                        {event.location || "En ligne"}
                      </span>
                    </div>
                    {event.max_participants && (
                      <div className="flex items-center gap-3">
                        <FiUsers className="text-blue-200 text-lg" />
                        <span className="text-base">
                          {event.current_participants || 0} participants
                          {` / ${event.max_participants} max`}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => openEventModal(event.id)}
                    className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Voir détails
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-2xl">
                <FiCalendar className="text-blue-200 text-4xl mx-auto mb-4" />
                <p className="text-blue-100 text-lg mb-2">
                  Aucun événement à venir pour le moment.
                </p>
                <p className="text-blue-200 text-sm">
                  Revenez bientôt pour découvrir nos prochains événements
                </p>
              </div>
              {error && (
                <p className="text-sm text-blue-200 mt-4">
                  Erreur de chargement: {error}
                </p>
              )}
            </div>
          )}

          <EventModal
            eventId={selectedEventId}
            isOpen={isEventModalOpen}
            onClose={closeEventModal}
          />
        </div>
      </motion.section>

      {/* ABOUT SECTION */}
      <motion.section
        id="about"
        className="py-24 bg-gradient-to-br from-gray-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              À propos de Vakio Boky
            </h2>
            <p className="text-gray-600 text-xl leading-relaxed bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg">
              Vakio Boky est la plateforme incontournable pour les passionnés de
              lecture à Madagascar. Nous réunissons lecteurs, auteurs et
              créateurs dans un espace numérique où chaque livre prend vie.
              Explorez des ebooks locaux et internationaux, participez à des
              événements littéraires et soutenez les talents émergents. Notre
              objectif ? Rendre la lecture accessible, interactive et inspirante
              pour tous. Chez Vakio Boky, nous croyons que la lecture transforme
              les idées, les communautés et les vies. Rejoignez notre univers et
              laissez vos mots s'envoler.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CATALOGUE SECTION */}
      <motion.section
        id="catalogue"
        className="py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Catalogue d'ebooks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez une sélection de nos livres les plus populaires
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {livres.length > 0
                ? `${livres.length} livres disponibles`
                : "Chargement des livres..."}
            </p>
          </motion.div>

          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <FiLoader className="animate-spin text-4xl text-blue-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Chargement des livres...
                </p>
              </div>
            </div>
          ) : livres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {livres.map((livre, index) => (
                <motion.div
                  key={livre.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={livre.couverture_url}
                      alt={livre.titre || "Livre"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/books/book-default.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {livre.titre || "Titre non disponible"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {livre.description || "Aucune description disponible."}
                    </p>
                    {livre.genre && (
                      <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        {livre.genre}
                      </span>
                    )}

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openModal(livre)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                      >
                        Voir plus
                      </button>
                      <div className="text-sm text-gray-500">
                        <div className="font-medium text-gray-800">
                          {livre.auteur}
                        </div>
                        {livre.prix > 0 && (
                          <div className="text-green-600 font-bold">
                            {livre.prix.toLocaleString()} Ar
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-block p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <FiBook className="text-4xl text-blue-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Aucun livre disponible pour le moment.
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Les livres publiés apparaîtront ici automatiquement.
                </p>
                {error && (
                  <p className="text-sm text-red-500 mb-2">Erreur: {error}</p>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-600 hover:text-blue-700 underline text-sm"
                >
                  Rafraîchir la page
                </button>
              </div>
            </div>
          )}

          {livres.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/books")}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Voir tous les livres ({livres.length})
              </Button>
            </div>
          )}

          <BookModal
            livre={selectedLivre}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </div>
      </motion.section>

      {/* AUTHORS SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-br from-amber-50 to-orange-50"
        id="auteur"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Découvrez nos{" "}
              <span className="text-amber-600">auteurs promus</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soutenez la littérature locale et découvrez des talents
              exceptionnels
            </p>
          </motion.div>

          {landingData?.authors?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {landingData.authors.map((author, index) => (
                <motion.div
                  key={author.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-amber-100 transition-all duration-300 group"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center text-amber-800 font-bold text-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {author.image ? (
                      <img
                        src={author.image}
                        alt={author.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "/assets/images/authors/author-default.png";
                        }}
                      />
                    ) : (
                      <FiPenTool className="text-amber-600 text-2xl" />
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {author.name || "Auteur inconnu"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 font-medium line-clamp-2">
                    {author.author_genre || "Auteur"}
                  </p>
                  {author.bio && (
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                      {author.bio}
                    </p>
                  )}
                  <div className="text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                    {author.published_works || 1} œuvre(s)
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl">
                <FiPenTool className="text-amber-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Aucun auteur disponible pour le moment.
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Nos auteurs seront bientôt présentés ici.
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-2">Erreur: {error}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* CONTACT SECTION */}
      <motion.section
        id="contact"
        className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Contact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vous avez des questions ? Notre équipe est là pour vous aider.
            </p>
          </motion.div>

          <ContactForm />
        </div>
      </motion.section>

      {/* FINAL CTA SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
              Prêt à commencer votre aventure littéraire ?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Rejoignez dès maintenant la communauté Vakio Boky et transformez
              votre passion pour la lecture en expérience enrichissante.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleRegister}
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold px-8 py-4 text-lg rounded-2xl"
              >
                Créer mon compte gratuit
              </Button>
            </div>
            <p className="text-blue-200 text-lg mt-8 font-medium">
              Aucune carte de crédit requise · Essai gratuit · Annulation à tout
              moment
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
