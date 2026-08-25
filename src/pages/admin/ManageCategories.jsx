// frontend/src/pages/admin/ManageCategories.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/adminAPI";

import Loader from "../../components/common/Loader";

import {
  FaTrash,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

import { toTitleCase } from "../../utils/adminUtils";


/* =========================================================
   CATEGORY FEATURES
========================================================= */

const CATEGORY_FEATURES = [
  {
    value: "pricing",
    label: "Pricing",
  },
  {
    value: "services",
    label: "Services",
  },
  {
    value: "catalog",
    label: "Catalog",
  },
  {
    value: "food_menu",
    label: "Food Menu",
  },
  {
    value: "appointment_booking",
    label: "Appointment Booking",
  },
  {
    value: "table_booking",
    label: "Table Booking",
  },
  {
    value: "room_booking",
    label: "Room Booking",
  },
  {
    value: "party_booking",
    label: "Party Booking",
  },
  {
    value: "faq",
    label: "FAQ",
  },
  {
    value: "offers",
    label: "Offers",
  },
  {
    value: "business_hours",
    label: "Business Hours",
  },
  {
    value: "lead_form",
    label: "Lead / Enquiry Form",
  },
];


/* =========================================================
   UI TYPES

   Must match Category.js enum exactly.
========================================================= */

const UI_TYPES = [
  {
    value: "service",
    label: "Service",
  },
  {
    value: "sell-service",
    label: "Sell & Service",
  },
  {
    value: "restaurant",
    label: "Restaurant",
  },
  {
    value: "hotel",
    label: "Hotel",
  },
  {
    value: "appointment",
    label: "Appointment",
  },
  {
    value: "shopping",
    label: "Shopping",
  },
  {
    value: "consultation",
    label: "Consultation",
  },
];


/* =========================================================
   HELPERS
========================================================= */

const normalize = (str = "") =>
  String(str)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();


const normalizeFeatures = (features = []) => {

  if (!Array.isArray(features)) {
    return [];
  }

  return [
    ...new Set(
      features
        .map((feature) =>
          String(feature)
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    ),
  ];
};


/* =========================================================
   TREE BUILDER
========================================================= */

const buildTree = (
  categories,
  parentId = null
) => {

  return categories

    .filter((cat) =>
      parentId === null
        ? !cat.parentCategory
        : String(cat.parentCategory) ===
          String(parentId)
    )

    .map((cat) => ({
      ...cat,

      children:
        buildTree(
          categories,
          cat._id
        ),
    }));
};


/* =========================================================
   FEATURE CHECKBOX GROUP
========================================================= */

const FeatureCheckboxGroup = ({
  value = [],
  onChange,
}) => {

  const selectedFeatures =
    normalizeFeatures(value);


  const toggleFeature = (
    featureValue,
    checked
  ) => {

    const current =
      normalizeFeatures(value);


    let updated;


    if (checked) {

      updated = [
        ...current,
        featureValue,
      ];

    } else {

      updated =
        current.filter(
          (item) =>
            item !== featureValue
        );

    }


    onChange(
      normalizeFeatures(updated)
    );
  };


  return (

    <div
      className="
        border
        rounded-lg
        p-4
        bg-gray-50
      "
    >

      <div
        className="
          font-semibold
          text-sm
          mb-3
        "
      >
        Category Features
      </div>


      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          gap-2
        "
      >

        {CATEGORY_FEATURES.map(
          (feature) => (

            <label
              key={feature.value}
              className="
                flex
                items-center
                gap-2
                text-sm
                cursor-pointer
                border
                rounded
                px-2
                py-2
                bg-white
                hover:bg-blue-50
              "
            >

              <input
                type="checkbox"
                checked={selectedFeatures.includes(
                  feature.value
                )}
                onChange={(e) =>
                  toggleFeature(
                    feature.value,
                    e.target.checked
                  )
                }
              />

              <span>
                {feature.label}
              </span>

            </label>

          )
        )}

      </div>

    </div>

  );
};


/* =========================================================
   FEATURE DISPLAY
========================================================= */

const getFeatureLabel = (
  featureValue
) => {

  const feature =
    CATEGORY_FEATURES.find(
      (item) =>
        item.value === featureValue
    );

  return (
    feature?.label ||
    featureValue
  );
};


const FeatureDisplay = ({
  features = [],
}) => {

  const normalized =
    normalizeFeatures(features);


  if (
    normalized.length === 0
  ) {

    return (
      <span className="text-gray-400 text-xs">
        No features
      </span>
    );

  }


  return (

    <div className="flex flex-wrap gap-1">

      {normalized.map(
        (feature) => (

          <span
            key={feature}
            className="
              inline-flex
              items-center
              px-2
              py-1
              rounded-full
              bg-blue-50
              text-blue-700
              text-xs
              border
              border-blue-100
            "
          >
            {getFeatureLabel(
              feature
            )}
          </span>

        )
      )}

    </div>

  );
};


/* =========================================================
   INITIAL STATES
========================================================= */

const EMPTY_NEW_CATEGORY = {
  name: "",
  description: "",
  order: 0,
  parentCategory: "",
  uiType: "service",
  features: [],
};


const EMPTY_EDIT_CATEGORY = {
  name: "",
  description: "",
  order: 0,
  isTrending: false,
  uiType: "service",
  features: [],
};


/* =========================================================
   COMPONENT
========================================================= */

const ManageCategories = () => {

  const [
    flatCategories,
    setFlatCategories,
  ] = useState([]);


  const [
    tree,
    setTree,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    expanded,
    setExpanded,
  ] = useState({});


  const [
    newCategory,
    setNewCategory,
  ] = useState(
    EMPTY_NEW_CATEGORY
  );


  const [
    editingId,
    setEditingId,
  ] = useState(null);


  const [
    editingData,
    setEditingData,
  ] = useState(
    EMPTY_EDIT_CATEGORY
  );


  /* =======================================================
     FETCH
  ======================================================= */

  const fetchCategories =
    async () => {

      setLoading(true);

      try {

        const res =
          await getAllCategories();


        const flat =
          res?.data?.data ||
          res?.data?.flatCategories ||
          [];


        const normalized =
          flat.map((category) => ({
            ...category,

            features:
              normalizeFeatures(
                category.features
              ),

            uiType:
              category.uiType ||
              "service",
          }));


        setFlatCategories(
          normalized
        );


        setTree(
          buildTree(normalized)
        );


        setExpanded({});

      } catch (err) {

        console.error(
          "Failed to fetch categories:",
          err
        );

        alert(
          "Failed to fetch categories"
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    fetchCategories();

  }, []);


  /* =======================================================
     FILTER TREE
  ======================================================= */

  const filteredTree =
    useMemo(() => {

      if (!search.trim()) {
        return tree;
      }


      const q =
        normalize(search);


      const filterNodes =
        (nodes = []) =>

          nodes

            .map((node) => {

              const children =
                filterNodes(
                  node.children || []
                );


              const match =
                normalize(node.name)
                  .includes(q) ||
                children.length > 0;


              return match
                ? {
                    ...node,
                    children,
                  }
                : null;

            })

            .filter(Boolean);


      return filterNodes(tree);

    }, [
      search,
      tree,
    ]);


  /* =======================================================
     EXISTING CATEGORY
  ======================================================= */

  const existingCategory =
    useMemo(() => {

      const newName =
        normalize(
          newCategory.name
        );


      if (!newName) {
        return null;
      }


      return flatCategories.find(
        (category) =>

          normalize(
            category.name
          ) === newName &&

          String(
            category.parentCategory ||
            ""
          ) ===
          String(
            newCategory.parentCategory ||
            ""
          )
      );

    }, [
      flatCategories,
      newCategory.name,
      newCategory.parentCategory,
    ]);


  /* =======================================================
     ADD CATEGORY
  ======================================================= */

  const handleAdd =
    async () => {

      if (
        !newCategory.name.trim()
      ) {

        alert(
          "Name required"
        );

        return;
      }


      if (existingCategory) {

        alert(
          `"${existingCategory.name}" already exists in this Parent`
        );

        return;
      }


      const orderValue =
        newCategory.order === "" ||
        newCategory.order === null
          ? 0
          : Number(
              newCategory.order
            );


      setActionLoading(true);


      try {

        await addCategory({

          name:
            toTitleCase(
              newCategory.name
            ),


          description:
            newCategory.description
              ?.trim() || "",


          order:
            Number.isFinite(
              orderValue
            )
              ? orderValue
              : 0,


          parentCategory:
            newCategory.parentCategory ||
            null,


          uiType:
            newCategory.uiType ||
            "service",


          features:
            normalizeFeatures(
              newCategory.features
            ),

        });


        setNewCategory({
          ...EMPTY_NEW_CATEGORY,
        });


        await fetchCategories();

      } catch (err) {

        console.error(
          "Add category failed:",
          err
        );

        alert(
          err?.response?.data?.message ||
          "Failed to add category"
        );

      } finally {

        setActionLoading(false);

      }

    };


  /* =======================================================
     START EDIT
  ======================================================= */

  const startEdit =
    (category) => {

      setEditingId(
        category._id
      );


      setEditingData({

        name:
          category.name || "",


        description:
          category.description || "",


        order:
          Number(
            category.order ?? 0
          ),


        isTrending:
          Boolean(
            category.isTrending
          ),


        uiType:
          category.uiType ||
          "service",


        features:
          normalizeFeatures(
            category.features
          ),

      });

    };


  /* =======================================================
     UPDATE
  ======================================================= */

  const handleUpdate =
    async (id) => {

      if (
        !editingData.name.trim()
      ) {

        alert(
          "Name required"
        );

        return;
      }


      setActionLoading(true);


      try {

        await updateCategory(
          id,
          {

            name:
              toTitleCase(
                editingData.name
              ),


            description:
              editingData.description
                ?.trim() || "",


            order:
              Number(
                editingData.order
              ) || 0,


            isTrending:
              Boolean(
                editingData.isTrending
              ),


            uiType:
              editingData.uiType ||
              "service",


            features:
              normalizeFeatures(
                editingData.features
              ),

          }
        );


        setEditingId(null);


        setEditingData({
          ...EMPTY_EDIT_CATEGORY,
        });


        await fetchCategories();

      } catch (err) {

        console.error(
          "Update category failed:",
          err
        );

        alert(
          err?.response?.data?.message ||
          "Failed to update category"
        );

      } finally {

        setActionLoading(false);

      }

    };


  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this category?"
        )
      ) {

        return;
      }


      setActionLoading(true);


      try {

        await deleteCategory(id);


        const updated =
          flatCategories.filter(
            (category) =>
              category._id !== id
          );


        setFlatCategories(
          updated
        );


        setTree(
          buildTree(updated)
        );

      } catch (err) {

        console.error(
          "Delete category failed:",
          err
        );

        alert(
          err?.response?.data?.message ||
          "Failed to delete category"
        );

      } finally {

        setActionLoading(false);

      }

    };


  /* =======================================================
     TOGGLE STATUS / TRENDING
  ======================================================= */

  const toggleField =
    async (
      category,
      field
    ) => {

      try {

        let newValue;


        if (
          field === "status"
        ) {

          newValue =
            category.status ===
            "active"
              ? "inactive"
              : "active";

        } else {

          newValue =
            !category[field];

        }


        await updateCategory(
          category._id,
          {
            [field]:
              newValue,
          }
        );


        const updated =
          flatCategories.map(
            (item) =>

              item._id ===
              category._id

                ? {
                    ...item,
                    [field]:
                      newValue,
                  }

                : item
          );


        setFlatCategories(
          updated
        );


        setTree(
          buildTree(updated)
        );

      } catch (err) {

        console.error(
          "Toggle failed:",
          err
        );

        alert(
          err?.response?.data?.message ||
          "Failed to update category"
        );

      }

    };


  /* =======================================================
     RENDER ROW
  ======================================================= */

  const renderRow =
    (
      category,
      level = 0
    ) => {

      const isOpen =
        Boolean(
          expanded[
            category._id
          ]
        );


      const isEditing =
        editingId ===
        category._id;


      return (

        <React.Fragment
          key={category._id}
        >

          <tr
            className="
              text-center
              hover:bg-gray-50
              align-top
            "
          >

            {/* NAME */}

            <td
              className="
                border
                px-3
                py-3
                text-left
              "
              style={{
                paddingLeft:
                  `${level * 20 + 12}px`,
              }}
            >

              <div
                className="
                  flex
                  items-start
                  gap-2
                "
              >

                {category.children?.length >
                  0 ? (

                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(
                        (prev) => ({
                          ...prev,

                          [category._id]:
                            !prev[
                              category._id
                            ],
                        })
                      )
                    }
                    className="
                      mt-1
                      text-gray-600
                    "
                  >

                    {isOpen ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}

                  </button>

                ) : (

                  <span
                    className="w-3"
                  />

                )}


                <div className="flex-1">

                  {isEditing ? (

                    <input
                      value={
                        editingData.name
                      }
                      onChange={(e) =>
                        setEditingData(
                          (prev) => ({
                            ...prev,
                            name:
                              e.target.value,
                          })
                        )
                      }
                      className="
                        border
                        px-2
                        py-1
                        rounded
                        w-full
                      "
                    />

                  ) : (

                    <div
                      className="
                        font-medium
                      "
                    >
                      {category.name}
                    </div>

                  )}

                </div>

              </div>

            </td>


            {/* DESCRIPTION */}

            <td
              className="
                border
                px-3
                py-3
              "
            >

              {isEditing ? (

                <input
                  value={
                    editingData.description
                  }
                  onChange={(e) =>
                    setEditingData(
                      (prev) => ({
                        ...prev,
                        description:
                          e.target.value,
                      })
                    )
                  }
                  className="
                    border
                    px-2
                    py-1
                    rounded
                    w-full
                  "
                />

              ) : (

                <span>
                  {category.description ||
                    "-"}
                </span>

              )}

            </td>


            {/* UI TYPE */}

            <td
              className="
                border
                px-3
                py-3
              "
            >

              {isEditing ? (

                <select
                  value={
                    editingData.uiType
                  }
                  onChange={(e) =>
                    setEditingData(
                      (prev) => ({
                        ...prev,
                        uiType:
                          e.target.value,
                      })
                    )
                  }
                  className="
                    border
                    px-2
                    py-1
                    rounded
                    w-full
                  "
                >

                  {UI_TYPES.map(
                    (type) => (

                      <option
                        key={
                          type.value
                        }
                        value={
                          type.value
                        }
                      >
                        {type.label}
                      </option>

                    )
                  )}

                </select>

              ) : (

                <span
                  className="
                    inline-flex
                    px-2
                    py-1
                    rounded-full
                    bg-gray-100
                    text-gray-700
                    text-xs
                  "
                >
                  {category.uiType ||
                    "service"}
                </span>

              )}

            </td>


            {/* FEATURES */}

            <td
              className="
                border
                px-3
                py-3
                min-w-[260px]
              "
            >

              {isEditing ? (

                <FeatureCheckboxGroup

                  value={
                    editingData.features
                  }

                  onChange={(
                    features
                  ) =>
                    setEditingData(
                      (prev) => ({
                        ...prev,
                        features,
                      })
                    )
                  }

                />

              ) : (

                <FeatureDisplay
                  features={
                    category.features
                  }
                />

              )}

            </td>


            {/* ORDER */}

            <td
              className="
                border
                px-3
                py-3
              "
            >

              {isEditing ? (

                <input
                  type="number"
                  value={
                    editingData.order
                  }
                  onChange={(e) =>
                    setEditingData(
                      (prev) => ({
                        ...prev,
                        order:
                          e.target.value ===
                          ""
                            ? ""
                            : Number(
                                e.target.value
                              ),
                      })
                    )
                  }
                  className="
                    border
                    px-2
                    py-1
                    rounded
                    w-20
                  "
                />

              ) : (

                category.order ?? 0

              )}

            </td>


            {/* STATUS */}

            <td
              className="
                border
                px-3
                py-3
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  items-center
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    toggleField(
                      category,
                      "status"
                    )
                  }
                  className={`
                    px-2
                    py-1
                    rounded
                    text-xs
                    ${
                      category.status ===
                      "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }
                  `}
                >
                  {category.status ||
                    "inactive"}
                </button>


                <button
                  type="button"
                  onClick={() =>
                    toggleField(
                      category,
                      "isTrending"
                    )
                  }
                  className={`
                    px-2
                    py-1
                    rounded
                    text-xs
                    ${
                      category.isTrending
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }
                  `}
                >
                  Trending
                </button>

              </div>

            </td>


            {/* ACTIONS */}

            <td
              className="
                border
                px-3
                py-3
              "
            >

              <div
                className="
                  flex
                  justify-center
                  gap-2
                "
              >

                {isEditing ? (

                  <>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdate(
                          category._id
                        )
                      }
                      className="
                        bg-green-500
                        hover:bg-green-600
                        text-white
                        px-3
                        py-1
                        rounded
                        text-sm
                      "
                    >
                      Save
                    </button>


                    <button
                      type="button"
                      onClick={() => {

                        setEditingId(
                          null
                        );

                        setEditingData({
                          ...EMPTY_EDIT_CATEGORY,
                        });

                      }}
                      className="
                        bg-gray-400
                        hover:bg-gray-500
                        text-white
                        px-3
                        py-1
                        rounded
                        text-sm
                      "
                    >
                      Cancel
                    </button>

                  </>

                ) : (

                  <button
                    type="button"
                    onClick={() =>
                      startEdit(
                        category
                      )
                    }
                    className="
                      bg-yellow-500
                      hover:bg-yellow-600
                      text-white
                      px-2
                      py-1
                      rounded
                    "
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                )}


                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      category._id
                    )
                  }
                  className="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-2
                    py-1
                    rounded
                  "
                  title="Delete"
                >
                  <FaTrash />
                </button>

              </div>

            </td>

          </tr>


          {/* CHILDREN */}

          {isOpen &&
            category.children?.map(
              (child) =>
                renderRow(
                  child,
                  level + 1
                )
            )}

        </React.Fragment>

      );

    };


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div
      className="
        p-6
        max-w-7xl
        mx-auto
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-4
        "
      >
        Manage Categories
      </h2>


      {(loading ||
        actionLoading) && (
        <Loader />
      )}


      {/* ===================================================
          ADD CATEGORY
      =================================================== */}

      <div
        className="
          border
          rounded-xl
          p-4
          mb-6
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            text-lg
            font-semibold
            mb-4
          "
        >
          Add Category
        </div>


        <div
          className="
            grid
            md:grid-cols-5
            gap-3
          "
        >

          {/* NAME */}

          <div
            className="
              flex
              flex-col
            "
          >

            <input
              list="categorySuggestions"
              className={`
                border
                px-3
                py-2
                rounded
                ${
                  existingCategory
                    ? "border-red-500"
                    : ""
                }
              `}
              placeholder="
                Category / Subcategory Name
              "
              value={
                newCategory.name
              }
              onChange={(e) =>
                setNewCategory(
                  (prev) => ({
                    ...prev,
                    name:
                      e.target.value,
                  })
                )
              }
            />


            <datalist
              id="categorySuggestions"
            >

              {flatCategories.map(
                (category) => (

                  <option
                    key={
                      category._id
                    }
                    value={
                      category.name
                    }
                  />

                )
              )}

            </datalist>


            {existingCategory && (

              <span
                className="
                  text-red-500
                  text-xs
                  mt-1
                "
              >
                Already exists under
                selected parent
              </span>

            )}

          </div>


          {/* DESCRIPTION */}

          <input
            className="
              border
              px-3
              py-2
              rounded
            "
            placeholder="Description"
            value={
              newCategory.description
            }
            onChange={(e) =>
              setNewCategory(
                (prev) => ({
                  ...prev,
                  description:
                    e.target.value,
                })
              )
            }
          />


          {/* ORDER */}

          <input
            type="number"
            className="
              border
              px-3
              py-2
              rounded
            "
            placeholder="Order"
            value={
              newCategory.order
            }
            onChange={(e) =>
              setNewCategory(
                (prev) => ({
                  ...prev,

                  order:
                    e.target.value ===
                    ""
                      ? ""
                      : Number(
                          e.target.value
                        ),
                })
              )
            }
          />


          {/* PARENT */}

          <select
            className="
              border
              px-3
              py-2
              rounded
            "
            value={
              newCategory.parentCategory
            }
            onChange={(e) =>
              setNewCategory(
                (prev) => ({
                  ...prev,
                  parentCategory:
                    e.target.value,
                })
              )
            }
          >

            <option value="">
              No Parent
            </option>


            {flatCategories
              .filter(
                (category) =>
                  !category.parentCategory
              )
              .map(
                (category) => (

                  <option
                    key={
                      category._id
                    }
                    value={
                      category._id
                    }
                  >
                    {category.name}
                  </option>

                )
              )}

          </select>


          {/* UI TYPE */}

          <select
            className="
              border
              px-3
              py-2
              rounded
            "
            value={
              newCategory.uiType
            }
            onChange={(e) =>
              setNewCategory(
                (prev) => ({
                  ...prev,
                  uiType:
                    e.target.value,
                })
              )
            }
          >

            {UI_TYPES.map(
              (type) => (

                <option
                  key={
                    type.value
                  }
                  value={
                    type.value
                  }
                >
                  {type.label}
                </option>

              )
            )}

          </select>

        </div>


        {/* FEATURES */}

        <div className="mt-4">

          <FeatureCheckboxGroup

            value={
              newCategory.features
            }

            onChange={(
              features
            ) =>
              setNewCategory(
                (prev) => ({
                  ...prev,
                  features,
                })
              )
            }

          />

        </div>


        {/* ADD BUTTON */}

        <div className="mt-4">

          <button
            type="button"
            onClick={
              handleAdd
            }
            disabled={
              actionLoading
            }
            className="
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-50
              text-white
              rounded
              px-5
              py-2
            "
          >
            Add Category
          </button>

        </div>

      </div>


      {/* ===================================================
          SEARCH
      =================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          mb-4
        "
      >

        <FaSearch />

        <input
          className="
            border
            px-3
            py-2
            rounded
            w-full
          "
          placeholder="
            Search categories...
          "
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>


      {/* ===================================================
          TABLE
      =================================================== */}

      <div
        className="
          overflow-x-auto
          bg-white
          rounded-xl
          shadow-sm
        "
      >

        <table
          className="
            w-full
            border
            min-w-[1100px]
          "
        >

          <thead
            className="
              bg-gray-100
            "
          >

            <tr>

              <th
                className="
                  border
                  px-3
                  py-2
                  text-left
                "
              >
                Name
              </th>


              <th
                className="
                  border
                  px-3
                  py-2
                "
              >
                Description
              </th>


              <th
                className="
                  border
                  px-3
                  py-2
                "
              >
                UI Type
              </th>


              <th
                className="
                  border
                  px-3
                  py-2
                "
              >
                Features
              </th>


              <th
                className="
                  border
                  px-3
                  py-2
                "
              >
                Order
              </th>


              <th
                className="
                  border
                  px-3
                  py-2
                "
              >
                Status
              </th>


              <th
                className="
                  border
                  px-3
                  py-2
                "
              >
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredTree.length >
            0 ? (

              filteredTree.map(
                (category) =>
                  renderRow(
                    category
                  )
              )

            ) : (

              <tr>

                <td
                  colSpan={7}
                  className="
                    border
                    px-4
                    py-8
                    text-center
                    text-gray-500
                  "
                >
                  No categories found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};


export default ManageCategories;