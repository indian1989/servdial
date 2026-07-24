const FoodMenuSection = ({ business }) => {

  return (
    <section id="food-menu">

      <h2 className="text-xl font-bold">
        🍽️ Food Menu
      </h2>

      <p className="text-gray-600 mt-2">
        View dishes and prices
      </p>


      <button
        className="mt-4 bg-orange-600 text-white px-5 py-2 rounded-lg"
        onClick={() =>
          window.open(
            `/business/${business.slug}/menu`,
            "_self"
          )
        }
      >
        View Menu
      </button>

    </section>
  );
};


export default FoodMenuSection;