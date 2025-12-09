// // import { useState } from "react";
// // import {
// //   FiBell,
// //   FiUser,
// //   FiBookOpen,
// //   FiShoppingCart,
// //   FiHome,
// //   FiCalendar,
// //   FiHeart,
// //   FiLogOut,
// //   FiSettings,
// // } from "react-icons/fi";
// // import { motion } from "framer-motion";
// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import Button from "@/components/ui/Button";
// // import Input from "../ui/Input";
// // import { useAuth } from "../../hooks/useAuth";
// // import NotificationBell from "../../components/clubs/NotificationBell";

// // export default function Header() {
// //   const [search, setSearch] = useState("");
// //   const [showUserMenu, setShowUserMenu] = useState(false);

// //   const scrollToSection = (id) => {
// //     const section = document.getElementById(id);
// //     if (section) {
// //       section.scrollIntoView({ behavior: "smooth" });
// //     }
// //   };

// //   const { user, logout, isAdmin } = useAuth();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const isAuthPage = [
// //     "/login",
// //     "/register",
// //     "/forgot-password",
// //     "/verify-code",
// //     "/reset-password",
// //   ].includes(location.pathname);
// //   const isLoggedIn = !!user?.token && !isAuthPage;

// //   const handleProtectedNavigation = (targetPath) => {
// //     if (isLoggedIn) {
// //       navigate(targetPath);
// //     } else {
// //       navigate("/login", {
// //         state: {
// //           from: targetPath,
// //           message: "Connectez-vous pour accéder à cette page",
// //         },
// //       });
// //     }
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     setShowUserMenu(false);
// //     navigate("/");
// //   };

// //   const handleProfile = () => {
// //     setShowUserMenu(false);
// //     navigate("/profile");
// //   };

// //   const handleAdmin = () => {
// //     setShowUserMenu(false);
// //     navigate("/admin");
// //   };

// //   if (isAuthPage) return null;

// //   const displayName = user?.nom || user?.user?.nom || "Utilisateur";
// //   const firstName = displayName.split(" ")[0];

// //   return (
// //     <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-lg z-50">
// //       <nav className="flex flex-col md:flex-row items-center justify-between px-6 md:px-8 py-4 gap-4 md:gap-0">
// //         {/* Logo */}
// //         <div className="flex items-center gap-3">
// //           <Link to="/">
// //             <motion.div
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //               className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl px-4 py-3 cursor-pointer text-center shadow-lg hover:shadow-xl transition-all duration-300"
// //             >
// //               <span className="block font-bold text-sm tracking-wide">
// //                 #Vakio_Boky
// //               </span>
// //               <span className="block text-xs font-light opacity-90">
// //                 {isLoggedIn ? "Connecté" : "Initiative"}
// //                 {isAdmin && " (Admin)"}
// //               </span>
// //             </motion.div>
// //           </Link>
// //         </div>

// //         {/* Navigation centrale */}
// //         <div className="flex flex-1 items-center flex-wrap justify-center gap-6 md:gap-8 text-gray-700 font-medium">
// //           {/* Recherche */}
// //           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
// //             <Input
// //               variant="primary"
// //               size="lg"
// //               placeholder="Rechercher des livres..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="min-w-[280px] bg-white/80 backdrop-blur-sm border-gray-300/80 focus:border-blue-500"
// //             />
// //           </motion.div>

// //           {/* Accueil */}
// //           {/* Liens publics uniquement si utilisateur NON connecté */}
// //           {!isLoggedIn && (
// //             <>
// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => scrollToSection("hero")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 <FiHome className="text-lg" /> Accueil
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => scrollToSection("features")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 Pourquoi nous choisir ?
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => scrollToSection("events")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 Événements
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => scrollToSection("about")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 A propos
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => scrollToSection("catalogue")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 Catalogue
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => scrollToSection("contact")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 Contact
// //               </motion.div>
// //             </>
// //           )}

// //           {/* Liens protégés pour utilisateurs connectés */}
// //           {isLoggedIn && (
// //             <>
// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => handleProtectedNavigation("/explore")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 <FiBookOpen className="text-lg" /> Explorer
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => handleProtectedNavigation("/marketplace")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 <FiShoppingCart className="text-lg" /> Marketplace
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => navigate("/calendar")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 <FiCalendar className="text-lg" /> Calendrier
// //               </motion.div>

// //               <motion.div
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => navigate("/fundraising")}
// //                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
// //               >
// //                 <FiHeart className="text-lg" /> Dons
// //               </motion.div>
// //             </>
// //           )}
// //         </div>

// //         {/* Section utilisateur */}
// //         <div className="flex items-center gap-4">
// //           {isLoggedIn && (
// //             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
// //               <NotificationBell />
// //             </motion.div>
// //           )}

// //           <div className="relative">
// //             {isLoggedIn ? (
// //               <>
// //                 <motion.button
// //                   whileHover={{ scale: 1.02 }}
// //                   whileTap={{ scale: 0.98 }}
// //                   onClick={() => setShowUserMenu(!showUserMenu)}
// //                   className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
// //                 >
// //                   <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-inner">
// //                     {displayName.charAt(0).toUpperCase()}
// //                   </div>
// //                   <div className="text-left">
// //                     <span className="text-base font-semibold block leading-tight">
// //                       {firstName.length > 12
// //                         ? firstName.slice(0, 12) + "..."
// //                         : firstName}
// //                     </span>
// //                     <span className="text-xs opacity-90 block leading-tight">
// //                       {isAdmin ? "Administrateur" : "Membre"}
// //                     </span>
// //                   </div>
// //                   {isAdmin && <div className="text-yellow-300 text-lg">👑</div>}
// //                 </motion.button>

// //                 {showUserMenu && (
// //                   <motion.div
// //                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
// //                     animate={{ opacity: 1, y: 0, scale: 1 }}
// //                     className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 py-3 z-50 overflow-hidden"
// //                   >
// //                     <button
// //                       onClick={handleProfile}
// //                       className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-left group"
// //                     >
// //                       <FiUser
// //                         size={18}
// //                         className="text-gray-400 group-hover:text-blue-600 transition-colors"
// //                       />
// //                       <span className="font-medium">Mon Profil</span>
// //                     </button>

// //                     {isAdmin && (
// //                       <>
// //                         <div className="border-t border-gray-200/60 my-1"></div>
// //                         <button
// //                           onClick={handleAdmin}
// //                           className="flex items-center gap-3 w-full px-4 py-3 text-purple-600 hover:bg-purple-50 transition-all duration-200 text-left group"
// //                         >
// //                           <FiSettings
// //                             size={18}
// //                             className="group-hover:rotate-90 transition-transform duration-300"
// //                           />
// //                           <span className="font-medium">Administration</span>
// //                         </button>
// //                       </>
// //                     )}

// //                     <div className="border-t border-gray-200/60 my-1"></div>

// //                     <button
// //                       onClick={handleLogout}
// //                       className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-left group"
// //                     >
// //                       <FiLogOut
// //                         size={18}
// //                         className="group-hover:scale-110 transition-transform"
// //                       />
// //                       <span className="font-medium">Déconnexion</span>
// //                     </button>
// //                   </motion.div>
// //                 )}
// //               </>
// //             ) : (
// //               <Link to="/login">
// //                 <Button
// //                   variant="primary"
// //                   size="lg"
// //                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3"
// //                 >
// //                   Se connecter
// //                 </Button>
// //               </Link>
// //             )}
// //           </div>
// //         </div>
// //       </nav>

// //       {showUserMenu && (
// //         <div
// //           className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
// //           onClick={() => setShowUserMenu(false)}
// //         />
// //       )}
// //     </header>
// //   );
// // }
// import { useState } from "react";
// import {
//   FiBell,
//   FiUser,
//   FiBookOpen,
//   FiShoppingCart,
//   FiHome,
//   FiCalendar,
//   FiHeart,
//   FiLogOut,
//   FiSettings,
//   FiTarget,
//   FiInfo,
//   FiMail,
//   FiBook,
//   FiStar,
// } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import Button from "@/components/ui/Button";
// import { useAuth } from "../../hooks/useAuth";
// import NotificationBell from "../../components/clubs/NotificationBell";

// export default function Header() {
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   const scrollToSection = (id) => {
//     const section = document.getElementById(id);
//     if (section) {
//       section.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const { user, logout, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isAuthPage = [
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/verify-code",
//     "/reset-password",
//   ].includes(location.pathname);
//   const isLoggedIn = !!user?.token && !isAuthPage;

//   const handleProtectedNavigation = (targetPath) => {
//     if (isLoggedIn) {
//       navigate(targetPath);
//     } else {
//       navigate("/login", {
//         state: {
//           from: targetPath,
//           message: "Connectez-vous pour accéder à cette page",
//         },
//       });
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setShowUserMenu(false);
//     navigate("/");
//   };

//   const handleProfile = () => {
//     setShowUserMenu(false);
//     navigate("/profile");
//   };

//   const handleAdmin = () => {
//     setShowUserMenu(false);
//     navigate("/admin");
//   };

//   if (isAuthPage) return null;

//   const displayName = user?.nom || user?.user?.nom || "Utilisateur";
//   const firstName = displayName.split(" ")[0];

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-lg z-50">
//       <nav className="flex items-center justify-between px-6 md:px-8 py-4">
//         {/* Logo */}
//         <div className="flex items-center gap-3">
//           <Link to="/">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl px-4 py-3 cursor-pointer text-center shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <span className="block font-bold text-sm tracking-wide">
//                 #Vakio_Boky
//               </span>
//               <span className="block text-xs font-light opacity-90">
//                 {isLoggedIn ? "Connecté" : "Initiative"}
//                 {isAdmin && " (Admin)"}
//               </span>
//             </motion.div>
//           </Link>
//         </div>

//         {/* Navigation centrale - Version simplifiée */}
//         <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
//           {!isLoggedIn ? (
//             // Liens pour visiteurs non connectés
//             <>
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => scrollToSection("hero")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiHome className="text-lg" /> Accueil
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => scrollToSection("features")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiStar className="text-lg" /> Avantages
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => scrollToSection("catalogue")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiBook className="text-lg" /> Catalogue
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => scrollToSection("auteur")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiMail className="text-lg" /> Nos auteurs
//               </motion.div>
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => scrollToSection("contact")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiMail className="text-lg" /> Contact
//               </motion.div>
//             </>
//           ) : (
//             // Liens pour utilisateurs connectés
//             <>
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleProtectedNavigation("/explore")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiBookOpen className="text-lg" /> Explorer
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleProtectedNavigation("/marketplace")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiShoppingCart className="text-lg" /> Marketplace
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate("/challenges")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiTarget className="text-lg" /> Défis
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate("/calendar")}
//                 className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
//               >
//                 <FiCalendar className="text-lg" /> Calendrier
//               </motion.div>
//             </>
//           )}
//         </div>

//         {/* Section utilisateur */}
//         <div className="flex items-center gap-4">
//           {isLoggedIn && (
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <NotificationBell />
//             </motion.div>
//           )}

//           <div className="relative">
//             {isLoggedIn ? (
//               <>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setShowUserMenu(!showUserMenu)}
//                   className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//                 >
//                   <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-inner">
//                     {displayName.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="text-left">
//                     <span className="text-base font-semibold block leading-tight">
//                       {firstName.length > 10
//                         ? firstName.slice(0, 10) + "..."
//                         : firstName}
//                     </span>
//                     <span className="text-xs opacity-90 block leading-tight">
//                       {isAdmin ? "Administrateur" : "Membre"}
//                     </span>
//                   </div>
//                   {isAdmin && <div className="text-yellow-300 text-lg">👑</div>}
//                 </motion.button>

//                 {showUserMenu && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 py-3 z-50 overflow-hidden"
//                   >
//                     <button
//                       onClick={handleProfile}
//                       className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-left group"
//                     >
//                       <FiUser
//                         size={18}
//                         className="text-gray-400 group-hover:text-blue-600 transition-colors"
//                       />
//                       <span className="font-medium">Mon Profil</span>
//                     </button>

//                     {isAdmin && (
//                       <>
//                         <div className="border-t border-gray-200/60 my-1"></div>
//                         <button
//                           onClick={handleAdmin}
//                           className="flex items-center gap-3 w-full px-4 py-3 text-purple-600 hover:bg-purple-50 transition-all duration-200 text-left group"
//                         >
//                           <FiSettings
//                             size={18}
//                             className="group-hover:rotate-90 transition-transform duration-300"
//                           />
//                           <span className="font-medium">Administration</span>
//                         </button>
//                       </>
//                     )}

//                     <div className="border-t border-gray-200/60 my-1"></div>

//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-left group"
//                     >
//                       <FiLogOut
//                         size={18}
//                         className="group-hover:scale-110 transition-transform"
//                       />
//                       <span className="font-medium">Déconnexion</span>
//                     </button>
//                   </motion.div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login">
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3"
//                 >
//                   <FiUser size={18} />
//                   Se connecter
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </nav>

//       {showUserMenu && (
//         <div
//           className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
//           onClick={() => setShowUserMenu(false)}
//         />
//       )}
//     </header>
//   );
// }
import { useState } from "react";
import {
  FiUser,
  FiBookOpen,
  FiShoppingCart,
  FiHome,
  FiCalendar,
  FiLogOut,
  FiSettings,
  FiTarget,
  FiBook,
  FiStar,
  FiUsers,
  FiMail,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../../components/clubs/NotificationBell";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-code",
    "/reset-password",
  ].includes(location.pathname);
  const isLoggedIn = !!user?.token && !isAuthPage;

  const handleProtectedNavigation = (targetPath) => {
    if (isLoggedIn) {
      navigate(targetPath);
    } else {
      navigate("/login", {
        state: {
          from: targetPath,
          message: "Connectez-vous pour accéder à cette page",
        },
      });
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    navigate("/profile");
  };

  const handleAdmin = () => {
    setShowUserMenu(false);
    navigate("/admin");
  };

  if (isAuthPage) return null;

  const displayName = user?.nom || user?.user?.nom || "Utilisateur";
  const firstName = displayName.split(" ")[0];

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-lg z-50">
      <nav className="flex items-center justify-between px-6 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl px-4 py-3 cursor-pointer text-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="block font-bold text-sm tracking-wide">
                #Vakio_Boky
              </span>
              <span className="block text-xs font-light opacity-90">
                {isLoggedIn ? "Connecté" : "Initiative"}
                {isAdmin && " (Admin)"}
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Navigation centrale - Version simplifiée */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {!isLoggedIn ? (
            // Liens pour visiteurs non connectés
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("hero")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiHome className="text-lg" /> Accueil
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("features")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiStar className="text-lg" /> Avantages
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("catalogue")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiBook className="text-lg" /> Catalogue
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("auteur")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiUsers className="text-lg" /> Nos auteurs
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("contact")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiMail className="text-lg" /> Contact
              </motion.div>
            </>
          ) : (
            // Liens pour utilisateurs connectés
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleProtectedNavigation("/explore")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiBookOpen className="text-lg" /> Explorer
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleProtectedNavigation("/marketplace")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiShoppingCart className="text-lg" /> Marketplace
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/challenges")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiTarget className="text-lg" /> Défis
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/calendar")}
                className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FiCalendar className="text-lg" /> Calendrier
              </motion.div>
            </>
          )}
        </div>

        {/* Section utilisateur */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <div className="relative">
              {/* Wrapper avec position relative pour NotificationBell */}
              <NotificationBell />
            </div>
          )}

          <div className="relative">
            {isLoggedIn ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-inner">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <span className="text-base font-semibold block leading-tight">
                      {firstName.length > 10
                        ? firstName.slice(0, 10) + "..."
                        : firstName}
                    </span>
                    <span className="text-xs opacity-90 block leading-tight">
                      {isAdmin ? "Administrateur" : "Membre"}
                    </span>
                  </div>
                  {isAdmin && <div className="text-yellow-300 text-lg">👑</div>}
                </motion.button>

                {showUserMenu && (
                  <>
                    {/* Overlay pour fermer le menu */}
                    <div
                      className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    {/* Menu utilisateur */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 py-3 z-50 overflow-hidden"
                    >
                      <button
                        onClick={handleProfile}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-left group"
                      >
                        <FiUser
                          size={18}
                          className="text-gray-400 group-hover:text-blue-600 transition-colors"
                        />
                        <span className="font-medium">Mon Profil</span>
                      </button>

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-200/60 my-1"></div>
                          <button
                            onClick={handleAdmin}
                            className="flex items-center gap-3 w-full px-4 py-3 text-purple-600 hover:bg-purple-50 transition-all duration-200 text-left group"
                          >
                            <FiSettings
                              size={18}
                              className="group-hover:rotate-90 transition-transform duration-300"
                            />
                            <span className="font-medium">Administration</span>
                          </button>
                        </>
                      )}

                      <div className="border-t border-gray-200/60 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-left group"
                      >
                        <FiLogOut
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="font-medium">Déconnexion</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3"
                >
                  <FiUser size={18} />
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}