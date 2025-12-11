// // // import { useState, useEffect } from "react";
// // // import { useAuth } from "../../hooks/useAuth";
// // // import { useProfileStatistics } from "../../hooks/useProfileStatistics";
// // // import Button from "../../components/ui/Button";
// // // import ProfileEditModal from "../../components/modales/ProfileEditModal";
// // // import {
// // //   FiUser,
// // //   FiMail,
// // //   FiPhone,
// // //   FiBook,
// // //   FiUsers,
// // //   FiCalendar,
// // //   FiHeart,
// // //   FiMessageCircle,
// // //   FiEdit,
// // //   FiCamera,
// // //   FiLoader,
// // //   FiTrendingUp,
// // //   FiAward,
// // // } from "react-icons/fi";

// // // export default function Profile() {
// // //   const { user, isAuthenticated } = useAuth();
// // //   const { statistics, loading: statsLoading, error: statsError } = useProfileStatistics();
// // //   const [profileData, setProfileData] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

// // //   // Fetch user profile data
// // //   useEffect(() => {
// // //     const fetchProfile = async () => {
// // //       if (!isAuthenticated || !user?.token) {
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       try {
// // //         const response = await fetch("https://vakio-boky-backend.onrender.com/api/profile", {
// // //           headers: {
// // //             Authorization: `Bearer ${user.token}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //         });

// // //         const data = await response.json();

// // //         if (data.user) {
// // //           setProfileData(data.user);
// // //         } else {
// // //           setError(data.error || "Erreur lors du chargement du profil");
// // //         }
// // //       } catch (err) {
// // //         console.error("Erreur chargement profil:", err);
// // //         setError("Impossible de se connecter au serveur");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchProfile();
// // //   }, [isAuthenticated, user]);

// // //   // Handle profile update
// // //   const handleProfileUpdate = (updatedProfile) => {
// // //     setProfileData(updatedProfile);
// // //   };

// // //   // Handle edit button click
// // //   const handleEditClick = () => {
// // //     setIsEditModalOpen(true);
// // //   };

// // //   if (loading || statsLoading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="text-center">
// // //           <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
// // //           <p className="text-gray-600">Chargement de votre profil...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!isAuthenticated) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="text-center">
// // //           <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
// // //           <h2 className="text-2xl font-bold text-gray-800 mb-2">
// // //             Connexion requise
// // //           </h2>
// // //           <p className="text-gray-600 mb-6">
// // //             Veuillez vous connecter pour accéder à votre profil.
// // //           </p>
// // //           <Button variant="primary" onClick={() => window.location.href = "/login"}>
// // //             Se connecter
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error || statsError) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="text-center">
// // //           <div className="text-red-500 text-6xl mb-4">⚠️</div>
// // //           <h2 className="text-2xl font-bold text-gray-800 mb-2">
// // //             Erreur de chargement
// // //           </h2>
// // //           <p className="text-gray-600 mb-6">
// // //             {error || statsError}
// // //           </p>
// // //           <Button variant="primary" onClick={() => window.location.reload()}>
// // //             Réessayer
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const statCards = [
// // //     {
// // //       icon: <FiBook className="text-blue-600" />,
// // //       title: "Posts publiés",
// // //       value: statistics.postsCount,
// // //       color: "bg-blue-50",
// // //     },
// // //     {
// // //       icon: <FiHeart className="text-red-600" />,
// // //       title: "Likes reçus",
// // //       value: statistics.likesReceivedCount,
// // //       color: "bg-red-50",
// // //     },
// // //     {
// // //       icon: <FiMessageCircle className="text-green-600" />,
// // //       title: "Commentaires",
// // //       value: statistics.commentsMadeCount,
// // //       color: "bg-green-50",
// // //     },
// // //     {
// // //       icon: <FiUsers className="text-purple-600" />,
// // //       title: "Clubs rejoints",
// // //       value: statistics.clubsJoinedCount,
// // //       color: "bg-purple-50",
// // //     },
// // //     {
// // //       icon: <FiCalendar className="text-orange-600" />,
// // //       title: "Événements",
// // //       value: statistics.eventsRegisteredCount,
// // //       color: "bg-orange-50",
// // //     },
// // //     {
// // //       icon: <FiAward className="text-yellow-600" />,
// // //       title: "Livres publiés",
// // //       value: statistics.booksPublishedCount,
// // //       color: "bg-yellow-50",
// // //     },
// // //     {
// // //       icon: <FiTrendingUp className="text-indigo-600" />,
// // //       title: "Extraits créés",
// // //       value: statistics.excerptsCreatedCount,
// // //       color: "bg-indigo-50",
// // //     },
// // //     {
// // //       icon: <FiBook className="text-teal-600" />,
// // //       title: "Livres lus",
// // //       value: statistics.booksReadCount,
// // //       color: "bg-teal-50",
// // //     },
// // //     {
// // //       icon: <FiTrendingUp className="text-cyan-600" />,
// // //       title: "Temps de lecture (min)",
// // //       value: statistics.totalReadingTime,
// // //       color: "bg-cyan-50",
// // //     },
// // //     {
// // //       icon: <FiBook className="text-emerald-600" />,
// // //       title: "Pages lues",
// // //       value: statistics.totalPagesRead,
// // //       color: "bg-emerald-50",
// // //     },
// // //   ];

// // //   return (
// // //     <div className="max-w-6xl mx-auto space-y-8">
// // //       {/* Profile Header */}
// // //       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
// // //         <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
// // //         <div className="px-8 pb-8">
// // //           <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
// // //             <div className="relative">
// // //               <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
// // //                 {profileData?.photo_profil ? (
// // //                   <img
// // //                     src={`https://vakio-boky-backend.onrender.com${profileData.photo_profil}`}
// // //                     alt="Photo de profil"
// // //                     className="w-full h-full object-cover"
// // //                   />
// // //                 ) : (
// // //                   <FiUser className="text-4xl text-gray-400" />
// // //                 )}
// // //               </div>
// // //               <button
// // //                 onClick={handleEditClick}
// // //                 className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
// // //               >
// // //                 <FiCamera className="text-sm" />
// // //               </button>
// // //             </div>
// // //             <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
// // //               <h1 className="text-3xl font-bold text-gray-900 mb-2">
// // //                 {profileData?.nom}
// // //               </h1>
// // //               <p className="text-gray-600 mb-2">
// // //                 Membre depuis {profileData?.created_at ? new Date(profileData.created_at).getFullYear() : 'N/A'}
// // //               </p>
// // //               {profileData?.bio && (
// // //                 <p className="text-gray-700 max-w-md">{profileData.bio}</p>
// // //               )}
// // //             </div>
// // //             <div className="md:ml-auto mt-4 md:mt-0">
// // //               <Button
// // //                 variant="outline"
// // //                 className="flex items-center gap-2"
// // //                 onClick={handleEditClick}
// // //               >
// // //                 <FiEdit className="text-sm" />
// // //                 Modifier le profil
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {/* Profile Info */}
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// // //             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// // //               <FiMail className="text-blue-600" />
// // //               <div>
// // //                 <p className="text-sm text-gray-500">Email</p>
// // //                 <p className="font-medium">{profileData?.email}</p>
// // //               </div>
// // //             </div>
// // //             {profileData?.telephone && (
// // //               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// // //                 <FiPhone className="text-green-600" />
// // //                 <div>
// // //                   <p className="text-sm text-gray-500">Téléphone</p>
// // //                   <p className="font-medium">{profileData.telephone}</p>
// // //                 </div>
// // //               </div>
// // //             )}
// // //             {profileData?.genre_prefere && (
// // //               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// // //                 <FiBook className="text-purple-600" />
// // //                 <div>
// // //                   <p className="text-sm text-gray-500">Genre préféré</p>
// // //                   <p className="font-medium">{profileData.genre_prefere}</p>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Statistics Section */}
// // //       <div className="bg-white rounded-2xl shadow-lg p-8">
// // //         <div className="flex items-center gap-3 mb-6">
// // //           <FiTrendingUp className="text-2xl text-blue-600" />
// // //           <h2 className="text-2xl font-bold text-gray-900">Vos statistiques</h2>
// // //         </div>

// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// // //           {statCards.map((stat, index) => (
// // //             <div
// // //               key={index}
// // //               className={`${stat.color} p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow`}
// // //             >
// // //               <div className="flex items-center justify-between mb-4">
// // //                 <div className="text-2xl">{stat.icon}</div>
// // //                 <div className="text-3xl font-bold text-gray-900">
// // //                   {stat.value}
// // //                 </div>
// // //               </div>
// // //               <h3 className="text-sm font-medium text-gray-600">
// // //                 {stat.title}
// // //               </h3>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Achievement Message */}
// // //         <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
// // //           <div className="flex items-center gap-3">
// // //             <FiAward className="text-yellow-600 text-2xl" />
// // //             <div>
// // //               <h3 className="font-bold text-gray-900 mb-1">
// // //                 Félicitations pour votre engagement !
// // //               </h3>
// // //               <p className="text-gray-700 text-sm">
// // //                 Vous avez contribué activement à la communauté Vakio Boky.
// // //                 Continuez à partager votre passion pour la littérature !
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Recent Activity Placeholder */}
// // //       {/* <div className="bg-white rounded-2xl shadow-lg p-8">
// // //         <h2 className="text-2xl font-bold text-gray-900 mb-6">
// // //           Activité récente
// // //         </h2> */}
// // //         {/* <div className="text-center py-12">
// // //           <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
// // //           <p className="text-gray-600">
// // //             Fonctionnalité d'activité récente à venir...
// // //           </p>
// // //         </div> */}
// // //       {/* </div> */}

// // //       {/* Profile Edit Modal */}
// // //       <ProfileEditModal
// // //         isOpen={isEditModalOpen}
// // //         onClose={() => setIsEditModalOpen(false)}
// // //         profileData={profileData}
// // //         onProfileUpdate={handleProfileUpdate}
// // //       />
// // //     </div>
// // //   );
// // // }
// // import { useState, useEffect } from "react";
// // import { useAuth } from "../../hooks/useAuth";
// // import { useProfileStatistics } from "../../hooks/useProfileStatistics";
// // import Button from "../../components/ui/Button";
// // import ProfileEditModal from "../../components/modales/ProfileEditModal";
// // import {
// //   FiUser,
// //   FiMail,
// //   FiPhone,
// //   FiBook,
// //   FiUsers,
// //   FiCalendar,
// //   FiHeart,
// //   FiMessageCircle,
// //   FiEdit,
// //   FiCamera,
// //   FiLoader,
// //   FiTrendingUp,
// //   FiAward,
// // } from "react-icons/fi";

// // // CORRIGÉ : Fonction pour gérer les URLs d'images
// // const getProfileImageUrl = (imageUrl) => {
// //   if (!imageUrl) return null;
  
// //   // Si c'est déjà une URL complète (http/https)
// //   if (imageUrl.startsWith('http')) {
// //     return imageUrl;
// //   }
  
// //   // Si c'est un chemin relatif sans slash
// //   if (!imageUrl.startsWith('/')) {
// //     return `/uploads/profiles/${imageUrl}`;
// //   }
  
// //   // Si c'est un chemin relatif avec uploads/profiles
// //   if (imageUrl.includes('uploads/profiles')) {
// //     // Vérifier s'il y a un double chemin
// //     if (imageUrl.includes('//uploads/')) {
// //       // Extraire juste le nom de fichier
// //       const filename = imageUrl.split('/').pop();
// //       return `/uploads/profiles/${filename}`;
// //     }
// //     return imageUrl;
// //   }
  
// //   // Par défaut
// //   return imageUrl;
// // };

// // export default function Profile() {
// //   const { user, isAuthenticated } = useAuth();
// //   const { statistics, loading: statsLoading, error: statsError } = useProfileStatistics();
// //   const [profileData, setProfileData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

// //   // Fetch user profile data
// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       if (!isAuthenticated || !user?.token) {
// //         setLoading(false);
// //         return;
// //       }

// //       try {
// //         const response = await fetch("https://vakio-boky-backend.onrender.com/api/profile", {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //             "Content-Type": "application/json",
// //           },
// //         });

// //         const data = await response.json();

// //         if (data.user) {
// //           // CORRIGÉ : Nettoyer l'URL de l'image
// //           const cleanedUser = {
// //             ...data.user,
// //             photo_profil: getProfileImageUrl(data.user.photo_profil)
// //           };
// //           setProfileData(cleanedUser);
// //         } else {
// //           setError(data.error || "Erreur lors du chargement du profil");
// //         }
// //       } catch (err) {
// //         console.error("Erreur chargement profil:", err);
// //         setError("Impossible de se connecter au serveur");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProfile();
// //   }, [isAuthenticated, user]);

// //   // Handle profile update
// //   const handleProfileUpdate = (updatedProfile) => {
// //     // CORRIGÉ : Nettoyer l'URL de l'image
// //     const cleanedProfile = {
// //       ...updatedProfile,
// //       photo_profil: getProfileImageUrl(updatedProfile.photo_profil)
// //     };
// //     setProfileData(cleanedProfile);
// //   };

// //   // Handle edit button click
// //   const handleEditClick = () => {
// //     setIsEditModalOpen(true);
// //   };

// //   if (loading || statsLoading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
// //           <p className="text-gray-600">Chargement de votre profil...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!isAuthenticated) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-800 mb-2">
// //             Connexion requise
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             Veuillez vous connecter pour accéder à votre profil.
// //           </p>
// //           <Button variant="primary" onClick={() => window.location.href = "/login"}>
// //             Se connecter
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error || statsError) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="text-red-500 text-6xl mb-4">⚠️</div>
// //           <h2 className="text-2xl font-bold text-gray-800 mb-2">
// //             Erreur de chargement
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             {error || statsError}
// //           </p>
// //           <Button variant="primary" onClick={() => window.location.reload()}>
// //             Réessayer
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const statCards = [
// //     {
// //       icon: <FiBook className="text-blue-600" />,
// //       title: "Posts publiés",
// //       value: statistics.postsCount,
// //       color: "bg-blue-50",
// //     },
// //     {
// //       icon: <FiHeart className="text-red-600" />,
// //       title: "Likes reçus",
// //       value: statistics.likesReceivedCount,
// //       color: "bg-red-50",
// //     },
// //     {
// //       icon: <FiMessageCircle className="text-green-600" />,
// //       title: "Commentaires",
// //       value: statistics.commentsMadeCount,
// //       color: "bg-green-50",
// //     },
// //     {
// //       icon: <FiUsers className="text-purple-600" />,
// //       title: "Clubs rejoints",
// //       value: statistics.clubsJoinedCount,
// //       color: "bg-purple-50",
// //     },
// //     {
// //       icon: <FiCalendar className="text-orange-600" />,
// //       title: "Événements",
// //       value: statistics.eventsRegisteredCount,
// //       color: "bg-orange-50",
// //     },
// //     {
// //       icon: <FiAward className="text-yellow-600" />,
// //       title: "Livres publiés",
// //       value: statistics.booksPublishedCount,
// //       color: "bg-yellow-50",
// //     },
// //     {
// //       icon: <FiTrendingUp className="text-indigo-600" />,
// //       title: "Extraits créés",
// //       value: statistics.excerptsCreatedCount,
// //       color: "bg-indigo-50",
// //     },
// //     {
// //       icon: <FiBook className="text-teal-600" />,
// //       title: "Livres lus",
// //       value: statistics.booksReadCount,
// //       color: "bg-teal-50",
// //     },
// //     {
// //       icon: <FiTrendingUp className="text-cyan-600" />,
// //       title: "Temps de lecture (min)",
// //       value: statistics.totalReadingTime,
// //       color: "bg-cyan-50",
// //     },
// //     {
// //       icon: <FiBook className="text-emerald-600" />,
// //       title: "Pages lues",
// //       value: statistics.totalPagesRead,
// //       color: "bg-emerald-50",
// //     },
// //   ];

// //   return (
// //     <div className="max-w-6xl mx-auto space-y-8">
// //       {/* Profile Header */}
// //       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
// //         <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
// //         <div className="px-8 pb-8">
// //           <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
// //             <div className="relative">
// //               <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
// //                 {profileData?.photo_profil ? (
// //                   <img
// //                     src={profileData.photo_profil}
// //                     alt="Photo de profil"
// //                     className="w-full h-full object-cover"
// //                     onError={(e) => {
// //                       e.target.onerror = null;
// //                       e.target.style.display = 'none';
// //                       // Afficher une icône par défaut
// //                       const icon = document.createElement('div');
// //                       icon.className = 'w-full h-full flex items-center justify-center bg-gray-100';
// //                       icon.innerHTML = '<FiUser className="text-4xl text-gray-400" />';
// //                       e.target.parentNode.appendChild(icon);
// //                     }}
// //                   />
// //                 ) : (
// //                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                     <FiUser className="text-4xl text-gray-400" />
// //                   </div>
// //                 )}
// //               </div>
// //               <button
// //                 onClick={handleEditClick}
// //                 className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
// //               >
// //                 <FiCamera className="text-sm" />
// //               </button>
// //             </div>
// //             <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
// //               <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //                 {profileData?.nom}
// //               </h1>
// //               <p className="text-gray-600 mb-2">
// //                 Membre depuis {profileData?.created_at ? new Date(profileData.created_at).getFullYear() : 'N/A'}
// //               </p>
// //               {profileData?.bio && (
// //                 <p className="text-gray-700 max-w-md">{profileData.bio}</p>
// //               )}
// //             </div>
// //             <div className="md:ml-auto mt-4 md:mt-0">
// //               <Button
// //                 variant="outline"
// //                 className="flex items-center gap-2"
// //                 onClick={handleEditClick}
// //               >
// //                 <FiEdit className="text-sm" />
// //                 Modifier le profil
// //               </Button>
// //             </div>
// //           </div>

// //           {/* Profile Info */}
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// //             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// //               <FiMail className="text-blue-600" />
// //               <div>
// //                 <p className="text-sm text-gray-500">Email</p>
// //                 <p className="font-medium">{profileData?.email}</p>
// //               </div>
// //             </div>
// //             {profileData?.telephone && (
// //               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// //                 <FiPhone className="text-green-600" />
// //                 <div>
// //                   <p className="text-sm text-gray-500">Téléphone</p>
// //                   <p className="font-medium">{profileData.telephone}</p>
// //                 </div>
// //               </div>
// //             )}
// //             {profileData?.genre_prefere && (
// //               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// //                 <FiBook className="text-purple-600" />
// //                 <div>
// //                   <p className="text-sm text-gray-500">Genre préféré</p>
// //                   <p className="font-medium">{profileData.genre_prefere}</p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Statistics Section */}
// //       <div className="bg-white rounded-2xl shadow-lg p-8">
// //         <div className="flex items-center gap-3 mb-6">
// //           <FiTrendingUp className="text-2xl text-blue-600" />
// //           <h2 className="text-2xl font-bold text-gray-900">Vos statistiques</h2>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //           {statCards.map((stat, index) => (
// //             <div
// //               key={index}
// //               className={`${stat.color} p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow`}
// //             >
// //               <div className="flex items-center justify-between mb-4">
// //                 <div className="text-2xl">{stat.icon}</div>
// //                 <div className="text-3xl font-bold text-gray-900">
// //                   {stat.value}
// //                 </div>
// //               </div>
// //               <h3 className="text-sm font-medium text-gray-600">
// //                 {stat.title}
// //               </h3>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Achievement Message */}
// //         <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
// //           <div className="flex items-center gap-3">
// //             <FiAward className="text-yellow-600 text-2xl" />
// //             <div>
// //               <h3 className="font-bold text-gray-900 mb-1">
// //                 Félicitations pour votre engagement !
// //               </h3>
// //               <p className="text-gray-700 text-sm">
// //                 Vous avez contribué activement à la communauté Vakio Boky.
// //                 Continuez à partager votre passion pour la littérature !
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Profile Edit Modal */}
// //       <ProfileEditModal
// //         isOpen={isEditModalOpen}
// //         onClose={() => setIsEditModalOpen(false)}
// //         profileData={profileData}
// //         onProfileUpdate={handleProfileUpdate}
// //       />
// //     </div>
// //   );
// // }
// import { useState, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useProfileStatistics } from "../../hooks/useProfileStatistics";
// import Button from "../../components/ui/Button";
// import ProfileEditModal from "../../components/modales/ProfileEditModal";
// import { getProfileImageUrl } from "../../utils/imageUtils"; // IMPORTANT
// import {
//   FiUser,
//   FiMail,
//   FiPhone,
//   FiBook,
//   FiUsers,
//   FiCalendar,
//   FiHeart,
//   FiMessageCircle,
//   FiEdit,
//   FiCamera,
//   FiLoader,
//   FiTrendingUp,
//   FiAward,
// } from "react-icons/fi";

// export default function Profile() {
//   const { user, isAuthenticated } = useAuth();
//   const { statistics, loading: statsLoading, error: statsError } = useProfileStatistics();
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   // Fetch user profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!isAuthenticated || !user?.token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch("https://vakio-boky-backend.onrender.com/api/profile", {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await response.json();

//         if (data.user) {
//           setProfileData(data.user);
//         } else {
//           setError(data.error || "Erreur lors du chargement du profil");
//         }
//       } catch (err) {
//         console.error("Erreur chargement profil:", err);
//         setError("Impossible de se connecter au serveur");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [isAuthenticated, user]);

//   // Handle profile update
//   const handleProfileUpdate = (updatedProfile) => {
//     setProfileData(updatedProfile);
//   };

//   // Handle edit button click
//   const handleEditClick = () => {
//     setIsEditModalOpen(true);
//   };

//   if (loading || statsLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Chargement de votre profil...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Connexion requise
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Veuillez vous connecter pour accéder à votre profil.
//           </p>
//           <Button variant="primary" onClick={() => window.location.href = "/login"}>
//             Se connecter
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (error || statsError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Erreur de chargement
//           </h2>
//           <p className="text-gray-600 mb-6">
//             {error || statsError}
//           </p>
//           <Button variant="primary" onClick={() => window.location.reload()}>
//             Réessayer
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Utiliser la fonction utilitaire pour obtenir l'URL sécurisée
//   const profileImageUrl = getProfileImageUrl(profileData?.photo_profil);

//   // ... reste du code inchangé ...

//   return (
//     <div className="max-w-6xl mx-auto space-y-8">
//       {/* Profile Header */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
//         <div className="px-8 pb-8">
//           <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
//             <div className="relative">
//               <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
//                 <img
//                   src={profileImageUrl}
//                   alt="Photo de profil"
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "/assets/images/profiles/profile-default.png";
//                   }}
//                 />
//               </div>
//               {/* ... reste du code ... */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProfileStatistics } from "../../hooks/useProfileStatistics";
import Button from "../../components/ui/Button";
import ProfileEditModal from "../../components/modales/ProfileEditModal";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiMessageCircle,
  FiEdit,
  FiCamera,
  FiLoader,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

// Fonction utilitaire SIMPLIFIÉE pour obtenir l'URL de l'image de profil
const getProfileImageUrl = (imageUrl) => {
  // Si pas d'image ou image null, retourner null pour que le frontend puisse gérer
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'NULL' || imageUrl.trim() === '') {
    return null;
  }
  
  // Si c'est déjà une URL complète (http/https)
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si c'est un chemin relatif qui commence par /uploads/
  if (imageUrl.startsWith('/uploads/')) {
    // Si le chemin contient un double slash, le corriger
    if (imageUrl.includes('//uploads/')) {
      const filename = imageUrl.split('/').pop();
      return `/uploads/profiles/${filename}`;
    }
    return imageUrl;
  }
  
  // Si c'est juste un nom de fichier sans chemin
  return `/uploads/profiles/${imageUrl}`;
};

// Fonction pour obtenir une URL d'image sécurisée avec fallback
const getSafeProfileImage = (imageUrl) => {
  const url = getProfileImageUrl(imageUrl);
  // Si url est null, retourner null (optionnel - le frontend gère le fallback)
  return url;
};

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { statistics, loading: statsLoading, error: statsError } = useProfileStatistics();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user?.token) {
        setLoading(false);
        setError("Non authentifié");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("https://vakio-boky-backend.onrender.com/api/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        // Vérifier si la réponse est OK
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.user) {
          // Nettoyer l'URL de l'image de profil - peut être null
          const cleanedUser = {
            ...data.user,
            photo_profil: getSafeProfileImage(data.user.photo_profil)
          };
          setProfileData(cleanedUser);
        } else {
          setError(data.error || "Erreur lors du chargement du profil");
        }
      } catch (err) {
        console.error("Erreur chargement profil:", err);
        setError(err.message || "Impossible de se connecter au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user]);

  // Handle profile update
  const handleProfileUpdate = (updatedProfile) => {
    // Nettoyer l'URL de l'image - peut être null
    const cleanedProfile = {
      ...updatedProfile,
      photo_profil: getSafeProfileImage(updatedProfile.photo_profil)
    };
    setProfileData(cleanedProfile);
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Formatage de la date - rendu sécurisé
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.getFullYear();
    } catch {
      return 'N/A';
    }
  };

  const statCards = [
    {
      icon: <FiBook className="text-blue-600" />,
      title: "Posts publiés",
      value: statistics?.postsCount || 0,
      color: "bg-blue-50",
    },
    {
      icon: <FiHeart className="text-red-600" />,
      title: "Likes reçus",
      value: statistics?.likesReceivedCount || 0,
      color: "bg-red-50",
    },
    {
      icon: <FiMessageCircle className="text-green-600" />,
      title: "Commentaires",
      value: statistics?.commentsMadeCount || 0,
      color: "bg-green-50",
    },
    {
      icon: <FiUsers className="text-purple-600" />,
      title: "Clubs rejoints",
      value: statistics?.clubsJoinedCount || 0,
      color: "bg-purple-50",
    },
    {
      icon: <FiCalendar className="text-orange-600" />,
      title: "Événements",
      value: statistics?.eventsRegisteredCount || 0,
      color: "bg-orange-50",
    },
    {
      icon: <FiAward className="text-yellow-600" />,
      title: "Livres publiés",
      value: statistics?.booksPublishedCount || 0,
      color: "bg-yellow-50",
    },
    {
      icon: <FiTrendingUp className="text-indigo-600" />,
      title: "Extraits créés",
      value: statistics?.excerptsCreatedCount || 0,
      color: "bg-indigo-50",
    },
    {
      icon: <FiBook className="text-teal-600" />,
      title: "Livres lus",
      value: statistics?.booksReadCount || 0,
      color: "bg-teal-50",
    },
    {
      icon: <FiTrendingUp className="text-cyan-600" />,
      title: "Temps de lecture (min)",
      value: statistics?.totalReadingTime || 0,
      color: "bg-cyan-50",
    },
    {
      icon: <FiBook className="text-emerald-600" />,
      title: "Pages lues",
      value: statistics?.totalPagesRead || 0,
      color: "bg-emerald-50",
    },
  ];

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Connexion requise
          </h2>
          <p className="text-gray-600 mb-6">
            Veuillez vous connecter pour accéder à votre profil.
          </p>
          <Button variant="primary" onClick={() => window.location.href = "/login"}>
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  if (error || statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {error || statsError}
          </p>
          <div className="space-x-4">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Si pas de profileData mais pas d'erreur non plus (cas limite)
  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profil non disponible
          </h2>
          <p className="text-gray-600 mb-6">
            Impossible de charger les données de votre profil.
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
            {/* <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {profileData?.photo_profil ? (
                  <img
                    src={profileData.photo_profil}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <span class="text-3xl font-bold text-gray-400">
                            ${profileData?.nom?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <span className="text-4xl font-bold text-blue-600">
                      {profileData?.nom?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div> 
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Modifier la photo de profil"
              >
                <FiCamera className="text-sm" />
              </button>
            </div>*/}
            <div className="relative">
  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
    {/* Solution SÛRE : vérifier si l'URL existe VRAIMENT avant d'afficher l'image */}
    {profileData?.photo_profil ? (
      <img
        src={profileData.photo_profil}
        alt={`Photo de ${profileData?.nom || 'profil'}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Si l'image échoue, on la cache simplement
          e.target.style.display = 'none';
        }}
      />
    ) : null}
    
    {/* Avatar par défaut TOUJOURS présent (au cas où l'image échoue ou n'existe pas) */}
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 absolute inset-0">
      <span className="text-4xl font-bold text-blue-600">
        {profileData?.nom?.charAt(0)?.toUpperCase() || 'U'}
      </span>
    </div>
  </div>
  <button
    onClick={handleEditClick}
    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
  >
    <FiCamera className="text-sm" />
  </button>
</div>
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileData?.nom || "Utilisateur"}
              </h1>
              <p className="text-gray-600 mb-2">
                Membre depuis {formatDate(profileData?.created_at)}
              </p>
              {profileData?.bio && (
                <p className="text-gray-700 max-w-md">{profileData.bio}</p>
              )}
            </div>
            <div className="md:ml-auto mt-4 md:mt-0">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleEditClick}
              >
                <FiEdit className="text-sm" />
                Modifier le profil
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiMail className="text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500 truncate">Email</p>
                <p className="font-medium truncate">{profileData?.email || "Non renseigné"}</p>
              </div>
            </div>
            
            {profileData?.telephone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiPhone className="text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 truncate">Téléphone</p>
                  <p className="font-medium truncate">{profileData.telephone}</p>
                </div>
              </div>
            )}
            
            {profileData?.genre_prefere && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiBook className="text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 truncate">Genre préféré</p>
                  <p className="font-medium truncate">{profileData.genre_prefere}</p>
                </div>
              </div>
            )}
            
            {profileData?.role && profileData.role !== 'user' && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiUser className="text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 truncate">Rôle</p>
                  <p className="font-medium truncate capitalize">{profileData.role}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Newsletter subscription */}
          {profileData?.accepte_newsletter !== undefined && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${profileData.accepte_newsletter ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">
                  {profileData.accepte_newsletter 
                    ? "✓ Abonné à la newsletter" 
                    : "✗ Non abonné à la newsletter"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <FiTrendingUp className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Vos statistiques</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} p-4 sm:p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="text-xl sm:text-2xl">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Summary statistics */}
        {statistics && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Activité totale</p>
              <p className="text-2xl font-bold text-gray-900">
                {((statistics.postsCount || 0) + (statistics.commentsMadeCount || 0) + (statistics.booksPublishedCount || 0)).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Engagement</p>
              <p className="text-2xl font-bold text-gray-900">
                {((statistics.clubsJoinedCount || 0) + (statistics.eventsRegisteredCount || 0)).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Lecture</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.booksReadCount || 0} livres
              </p>
            </div>
          </div>
        )}

        {/* Achievement Message */}
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
          <div className="flex items-start gap-3">
            <FiAward className="text-yellow-600 text-2xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Félicitations pour votre engagement !
              </h3>
              <p className="text-gray-700 text-sm">
                Vous avez contribué activement à la communauté Vakio Boky.
                Continuez à partager votre passion pour la littérature !
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {profileData && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileData}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}