import { AuthProvider, useAuth } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";
import AppRoutes from "./routes/AppRoutes";
import TrackPageView from "./components/analytics/TrackPageView";

function AppContent({ ssrBusiness }) {
  const { user } = useAuth();

  return (
    <BusinessProvider>
      <CityProvider>
        <CategoryProvider>
          <TrackPageView user={user} />
          <AppRoutes ssrBusiness={ssrBusiness} />
        </CategoryProvider>
      </CityProvider>
    </BusinessProvider>
  );
}

function App({ ssrBusiness }) {
  return (
    <AuthProvider>
      <AppContent
  ssrBusiness={ssrBusiness}
/>
    </AuthProvider>
  );
}

export default App;