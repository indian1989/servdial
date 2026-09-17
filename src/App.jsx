import { AuthProvider, useAuth } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";
import AppRoutes from "./routes/AppRoutes";
import TrackPageView from "./components/analytics/TrackPageView";

function AppContent({
  ssrBusiness,
  ssrBlog,
  ssrCity,
  ssrCategories,
  ssrBusinesses,
  ssrCityCategory,
}) {
  const { user } = useAuth();

  return (
    <BusinessProvider>
      <CityProvider>
        <CategoryProvider>
          <TrackPageView user={user} />
          <AppRoutes
          ssrBusiness={ssrBusiness}
          ssrBlog={ssrBlog}
          ssrCity={ssrCity}
          ssrCategories={ssrCategories}
          ssrBusinesses={ssrBusinesses}
          ssrCityCategory={ssrCityCategory}
        />
        </CategoryProvider>
      </CityProvider>
    </BusinessProvider>
  );
}

function App({
  ssrBusiness,
  ssrBlog,
  ssrCity,
  ssrCategories,
  ssrBusinesses,
  ssrCityCategory,
}) {
  return (
    <AuthProvider>
      <AppContent
  ssrBusiness={ssrBusiness}
  ssrBlog={ssrBlog}
  ssrCity={ssrCity}
  ssrCategories={ssrCategories}
  ssrBusinesses={ssrBusinesses}
  ssrCityCategory={ssrCityCategory}
/>
    </AuthProvider>
  );
}

export default App;