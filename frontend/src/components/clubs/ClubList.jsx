import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Button from "@/components/ui/Button";

export default function ClubList() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch("https://vakio-boky-backend.onrender.com/api/clubs", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setClubs(data.clubs);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const filteredClubs = clubs.filter(club => {
    if (filterType === "all") return true;
    return club.type === filterType;
  });

  if (loading) return <p className="text-center mt-8">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clubs</h2>
        <Button onClick={() => navigate("/clubs/create")}>Créer un club</Button>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="all">Tous les clubs</option>
          <option value="physique">Clubs physiques</option>
          <option value="virtuel">Clubs virtuels</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClubs.map(club => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl shadow-md cursor-pointer"
            onClick={() => navigate(`/clubs/${club.id}`)}
          >
            <img src={club.image_url || "/placeholder.jpg"} alt={club.nom} className="h-40 w-full object-cover rounded-lg mb-2"/>
            <h3 className="text-lg font-bold text-blue-900">{club.nom}</h3>
            <div className="flex gap-2 mb-1">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  club.type === "physique"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {club.type === "physique" ? "Physique" : "Virtuel"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  club.visibilite === "public"
                    ? "bg-green-100 text-green-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {club.visibilite}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {club.ville && club.pays ? `${club.ville}, ${club.pays}` : "En ligne"}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
