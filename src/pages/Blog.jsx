// Path: frontend/src/pages/Blog.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaSearch,
  FaThumbtack,
} from "react-icons/fa";

import { getPublishedBlogs } from "../api/blogAPI";
import { getActiveBlogCategories } from "../api/blogCategoryAPI";

const Blog = ({ ssrBlog }) => {
  const initialSSRBlogs = Array.isArray(ssrBlog)
  ? ssrBlog
  : [];

const hasSSRBlogList = Array.isArray(ssrBlog);

  const [blogs, setBlogs] = useState(
  initialSSRBlogs
);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(
  !hasSSRBlogList
);
  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");

  // =========================
  // FETCH BLOGS
  // =========================

  useEffect(() => {
  if (hasSSRBlogList) {
    return;
  }

  const fetchBlogs = async () => {
      try {
        setLoading(true);

        const response = await getPublishedBlogs();

        const data = response?.data?.data;

        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (Array.isArray(data?.blogs)) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error(
          "❌ Failed to fetch published blogs:",
          error
        );

        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
    }, [hasSSRBlogList]);

  // =========================
  // FETCH CATEGORIES
  // =========================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);

        const response =
          await getActiveBlogCategories();

        const data = response?.data?.data;

        setCategories(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "❌ Failed to fetch blog categories:",
          error
        );

        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // HELPERS
  // =========================

  const getCategoryName = (blog) => {
    if (!blog?.category) {
      return "";
    }

    if (typeof blog.category === "string") {
      const category = categories.find(
        (item) => item._id === blog.category
      );

      return category?.name || "";
    }

    return blog.category?.name || "";
  };

  const getAuthorName = (blog) => {
    if (!blog?.author) {
      return "ServDial";
    }

    if (typeof blog.author === "string") {
      return blog.author;
    }

    return (
      blog.author?.name ||
      blog.author?.fullName ||
      "ServDial"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const stripHtml = (html = "") => {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};
  // =========================
  // FILTER BLOGS
  // =========================

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const categoryId =
        typeof blog.category === "string"
          ? blog.category
          : blog.category?._id;

      const matchesCategory =
        !selectedCategory ||
        categoryId === selectedCategory;

      const matchesSearch =
        !query ||
        blog?.title
          ?.toLowerCase()
          .includes(query) ||
        blog?.excerpt
          ?.toLowerCase()
          .includes(query) ||
        stripHtml(blog?.content)
          .toLowerCase()
          .includes(query) ||
        blog?.tags?.some((tag) =>
          tag?.toLowerCase().includes(query)
        );

      return (
        matchesCategory && matchesSearch
      );
    });
  }, [
    blogs,
    search,
    selectedCategory,
  ]);

  // =========================
  // FEATURED / LATEST
  // =========================

  const featuredBlog =
    filteredBlogs.length > 0
      ? filteredBlogs[0]
      : null;

  const latestBlogs = featuredBlog
    ? filteredBlogs.filter(
        (blog) =>
          blog._id !== featuredBlog._id
      )
    : [];

  // =========================
  // UI
  // =========================

  return (
    <>
    <Helmet>
  <title>
    ServDial Blog | Local Business Guides & Insights
  </title>

  <meta
    name="description"
    content="Discover useful local business insights, service guides, business tips and helpful information from ServDial."
  />

  <link
    rel="canonical"
    href="https://www.servdial.com/blog"
  />

  <meta
    property="og:title"
    content="ServDial Blog | Local Business Guides & Insights"
  />

  <meta
    property="og:description"
    content="Discover useful local business insights, service guides, business tips and helpful information from ServDial."
  />

  <meta
    property="og:url"
    content="https://www.servdial.com/blog"
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="ServDial Blog | Local Business Guides & Insights"
  />

  <meta
    name="twitter:description"
    content="Discover useful local business insights, service guides, business tips and helpful information from ServDial."
  />

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "ServDial Blog",
      url: "https://www.servdial.com/blog",
      description:
        "Discover useful local business insights, service guides, business tips and helpful information from ServDial.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.servdial.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.servdial.com/blog",
          },
        ],
      },
    })}
  </script>
</Helmet>

    <main className="min-h-screen bg-gray-50">

      <section className="mx-4 mt-6 rounded-2xl bg-blue-600 text-white">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

    {/* =========================
        BREADCRUMB
    ========================= */}

    <nav
      aria-label="Breadcrumb"
      className="mb-6 text-sm"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            to="/"
            className="text-blue-100 transition hover:text-white"
          >
            Home
          </Link>
        </li>

        <li className="text-blue-200">
          &gt;
        </li>

        <li
          aria-current="page"
          className="font-medium text-white"
        >
          Blog
        </li>
      </ol>
    </nav>

    {/* =========================
        HERO
    ========================= */}

    <div className="max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-100">
        ServDial Journal
      </p>

      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        ServDial Blog
      </h1>

      <p className="mt-4 text-base leading-7 text-blue-50 sm:text-lg">
        Discover useful insights, local business
        tips, service guides and helpful information
        from ServDial.
      </p>
    </div>

  </div>
</section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* SEARCH + CATEGORIES */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}

          <div className="relative w-full lg:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search blog posts..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* CATEGORIES */}

          {!categoryLoading &&
            categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory("")
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === ""
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category._id
                      )
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedCategory ===
                      category._id
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="py-20 text-center">
            <div className="text-sm font-medium text-gray-500">
              Loading blog posts...
            </div>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================= */}

        {!loading &&
          filteredBlogs.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                No blog posts found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try a different search term or category.
              </p>
            </div>
          )}

        {/* =========================
            FEATURED POST
        ========================= */}

        {!loading && featuredBlog && (
          <article className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* IMAGE */}

              <Link
                to={`/blog/${featuredBlog.slug}`}
                className="group block h-full min-h-[280px] overflow-hidden bg-gray-100 lg:min-h-[400px]"
              >
                {featuredBlog.featuredImage ? (
                  <img
                    src={
                      featuredBlog.featuredImage
                    }
                    alt={featuredBlog.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center bg-gray-100 text-sm text-gray-400 lg:min-h-[400px]">
                    ServDial Blog
                  </div>
                )}
              </Link>

              {/* CONTENT */}

              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    <FaThumbtack />
                    Featured
                  </span>

                  {getCategoryName(
                    featuredBlog
                  ) && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {getCategoryName(
                        featuredBlog
                      )}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  <Link
                    to={`/blog/${featuredBlog.slug}`}
                    className="transition hover:text-indigo-600"
                  >
                    {featuredBlog.title}
                  </Link>
                </h2>

                {featuredBlog.excerpt && (
                  <p className="mt-4 line-clamp-4 text-base leading-7 text-gray-600">
                    {featuredBlog.excerpt}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <FaUser />
                    {getAuthorName(
                      featuredBlog
                    )}
                  </span>

                  {(
                    featuredBlog.publishedAt ||
                    featuredBlog.createdAt
                  ) && (
                    <span className="inline-flex items-center gap-2">
                      <FaCalendarAlt />
                      {formatDate(
                        featuredBlog.publishedAt ||
                          featuredBlog.createdAt
                      )}
                    </span>
                  )}
                </div>

                <div className="mt-7">
                  <Link
                    to={`/blog/${featuredBlog.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Read More
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* =========================
            LATEST POSTS
        ========================= */}

        {!loading &&
          latestBlogs.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Latest Posts
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {latestBlogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* IMAGE */}

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="block aspect-[16/9] overflow-hidden bg-gray-100"
                    >
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                          ServDial Blog
                        </div>
                      )}
                    </Link>

                    {/* CONTENT */}

                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {blog.isPinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            <FaThumbtack />
                            Pinned
                          </span>
                        )}

                        {getCategoryName(blog) && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            {getCategoryName(blog)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold leading-tight text-gray-900">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="transition hover:text-indigo-600"
                        >
                          {blog.title}
                        </Link>
                      </h3>

                      {blog.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <FaUser />
                          {getAuthorName(blog)}
                        </span>

                        {(
                          blog.publishedAt ||
                          blog.createdAt
                        ) && (
                          <span className="inline-flex items-center gap-1.5">
                            <FaCalendarAlt />
                            {formatDate(
                              blog.publishedAt ||
                                blog.createdAt
                            )}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                        >
                          Read More
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
      </section>
       </main>
  </>
);
};

export default Blog;