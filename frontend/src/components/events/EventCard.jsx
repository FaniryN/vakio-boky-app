// import { motion } from 'framer-motion';
// import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
// import Button from '@/components/ui/Button';

// export default function EventCard({ event, onRegister, user }) {
//   const eventDate = new Date(event.event_date);
//   const now = new Date();
//   const isPast = eventDate < now;
//   const isRegistered = user && event.registrations?.some(reg => reg.user_id === user.id);

//   const formatDate = (date) => {
//     return new Intl.DateTimeFormat('fr-FR', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };

//   const getSpotsLeft = () => {
//     if (!event.max_participants) return 'Illimité';
//     const spotsLeft = event.max_participants - (event.registered_count || 0);
//     return `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} disponible${spotsLeft > 1 ? 's' : ''}`;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
//     >
//       {/* Image */}
//       <div className="h-48 bg-gray-200 relative">
//         {event.image_url ? (
//           <img
//             src={event.image_url}
//             alt={event.title}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
//             <FiCalendar className="text-4xl text-purple-600" />
//           </div>
//         )}
        
//         {/* Badge date */}
//         <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full shadow-sm">
//           <span className="text-sm font-semibold text-purple-600 flex items-center gap-1">
//             <FiCalendar size={14} />
//             {formatDate(eventDate)}
//           </span>
//         </div>

//         {/* Badge prix */}
//         {event.price > 0 && (
//           <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm">
//             <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
//               {/* <FiEuro size={14} /> */}
//               {event.price} €
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Contenu */}
//       <div className="p-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
//           {event.title}
//         </h3>
        
//         <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//           {event.description}
//         </p>

//         {/* Infos */}
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <FiMapPin className="text-red-500" />
//             <span>{event.location}</span>
//           </div>
          
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <FiUsers className="text-blue-500" />
//             <span>
//               {event.registered_count || 0} participant{event.registered_count !== 1 ? 's' : ''}
//               {event.max_participants && ` • ${getSpotsLeft()}`}
//             </span>
//           </div>
//         </div>

//         {/* Bouton inscription */}
//         {user ? (
//           isPast ? (
//             <Button variant="secondary" disabled className="w-full">
//               Événement terminé
//             </Button>
//           ) : isRegistered ? (
//             <Button variant="success" disabled className="w-full">
//               ✓ Déjà inscrit
//             </Button>
//           ) : (
//             <Button
//               variant="primary"
//               onClick={() => onRegister(event)}
//               disabled={event.max_participants && (event.registered_count || 0) >= event.max_participants}
//               className="w-full"
//             >
//               {event.max_participants && (event.registered_count || 0) >= event.max_participants
//                 ? 'Complet'
//                 : "S'inscrire"}
//             </Button>
//           )
//         ) : (
//           <Button variant="secondary" disabled className="w-full">
//             Connectez-vous pour vous inscrire
//           </Button>
//         )}
//       </div>
//     </motion.div>
//   );
// }
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function EventCard({ event, onRegister, user }) {
  const eventDate = new Date(event.event_date);
  const now = new Date();
  const isPast = eventDate < now;
  const isRegistered =
    user && event.registrations?.some((reg) => reg.user_id === user.id);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  const getSpotsLeft = () => {
    if (!event.max_participants) return "Illimité";
    const spotsLeft =
      event.max_participants - (event.registered_count || 0);
    return `${spotsLeft} place${spotsLeft > 1 ? "s" : ""}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-white 
        rounded-xl 
        shadow-md 
        hover:shadow-lg 
        transition-all 
        border border-gray-200 
        overflow-hidden
      "
    >
      {/* IMAGE */}
      <div className="relative h-52 bg-gray-100">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
            <FiCalendar className="text-4xl text-purple-500" />
          </div>
        )}

        {/* BADGE DATE */}
        <div className="absolute top-3 left-3 bg-white/85 px-3 py-1 rounded-lg shadow-sm backdrop-blur">
          <span className="text-sm font-medium text-purple-700 flex items-center gap-1">
            <FiCalendar size={14} />
            {formatDate(eventDate)}
          </span>
        </div>

        {/* BADGE PRIX */}
        {event.price > 0 && (
          <div className="absolute top-3 right-3 bg-white/85 px-3 py-1 rounded-lg shadow-sm backdrop-blur">
            <span className="text-sm font-semibold text-green-600">
              {event.price} €
            </span>
          </div>
        )}
      </div>

      {/* CONTENU */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* INFOS */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FiMapPin className="text-red-500" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FiUsers className="text-blue-500" />
            <span>
              {event.registered_count || 0} participant
              {event.registered_count !== 1 ? "s" : ""}
              {event.max_participants && ` • ${getSpotsLeft()}`}
            </span>
          </div>
        </div>

        {/* BOUTON */}
        {user ? (
          isPast ? (
            <Button variant="secondary" disabled className="w-full">
              Événement terminé
            </Button>
          ) : isRegistered ? (
            <Button variant="success" disabled className="w-full">
              ✓ Déjà inscrit
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => onRegister(event)}
              disabled={
                event.max_participants &&
                (event.registered_count || 0) >= event.max_participants
              }
              className="w-full"
            >
              {event.max_participants &&
              (event.registered_count || 0) >= event.max_participants
                ? "Complet"
                : "S'inscrire"}
            </Button>
          )
        ) : (
          <Button variant="secondary" disabled className="w-full">
            Connectez-vous pour vous inscrire
          </Button>
        )}
      </div>
    </motion.div>
  );
}
