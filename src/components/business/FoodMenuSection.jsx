const FoodMenuSection = ({ business }) => {


  const menu =
    business?.menu || [];


  const scrollToMenu = () => {

    document
      .getElementById("menu-items")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

  };


  return (

    <section>

      <h2 className="text-xl font-bold">
        🍽️ Food Menu
      </h2>


      <p className="text-gray-600 mt-2">
        View dishes and prices
      </p>


      <button

        onClick={scrollToMenu}

        className="
        mt-4
        bg-orange-600
        text-white
        px-5
        py-2
        rounded-lg
        "

      >
        View Menu

      </button>


    </section>

  );

};


export default FoodMenuSection;