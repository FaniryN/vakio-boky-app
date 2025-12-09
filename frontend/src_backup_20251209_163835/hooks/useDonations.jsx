// import { useState, useEffect } from 'react';
// import { useAuth } from './useAuth';

// export const useDonations = () => {
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   const API_BASE_URL = 'http://localhost:5000/api';

//   const createDonation = async (donationData) => {
//     if (!user?.token) {
//       setError("Vous devez être connecté pour effectuer un don");
//       console.error("❌ Token manquant pour createDonation");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/donations`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`
//         },
//         body: JSON.stringify(donationData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `Erreur ${response.status}`);
//       }

//       if (data.success) {
//         return data.donation;
//       } else {
//         throw new Error(data.error || 'Erreur traitement don');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('❌ Erreur création don:', err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserDonations = async () => {
//     if (!user?.token) {
//       console.error("❌ Token manquant pour fetchUserDonations");
//       setError("Vous devez être connecté");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/user`, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`
//         }
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `Erreur ${response.status}`);
//       }

//       if (data.success) {
//         setDonations(data.donations || []);
//       } else {
//         throw new Error(data.error || 'Erreur chargement dons');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('❌ Erreur récupération dons:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCampaignDonations = async (campaignId) => {
//     if (!campaignId) return [];
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/campaign/${campaignId}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `Erreur ${response.status}`);
//       }

//       return data.donations || [];
//     } catch (err) {
//       setError(err.message);
//       console.error('❌ Erreur récupération dons campagne:', err);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch automatique des dons utilisateur
//   useEffect(() => {
//     if (user) {
//       fetchUserDonations();
//     }
//   }, [user]);

//   return {
//     donations,
//     loading,
//     error,
//     createDonation,
//     fetchUserDonations,
//     fetchCampaignDonations
//   };
// };
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:5000/api';

  const createDonation = async (donationData) => {
    if (!user?.token) {
      setError("Vous devez être connecté pour effectuer un don");
      console.error("❌ Token manquant pour createDonation");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(donationData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        return data.donation;
      } else {
        throw new Error(data.error || 'Erreur traitement don');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur création don:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDonations = async () => {
    if (!user?.token) {
      console.error("❌ Token manquant pour fetchUserDonations");
      setError("Vous devez être connecté");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/donations/user`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      if (data.success) {
        setDonations(data.donations || []);
      } else {
        throw new Error(data.error || 'Erreur chargement dons');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur récupération dons:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatique des dons utilisateur
  useEffect(() => {
    if (user) {
      fetchUserDonations();
    }
  }, [user]);

  return {
    donations,
    loading,
    error,
    createDonation,
    fetchUserDonations
  };
};