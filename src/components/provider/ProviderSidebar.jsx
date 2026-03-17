import { Link } from "react-router-dom";
import { providerRoutes } from "../../routes/routeConfig";

function ProviderSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">

      <h2 className="text-xl font-bold mb-6">
        Provider Panel
      </h2>

      <ul className="space-y-3">

        {providerRoutes.map((route) => (
          <li key={route.path}>
            <Link
              to={route.path}
              className="block p-2 rounded hover:bg-gray-700"
            >
              {route.name}
            </Link>
          </li>
        ))}

      </ul>

    </div>
  );
}

export default ProviderSidebar;