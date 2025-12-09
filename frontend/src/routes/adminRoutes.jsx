import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminGuard from '../middleware/adminGuard.jsx';
import AdminLayout from '../admin/layout/AdminLayout';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminUserRoles from '../pages/Admin/AdminUserRoles';
import AdminUserAnalytics from '../pages/Admin/AdminUserAnalytics';
import AdminBooksModeration from '../pages/Books/AdminBooksModeration';
import AdminBooksCatalog from '../pages/Books/AdminBooksCatalog';
import AdminBooksAnalytics from '../pages/Books/AdminBooksAnalytics';
import AdminMarketplace from '../pages/Marketplace/AdminMarketplace';
import AdminCategories from '../pages/Marketplace/AdminCategories';
import AdminAnalytics from '../pages/Marketplace/AdminAnalytics';
import AdminOrders from '../pages/Marketplace/AdminOrders';
import AdminDisputes from '../pages/Marketplace/AdminDisputes';
import AdminCampaigns from '../pages/Fundraising/AdminCampaigns';
import AdminCampaignAnalytics from '../pages/Fundraising/AdminCampaignAnalytics';
import AdminFeaturedCampaigns from '../pages/Fundraising/AdminFeaturedCampaigns';
import AdminEvents from '../pages/Events/AdminEvents';
import AdminEventsAnalytics from '../pages/Events/AdminEventsAnalytics';
import AdminEventTemplates from '../pages/Events/AdminEventTemplates';
import AdminChallengesManagement from '../pages/Challenges/AdminChallengesManagement';
import AdminChallengesAnalytics from '../pages/Challenges/AdminChallengesAnalytics';
import AdminChallengesBadges from '../pages/Challenges/AdminChallengesBadges';
import AdminAnalyticsOverview from '../pages/Analytics/AdminAnalyticsOverview';
import AdminAnalyticsUsers from '../pages/Analytics/AdminAnalyticsUsers';
import AdminAnalyticsContent from '../pages/Analytics/AdminAnalyticsContent';
import AdminModerationQueue from '../pages/Moderation/AdminModerationQueue';
import AdminModerationReports from '../pages/Moderation/AdminModerationReports';
import AdminModerationActions from '../pages/Moderation/AdminModerationActions';
import AdminSettingsPlatform from '../pages/Settings/AdminSettingsPlatform';
import AdminSettingsEmail from '../pages/Settings/AdminSettingsEmail';
import AdminSettingsSystem from '../pages/Settings/AdminSettingsSystem';

// Placeholder components for missing admin pages

const AdminBooks = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion de la Bibliothèque</h1>
    <p className="text-gray-600">Cette page est en cours de développement.</p>
  </div>
);

const AdminChallenges = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des Défis</h1>
    <p className="text-gray-600">Cette page est en cours de développement.</p>
  </div>
);


const AdminModeration = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Modération</h1>
    <p className="text-gray-600">Cette page est en cours de développement.</p>
  </div>
);

const AdminSettings = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Paramètres Système</h1>
    <p className="text-gray-600">Cette page est en cours de développement.</p>
  </div>
);

/**
 * AdminRoutes component
 * Centralizes all admin routes with proper protection and layout
 */
export default function AdminRoutes() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/marketplace" element={<AdminMarketplace />} />
          <Route path="/marketplace/categories" element={<AdminCategories />} />
          <Route path="/marketplace/analytics" element={<AdminAnalytics />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/orders/disputes" element={<AdminDisputes />} />
          <Route path="/campaigns" element={<AdminCampaigns />} />
          <Route path="/campaigns/moderation" element={<AdminCampaigns />} />
          <Route path="/campaigns/analytics" element={<AdminCampaignAnalytics />} />
          <Route path="/campaigns/featured" element={<AdminFeaturedCampaigns />} />
          <Route path="/events" element={<AdminEvents />} />
          <Route path="/events/moderation" element={<AdminEvents />} />
          <Route path="/events/analytics" element={<AdminEventsAnalytics />} />
          <Route path="/events/templates" element={<AdminEventTemplates />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/users/dashboard" element={<AdminUsers />} />
          <Route path="/users/roles" element={<AdminUserRoles />} />
          <Route path="/users/analytics" element={<AdminUserAnalytics />} />
          <Route path="/books" element={<AdminBooksModeration />} />
          <Route path="/books/moderation" element={<AdminBooksModeration />} />
          <Route path="/books/catalog" element={<AdminBooksCatalog />} />
          <Route path="/books/analytics" element={<AdminBooksAnalytics />} />
          <Route path="/challenges" element={<AdminChallengesManagement />} />
          <Route path="/challenges/management" element={<AdminChallengesManagement />} />
          <Route path="/challenges/analytics" element={<AdminChallengesAnalytics />} />
          <Route path="/challenges/badges" element={<AdminChallengesBadges />} />

          <Route path="/analytics" element={<AdminAnalyticsOverview />} />
          <Route path="/analytics/overview" element={<AdminAnalyticsOverview />} />
          <Route path="/analytics/users" element={<AdminAnalyticsUsers />} />
          <Route path="/analytics/content" element={<AdminAnalyticsContent />} />

          <Route path="/moderation" element={<AdminModerationQueue />} />
          <Route path="/moderation/queue" element={<AdminModerationQueue />} />
          <Route path="/moderation/reports" element={<AdminModerationReports />} />
          <Route path="/moderation/actions" element={<AdminModerationActions />} />

          <Route path="/settings" element={<AdminSettingsPlatform />} />
          <Route path="/settings/platform" element={<AdminSettingsPlatform />} />
          <Route path="/settings/email" element={<AdminSettingsEmail />} />
          <Route path="/settings/system" element={<AdminSettingsSystem />} />
          
          {/* 404 for admin routes */}
          <Route 
            path="*" 
            element={
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
                <p className="text-gray-600 mb-4">
                  La page d'administration que vous recherchez n'existe pas.
                </p>
                <a 
                  href="/admin" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retour au tableau de bord
                </a>
              </div>
            } 
          />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
}

/**
 * Individual route components for use in main App.jsx
 * These are wrapped with AdminGuard and AdminLayout
 */
export const AdminDashboardRoute = () => (
  <AdminGuard>
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  </AdminGuard>
);

export const AdminMarketplaceRoute = () => (
  <AdminGuard>
    <AdminLayout>
      <AdminMarketplace />
    </AdminLayout>
  </AdminGuard>
);

export const AdminOrdersRoute = () => (
  <AdminGuard>
    <AdminLayout>
      <AdminOrders />
    </AdminLayout>
  </AdminGuard>
);

export const AdminCampaignsRoute = () => (
  <AdminGuard>
    <AdminLayout>
      <AdminCampaigns />
    </AdminLayout>
  </AdminGuard>
);

export const AdminEventsRoute = () => (
  <AdminGuard>
    <AdminLayout>
      <AdminEvents />
    </AdminLayout>
  </AdminGuard>
);