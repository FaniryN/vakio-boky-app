// services/landingService.js
const API_BASE_URL = 'http://localhost:5000/api/landing';

// Service pour les témoignages
export const testimonialsService = {
  async getFeaturedTestimonials() {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      if (!response.ok) throw new Error('Erreur API testimonials');
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('⚠ Témoignages statiques utilisés:', error.message);
      return [
        {
          id: 1,
          content: "Une plateforme incroyable pour découvrir des œuvres locales !",
          author: "Jean Rakoto",
          role: "Lecteur",
          rating: 5
        },
        {
          id: 2,
          content: "Vakio Boky m'a permis de partager mes écrits avec une communauté passionnée.",
          author: "Marie Randria",
          role: "Auteure",
          rating: 4
        }
      ];
    }
  }
};

// Service pour les événements
export const eventsService = {
  async getUpcomingEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/upcoming-events`);
      if (!response.ok) throw new Error('Erreur API events');
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('⚠ Événements statiques utilisés:', error.message);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      return [
        {
          id: 1,
          title: "Rencontre avec les auteurs malgaches",
          description: "Découverte des nouveaux talents littéraires de Madagascar",
          event_date: nextWeek.toISOString(),
          location: "Antananarivo",
          event_type: "rencontre",
          image_url: "/assets/images/event1.jpg"
        }
      ];
    }
  }
};

// Service pour les auteurs promus
export const authorsService = {
  async getPromotedAuthors() {
    try {
      const response = await fetch(`${API_BASE_URL}/promoted-authors`);
      if (!response.ok) throw new Error('Erreur API auteurs');
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('⚠ Auteurs statiques utilisés:', error.message);
      return [
        {
          id: 1,
          name: "Sarah Andrianarisoa",
          bio: "Romancière passionnée par les histoires traditionnelles malgaches",
          author_genre: "Roman",
          published_works: 3,
          image: "/assets/images/author1.jpg"
        }
      ];
    }
  }
};

// Service pour les statistiques
export const statsService = {
  async getLandingStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Erreur API stats');
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.warn('⚠ Statistiques statiques utilisées:', error.message);
      return {
        total_books: 1250,
        total_users: 3200,
        total_authors: 150,
        upcoming_events: 8
      };
    }
  }
};

// Service global (optionnel)
export const landingDataService = {
  async getAllLandingData() {
    try {
      const response = await fetch(`${API_BASE_URL}/data`);
      if (!response.ok) throw new Error('Erreur API données globales');
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.warn('⚠ Données statiques utilisées:', error.message);
      // Fallback avec les autres services
      const [testimonials, events, authors, stats] = await Promise.all([
        testimonialsService.getFeaturedTestimonials(),
        eventsService.getUpcomingEvents(),
        authorsService.getPromotedAuthors(),
        statsService.getLandingStats()
      ]);
      
      return { testimonials, events, authors, stats };
    }
  }
};