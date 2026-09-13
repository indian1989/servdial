const Specializations = ({ business }) => {
  const specializations = Array.isArray(business?.secondaryCategoryIds)
    ? business.secondaryCategoryIds.filter(
        (category) => category && category._id
      )
    : [];

  // No secondary categories
  if (!specializations.length) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Specializations
      </h2>

      <div className="flex flex-wrap gap-2">
        {specializations.map((category) => (
          <span
            key={category._id}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm hover:from-orange-100 hover:to-amber-100 hover:border-orange-300 transition-all duration-200"
          >
            {category.name}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Specializations;