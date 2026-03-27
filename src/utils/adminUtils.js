import slugify from "slugify";

export const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (t) =>
    t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  );

export const normalizeCategory = (cat) => ({
  ...cat,
  name: cat.name ? toTitleCase(cat.name) : "",
  slug: cat.slug || slugify(cat.name || "", { lower: true }),
  order: Number(cat.order) || 0,
  status: cat.status || "active",
  description: cat.description || "",
});

export const buildCategoryTree = (cats) => {
  const map = {};
  const roots = [];

  cats.forEach((c) => {
    map[c._id] = { ...normalizeCategory(c), subcategories: [] };
  });

  cats.forEach((c) => {
    const parentId =
      typeof c.parentCategory === "object"
        ? c.parentCategory?._id
        : c.parentCategory;

    if (parentId && map[parentId]) {
      map[parentId].subcategories.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });

  const sortTree = (nodes) => {
    nodes.sort(
      (a, b) =>
        (a.order || 0) - (b.order || 0) ||
        a.name.localeCompare(b.name)
    );
    nodes.forEach((n) => sortTree(n.subcategories));
  };

  sortTree(roots);
  return roots;
};