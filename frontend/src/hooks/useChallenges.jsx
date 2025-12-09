import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = 'https://vakio-boky-backend.onrender.com/api';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch all active challenges
  const fetchChallenges = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges`);
      const data = await response.json();

      if (data.success) {
        setChallenges(data.challenges);
      } else {
        setError(data.error || 'Erreur lors du chargement des défis');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's challenge progress
  const fetchUserChallenges = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/user/progress`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setUserChallenges(data.userChallenges);
      } else {
        setError(data.error || 'Erreur lors du chargement de vos défis');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching user challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all badges
  const fetchBadges = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/badges/all`);
      const data = await response.json();

      if (data.success) {
        setBadges(data.badges);
      } else {
        setError(data.error || 'Erreur lors du chargement des badges');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's earned badges
  const fetchUserBadges = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/badges/user`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setUserBadges(data.userBadges);
      } else {
        setError(data.error || 'Erreur lors du chargement de vos badges');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching user badges:', err);
    } finally {
      setLoading(false);
    }
  };

  // Join a challenge
  const joinChallenge = async (challengeId) => {
    if (!user?.token) {
      setError('Vous devez être connecté pour rejoindre un défi');
      return { success: false, error: 'Non authentifié' };
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        // Refresh user challenges
        await fetchUserChallenges();
        return { success: true, message: data.message };
      } else {
        setError(data.error || 'Erreur lors de l\'inscription au défi');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error joining challenge:', err);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Update challenge progress
  const updateProgress = async (challengeId, progress) => {
    if (!user?.token) {
      setError('Vous devez être connecté pour mettre à jour votre progrès');
      return { success: false, error: 'Non authentifié' };
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ progress }),
      });
      const data = await response.json();

      if (data.success) {
        // Refresh user challenges and badges
        await fetchUserChallenges();
        await fetchUserBadges();
        return { success: true, message: data.message };
      } else {
        setError(data.error || 'Erreur lors de la mise à jour du progrès');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error updating progress:', err);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Create a new challenge (admin only)
  const createChallenge = async (challengeData) => {
    if (!user?.token) {
      setError('Vous devez être connecté en tant qu\'administrateur');
      return { success: false, error: 'Non authentifié' };
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(challengeData),
      });
      const data = await response.json();

      if (data.success) {
        await fetchChallenges();
        return { success: true, message: data.message, challenge: data.challenge };
      } else {
        setError(data.error || 'Erreur lors de la création du défi');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error creating challenge:', err);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Create a new badge (admin only)
  const createBadge = async (badgeData) => {
    if (!user?.token) {
      setError('Vous devez être connecté en tant qu\'administrateur');
      return { success: false, error: 'Non authentifié' };
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(badgeData),
      });
      const data = await response.json();

      if (data.success) {
        await fetchBadges();
        return { success: true, message: data.message, badge: data.badge };
      } else {
        setError(data.error || 'Erreur lors de la création du badge');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error creating badge:', err);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchChallenges();
    fetchBadges();
  }, []);

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      fetchUserChallenges();
      fetchUserBadges();
    }
  }, [user]);

  return {
    challenges,
    userChallenges,
    badges,
    userBadges,
    loading,
    error,
    fetchChallenges,
    fetchUserChallenges,
    fetchBadges,
    fetchUserBadges,
    joinChallenge,
    updateProgress,
    createChallenge,
    createBadge,
  };
};