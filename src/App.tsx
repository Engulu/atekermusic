import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MusicPage from './pages/MusicPage';
import ArtistDashboardPage from './pages/ArtistDashboardPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import ArtistsPage from './pages/ArtistsPage';
import EventsPage from './pages/EventsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import LegalPage from './pages/LegalPage';
import NewsPage from './pages/NewsPage';
import BettingPredictionsPage from './pages/BettingPredictionsPage';
import ArticlePage from './pages/ArticlePage';
import Footer from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-navy-900">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:id" element={<ArtistProfilePage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="artist">
                  <ArtistDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/events" element={<EventsPage />} />
            <Route
              path="/admin/*" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<ArticlePage />} />
            <Route path="/predictions" element={<BettingPredictionsPage />} />
          </Routes>
          <hr className="border-gray-700 mx-4 md:mx-8 lg:mx-16" />
          <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
