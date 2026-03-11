import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <BusinessProvider>
        <CityProvider>
          <CategoryProvider>
            <AppRoutes />
          </CategoryProvider>
        </CityProvider>
      </BusinessProvider>
    </Router>
  );
}

export default App;