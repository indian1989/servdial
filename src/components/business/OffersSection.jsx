import { Tag, Gift, Percent } from "lucide-react";

const OffersSection = ({ business }) => {
  const offers = business?.offers || [];

  if (!offers.length) return null;

  return (
    <section
      id="offers"
      className="bg-white rounded-2xl shadow p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Gift className="text-red-500" size={22} />
        <h2 className="text-xl font-bold">
          Offers & Deals
        </h2>
      </div>

      <div className="space-y-3">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 flex gap-3 hover:bg-gray-50 transition"
          >
            <div className="mt-1">
              <Percent
                className="text-green-600"
                size={22}
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">
                {offer.title}
              </h3>

              {offer.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {offer.description}
                </p>
              )}

              {offer.validTill && (
                <p className="text-xs text-red-500 mt-2">
                  Valid till {offer.validTill}
                </p>
              )}
            </div>

            <Tag className="text-orange-500" size={20} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OffersSection;