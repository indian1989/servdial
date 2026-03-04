import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <BusinessProvider>
      <CityProvider>
        <AppRoutes />
      </CityProvider>
    </BusinessProvider>
  );
}

export default App;