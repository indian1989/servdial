import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ChevronRight,
  MapPin,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

import API from "../api/axios";

import {
  Helmet,
} from "react-helmet-async";

import BusinessCard from "../components/business/BusinessCard";


const StatePage = () => {

  const {
    stateSlug,
  } = useParams();

  const navigate =
    useNavigate();


  const [
    states,
    setStates,
  ] = useState([]);


  const [
    selectedState,
    setSelectedState,
  ] = useState("");

  const [
  stateSearch,
  setStateSearch,
] = useState("");

const [
  stateDropdownOpen,
  setStateDropdownOpen,
] = useState(false);

  const [
    cities,
    setCities,
  ] = useState([]);

  const [
    selectedCity,
    setSelectedCity,
  ] = useState("");

  const [
    citySearch,
    setCitySearch,
  ] = useState("");

  const [
    cityDropdownOpen,
    setCityDropdownOpen,
  ] = useState(false);

  const [
    businesses,
    setBusinesses,
  ] = useState([]);


  const [
    loadingStates,
    setLoadingStates,
  ] = useState(true);


  const [
    loadingBusinesses,
    setLoadingBusinesses,
  ] = useState(false);


  const [
    stateNotFound,
    setStateNotFound,
  ] = useState(false);


  /* =====================================================
     STATE SLUG HELPER
  ===================================================== */

  const slugifyState =
    (value = "") =>
      String(value)
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    /* =====================================================
     SEARCHABLE STATE LIST
  ===================================================== */

  const filteredStates =
    states
      .filter((state) => {

        const search =
          stateSearch
            .trim()
            .toLowerCase();

        if (!search) {
          return true;
        }

        return String(state)
          .toLowerCase()
          .includes(search);

      })
      .sort((a, b) => {

        const search =
          stateSearch
            .trim()
            .toLowerCase();

        if (!search) {
          return String(a).localeCompare(
            String(b)
          );
        }

        const aValue =
          String(a).toLowerCase();

        const bValue =
          String(b).toLowerCase();

        const aStarts =
          aValue.startsWith(search);

        const bStarts =
          bValue.startsWith(search);

        if (aStarts && !bStarts) {
          return -1;
        }

        if (!aStarts && bStarts) {
          return 1;
        }

        return aValue.localeCompare(
          bValue
        );

      });

      /* =====================================================
     FILTER CITIES BY SELECTED STATE
  ===================================================== */

  const filteredCities =
    cities
      .filter((city) => {

        if (
          !selectedState
        ) {
          return false;
        }

        const cityState =
          String(
            city.state || ""
          )
            .trim()
            .toLowerCase();

        const currentState =
          String(
            selectedState
          )
            .trim()
            .toLowerCase();

        if (
          cityState !==
          currentState
        ) {
          return false;
        }

        const search =
          citySearch
            .trim()
            .toLowerCase();

        if (!search) {
          return true;
        }

        return String(
          city.name || ""
        )
          .toLowerCase()
          .includes(search);

      })
      .sort((a, b) => {

        const search =
          citySearch
            .trim()
            .toLowerCase();

        const aValue =
          String(
            a.name || ""
          ).toLowerCase();

        const bValue =
          String(
            b.name || ""
          ).toLowerCase();

        if (!search) {
          return aValue.localeCompare(
            bValue
          );
        }

        const aStarts =
          aValue.startsWith(search);

        const bStarts =
          bValue.startsWith(search);

        if (
          aStarts &&
          !bStarts
        ) {
          return -1;
        }

        if (
          !aStarts &&
          bStarts
        ) {
          return 1;
        }

        return aValue.localeCompare(
          bValue
        );

      });

  /* =====================================================
     LOAD STATES
  ===================================================== */

  useEffect(() => {

    const loadStates =
      async () => {

        try {

          setLoadingStates(true);

          const response =
            await API.get(
              "/cities/states"
            );


          if (
            response.data?.success
          ) {

            const stateList =
              response.data.data || [];

            setStates(stateList);

          } else {

            setStates([]);

          }

        } catch (error) {

          console.error(
            "Failed to load states:",
            error
          );

          setStates([]);

        } finally {

          setLoadingStates(false);

        }

      };


    loadStates();

  }, []);

    /* =====================================================
     LOAD CITIES
  ===================================================== */

  useEffect(() => {

    const loadCities =
      async () => {

        try {

          const response =
            await API.get(
              "/cities",
              {
                params: {
                  dropdown: true,
                },
              }
            );

          const cityList =
            response.data?.data?.cities ||
            response.data?.cities ||
            response.data?.data ||
            [];

          setCities(
            Array.isArray(cityList)
              ? cityList
              : []
          );

        } catch (error) {

          console.error(
            "Failed to load cities:",
            error
          );

          setCities([]);

        }

      };

    loadCities();

  }, []);

  /* =====================================================
     RESOLVE URL STATE → STATE NAME
  ===================================================== */

  useEffect(() => {

    if (
      loadingStates ||
      states.length === 0
    ) {
      return;
    }


    /*
     * No state in URL
     * Example:
     * /states
     */
    if (!stateSlug) {

      setSelectedState("");
      setStateNotFound(false);

      return;

    }


    const normalizedSlug =
      slugifyState(stateSlug);


    const matchedState =
      states.find(
        (state) =>
          slugifyState(state) ===
          normalizedSlug
      );


    if (matchedState) {

      setSelectedState(
        matchedState
      );

      setStateNotFound(false);

    } else {

      setSelectedState("");
      setStateNotFound(true);

    }

  }, [
    stateSlug,
    states,
    loadingStates,
  ]);


  /* =====================================================
     LOAD RANDOM STATE BUSINESSES
  ===================================================== */

  useEffect(() => {

    if (!selectedState) {

      setBusinesses([]);

      return;

    }


    const loadBusinesses =
      async () => {

        try {

          setLoadingBusinesses(true);

          const response =
            await API.get(
              "/businesses/random-state",
              {
                params: {
                    state:
                        selectedState,
                    ...(selectedCity
                        ? {
                            city:
                            selectedCity,
                        }
                        : {}),
                    limit: 20,
                    },
              }
            );


          if (
            response.data?.success
          ) {

            setBusinesses(
              response.data.data || []
            );

          } else {

            setBusinesses([]);

          }

        } catch (error) {

          console.error(
            "Failed to load state businesses:",
            error
          );

          setBusinesses([]);

        } finally {

          setLoadingBusinesses(false);

        }

      };


    loadBusinesses();

  }, [
  selectedState,
  selectedCity,
]);


    /* =====================================================
     STATE CHANGE
  ===================================================== */

  const handleStateChange =
    (newState) => {

      if (!newState) {
        return;
      }

      const newStateSlug =
        slugifyState(
          newState
        );

      setSelectedState(
        newState
      );

      // Reset city when state changes
      setSelectedCity("");

      setCitySearch("");

      setCityDropdownOpen(
        false
      );

      setStateSearch("");

      setStateDropdownOpen(
        false
      );

      setStateNotFound(
        false
      );

      navigate(
        `/${newStateSlug}`
      );

    };


      /* =====================================================
     CITY CHANGE
  ===================================================== */

  const handleCityChange =
    (city) => {

      if (!city) {
        return;
      }

      setSelectedCity(
        city.name
      );

      setCitySearch("");

      setCityDropdownOpen(
        false
      );

    };


  /* =====================================================
     SEO
  ===================================================== */

  const pageTitle =
    selectedState
      ? `Businesses in ${selectedState}, India | ServDial`
      : "Businesses by State in India | ServDial";


  const pageDescription =
    selectedState
      ? `Discover local businesses, services and places across ${selectedState}, India on ServDial. Explore trusted local businesses, services, contact details and more.`
      : "Discover local businesses and services across different states in India on ServDial.";


  const canonicalUrl =
    selectedState
      ? `https://servdial.com/${slugifyState(
          selectedState
        )}`
      : "https://servdial.com/states";


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>

      <Helmet>

        <title>
          {pageTitle}
        </title>

        <meta
          name="description"
          content={
            pageDescription
          }
        />

        <link
          rel="canonical"
          href={
            canonicalUrl
          }
        />

      </Helmet>


      <main className="min-h-screen bg-gray-50">


        {/* =================================================
            BLUE PAGE HEADER
        ================================================= */}

        <div className="bg-blue-600 text-white">

          <div className="max-w-7xl mx-auto px-4 py-8">


            {/* =================================================
                BREADCRUMB
            ================================================= */}

            <nav
              className="flex items-center gap-2 text-sm mb-6"
              aria-label="Breadcrumb"
            >

              <Link
                to="/"
                className="hover:text-blue-100 transition"
              >
                Home
              </Link>


              <span>
                &gt;
              </span>


              <span className="font-medium">
                {selectedState ||
                  "States"}
              </span>

            </nav>


            {/* =================================================
                HEADER
            ================================================= */}

            <div>

              <div className="flex items-center gap-3 mb-3">

                <MapPin
                  size={28}
                />

                <h1 className="text-3xl md:text-4xl font-bold">
                  {selectedState
                    ? `Businesses in ${selectedState}, India`
                    : "Explore Businesses by State"}
                </h1>

              </div>


              <p className="text-blue-100 text-base md:text-lg">
                {selectedState
                  ? `Discover local businesses and services across ${selectedState}, India with ServDial.`
                  : "Discover local businesses and services across India with ServDial."}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="max-w-7xl mx-auto px-4 py-10">


          {/* =================================================
              STATE SELECTOR
          ================================================= */}

          <section className="mb-10">

            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select State
            </label>


                        <div className="relative w-full md:w-96">

              {/* =================================================
                  SEARCH INPUT
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setStateDropdownOpen(
                    !stateDropdownOpen
                  )
                }
                disabled={loadingStates}
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-left shadow-sm outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              >

                <span
                  className={
                    selectedState
                      ? "text-gray-900"
                      : "text-gray-500"
                  }
                >
                  {loadingStates
                    ? "Loading states..."
                    : selectedState ||
                      "Select a state"}
                </span>

                <ChevronDown
                  size={18}
                  className={
                    stateDropdownOpen
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />

              </button>


              {/* =================================================
                  DROPDOWN
              ================================================= */}

              {stateDropdownOpen &&
                !loadingStates && (

                  <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">


                    {/* =================================================
                        SEARCH BOX
                    ================================================= */}

                    <div className="relative border-b border-gray-200 p-3">

                      <Search
                        size={18}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={stateSearch}
                        onChange={(event) =>
                          setStateSearch(
                            event.target.value
                          )
                        }
                        placeholder="Search state..."
                        autoFocus
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />


                      {stateSearch && (

                        <button
                          type="button"
                          onClick={() =>
                            setStateSearch("")
                          }
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          aria-label="Clear search"
                        >
                          <X
                            size={16}
                          />
                        </button>

                      )}

                    </div>


                    {/* =================================================
                        STATE LIST
                    ================================================= */}

                    <div className="max-h-64 overflow-y-auto">

                      {filteredStates.length === 0 ? (

                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          No states found
                        </div>

                      ) : (

                        filteredStates.map(
                          (state) => (

                            <button
                              key={state}
                              type="button"
                              onClick={() =>
                                handleStateChange(
                                  state
                                )
                              }
                              className={`w-full px-4 py-3 text-left text-sm transition ${
                                selectedState === state
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >

                              {state}

                            </button>

                          )
                        )

                      )}

                    </div>

                  </div>

                )}

            </div>

                {/* =================================================
                CITY SELECTOR
            ================================================= */}

            {selectedState &&
              !stateNotFound && (

                <div className="mt-5 w-full md:w-96">

                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select City ( Optional )
                  </label>


                  <div className="relative">

                    {/* =================================================
                        CITY SELECT BUTTON
                    ================================================= */}

                    <button
                      id="city"
                      type="button"
                      onClick={() =>
                        setCityDropdownOpen(
                          !cityDropdownOpen
                        )
                      }
                      className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-left shadow-sm outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >

                      <span
                        className={
                          selectedCity
                            ? "text-gray-900"
                            : "text-gray-500"
                        }
                      >
                        {selectedCity ||
                          "Select a city"}
                      </span>


                      <ChevronDown
                        size={18}
                        className={
                          cityDropdownOpen
                            ? "rotate-180 transition-transform"
                            : "transition-transform"
                        }
                      />

                    </button>


                    {/* =================================================
                        CITY DROPDOWN
                    ================================================= */}

                    {cityDropdownOpen && (

                      <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">


                        {/* =================================================
                            SEARCH CITY
                        ================================================= */}

                        <div className="relative border-b border-gray-200 p-3">

                          <Search
                            size={18}
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                          />


                          <input
                            type="text"
                            value={
                              citySearch
                            }
                            onChange={(event) =>
                              setCitySearch(
                                event.target.value
                              )
                            }
                            placeholder="Search city..."
                            autoFocus
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />


                          {citySearch && (

                            <button
                              type="button"
                              onClick={() =>
                                setCitySearch("")
                              }
                              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                              aria-label="Clear city search"
                            >

                              <X
                                size={16}
                              />

                            </button>

                          )}

                        </div>


                        {/* =================================================
                            CITY LIST
                        ================================================= */}

                        <div className="max-h-64 overflow-y-auto">

                          {filteredCities.length === 0 ? (

                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                              No cities found
                            </div>

                          ) : (

                            filteredCities.map(
                              (city) => (

                                <button
                                  key={
                                    city._id ||
                                    city.slug ||
                                    city.name
                                  }
                                  type="button"
                                  onClick={() =>
                                    handleCityChange(
                                      city
                                    )
                                  }
                                  className={`w-full px-4 py-3 text-left text-sm transition ${
                                    selectedCity ===
                                    city.name
                                      ? "bg-blue-50 text-blue-700 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >

                                  {city.name}

                                </button>

                              )
                            )

                          )}

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              )}

          </section>


          {/* =================================================
              INVALID STATE
          ================================================= */}

          {!loadingStates &&
            stateNotFound && (

              <section className="bg-white rounded-2xl border border-gray-200 p-10 text-center">

                <div className="text-5xl mb-4">
                  📍
                </div>


                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  State not found
                </h2>


                <p className="text-gray-500">
                  We couldn't find the state
                  <span className="font-medium text-gray-700">
                    {" "}
                    "{stateSlug}"
                  </span>
                  .
                </p>

              </section>

            )}


          {/* =================================================
              BUSINESSES
          ================================================= */}

          {selectedState &&
            !stateNotFound && (

              <section>


                <div className="mb-6">

                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Local Businesses in{" "}
                    {selectedState}
                  </h2>


                  <p className="text-sm text-gray-600 mt-1">
                    Explore randomly selected
                    businesses from across{" "}
                    {selectedState}.
                  </p>

                </div>


                {/* =================================================
                    BUSINESS LOADING
                ================================================= */}

                {loadingBusinesses ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {Array.from(
                      {
                        length: 8,
                      }
                    ).map(
                      (_, index) => (

                        <div
                          key={index}
                          className="h-72 bg-white rounded-2xl shadow-sm animate-pulse"
                        />

                      )
                    )}

                  </div>


                ) : businesses.length === 0 ? (


                  /* =================================================
                     NO BUSINESSES
                  ================================================= */

                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">

                    <div className="text-5xl mb-4">
                      📍
                    </div>


                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      No businesses found
                    </h2>


                    <p className="text-gray-500">
                      No businesses are currently
                      available in{" "}
                      {selectedState}.
                    </p>

                  </div>


                ) : (


                  /* =================================================
                     BUSINESS GRID
                  ================================================= */

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {businesses.map(
                      (business) => (

                        <BusinessCard
                          key={
                            business._id
                          }
                          business={
                            business
                          }
                        />

                      )
                    )}

                  </div>

                )}

              </section>

            )}

        </div>

      </main>

    </>
  );

};


export default StatePage;