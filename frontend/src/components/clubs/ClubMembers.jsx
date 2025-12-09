import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

export default function ClubMembers() {
  const { id } = useParams();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${id}/members`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) setMembers(data.members);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchClub = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clubs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) setClub(data.club);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
    fetchMembers();
  }, [id]);

  const updateMemberRole = async (memberId, newRole) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/clubs/${id}/members/${memberId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchMembers();
        alert("Rôle mis à jour");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const removeMember = async (memberId) => {
    if (!confirm("Retirer ce membre du club ?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/clubs/${id}/members/${memberId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchMembers();
        alert("Membre retiré");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Erreur lors du retrait");
    }
  };

  const currentUserRole = members.find((m) => m.user_id === user.id)?.role;

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Membres du club - {club?.nom}
          </h1>
          <p className="text-gray-600">
            {members.length} membre{members.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        <div className="grid gap-4">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.nom.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.nom}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      member.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : member.role === "moderateur"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>

              {currentUserRole === "admin" && member.user_id !== user.id && (
                <div className="flex items-center space-x-2">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      updateMemberRole(member.user_id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="membre">Membre</option>
                    <option value="moderateur">Modérateur</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => removeMember(member.user_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
