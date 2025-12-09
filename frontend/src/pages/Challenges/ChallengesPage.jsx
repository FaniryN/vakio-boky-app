import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChallenges } from '@/hooks/useChallenges';
import Button from '@/components/ui/Button';
import { FiTarget, FiAward, FiTrendingUp } from 'react-icons/fi';
//  FiTrophy,
export default function ChallengesPage() {
  const { isAuthenticated } = useAuth();
  const {
    challenges,
    userChallenges,
    badges,
    userBadges,
    loading,
    error,
    joinChallenge,
    updateProgress,
  } = useChallenges();

  const [activeTab, setActiveTab] = useState('challenges');

  const handleJoinChallenge = async (challengeId) => {
    const result = await joinChallenge(challengeId);
    if (result.success) {
      alert('Vous avez rejoint le défi avec succès !');
    } else {
      alert(result.error || 'Erreur lors de l\'inscription');
    }
  };

  const getUserChallengeProgress = (challengeId) => {
    return userChallenges.find(uc => uc.challenge_id === challengeId);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading && challenges.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Défis et Badges
        </h1>
        <p className="text-gray-600">
          Relevez des défis de lecture et gagnez des badges pour montrer votre progression !
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'challenges'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiTarget className="inline mr-2" />
              Défis Actifs
            </button>
            <button
              onClick={() => setActiveTab('my-challenges')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-challenges'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiTrendingUp className="inline mr-2" />
              Mes Défis
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'badges'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiAward className="inline mr-2" />
              Tous les Badges
            </button>
            <button
              onClick={() => setActiveTab('my-badges')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-badges'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {/* <FiTrophy className="inline mr-2" /> */}
              Mes Badges
            </button>
          </nav>
        </div>
      </div>

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {challenge.description}
                  </p>
                </div>
                {challenge.reward_badge_icon && (
                  <img
                    src={challenge.reward_badge_icon}
                    alt={challenge.reward_badge_name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Objectif: {challenge.target_value}</span>
                  <span>Type: {challenge.type}</span>
                </div>
                {challenge.end_date && (
                  <p className="text-xs text-gray-500">
                    Échéance: {new Date(challenge.end_date).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>

              {challenge.reward_badge_name && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <FiAward className="inline mr-1" />
                    Récompense: {challenge.reward_badge_name}
                  </p>
                </div>
              )}

              {isAuthenticated ? (
                getUserChallengeProgress(challenge.id) ? (
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Déjà inscrit
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className="w-full"
                    disabled={loading}
                  >
                    Rejoindre le défi
                  </Button>
                )
              ) : (
                <p className="text-center text-gray-500 text-sm">
                  Connectez-vous pour rejoindre les défis
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* My Challenges Tab */}
      {activeTab === 'my-challenges' && (
        <div>
          {isAuthenticated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userChallenges.map((userChallenge) => (
                <div key={userChallenge.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {userChallenge.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {userChallenge.description}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      userChallenge.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : userChallenge.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userChallenge.status === 'completed' ? 'Terminé' :
                       userChallenge.status === 'failed' ? 'Échoué' : 'En cours'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progression: {userChallenge.current_value} / {userChallenge.target_value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(userChallenge.current_value, userChallenge.target_value)}%` }}
                      ></div>
                    </div>
                  </div>

                  {userChallenge.reward_badge_name && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <FiAward className="inline mr-1" />
                        Récompense: {userChallenge.reward_badge_name}
                      </p>
                    </div>
                  )}

                  {userChallenge.end_date && (
                    <p className="text-xs text-gray-500">
                      Échéance: {new Date(userChallenge.end_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              ))}
              {userChallenges.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FiTarget className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun défi en cours
                  </h3>
                  <p className="text-gray-500">
                    Rejoignez un défi pour commencer votre progression !
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiTarget className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connexion requise
              </h3>
              <p className="text-gray-500">
                Connectez-vous pour voir vos défis personnels.
              </p>
            </div>
          )}
        </div>
      )}

      {/* All Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const hasBadge = userBadges.some(ub => ub.badge_id === badge.id);
            return (
              <div key={badge.id} className={`rounded-lg shadow-md p-6 ${hasBadge ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-white'}`}>
                <div className="flex items-center mb-4">
                  {badge.icon_url ? (
                    <img
                      src={badge.icon_url}
                      alt={badge.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <FiAward className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {badge.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      badge.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                      badge.rarity === 'epic' ? 'bg-red-100 text-red-800' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {badge.rarity}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {badge.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {badge.points} points
                  </span>
                  {hasBadge && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Obtenu
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Badges Tab */}
      {activeTab === 'my-badges' && (
        <div>
          {isAuthenticated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBadges.map((userBadge) => (
                <div key={userBadge.id} className="bg-yellow-50 border-2 border-yellow-200 rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    {userBadge.icon_url ? (
                      <img
                        src={userBadge.icon_url}
                        alt={userBadge.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center mr-4">
                        <FiAward className="w-8 h-8 text-yellow-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userBadge.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userBadge.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                        userBadge.rarity === 'epic' ? 'bg-red-100 text-red-800' :
                        userBadge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {userBadge.rarity}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {userBadge.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {userBadge.points} points
                    </span>
                    <span className="text-xs text-gray-500">
                      Obtenu le {new Date(userBadge.earned_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
              {userBadges.length === 0 && (
                <div className="col-span-full text-center py-12">
                  {/* <FiTrophy className="mx-auto h-12 w-12 text-gray-400 mb-4" /> */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun badge obtenu
                  </h3>
                  <p className="text-gray-500">
                    Relevez des défis pour gagner vos premiers badges !
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              {/* <FiTrophy className="mx-auto h-12 w-12 text-gray-400 mb-4" /> */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connexion requise
              </h3>
              <p className="text-gray-500">
                Connectez-vous pour voir vos badges.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}