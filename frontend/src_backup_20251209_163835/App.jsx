import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";


// Authentication Pages
import Login from "./components/modales/Login";
import Register from "./components/modales/Register";
import ForgotPassword from "./components/modales/ForgotPassword";
import VerifyCode from "./components/modales/VerifyCode";
import ResetPassword from "./components/modales/ResetPassword";

// Main Pages
import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import Marketplace from "./pages/Marketplace/Marketplace";
import Profile from "./pages/Profile/Profile";
import Postes from "./pages/Postes/Postes";
import BookList from "./components/books/BookList";
import Clubs from "./pages/Clubs/ClubsPage";

//About Page
import Apropos from "./components/home/Apropos";

// Fundraising Pages
import FundraisingPage from "./pages/Fundraising/FundraisingPage";
// import AdminCampaigns from "./pages/Fundraising/AdminCampaigns";

// Events Pages
import EventsPage from "./pages/Events/EventsPage";
import EventsCalendarPage from "./pages/Events/EventsCalendarPage";
// import AdminEvents from "./pages/Events/AdminEvents";

// Admin Routes
import AdminRoutes from "./routes/adminRoutes";

// Ebook Reader
import EbookReader from "./pages/EbookReader/EbookReader";

// Challenges Page
import ChallengesPage from "./pages/Challenges/ChallengesPage";

// Club Components
import ClubDetails from "./components/clubs/ClubDetails";
import CreateClub from "./components/clubs/CreateClub";
import EditClub from "./components/clubs/EditClub";
import ClubEvents from "./components/clubs/ClubEvents";
import ClubMembers from "./components/clubs/ClubMembers";
import Notifications from "./components/clubs/Notifications";
import PostComments from "./pages/Postes/PostComments";

// Layout component for pages with header and footer
const PageLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1 pt-20"> {/* Space for fixed header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

// Routes configuration for better organization
const ROUTE_CONFIG = [
  // Public routes
  { path: "/", component: Home, layout: true },
  { path: "/explore", component: Explore, layout: true },
  { path: "/marketplace", component: Marketplace, layout: true },
  { path: "/challenges", component: ChallengesPage, layout: true },
  { path: "/reader", component: EbookReader, layout: true },
  { path: "/profile", component: Profile, layout: true },
  { path: "/postes", component: Postes, layout: true },
  { path: "/booklist", component: BookList, layout: true },
  { path: "/club", component: Clubs, layout: true },
  { path: "/fundraising", component: FundraisingPage, layout: true },
  { path: "/events", component: EventsPage, layout: true },
  { path: "/calendar", component: EventsCalendarPage, layout: true },
  
  
  // Authentication routes
  { path: "/login", component: Login, layout: false },
  { path: "/register", component: Register, layout: false },
  { path: "/forgot-password", component: ForgotPassword, layout: false },
  { path: "/verify-code", component: VerifyCode, layout: false },
  { path: "/reset-password", component: ResetPassword, layout: false },
  
  // Club routes
  { path: "/clubs/:id", component: ClubDetails, layout: false },
  { path: "/clubs/:id/edit", component: EditClub, layout: false },
  { path: "/create", component: CreateClub, layout: false },
  { path: "/clubs/:id/members", component: ClubMembers, layout: false },
  { path: "/clubs/:id/events", component: ClubEvents, layout: false },
  { path: "/notifications", component: Notifications, layout: false },
  { path: "/postComment", component: PostComments, layout: false },

  //about
  { path: "/propos", component: Apropos, layout: false },
];

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Routes - Separate from main layout */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Regular Routes */}
          {ROUTE_CONFIG.map(({ path, component: Component, layout }) => (
            <Route
              key={path}
              path={path}
              element={
                layout ? (
                  <PageLayout>
                    <Component />
                  </PageLayout>
                ) : (
                  <Component />
                )
              }
            />
          ))}
          
          {/* 404 Page */}
          <Route
            path="*"
            element={
              <PageLayout>
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    404 - Page non trouvée
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    La page que vous recherchez n'existe pas.
                  </p>
                  <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retour à l'accueil
                  </a>
                </div>
              </PageLayout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}