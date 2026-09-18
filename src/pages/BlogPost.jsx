// Path: frontend/src/pages/BlogPost.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaTag,
  FaUser,
} from "react-icons/fa";

import {
  getBlogBySlug,
  getPublishedBlogs,
  incrementBlogViews,
} from "../api/blogAPI";

const BlogPost = ({ ssrBlog }) => {
  const { slug } = useParams();

  const hasSSRBlog =
    Boolean(ssrBlog?._id) &&
    ssrBlog?.slug === slug;

  const [blog, setBlog] = useState(
    hasSSRBlog ? ssrBlog : null
  );
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const [loading, setLoading] = useState(
  !hasSSRBlog
);
  const [notFound, setNotFound] = useState(false);

  // =========================
  // HELPERS
  // =========================

  const getCategoryId = (category) => {
    if (!category) {
      return null;
    }

    if (typeof category === "string") {
      return category;
    }

    return category?._id || null;
  };

  const getCategoryName = (category) => {
    if (!category) {
      return "";
    }

    if (typeof category === "string") {
      return "";
    }

    return category?.name || "";
  };

  const getAuthorName = (author) => {
    if (!author) {
      return "ServDial";
    }

    if (typeof author === "string") {
      return author;
    }

    return (
      author?.name ||
      author?.fullName ||
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

  // =========================
  // FETCH BLOG
  // =========================

  useEffect(() => {
  let cancelled = false;

  if (hasSSRBlog) {
    return () => {
      cancelled = true;
    };
  }

  const fetchBlog = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setBlog(null);

        const response =
          await getBlogBySlug(slug);

        const blogData =
          response?.data?.data || null;

        if (!blogData) {
          if (!cancelled) {
            setNotFound(true);
          }

          return;
        }

        if (!cancelled) {
          setBlog(blogData);
        }
      } catch (error) {
        console.error(
          "❌ Failed to fetch blog post:",
          error
        );

        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchBlog();
    }

    return () => {
      cancelled = true;
    };
  }, [slug, hasSSRBlog]);

  // =========================
  // INCREMENT VIEWS
  // =========================

  useEffect(() => {
    if (!blog?._id) {
      return;
    }

    const updateViews = async () => {
      try {
        await incrementBlogViews(blog._id);
      } catch (error) {
        console.warn(
          "⚠️ Failed to increment blog views:",
          error
        );
      }
    };

    updateViews();
  }, [blog?._id]);

  // =========================
  // FETCH RELATED POSTS
  // =========================

  useEffect(() => {
    let cancelled = false;

    const fetchRelatedBlogs = async () => {
      if (!blog) {
        return;
      }

      try {
        const response =
          await getPublishedBlogs();

        const data = response?.data?.data;

        const allBlogs = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
          ? data.blogs
          : [];

        const currentCategoryId =
          getCategoryId(blog.category);

        const related = allBlogs
          .filter(
            (item) =>
              item?._id !== blog?._id
          )
          .filter((item) => {
            if (!currentCategoryId) {
              return true;
            }

            return (
              getCategoryId(item.category) ===
              currentCategoryId
            );
          })
          .slice(0, 3);

        if (!cancelled) {
          setRelatedBlogs(related);
        }
      } catch (error) {
        console.warn(
          "⚠️ Failed to fetch related blogs:",
          error
        );

        if (!cancelled) {
          setRelatedBlogs([]);
        }
      }
    };

    fetchRelatedBlogs();

    return () => {
      cancelled = true;
    };
  }, [blog]);

  // =========================
  // CATEGORY
  // =========================

  const categoryName = useMemo(() => {
    return getCategoryName(blog?.category);
  }, [blog]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-gray-500">
            Loading blog post...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (notFound || !blog) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Blog post not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              The blog post you are looking for may
              have been removed or is no longer
              available.
            </p>

            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <FaArrowLeft />
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const publishDate =
    blog.publishedAt || blog.createdAt;
const canonicalUrl =
  blog.seo?.canonicalUrl ||
  `https://www.servdial.com/blog/${blog.slug}`;

const seoTitle =
  blog.seo?.title ||
  `${blog.title} | ServDial Journal`;

const seoDescription =
  blog.seo?.description ||
  blog.excerpt ||
  `Read ${blog.title} on ServDial Journal.`;

const ogTitle =
  blog.seo?.ogTitle ||
  blog.seo?.title ||
  blog.title;

const ogDescription =
  blog.seo?.ogDescription ||
  blog.seo?.description ||
  blog.excerpt ||
  "";

const twitterTitle =
  blog.seo?.twitterTitle ||
  blog.seo?.ogTitle ||
  blog.title;

const twitterDescription =
  blog.seo?.twitterDescription ||
  blog.seo?.ogDescription ||
  blog.excerpt ||
  "";

  // =========================
  // UI
  // =========================

  return (
  <>
    <Helmet>
      <title>{seoTitle}</title>

      <meta
        name="description"
        content={seoDescription}
      />

      <meta
        name="robots"
        content="index,follow"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      <meta
        property="og:title"
        content={ogTitle}
      />

      <meta
        property="og:description"
        content={ogDescription}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:type"
        content="article"
      />

      {(
        blog.seo?.ogImage ||
        blog.featuredImage
      ) && (
        <meta
          property="og:image"
          content={
            blog.seo?.ogImage ||
            blog.featuredImage
          }
        />
      )}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={twitterTitle}
      />

      <meta
        name="twitter:description"
        content={twitterDescription}
      />

      {(
        blog.seo?.twitterImage ||
        blog.featuredImage
      ) && (
        <meta
          name="twitter:image"
          content={
            blog.seo?.twitterImage ||
            blog.featuredImage
          }
        />
      )}

      {/* =========================
          BLOGPOSTING JSON-LD
      ========================= */}

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blog.title,
          description: seoDescription,
          image: blog.featuredImage
            ? [blog.featuredImage]
            : undefined,
          author: blog.author
            ? {
                "@type": "Person",
                name: getAuthorName(
                  blog.author
                ),
              }
            : {
                "@type": "Organization",
                name: "ServDial",
                url: "https://www.servdial.com",
              },
          publisher: {
            "@type": "Organization",
            name: "ServDial",
            url: "https://www.servdial.com",
          },
          datePublished:
            blog.publishedAt ||
            blog.createdAt,
          dateModified:
            blog.updatedAt ||
            blog.publishedAt ||
            blog.createdAt,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
          url: canonicalUrl,
        })}
      </script>

      {/* =========================
          BREADCRUMB JSON-LD
      ========================= */}

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
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
            {
              "@type": "ListItem",
              position: 3,
              name: blog.title,
              item: canonicalUrl,
            },
          ],
        })}
      </script>
    </Helmet>

    <main className="min-h-screen bg-gray-50">
      {/* =========================
          BREADCRUMB
      ========================= */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              to="/"
              className="text-gray-500 transition hover:text-indigo-600"
            >
              Home
            </Link>

            <span className="text-gray-400">
              ›
            </span>

            <Link
              to="/blog"
              className="text-gray-500 transition hover:text-indigo-600"
            >
              Blog
            </Link>

            <span className="text-gray-400">
              ›
            </span>

            <span className="max-w-[280px] truncate font-medium text-gray-700 sm:max-w-none">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* =========================
          ARTICLE HEADER
      ========================= */}

      <article>
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            {/* CATEGORY */}

            {categoryName && (
              <div className="mb-4">
                <Link
                  to="/blog"
                  className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  {categoryName}
                </Link>
              </div>
            )}

            {/* TITLE */}

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            {/* EXCERPT */}

            {blog.excerpt && (
              <p className="mt-5 max-w-4xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                {blog.excerpt}
              </p>
            )}

            {/* META */}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <FaUser />
                {getAuthorName(blog.author)}
              </span>

              {publishDate && (
                <span className="inline-flex items-center gap-2">
                  <FaCalendarAlt />
                  {formatDate(publishDate)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* =========================
            FEATURED IMAGE
        ========================= */}

        {blog.featuredImage && (
          <div className="bg-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden sm:rounded-2xl">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="h-auto max-h-[600px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================
            ARTICLE CONTENT
        ========================= */}

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,760px)_280px] lg:justify-center">
            {/* ARTICLE */}

            <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div
                className="blog-content text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: blog.content || "",
                }}
              />

              {/* TAGS */}

              {Array.isArray(blog.tags) &&
                blog.tags.length > 0 && (
                  <div className="mt-10 border-t border-gray-200 pt-6">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaTag />
                      Tags
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map(
                        (tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* SIDEBAR */}

            <aside className="space-y-5">
              {/* BACK TO BLOG */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                  <FaArrowLeft />
                  Back to Blog
                </Link>
              </div>

              {/* ABOUT SERVdial */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  ServDial Journal
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Helpful articles, local business
                  insights, service guides and useful
                  information from ServDial.
                </p>

                <Link
                  to="/blog"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                  Explore Blog
                  <FaArrowRight />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* =========================
          RELATED POSTS
      ========================= */}

      {relatedBlogs.length > 0 && (
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Posts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                More articles you may find useful.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedBlogs.map((relatedBlog) => (
                <article
                  key={relatedBlog._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* IMAGE */}

                  <Link
                    to={`/blog/${relatedBlog.slug}`}
                    className="block aspect-[16/9] overflow-hidden bg-gray-100"
                  >
                    {relatedBlog.featuredImage ? (
                      <img
                        src={
                          relatedBlog.featuredImage
                        }
                        alt={relatedBlog.title}
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
                    {getCategoryName(
                      relatedBlog.category
                    ) && (
                      <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {getCategoryName(
                          relatedBlog.category
                        )}
                      </span>
                    )}

                    <h3 className="mt-3 text-lg font-bold leading-tight text-gray-900">
                      <Link
                        to={`/blog/${relatedBlog.slug}`}
                        className="transition hover:text-indigo-600"
                      >
                        {relatedBlog.title}
                      </Link>
                    </h3>

                    {relatedBlog.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                        {relatedBlog.excerpt}
                      </p>
                    )}

                    <Link
                      to={`/blog/${relatedBlog.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                    >
                      Read More
                      <FaArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
        </main>
  </>
  );
};

export default BlogPost;