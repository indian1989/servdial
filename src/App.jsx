import { AuthProvider, useAuth } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";
import AppRoutes from "./routes/AppRoutes";
import TrackPageView from "./components/analytics/TrackPageView";

function AppContent() {
  const { user } = useAuth();

  return (
    <BusinessProvider>
      <CityProvider>
        <CategoryProvider>
          <TrackPageView user={user} />
          <AppRoutes />
        </CategoryProvider>
      </CityProvider>
    </BusinessProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;