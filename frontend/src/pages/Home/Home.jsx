// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Header from "@/components/layout/Header";
// // import Button from "@/components/ui/Button";
// // import ContactForm from "@/components/home/Contact";
// // import BookModal from "@/components/books/BookModal";
// // import { motion } from "framer-motion";
// // import {
// //   FiBook,
// //   FiUsers,
// //   FiCalendar,
// //   FiShoppingBag,
// //   FiHeart,
// //   FiAward,
// //   FiMapPin,
// //   FiCheckCircle,
// //   FiMessageCircle,
// //   FiStar,
// //   FiArrowRight,
// //   FiLoader,
// // } from "react-icons/fi";

// // const API_BASE_URL = "https://vakio-boky-backend.onrender.com/api";

// // export default function Home() {
// //   const navigate = useNavigate();
// //   const [landingData, setLandingData] = useState({
// //     testimonials: [],
// //     events: [],
// //     authors: [],
// //     stats: null,
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const [livres, setLivres] = useState([]);
// //   const [selectedLivre, setSelectedLivre] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   const openModal = (livre) => {
// //     setSelectedLivre(livre);
// //     setIsModalOpen(true);
// //   };

// //   const closeModal = () => {
// //     setSelectedLivre(null);
// //     setIsModalOpen(false);
// //   };

// //   useEffect(() => {
// //     const fetchLivres = async () => {
// //       try {
// //         const res = await fetch(`${API_BASE_URL}/books/recent`);
// //         const data = await res.json();
// //         setLivres(data);
// //       } catch (err) {
// //         console.error("Erreur récupération livres :", err);
// //       }
// //     };
// //     fetchLivres();
// //   }, []);

// //   // Chargement des données dynamiques
// //   useEffect(() => {
// //     const fetchLandingData = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         // Appel direct à l'endpoint global
// //         const response = await fetch(`${API_BASE_URL}/landing/data`);

// //         if (!response.ok) {
// //           throw new Error(`Erreur HTTP: ${response.status}`);
// //         }

// //         const result = await response.json();

// //         console.log("🔍 DONNÉES BRUTES DE L'API:", result);

// //         if (result.success) {
// //           setLandingData(result.data);
// //           console.log("📊 Structure des données:", {
// //             testimonials: result.data.testimonials,
// //             events: result.data.events,
// //             authors: result.data.authors,
// //             stats: result.data.stats,
// //           });
// //         } else {
// //           throw new Error(result.message || "Erreur inconnue du serveur");
// //         }
// //       } catch (error) {
// //         console.error("Erreur chargement données:", error);
// //         setError(error.message);
// //         // Données de fallback minimales
// //         setLandingData({
// //           testimonials: [],
// //           events: [],
// //           authors: [],
// //           stats: {
// //             total_books: 1250,
// //             total_users: 3200,
// //             total_authors: 150,
// //             upcoming_events: 8,
// //           },
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchLandingData();
// //   }, []);

// //   const handleLogin = () => {
// //     navigate("/login");
// //   };

// //   const handlePropos = () => {
// //     navigate("/propos");
// //   };

// //   const handleRegister = () => {
// //     navigate("/register");
// //   };

// //   // Données statiques pour les sections fixes
// //   const features = [
// //     {
// //       icon: <FiBook className="text-3xl mb-4" />,
// //       title: "Bibliothèque Digitale",
// //       description: "Accédez à des milliers de livres numériques et physiques",
// //     },
// //     {
// //       icon: <FiUsers className="text-3xl mb-4" />,
// //       title: "Communauté Active",
// //       description: "Échangez avec d'autres passionnés de lecture",
// //     },
// //     {
// //       icon: <FiCalendar className="text-3xl mb-4" />,
// //       title: "Événements Littéraires",
// //       description: "Participez à des rencontres et ateliers en ligne",
// //     },
// //     {
// //       icon: <FiShoppingBag className="text-3xl mb-4" />,
// //       title: "Marketplace",
// //       description: "Achetez et vendez vos livres en toute sécurité",
// //     },
// //     {
// //       icon: <FiHeart className="text-3xl mb-4" />,
// //       title: "Soutien aux Auteurs",
// //       description: "Financez des projets littéraires prometteurs",
// //     },
// //     {
// //       icon: <FiAward className="text-3xl mb-4" />,
// //       title: "Reconnaissance",
// //       description: "Gagnez des badges et défis de lecture",
// //     },
// //   ];

// //   const steps = [
// //     {
// //       step: "01",
// //       title: "Inscription Rapide",
// //       desc: "Créez votre profil en 2 minutes seulement",
// //       icon: <FiCheckCircle className="text-blue-600 text-2xl" />,
// //     },
// //     {
// //       step: "02",
// //       title: "Exploration",
// //       desc: "Découvrez livres, auteurs et communautés",
// //       icon: <FiBook className="text-blue-600 text-2xl" />,
// //     },
// //     {
// //       step: "03",
// //       title: "Interaction",
// //       desc: "Participez aux discussions et événements",
// //       icon: <FiMessageCircle className="text-blue-600 text-2xl" />,
// //     },
// //   ];

// //   // Fonctions utilitaires
// //   const formatEventDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString("fr-FR", {
// //       day: "numeric",
// //       month: "short",
// //       year: "numeric",
// //     });
// //   };

// //   const getEventTypeLabel = (event) => {
// //     if (event.event_type === "general") {
// //       return "Événement général";
// //     }

// //     const types = {
// //       rencontre: "Rencontre",
// //       webinar: "Webinaire",
// //       atelier: "Atelier",
// //       lecture: "Lecture",
// //     };

// //     return types[event.event_type] || "Événement";
// //   };

// //   const formatAuthorName = (name) => {
// //     return name?.charAt(0) || "A";
// //   };

// //   const formatTestimonialAuthor = (testimonial) => {
// //     return testimonial.author?.charAt(0) || testimonial.name?.charAt(0) || "U";
// //   };

// //   const getTestimonialContent = (testimonial) => {
// //     return testimonial.content || testimonial.message || "";
// //   };

// //   const getTestimonialAuthorName = (testimonial) => {
// //     return testimonial.author || testimonial.name || "Utilisateur";
// //   };

// //   const getTestimonialRole = (testimonial) => {
// //     return testimonial.role || "Membre Vakio Boky";
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-center">
// //           <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
// //           <p className="text-gray-600">
// //             Chargement de votre sanctuaire littéraire...
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen text-gray-900 overflow-hidden">
// //       {/* === HERO SECTION AVEC BACKGROUND === */}
// //       <div className="relative min-h-screen overflow-hidden">
// //         {/* --- Arrière-plan UNIQUEMENT pour la hero section --- */}
// //         <div
// //           className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
// //           style={{ backgroundImage: "url('/assets/images/home.jpeg')" }}
// //         ></div>

// //         {/* --- Couche sombre semi-transparente --- */}
// //         <div className="absolute inset-0 bg-black/40"></div>

// //         {/* --- Contenu principal DE LA HERO SECTION --- */}
// //         <div className="relative z-10 pt-14 min-h-screen flex flex-col">
// //           <Header />
// //           {/* <main></main> */}
// //           <main
// //             id="hero"
// //             className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 animate-fadeIn"
// //           >
// //             <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
// //               Votre <span className="text-blue-300">Sanctuaire</span>
// //             </h1>

// //             <h2
// //               className="text-7xl md:text-7xl mb-10 text-blue-200 animate-fadeIn delay-200"
// //               style={{
// //                 fontFamily: "'UnifrakturCook', cursive",
// //                 fontWeight: 700,
// //                 textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
// //               }}
// //             >
// //               Littéraire
// //             </h2>

// //             <div className="max-w-3xl mx-auto space-y-3 animate-fadeIn delay-400">
// //               <p className="text-xl md:text-2xl leading-relaxed font-serif text-gray-100">
// //                 « Plongez dans un univers où les mots prennent vie et les
// //                 discussions éveillent les esprits. »
// //               </p>
// //               <p className="text-xl md:text-2xl leading-relaxed font-serif text-gray-100">
// //                 Rejoignez notre cercle d'auteurs, de lecteurs et de passionnés
// //                 des livres.
// //               </p>
// //             </div>

// //             <div className="flex flex-wrap gap-4 justify-center mt-10 animate-fadeIn delay-600">
// //               <Button variant="primary" size="lg" onClick={handleRegister}>
// //                 Découvrir la plateforme
// //               </Button>
// //               {/* <Button variant="outline" size="lg" onClick={handlePropos}>
// //                 En savoir plus
// //               </Button> */}
// //             </div>
// //           </main>
// //           {/* </section>  */}
// //         </div>
// //       </div>

// //       {/* === AUTRES SECTIONS SANS BACKGROUND SPÉCIAL === */}

// //       {/* FEATURES SECTION */}
// //       <motion.section
// //         initial={{ opacity: 0 }}
// //         whileInView={{ opacity: 1 }}
// //         transition={{ duration: 0.8 }}
// //         className="bg-white py-20 px-6"
// //         id="features"
// //       >
// //         <div className="max-w-6xl mx-auto">
// //           <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
// //             Pourquoi rejoindre <span className="text-blue-600">Vakio Boky</span>{" "}
// //             ?
// //           </h2>
// //           <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
// //             Découvrez une plateforme complète dédiée à la littérature malagasy
// //             et francophone
// //           </p>

// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //             {features.map((feature, index) => (
// //               <motion.div
// //                 key={index}
// //                 whileHover={{ scale: 1.05 }}
// //                 className="bg-blue-50 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
// //               >
// //                 <div className="text-blue-600 flex justify-center">
// //                   {feature.icon}
// //                 </div>
// //                 <h3 className="text-xl font-bold text-gray-800 mb-3">
// //                   {feature.title}
// //                 </h3>
// //                 <p className="text-gray-600">{feature.description}</p>
// //               </motion.div>
// //             ))}
// //           </div>
// //         </div>
// //       </motion.section>

// //       {/* HOW IT WORKS SECTION */}
// //       <motion.section
// //         initial={{ opacity: 0 }}
// //         whileInView={{ opacity: 1 }}
// //         transition={{ duration: 0.8 }}
// //         className="bg-gray-50 py-20 px-6"
// //       >
// //         <div className="max-w-6xl mx-auto">
// //           <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
// //             Comment fonctionne Vakio Boky ?
// //           </h2>
// //           <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
// //             Rejoignez notre communauté en 3 étapes simples
// //           </p>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
// //             {steps.map((step, index) => (
// //               <motion.div
// //                 key={index}
// //                 whileHover={{ y: -5 }}
// //                 className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
// //               >
// //                 <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
// //                   {step.step}
// //                 </div>
// //                 <div className="flex justify-center mb-4">{step.icon}</div>
// //                 <h3 className="text-xl font-bold mb-3 text-gray-800">
// //                   {step.title}
// //                 </h3>
// //                 <p className="text-gray-600">{step.desc}</p>
// //               </motion.div>
// //             ))}
// //           </div>

// //           <div className="text-center mt-12">
// //             <Button variant="primary" size="lg" onClick={handleRegister}>
// //               Commencer maintenant <FiArrowRight className="ml-2" />
// //             </Button>
// //           </div>
// //         </div>
// //       </motion.section>

// //       {/* STATS SECTION */}
// //       <motion.section
// //         initial={{ opacity: 0 }}
// //         whileInView={{ opacity: 1 }}
// //         transition={{ duration: 0.8 }}
// //         className="bg-blue-600 py-16 text-white"
// //       >
// //         <div className="max-w-6xl mx-auto px-6">
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
// //             <div>
// //               <div className="text-3xl font-bold mb-2">
// //                 {landingData?.stats?.total_books || 0}+
// //               </div>
// //               <div className="text-blue-100">Livres disponibles</div>
// //             </div>
// //             <div>
// //               <div className="text-3xl font-bold mb-2">
// //                 {landingData?.stats?.total_users || 0}+
// //               </div>
// //               <div className="text-blue-100">Membres actifs</div>
// //             </div>
// //             <div>
// //               <div className="text-3xl font-bold mb-2">
// //                 {landingData?.stats?.total_authors || 0}+
// //               </div>
// //               <div className="text-blue-100">Auteurs locaux</div>
// //             </div>
// //             <div>
// //               <div className="text-3xl font-bold mb-2">
// //                 {landingData?.stats?.upcoming_events || 0}+
// //               </div>
// //               <div className="text-blue-100">Événements à venir</div>
// //             </div>
// //           </div>
// //         </div>
// //       </motion.section>

// //       {/* TESTIMONIALS SECTION */}
// //       <motion.section
// //         initial={{ opacity: 0 }}
// //         whileInView={{ opacity: 1 }}
// //         transition={{ duration: 0.8 }}
// //         className="py-20 px-6 bg-white"
// //       >
// //         <div className="max-w-6xl mx-auto">
// //           <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
// //             Ils parlent de nous
// //           </h2>
// //           <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
// //             Découvrez les expériences de notre communauté
// //           </p>

// //           {landingData?.testimonials?.length > 0 ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //               {landingData.testimonials.map((testimonial) => (
// //                 <motion.div
// //                   key={testimonial.id}
// //                   whileHover={{ scale: 1.02 }}
// //                   className="bg-blue-50 p-6 rounded-xl border border-blue-100"
// //                 >
// //                   <div className="flex items-center gap-2 mb-4">
// //                     {[...Array(5)].map((_, i) => (
// //                       <FiStar
// //                         key={i}
// //                         className={
// //                           i < (testimonial.rating || 5)
// //                             ? "text-yellow-400 fill-current"
// //                             : "text-gray-300"
// //                         }
// //                       />
// //                     ))}
// //                   </div>
// //                   <p className="text-gray-700 italic mb-4">
// //                     "{getTestimonialContent(testimonial)}"
// //                   </p>
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
// //                       {formatTestimonialAuthor(testimonial)}
// //                     </div>
// //                     <div>
// //                       <div className="font-semibold text-gray-800">
// //                         {getTestimonialAuthorName(testimonial)}
// //                       </div>
// //                       <div className="text-blue-600 text-sm">
// //                         {getTestimonialRole(testimonial)}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center">
// //               <p className="text-gray-500 mb-4">
// //                 Aucun témoignage sélectionné pour le moment.
// //               </p>
// //               {error && <p className="text-sm text-red-500">Erreur: {error}</p>}
// //             </div>
// //           )}
// //         </div>
// //       </motion.section>

// //       {/* EVENTS SECTION */}
// //       <motion.section
// //         initial={{ opacity: 0 }}
// //         whileInView={{ opacity: 1 }}
// //         transition={{ duration: 0.8 }}
// //         className="py-20 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
// //         id="events"
// //       >
// //         <div className="max-w-6xl mx-auto">
// //           <h2 className="text-4xl font-bold text-center mb-4">
// //             Événements à ne pas manquer
// //           </h2>
// //           <p className="text-xl text-center text-blue-100 mb-12 max-w-3xl mx-auto">
// //             Découvrez les prochains événements généraux et de clubs
// //           </p>

// //           {landingData?.events?.length > 0 ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
// //               {landingData.events.map((event) => (
// //                 <motion.div
// //                   key={event.id}
// //                   whileHover={{ scale: 1.05 }}
// //                   className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
// //                 >
// //                   {event.image_url && (
// //                     <img
// //                       src={event.image_url}
// //                       alt={event.title}
// //                       className="w-full h-40 object-cover rounded-lg mb-4"
// //                     />
// //                   )}

// //                   <div className="text-2xl font-bold text-blue-200">
// //                     {formatEventDate(event.event_date)}
// //                   </div>

// //                   <div className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-2">
// //                     {getEventTypeLabel(event)}
// //                   </div>

// //                   <h3 className="text-xl font-bold mt-2 mb-3">{event.title}</h3>

// //                   {event.description && (
// //                     <p className="text-blue-100 text-sm mb-3 line-clamp-2">
// //                       {event.description}
// //                     </p>
// //                   )}

// //                   {event.club_name && (
// //                     <div className="flex items-center gap-2 mb-2 text-blue-100 text-sm">
// //                       <FiUsers className="text-blue-200" />
// //                       <span>Club: {event.club_name}</span>
// //                     </div>
// //                   )}

// //                   <div className="space-y-2 text-blue-100">
// //                     <div className="flex items-center gap-2">
// //                       <FiMapPin className="text-blue-200" />
// //                       <span className="text-sm">
// //                         {event.location || "Lieu à préciser"}
// //                       </span>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <FiUsers className="text-blue-200" />
// //                       <span className="text-sm">
// //                         {event.current_participants || 0} participants
// //                         {event.max_participants &&
// //                           ` / ${event.max_participants} max`}
// //                       </span>
// //                     </div>
// //                   </div>

// //                   <Button variant="outline" size="sm" className="w-full mt-4">
// //                     {event.event_type === "general"
// //                       ? "S'inscrire"
// //                       : "Voir détails"}
// //                   </Button>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center">
// //               <p className="text-blue-100 mb-4">
// //                 Aucun événement à venir pour le moment.
// //               </p>
// //               {error && (
// //                 <p className="text-sm text-blue-200">
// //                   Erreur de chargement: {error}
// //                 </p>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </motion.section>

// //       {/* ABOUT SECTION */}
// //       <motion.section id="about" className="py-20 bg-gray-50">
// //         <div className="max-w-6xl mx-auto px-6 text-center">
// //           <h2 className="text-3xl font-bold mb-4">À propos de Vakio Boky</h2>
// //           <p className="text-gray-600 text-lg leading-relaxed">
// //             Vakio Boky est la plateforme incontournable pour les passionnés de lecture à Madagascar. Nous réunissons lecteurs, auteurs et créateurs dans un espace numérique où chaque livre prend vie.

// // Explorez des ebooks locaux et internationaux, participez à des événements littéraires et soutenez les talents émergents. Notre objectif ? Rendre la lecture accessible, interactive et inspirante pour tous.

// // Chez Vakio Boky, nous croyons que la lecture transforme les idées, les communautés et les vies. Rejoignez notre univers et laissez vos mots s’envoler.
// //           </p>
// //         </div>
// //       </motion.section>

// //       {/* CATALOGUES SECTION
// //       <motion.section id="catalogue" className="py-20">
// //         <div className="max-w-6xl mx-auto px-6 text-center">
// //           <h2 className="text-3xl font-bold mb-4">Catalogue d'ebooks</h2>
// //           <p className="text-gray-600 mb-8">
// //             Découvrez une sélection de nos ebooks les plus populaires.
// //           </p>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {[1, 2, 3].map((i) => (
// //               <div key={i} className="border p-4 rounded-xl shadow-sm">
// //                 <div className="h-40 bg-gray-200 rounded mb-4"></div>
// //                 <h3 className="font-semibold">Titre du livre</h3>
// //                 <p className="text-gray-500 text-sm mb-4">Auteur inconnu</p>
// //                 <button
// //                   onClick={() => navigate("/login")}
// //                   className="text-blue-600 underline"
// //                 >
// //                   Se connecter pour voir plus
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </motion.section> */}
// //       <motion.section id="catalogue" className="py-20">
// //         <div className="max-w-6xl mx-auto px-6 text-center">
// //           <h2 className="text-3xl font-bold mb-4">Catalogue d'ebooks</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {livres.length > 0 ? (
// //               livres.map((livre) => (
// //                 <div
// //                   key={livre.id}
// //                   className="border p-4 rounded-xl shadow-sm flex flex-col justify-between"
// //                 >
// //                   <img
// //                     src={livre.couverture_url}
// //                     alt={livre.titre}
// //                     className="h-48 w-full object-cover rounded mb-4"
// //                   />
// //                   <h3 className="font-semibold text-lg mb-2">{livre.titre}</h3>
// //                   <p className="text-gray-500 text-sm mb-2 line-clamp-3">
// //                     {livre.description || "Aucune description disponible."}
// //                   </p>
// //                   <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
// //                     {livre.genre || "Genre inconnu"}
// //                   </span>
// //                   <div className="mt-4 flex justify-between items-center">
// //                     <button
// //                       onClick={() => openModal(livre)}
// //                       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
// //                     >
// //                       Voir plus
// //                     </button>
// //                     <button
// //                       onClick={() => navigate("/login")}
// //                       className="text-blue-600 underline text-sm"
// //                     >
// //                       Se connecter
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p>Aucun livre disponible pour le moment.</p>
// //             )}
// //           </div>

// //           {/* Modal */}
// //           <BookModal
// //             livre={selectedLivre}
// //             isOpen={isModalOpen}
// //             onClose={closeModal}
// //           />
// //         </div>
// //       </motion.section>

// //       {/* AUTHORS SECTION */}
// //       <motion.section
// //         initial={{ opacity: 0 }}
// //         whileInView={{ opacity: 1 }}
// //         transition={{ duration: 0.8 }}
// //         className="py-20 px-6 bg-amber-50"
// //       >
// //         <div className="max-w-6xl mx-auto">
// //           <h2 className="text-4xl font-bold text-center mb-4">
// //             Découvrez nos <span className="text-amber-600">auteurs promus</span>
// //           </h2>
// //           <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
// //             Soutenez la littérature locale et découvrez des talents
// //             exceptionnels
// //           </p>

// //           {landingData?.authors?.length > 0 ? (
// //             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
// //               {landingData.authors.map((author) => (
// //                 <motion.div
// //                   key={author.id}
// //                   whileHover={{ y: -5 }}
// //                   className="text-center bg-white p-6 rounded-2xl shadow-lg"
// //                 >
// //                   <div className="w-20 h-20 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center text-amber-800 font-bold text-xl overflow-hidden">
// //                     {author.image ? (
// //                       <img
// //                         src={author.image}
// //                         alt={author.name}
// //                         className="w-full h-full object-cover"
// //                       />
// //                     ) : (
// //                       formatAuthorName(author.name)
// //                     )}
// //                   </div>
// //                   <h3 className="font-bold text-gray-800">{author.name}</h3>
// //                   <p className="text-sm text-gray-600 mb-2">
// //                     {author.author_genre || "Auteur"}
// //                   </p>
// //                   {author.bio && (
// //                     <p className="text-xs text-gray-500 mb-2 line-clamp-2">
// //                       {author.bio}
// //                     </p>
// //                   )}
// //                   <div className="text-xs text-amber-600">
// //                     {author.published_works || 0} œuvre(s)
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center">
// //               <p className="text-gray-500 mb-4">
// //                 Aucun auteur promu pour le moment.
// //               </p>
// //               {error && <p className="text-sm text-red-500">Erreur: {error}</p>}
// //             </div>
// //           )}
// //         </div>
// //       </motion.section>

// //       {/* CONTACT SECTION */}
// //       {/* <motion.section id="contact" className="py-20">
// //         <div className="max-w-4xl mx-auto px-6 text-center">
// //           <h2 className="text-3xl font-bold mb-6">Contact</h2>
// //           <p className="text-gray-600 mb-8">
// //             Vous avez des questions ? Notre équipe est là pour vous aider.
// //           </p>

// //           <a
// //             href="mailto:support@vakioboky.com"
// //             className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow"
// //           >
// //             Envoyer un email
// //           </a>
// //         </div>
// //       </motion.section> */}
// //       <motion.section id="contact" className="py-20">
// //         <div className="max-w-4xl mx-auto px-6 text-center">
// //           <h2 className="text-3xl font-bold mb-6">Contact</h2>
// //           <p className="text-gray-600 mb-8">
// //             Vous avez des questions ? Notre équipe est là pour vous aider.
// //           </p>

// //           <ContactForm />
// //         </div>
// //       </motion.section>

// //       {/* FINAL CTA SECTION */}
// //       <motion.section
// //         initial={{ opacity: 0 }}
// //         whileInView={{ opacity: 1 }}
// //         transition={{ duration: 0.8 }}
// //         className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 px-6 text-center text-white"
// //       >
// //         <div className="max-w-4xl mx-auto">
// //           <h2 className="text-3xl md:text-4xl font-bold mb-6">
// //             Prêt à commencer votre aventure littéraire ?
// //           </h2>
// //           <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
// //             Rejoignez dès maintenant la communauté Vakio Boky et transformez
// //             votre passion pour la lecture en expérience enrichissante.
// //           </p>
// //           <div className="flex flex-wrap gap-4 justify-center">
// //             <Button variant="primary" size="lg" onClick={handleRegister}>
// //               Créer mon compte gratuit
// //             </Button>
// //             {/* <Button variant="outline" size="lg" onClick={handleExplore}>
// //               Découvrir la plateforme
// //             </Button> */}
// //           </div>
// //           <p className="text-blue-200 text-sm mt-6">
// //             Aucune carte de crédit requise · Essai gratuit · Annulation à tout
// //             moment
// //           </p>
// //         </div>
// //       </motion.section>
// //     </div>
// //   );
// // }
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "@/components/layout/Header";
// import Button from "@/components/ui/Button";
// import ContactForm from "@/components/home/Contact";
// import BookModal from "@/components/books/BookModal";
// // import EventModal from "@/pages/Events/EventModal";
// import EventModal from "@/pages/Events/EventModal";
// import { motion } from "framer-motion";
// import {
//   FiBook,
//   FiUsers,
//   FiCalendar,
//   FiShoppingBag,
//   FiHeart,
//   FiAward,
//   FiMapPin,
//   FiCheckCircle,
//   FiMessageCircle,
//   FiStar,
//   FiArrowRight,
//   FiLoader,
// } from "react-icons/fi";

// const API_BASE_URL = "https://vakio-boky-backend.onrender.com/api";

// export default function Home() {
//   const navigate = useNavigate();
//   const [landingData, setLandingData] = useState({
//     testimonials: [],
//     events: [],
//     authors: [],
//     stats: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [livres, setLivres] = useState([]);
//   const [selectedLivre, setSelectedLivre] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // Dans le composant Home, ajouter ces states :
//   const [selectedEventId, setSelectedEventId] = useState(null);
//   const [isEventModalOpen, setIsEventModalOpen] = useState(false);

//   // Ajouter ces fonctions :

//   const openModal = (livre) => {
//     setSelectedLivre(livre);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedLivre(null);
//     setIsModalOpen(false);
//   };

//   const openEventModal = (eventId) => {
//     setSelectedEventId(eventId);
//     setIsEventModalOpen(true);
//   };

//   const closeEventModal = () => {
//     setSelectedEventId(null);
//     setIsEventModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchLivres = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/books/recent`);
//         const data = await res.json();
//         setLivres(data);
//       } catch (err) {
//         console.error("Erreur récupération livres :", err);
//       }
//     };
//     fetchLivres();
//   }, []);

//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(`${API_BASE_URL}/landing/data`);

//         if (!response.ok) {
//           throw new Error(`Erreur HTTP: ${response.status}`);
//         }

//         const result = await response.json();

//         if (result.success) {
//           setLandingData(result.data);
//         } else {
//           throw new Error(result.message || "Erreur inconnue du serveur");
//         }
//       } catch (error) {
//         console.error("Erreur chargement données:", error);
//         setError(error.message);
//         setLandingData({
//           testimonials: [],
//           events: [],
//           authors: [],
//           stats: {
//             total_books: 1250,
//             total_users: 3200,
//             total_authors: 150,
//             upcoming_events: 8,
//           },
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLandingData();
//   }, []);

//   const handleLogin = () => {
//     navigate("/login");
//   };

//   const handlePropos = () => {
//     navigate("/propos");
//   };

//   const handleRegister = () => {
//     navigate("/register");
//   };

//   const features = [
//     {
//       icon: <FiBook className="text-3xl mb-4" />,
//       title: "Bibliothèque Digitale",
//       description: "Accédez à des milliers de livres numériques et physiques",
//     },
//     {
//       icon: <FiUsers className="text-3xl mb-4" />,
//       title: "Communauté Active",
//       description: "Échangez avec d'autres passionnés de lecture",
//     },
//     {
//       icon: <FiCalendar className="text-3xl mb-4" />,
//       title: "Événements Littéraires",
//       description: "Participez à des rencontres et ateliers en ligne",
//     },
//     {
//       icon: <FiShoppingBag className="text-3xl mb-4" />,
//       title: "Marketplace",
//       description: "Achetez et vendez vos livres en toute sécurité",
//     },
//     {
//       icon: <FiHeart className="text-3xl mb-4" />,
//       title: "Soutien aux Auteurs",
//       description: "Financez des projets littéraires prometteurs",
//     },
//     {
//       icon: <FiAward className="text-3xl mb-4" />,
//       title: "Reconnaissance",
//       description: "Gagnez des badges et défis de lecture",
//     },
//   ];

//   const steps = [
//     {
//       step: "01",
//       title: "Inscription Rapide",
//       desc: "Créez votre profil en 2 minutes seulement",
//       icon: <FiCheckCircle className="text-blue-600 text-2xl" />,
//     },
//     {
//       step: "02",
//       title: "Exploration",
//       desc: "Découvrez livres, auteurs et communautés",
//       icon: <FiBook className="text-blue-600 text-2xl" />,
//     },
//     {
//       step: "03",
//       title: "Interaction",
//       desc: "Participez aux discussions et événements",
//       icon: <FiMessageCircle className="text-blue-600 text-2xl" />,
//     },
//   ];

//   const formatEventDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("fr-FR", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const getEventTypeLabel = (event) => {
//     if (event.event_type === "general") {
//       return "Événement général";
//     }

//     const types = {
//       rencontre: "Rencontre",
//       webinar: "Webinaire",
//       atelier: "Atelier",
//       lecture: "Lecture",
//     };

//     return types[event.event_type] || "Événement";
//   };

//   const formatAuthorName = (name) => {
//     return name?.charAt(0) || "A";
//   };

//   const formatTestimonialAuthor = (testimonial) => {
//     return testimonial.author?.charAt(0) || testimonial.name?.charAt(0) || "U";
//   };

//   const getTestimonialContent = (testimonial) => {
//     return testimonial.content || testimonial.message || "";
//   };

//   const getTestimonialAuthorName = (testimonial) => {
//     return testimonial.author || testimonial.name || "Utilisateur";
//   };

//   const getTestimonialRole = (testimonial) => {
//     return testimonial.role || "Membre Vakio Boky";
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
//         <div className="text-center">
//           <div className="relative">
//             <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-20 animate-pulse"></div>
//           </div>
//           <p className="text-gray-600 font-medium">
//             Chargement de votre sanctuaire littéraire...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-gray-900 overflow-hidden bg-white">
//       <div className="relative min-h-screen overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
//           style={{ backgroundImage: "url('/assets/images/home.jpeg')" }}
//         ></div>

//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-purple-900/40"></div>

//         <div className="relative z-10 pt-14 min-h-screen flex flex-col">
//           <Header />

//           <main
//             id="hero"
//             className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 animate-fadeIn"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="max-w-6xl mx-auto"
//             >
//               <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
//                 Votre{" "}
//                 <span className="text-blue-300 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
//                   Sanctuaire
//                 </span>
//               </h1>

//               <h2
//                 className="text-6xl md:text-8xl mb-12 text-blue-200 animate-fadeIn delay-200 font-serif italic"
//                 style={{
//                   fontFamily: "'UnifrakturCook', cursive",
//                   fontWeight: 700,
//                   textShadow: "3px 3px 8px rgba(0,0,0,0.7)",
//                 }}
//               >
//                 Littéraire
//               </h2>

//               <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn delay-400">
//                 <p className="text-xl md:text-2xl leading-relaxed font-light text-gray-100 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//                   « Plongez dans un univers où les mots prennent vie et les
//                   discussions éveillent les esprits. Rejoignez notre cercle
//                   d'auteurs, de lecteurs et de passionnés des livres. »
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-6 justify-center mt-12 animate-fadeIn delay-600">
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   onClick={handleLogin}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
//                 >
//                   Découvrir la plateforme
//                 </Button>
//               </div>
//             </motion.div>
//           </main>
//         </div>
//       </div>

//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="py-24 px-6 bg-gradient-to-br from-white to-blue-50/30"
//         id="features"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//               Pourquoi rejoindre{" "}
//               <span className="text-blue-600">Vakio Boky</span> ?
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//               Découvrez une plateforme complète dédiée à la littérature malagasy
//               et francophone
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//                 whileHover={{ scale: 1.05, y: -5 }}
//                 className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
//               >
//                 <div className="text-blue-600 flex justify-center group-hover:scale-110 transition-transform duration-300">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </motion.section>

//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="py-24 px-6 bg-gradient-to-br from-gray-50 to-white"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//               Comment fonctionne Vakio Boky ?
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Rejoignez notre communauté en 3 étapes simples
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
//             {steps.map((step, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.2 }}
//                 whileHover={{ y: -8 }}
//                 className="relative text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100 group"
//               >
//                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
//                   {step.step}
//                 </div>
//                 <div className="flex justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
//                   {step.icon}
//                 </div>
//                 <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
//                   {step.title}
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">{step.desc}</p>
//               </motion.div>
//             ))}
//           </div>

//           <div className="text-center mt-16">
//             <Button
//               variant="primary"
//               size="lg"
//               onClick={handleLogin}
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
//             >
//               Commencer maintenant{" "}
//               <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
//             </Button>
//           </div>
//         </div>
//       </motion.section>

//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden"
//       >
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="max-w-7xl mx-auto px-6 relative z-10">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             {[
//               {
//                 value: landingData?.stats?.total_books || 0,
//                 label: "Livres disponibles",
//               },
//               {
//                 value: landingData?.stats?.total_users || 0,
//                 label: "Membres actifs",
//               },
//               {
//                 value: landingData?.stats?.total_authors || 0,
//                 label: "Auteurs locaux",
//               },
//               {
//                 value: landingData?.stats?.upcoming_events || 0,
//                 label: "Événements à venir",
//               },
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className="text-center"
//               >
//                 <div className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
//                   {stat.value}+
//                 </div>
//                 <div className="text-blue-100 font-medium text-lg">
//                   {stat.label}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </motion.section>

//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="py-24 px-6 bg-white"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//               Ils parlent de nous
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Découvrez les expériences de notre communauté
//             </p>
//           </motion.div>

//           {landingData?.testimonials?.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {landingData.testimonials.map((testimonial, index) => (
//                 <motion.div
//                   key={testimonial.id}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                   whileHover={{ scale: 1.02, y: -5 }}
//                   className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <div className="flex items-center gap-2 mb-4">
//                     {[...Array(5)].map((_, i) => (
//                       <FiStar
//                         key={i}
//                         className={
//                           i < (testimonial.rating || 5)
//                             ? "text-yellow-400 fill-current"
//                             : "text-gray-300"
//                         }
//                       />
//                     ))}
//                   </div>
//                   <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
//                     "{getTestimonialContent(testimonial)}"
//                   </p>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
//                       {formatTestimonialAuthor(testimonial)}
//                     </div>
//                     <div>
//                       <div className="font-semibold text-gray-800 text-lg">
//                         {getTestimonialAuthorName(testimonial)}
//                       </div>
//                       <div className="text-blue-600 font-medium">
//                         {getTestimonialRole(testimonial)}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-gray-500 text-lg mb-4">
//                 Aucun témoignage sélectionné pour le moment.
//               </p>
//               {error && <p className="text-sm text-red-500">Erreur: {error}</p>}
//             </div>
//           )}
//         </div>
//       </motion.section>

//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden"
//         id="events"
//       >
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="max-w-7xl mx-auto relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
//               Événements à ne pas manquer
//             </h2>
//             <p className="text-xl text-blue-100 max-w-3xl mx-auto">
//               Découvrez les prochains événements généraux et de clubs
//             </p>
//           </motion.div>
//           {landingData?.events?.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
//               {landingData.events.map((event, index) => (
//                 <motion.div
//                   key={event.id}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                   whileHover={{ scale: 1.05, y: -5 }}
//                   className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
//                 >
//                   {event.image_url && (
//                     <img
//                       src={event.image_url}
//                       alt={event.title}
//                       className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
//                     />
//                   )}
//                   <div className="text-2xl font-bold text-blue-200 mb-2">
//                     {formatEventDate(event.event_date)}
//                   </div>
//                   <div className="inline-block bg-white/20 text-white text-sm px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
//                     {getEventTypeLabel(event)}
//                   </div>
//                   <h3 className="text-2xl font-bold mt-2 mb-4 text-white leading-tight">
//                     {event.title}
//                   </h3>
//                   {event.description && (
//                     <p className="text-blue-100 text-base mb-4 leading-relaxed line-clamp-3">
//                       {event.description}
//                     </p>
//                   )}
//                   {event.club_name && (
//                     <div className="flex items-center gap-3 mb-4 text-blue-100 text-base">
//                       <FiUsers className="text-blue-200 text-lg" />
//                       <span>Club: {event.club_name}</span>
//                     </div>
//                   )}
//                   <div className="space-y-3 text-blue-100 mb-6">
//                     <div className="flex items-center gap-3">
//                       <FiMapPin className="text-blue-200 text-lg" />
//                       <span className="text-base">
//                         {event.location || "Lieu à préciser"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <FiUsers className="text-blue-200 text-lg" />
//                       <span className="text-base">
//                         {event.current_participants || 0} participants
//                         {event.max_participants &&
//                           ` / ${event.max_participants} max`}
//                       </span>
//                     </div>
//                   </div>
//                   {/* <Button
//                     variant="outline"
//                     size="lg"
//                     className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold py-3 rounded-xl transition-all duration-300"
//                   >
//                     {event.event_type === "general"
//                       ? "S'inscrire"
//                       : "Voir détails"}
//                   </Button> */}
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     onClick={() => openEventModal(event.id)}
//                     className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold py-3 rounded-xl transition-all duration-300"
//                   >
//                     Voir détails
//                   </Button>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-blue-100 text-lg mb-4">
//                 Aucun événement à venir pour le moment.
//               </p>
//               {error && (
//                 <p className="text-sm text-blue-200">
//                   Erreur de chargement: {error}
//                 </p>
//               )}
//             </div>
//           )}
//           <EventModal
//             eventId={selectedEventId}
//             isOpen={isEventModalOpen}
//             onClose={closeEventModal}
//           />
//         </div>
//       </motion.section>

//       <motion.section
//         id="about"
//         className="py-24 bg-gradient-to-br from-gray-50 to-white"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
//               À propos de Vakio Boky
//             </h2>
//             <p className="text-gray-600 text-xl leading-relaxed bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg">
//               Vakio Boky est la plateforme incontournable pour les passionnés de
//               lecture à Madagascar. Nous réunissons lecteurs, auteurs et
//               créateurs dans un espace numérique où chaque livre prend vie.
//               Explorez des ebooks locaux et internationaux, participez à des
//               événements littéraires et soutenez les talents émergents. Notre
//               objectif ? Rendre la lecture accessible, interactive et inspirante
//               pour tous. Chez Vakio Boky, nous croyons que la lecture transforme
//               les idées, les communautés et les vies. Rejoignez notre univers et
//               laissez vos mots s'envoler.
//             </p>
//           </motion.div>
//         </div>
//       </motion.section>

//       <motion.section
//         id="catalogue"
//         className="py-24 bg-white"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         <div className="max-w-7xl mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//               Catalogue d'ebooks
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Découvrez une sélection de nos livres les plus populaires
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {livres.length > 0 ? (
//               livres.map((livre, index) => (
//                 <motion.div
//                   key={livre.id}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                   whileHover={{ y: -8 }}
//                   className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 group"
//                 >
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={livre.couverture_url}
//                       alt={livre.titre}
//                       className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
//                   </div>

//                   <div className="p-6">
//                     <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
//                       {livre.titre}
//                     </h3>
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
//                       {livre.description || "Aucune description disponible."}
//                     </p>
//                     <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
//                       {livre.genre || "Genre inconnu"}
//                     </span>

//                     <div className="flex justify-between items-center">
//                       <button
//                         onClick={() => openModal(livre)}
//                         className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
//                       >
//                         Voir plus
//                       </button>
//                       <button
//                         onClick={() => navigate("/login")}
//                         className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
//                       >
//                         Se connecter
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-gray-500 text-lg">
//                   Aucun livre disponible pour le moment.
//                 </p>
//               </div>
//             )}
//           </div>

//           <BookModal
//             livre={selectedLivre}
//             isOpen={isModalOpen}
//             onClose={closeModal}
//           />
//         </div>
//       </motion.section>

//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="py-24 px-6 bg-gradient-to-br from-amber-50 to-orange-50"
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//               Découvrez nos{" "}
//               <span className="text-amber-600">auteurs promus</span>
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Soutenez la littérature locale et découvrez des talents
//               exceptionnels
//             </p>
//           </motion.div>

//           {landingData?.authors?.length > 0 ? (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//               {landingData.authors.map((author, index) => (
//                 <motion.div
//                   key={author.id}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                   whileHover={{ y: -8, scale: 1.05 }}
//                   className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-amber-100 transition-all duration-300 group"
//                 >
//                   <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center text-amber-800 font-bold text-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
//                     {author.image ? (
//                       <img
//                         src={author.image}
//                         alt={author.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       formatAuthorName(author.name)
//                     )}
//                   </div>
//                   <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
//                     {author.name}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-3 font-medium">
//                     {author.author_genre || "Auteur"}
//                   </p>
//                   {author.bio && (
//                     <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
//                       {author.bio}
//                     </p>
//                   )}
//                   <div className="text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
//                     {author.published_works || 0} œuvre(s)
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-gray-500 text-lg mb-4">
//                 Aucun auteur promu pour le moment.
//               </p>
//               {error && <p className="text-sm text-red-500">Erreur: {error}</p>}
//             </div>
//           )}
//         </div>
//       </motion.section>

//       <motion.section
//         id="contact"
//         className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         <div className="max-w-4xl mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//               Contact
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Vous avez des questions ? Notre équipe est là pour vous aider.
//             </p>
//           </motion.div>

//           <ContactForm />
//         </div>
//       </motion.section>

//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white text-center relative overflow-hidden"
//       >
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="max-w-5xl mx-auto relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
//               Prêt à commencer votre aventure littéraire ?
//             </h2>
//             <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
//               Rejoignez dès maintenant la communauté Vakio Boky et transformez
//               votre passion pour la lecture en expérience enrichissante.
//             </p>
//             <div className="flex flex-wrap gap-6 justify-center">
//               <Button
//                 variant="primary"
//                 size="lg"
//                 onClick={handleRegister}
//                 className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold px-8 py-4 text-lg rounded-2xl"
//               >
//                 Créer mon compte gratuit
//               </Button>
//             </div>
//             <p className="text-blue-200 text-lg mt-8 font-medium">
//               Aucune carte de crédit requise · Essai gratuit · Annulation à tout
//               moment
//             </p>
//           </motion.div>
//         </div>
//       </motion.section>
//     </div>
//   );
// }
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

  // 1. Récupération des livres récents
  useEffect(() => {
    const fetchLivres = async () => {
      try {
        console.log("🔄 Récupération des livres depuis l'API...");
        const res = await fetch(`${API_BASE_URL}/books/recent`);
        
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("📚 Livres reçus:", data.length);
        // Si l'API retourne directement un tableau
        if (Array.isArray(data)) {
          setLivres(data);
        } 
        // Si l'API retourne un objet avec une propriété data
        else if (data.data && Array.isArray(data.data)) {
          setLivres(data.data);
        }
        // Si l'API retourne un objet avec une propriété books
        else if (data.books && Array.isArray(data.books)) {
          setLivres(data.books);
        }
        else {
          console.warn("Format de données inattendu:", data);
          setLivres([]);
        }
      } catch (err) {
        console.error("❌ Erreur récupération livres :", err);
        setLivres([]);
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
          hasStats: !!result.data?.stats
        });

        if (result.success) {
          setLandingData({
            testimonials: result.data.testimonials || [],
            events: result.data.events || [],
            authors: result.data.authors || [],
            stats: result.data.stats || null,
          });
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
    // Détermine le type d'événement basé sur le titre ou d'autres propriétés
    if (event.title?.toLowerCase().includes("rencontre")) return "Rencontre";
    if (event.title?.toLowerCase().includes("webinaire")) return "Webinaire";
    if (event.title?.toLowerCase().includes("atelier")) return "Atelier";
    return "Événement";
  };

  const formatAuthorName = (name) => {
    return name?.charAt(0)?.toUpperCase() || "A";
  };

  const formatTestimonialAuthor = (testimonial) => {
    return testimonial.author?.charAt(0)?.toUpperCase() || 
           testimonial.name?.charAt(0)?.toUpperCase() || 
           "U";
  };

  const getTestimonialContent = (testimonial) => {
    return testimonial.content || testimonial.contenu || testimonial.message || "Excellent service !";
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

      {/* SECTION STATISTIQUES - OPTIONNEL (peut être supprimée) */}
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

      {/* TESTIMONIALS SECTION */}
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
              {landingData.testimonials.slice(0, 6).map((testimonial, index) => (
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
      </motion.section>

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
                        e.target.src = "/assets/images/event-placeholder.jpg";
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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {livres.length > 0 ? (
              livres.slice(0, 6).map((livre, index) => (
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
                      src={livre.couverture_url || "/assets/images/book-placeholder.jpg"}
                      alt={livre.titre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/book-placeholder.jpg";
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
                      <button
                        onClick={() => navigate("/login")}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                      >
                        Se connecter
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-block p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <FiBook className="text-4xl text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    Aucun livre disponible pour le moment.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Nos livres seront bientôt disponibles
                  </p>
                </div>
              </div>
            )}
          </div>

          <BookModal
            livre={selectedLivre}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </div>
      </motion.section>

      {/* PROMOTED AUTHORS SECTION
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-br from-amber-50 to-orange-50"
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
              {landingData.authors.slice(0, 8).map((author, index) => (
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
                          e.target.src = "/assets/images/avatar-placeholder.jpg";
                        }}
                      />
                    ) : (
                      <FiUser className="text-amber-600 text-2xl" />
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
                    {author.published_works || 0} œuvre(s)
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl">
                <FiUser className="text-amber-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Aucun auteur promu pour le moment.
                </p>
                <p className="text-gray-400 text-sm">
                  Découvrez bientôt nos auteurs talentueux
                </p>
              </div>
              {error && <p className="text-sm text-red-500 mt-4">Erreur: {error}</p>}
            </div>
          )}
        </div>
      </motion.section> */}
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
              Soutenez la littérature locale et découvrez des talents exceptionnels
            </p>
            
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 bg-white/50 rounded-lg text-left">
                <p className="text-sm text-gray-600">
                  <strong>Debug info:</strong> {landingData.authors.length} auteurs chargés
                  {error && <span className="text-red-500 ml-2">• Erreur: {error}</span>}
                </p>
              </div>
            )}
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
                          e.target.src = "/assets/images/avatar-placeholder.jpg";
                        }}
                      />
                    ) : (
                      // <FiPenTool className="text-amber-600 text-2xl" />
                      <FiArrowRight/>
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
                <FiArrowRight className="text-amber-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Aucun auteur disponible pour le moment.
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Nos auteurs seront bientôt présentés ici.
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-2">
                    Erreur: {error}
                  </p>
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