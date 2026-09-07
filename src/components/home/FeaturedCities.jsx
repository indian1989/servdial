import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import API from "../../api/axios";
// CITY IMAGES
import patna from "../../assets/cities/patna.jpg";
import hajipur from "../../assets/cities/hajipur.jpg";
import ahmedabad from "../../assets/cities/ahmedabad.jpg";
import kolkata from "../../assets/cities/kolkata.jpg";


// CITY IMAGE MAP
const cityImageMap = {
  patna: patna,
  hajipur: hajipur,
  ahmedabad: ahmedabad,
  kolkata: kolkata,
};

const getCityImage = (city) => {
  if (!city?.name) return null;

  const key = city.name
    .toLowerCase()
    .trim();

  return cityImageMap[key] || null;
};


const FeaturedCities = ({
  cities = [],
  loading = false,
}) => {
  const navigate = useNavigate();

  const [allCities, setAllCities] = useState([]);

  /* =========================================================
     ALL SERVDIAL CITIES
  ========================================================= */

  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        const res = await API.get(
          "/cities?dropdown=true"
        );

        const fetchedCities =
          res?.data?.cities ||
          res?.data?.data ||
          [];

        setAllCities(
          Array.isArray(fetchedCities)
            ? fetchedCities
            : []
        );
      } catch (err) {
        console.error(
          "❌ Featured cities dropdown error:",
          err?.response?.data || err
        );

        setAllCities([]);
      }
    };

    fetchAllCities();
  }, []);

  /* =========================================================
     OPEN CITY
  ========================================================= */

  const openCity = (city) => {
  if (!city?.slug || !city?.stateSlug) return;

  navigate(`/${city.stateSlug}/${city.slug}`);
};

  /* =========================================================
     CITY SEARCH OPTIONS
  ========================================================= */

  const cityOptions = useMemo(() => {
    return allCities
      .filter((city) => city?.slug && city?.name)
      .map((city) => ({
        value: city.slug,
        label: city.state
          ? `${city.name} (${city.state})`
          : city.name,
        city,
      }));
  }, [allCities]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-10">
            <div className="h-8 w-72 bg-gray-200 rounded-lg animate-pulse mx-auto mb-3" />

            <div className="h-5 w-96 max-w-full bg-gray-200 rounded-lg animate-pulse mx-auto" />
          </div>

          <div className="max-w-xl mx-auto mb-10">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>

          <div className="
            grid
            grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-3
            md:gap-4
          ">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="
                  h-44
                  md:h-48
                  rounded-2xl
                  bg-gray-200
                  animate-pulse
                "
              />
            ))}
          </div>

        </div>
      </section>
    );
  }

  /* =========================================================
     NO FEATURED CITIES
  ========================================================= */

  if (!cities?.length) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">

      <div className="max-w-7xl mx-auto px-4">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="text-center mb-10">

          <h2 className="
            text-2xl
            md:text-3xl
            font-bold
            text-gray-900
          ">
            Explore Businesses by City
          </h2>

          <p className="
            text-gray-500
            mt-2
            text-sm
            md:text-base
          ">
            Discover trusted businesses and services across cities
          </p>

          {/* ===================================================
              CITY SEARCH
          =================================================== */}

          <div className="max-w-xl mx-auto mt-6 text-left">

            <Select
              options={cityOptions}
              isSearchable
              isClearable
              placeholder="🔍 Search or select your city"
              noOptionsMessage={() =>
                "No city found"
              }
              onChange={(selectedOption) => {
                if (selectedOption?.city) {
                  openCity(selectedOption.city);
                }
              }}
              filterOption={(option, inputValue) => {
                const search =
                  inputValue
                    .toLowerCase()
                    .trim();

                if (!search) {
                  return true;
                }

                return option.label
                  .toLowerCase()
                  .includes(search);
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "50px",
                  borderRadius: "14px",
                  borderColor: state.isFocused
                    ? "#9ca3af"
                    : "#e5e7eb",
                  boxShadow: state.isFocused
                    ? "0 0 0 1px #9ca3af"
                    : "none",
                  cursor: "text",
                  "&:hover": {
                    borderColor: "#9ca3af",
                  },
                }),

                menu: (base) => ({
                  ...base,
                  zIndex: 50,
                  borderRadius: "12px",
                  overflow: "hidden",
                }),

                option: (
                  base,
                  state
                ) => ({
                  ...base,
                  cursor: "pointer",
                  padding: "10px 14px",
                  backgroundColor:
                    state.isFocused
                      ? "#f3f4f6"
                      : "#ffffff",
                  color: "#1f2937",
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "#6b7280",
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "#1f2937",
                }),
              }}
            />

          </div>
        </div>

        {/* =====================================================
    FEATURED CITY CARDS
    MOBILE  → 3
    TABLET  → 4
    DESKTOP → 6
===================================================== */}

<div className="
  grid
  grid-cols-3
  md:grid-cols-4
  lg:grid-cols-6
  gap-3
  md:gap-5
">

  {cities.map((city) => {
  const cityImage = getCityImage(city);

  return (

    <button
      key={city._id || city.slug}
      type="button"
      onClick={() => openCity(city)}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-white
        border
        border-gray-200
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
        text-left
      "
    >

      {/* =================================================
          CITY IMAGE
      ================================================= */}

      <div className="
        relative
        h-36
        md:h-44
        overflow-hidden
      ">

       {cityImage ? (
  <img
    src={cityImage}
            alt={`${city.name}${city.state ? `, ${city.state}` : ""}`}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
            loading="lazy"
          />

        ) : (

          <div className="
            w-full
            h-full
            bg-gradient-to-br
            from-gray-600
            via-gray-700
            to-gray-900
            flex
            items-center
            justify-center
          ">
            <span className="text-4xl opacity-60">
              📍
            </span>
          </div>

        )}

        {/* =================================================
            SUBTLE GRADIENT
        ================================================= */}

        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/70
          via-black/10
          to-transparent
        " />

        {/* =================================================
            LOCATION BADGE
        ================================================= */}

        <div className="
          absolute
          top-3
          left-3
          w-7
          h-7
          rounded-full
          bg-white/90
          backdrop-blur-sm
          flex
          items-center
          justify-center
          shadow-sm
        ">
          <span className="text-sm">
            📍
          </span>
        </div>

        {/* =================================================
            HOVER ARROW
        ================================================= */}

        <div className="
          absolute
          top-3
          right-3
          w-8
          h-8
          rounded-full
          bg-white/90
          backdrop-blur-sm
          flex
          items-center
          justify-center
          opacity-0
          translate-x-1
          group-hover:opacity-100
          group-hover:translate-x-0
          transition-all
          duration-300
          shadow-sm
        ">
          <span className="
            text-gray-800
            text-sm
            font-bold
          ">
            ↗
          </span>
        </div>

        {/* =================================================
            CITY NAME ON IMAGE
        ================================================= */}

        <div className="
          absolute
          left-0
          right-0
          bottom-0
          px-3
          pb-3
        ">

          <h3 className="
            text-sm
            md:text-base
            font-bold
            text-white
            leading-tight
            truncate
          ">
            {city.name}
          </h3>

          {city.state && (
            <p className="
              text-[11px]
              md:text-xs
              text-white/85
              mt-0.5
              truncate
            ">
              {city.state}
            </p>
          )}

        </div>

      </div>

      {/* =================================================
          CARD FOOTER
      ================================================= */}

      <div className="
        px-3
        py-3
        flex
        items-center
        justify-between
        gap-2
        bg-white
      ">

        <span className="
          text-[11px]
          md:text-xs
          font-medium
          text-gray-600
          truncate
        ">
          Explore businesses
        </span>

        <span className="
          shrink-0
          text-gray-400
          group-hover:text-blue-600
          group-hover:translate-x-1
          transition-all
          duration-300
        ">
          →
        </span>

      </div>

    </button>
  );
})}

</div>

      </div>

    </section>
  );
};

export default FeaturedCities;