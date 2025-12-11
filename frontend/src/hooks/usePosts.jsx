import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = useAuth();
  const token = auth.user?.token;
  const user = auth.user?.user;

  /**
   * Récupère tous les posts depuis l'API
   */
  const fetchPosts = async () => {
    if (!token) {
      setError("Veuillez vous reconnecter");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://vakio-boky-backend.onrender.com/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.posts) {
        setPosts(data.posts);
      } else {
        setError(data.error || "Erreur inconnue du serveur");
      }
    } catch (err) {
      console.error("Erreur chargement posts:", err);
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crée un nouveau post
   */
  const createPost = async (postData) => {
    if (!token) {
      return { success: false, error: "Non authentifié" };
    }

    try {
      const response = await fetch("https://vakio-boky-backend.onrender.com/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.post) {
        // Ajoute le nouveau post au début de la liste
        setPosts((prev) => [data.post, ...prev]);
        return { success: true, post: data.post };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Erreur création post:", err);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  //  Like ou unlike un post
  const toggleLike = async (postId) => {
    if (!token) return { success: false, error: "Non authentifié" };

    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.liked !== undefined) {
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                user_liked: data.liked,
                likes_count: data.likes_count || 0,
              };
            }
            return post;
          })
        );

        return { success: true, liked: data.liked };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Erreur like post:", err);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  /**
   * Ajouter un commentaire
   */
  // const addComment = async (postId, commentContent) => {
  //   console.log("💬 [usePosts] Ajout commentaire:", { postId, commentContent });

  //   if (!token) {
  //     return { success: false, error: "Non authentifié" };
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://vakio-boky-backend.onrender.com/api/posts/${postId}/comments`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ contenu: commentContent }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("📡 [usePosts] Réponse commentaire:", data);

  //     if (data.comment) {
  //       return { success: true, comment: data.comment };
  //     } else {
  //       return { success: false, error: data.error };
  //     }
  //   } catch (err) {
  //     console.error("❌ [usePosts] Erreur commentaire:", err);
  //     return { success: false, error: "Erreur de connexion" };
  //   }
  // };

  /**
   * Partage un post
   */
  const sharePost = async (postId) => {
    if (!token) {
      return { success: false, error: "Non authentifié" };
    }

    try {
      const response = await fetch(
        `https://vakio-boky-backend.onrender.com/api/posts/${postId}/share`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.message) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Erreur partage post:", err);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  // Chargement initial des posts
  useEffect(() => {
    if (token) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Retourner toutes fonctions
  return {
    posts,
    loading,
    error,
    createPost,
    toggleLike,
    // addComment,
    sharePost,
    refetch: fetchPosts,
  };
}
