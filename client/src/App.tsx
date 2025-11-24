import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
import AudioPlayer from "./components/AudioPlayer";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Home from "./pages/Home";
import Music from "./pages/Music";
import Artists from "./pages/Artists";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DMCA from "./pages/DMCA";
import ArtistAgreement from "./pages/ArtistAgreement";
import FAQ from "./pages/FAQ";
import Events from "./pages/Events";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import Search from "./pages/Search";
import ArtistProfile from "./pages/ArtistProfile";
import DownloadHistory from "./pages/DownloadHistory";
import PlaylistDetail from "./pages/PlaylistDetail";
import ArtistAnalytics from "./pages/ArtistAnalytics";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/music" component={Music} />
      <Route path="/artists" component={Artists} />
      <Route path="/news" component={News} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/upload" component={Upload} />
      <Route path="/admin" component={Admin} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/dmca" component={DMCA} />
      <Route path="/artist-agreement" component={ArtistAgreement} />
      <Route path="/faq" component={FAQ} />
      <Route path="/events" component={Events} />      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/search" component={Search} />
      <Route path="/artist/:id" component={ArtistProfile} />
      <Route path="/download-history" component={DownloadHistory} />
      <Route path="/playlist/:id" component={PlaylistDetail} />
      <Route path="/analytics" component={ArtistAnalytics} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <AuthProvider>
          <AudioPlayerProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <AudioPlayer />
              <PWAInstallPrompt />
            </TooltipProvider>
          </AudioPlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
