import { IndianRupee } from "lucide-react";

const ServicePricing = ({ pricing = [] }) => {
  if (!pricing.length) return null;

  return (
    <section
      id="pricing"
      className="bg-white rounded-2xl shadow p-5"
    >
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <IndianRupee size={20} />
        Service Pricing
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">
                Service
              </th>

              <th className="text-right p-3">
                Starting Price
              </th>
            </tr>
          </thead>

          <tbody>
            {pricing.map((item, index) => (
              <tr
                key={index}
                className="border-b last:border-none"
              >
                <td className="p-3">
                  {item.name}
                </td>

                <td className="p-3 text-right font-semibold text-green-600">
                  ₹{item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        * Final charges may vary depending on work scope and site inspection.
      </p>
    </section>
  );
};

export default ServicePricing;