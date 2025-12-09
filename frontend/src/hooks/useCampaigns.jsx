// import { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";

// export const useCampaigns = () => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const auth = useAuth();
//   const token = auth.user?.token;

//   const getAuthHeaders = () => {
//     const headers = {
//       "Content-Type": "application/json",
//     };

//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }

//     return headers;
//   };

//   const fetchCampaigns = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch("https://vakio-boky-backend.onrender.com/api/campaigns", {
//         method: "GET",
//         headers: getAuthHeaders(),
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setCampaigns(data.campaigns || []);
//       return data;
//     } catch (err) {
//       const errorMessage =
//         err.message || "Erreur lors du chargement des campagnes";
//       setError(errorMessage);
//       console.error("fetchCampaigns error:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createCampaign = async (campaignData) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch("https://vakio-boky-backend.onrender.com/api/campaigns", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         credentials: "include",
//         body: JSON.stringify(campaignData),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();

//       await fetchCampaigns();

//       return data;
//     } catch (err) {
//       const errorMessage =
//         err.message || "Erreur lors de la création de la campagne";
//       setError(errorMessage);
//       console.error("createCampaign error:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const makeDonation = async (donationData) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetch("https://vakio-boky-backend.onrender.com/api/donations", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         credentials: "include",
//         body: JSON.stringify(donationData),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (err) {
//       const errorMessage = err.message || "Erreur lors du traitement du don";
//       setError(errorMessage);
//       console.error("makeDonation error:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearError = () => setError("");
//   const reset = () => {
//     setCampaigns([]);
//     setDonations([]);
//     setError("");
//     setLoading(false);
//   };

//   return {
//     campaigns,
//     donations,
//     loading,
//     error,
//     fetchCampaigns,
//     createCampaign,
//     makeDonation,
//     clearError,
//     reset,
//     setCampaigns,
//     setDonations,
//   };
// };
// import { useState, useEffect } from 'react';

// export const useCampaigns = () => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const API_BASE_URL = 'https://vakio-boky-backend.onrender.com/api';

//   const fetchCampaigns = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/campaigns`);
      
//       if (!response.ok) {
//         throw new Error(`Erreur ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         // Filtrer uniquement les campagnes actives ou récentes
//         const activeCampaigns = data.campaigns.filter(campaign => 
//           campaign.status === 'active' || 
//           new Date(campaign.end_date) > new Date()
//         );
//         setCampaigns(activeCampaigns);
//       } else {
//         throw new Error(data.error || 'Erreur inconnue');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('❌ Erreur récupération campagnes:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   return {
//     campaigns,
//     loading,
//     error,
//     fetchCampaigns
//   };
// };
import { useState, useEffect } from 'react';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://vakio-boky-backend.onrender.com/api';

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCampaigns(data.campaigns || []);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur récupération campagnes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchCampaigns();
        return data.campaign;
      } else {
        throw new Error(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur création campagne:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCampaign = async (campaignId, campaignData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchCampaigns();
        return data.campaign;
      } else {
        throw new Error(data.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur modification campagne:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('vakio_token');
      const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchCampaigns();
        return data;
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur suppression campagne:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign
  };
};