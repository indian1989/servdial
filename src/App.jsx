import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";
import AppRoutes from "./routes/AppRoutes";

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