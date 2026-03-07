import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";
import AppRoutes from "./routes/AppRoutes";
import CityCategoryPage from "./pages/CityCategoryPage";

<Route path="/:city/:category" element={<CityCategoryPage />} />
function App() {
  return (
    <BusinessProvider>
      <CityProvider>
        <CategoryProvider>
          <AppRoutes />
        </CategoryProvider>
      </CityProvider>
    </BusinessProvider>
  );
}

export default App;