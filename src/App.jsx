import { BrowserRouter } from "react-router-dom";

import { BusinessProvider } from "./context/BusinessContext";
import { CityProvider } from "./context/CityContext";
import { CategoryProvider } from "./context/CategoryContext";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <BusinessProvider>
        <CityProvider>
          <CategoryProvider>
            <AppRoutes />
          </CategoryProvider>
        </CityProvider>
      </BusinessProvider>
    </BrowserRouter>
  );
}

export default App;