import { AuthProvider } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <CityProvider>
          <CategoryProvider>
            <AppRoutes />
          </CategoryProvider>
        </CityProvider>
      </BusinessProvider>
    </AuthProvider>
  );
}

export default App;