import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublishedBlogs } from "../../api/blogAPI";

const LatestBlogPosts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchLatestPosts = async () => {
      try {
        const response = await getPublishedBlogs({
          page: 1,
          limit: 4,
        });

        const data = response?.data?.data;

        const blogs = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
          ? data.blogs
          : [];

        if (mounted) {
          setPosts(blogs.slice(0, 4));
        }
      } catch (error) {
        console.error("❌ Latest Blog Posts Error:", error);

        if (mounted) {
          setPosts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLatestPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="my-14 max-w-7xl mx-auto px-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">
            ServDial Journal
          </h2>

          <p className="text-gray-600 mt-2">
            Helpful guides, local insights and useful information from ServDial.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/blog")}
          className="text-blue-600 font-semibold hover:underline whitespace-nowrap"
        >
          View All →
        </button>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />

              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-5 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && posts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
          No journal articles available yet.
        </div>
      )}

      {/* ================= BLOG POSTS ================= */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* IMAGE */}
              {post.featuredImage ? (
                <img
                  src={post.featuredImage}
                  alt={post.title || "ServDial Journal"}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  ServDial Journal
                </div>
              )}

              <div className="p-5">
                {/* CATEGORY + DATE */}
                <div className="flex items-center justify-between gap-3 mb-3 text-xs text-gray-500">
                  {post.category?.name ? (
                    <span className="text-blue-600 font-medium">
                      {post.category.name}
                    </span>
                  ) : (
                    <span>Journal</span>
                  )}

                  {post.publishedAt && (
                    <span>{formatDate(post.publishedAt)}</span>
                  )}
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {post.title}
                </h3>

                {/* EXCERPT */}
                {post.excerpt && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* READ MORE */}
                <button
                  type="button"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
                >
                  Read Article →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestBlogPosts;