
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBLogsApi, getImgURL } from "../services/authService";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [category, setCategory] = useState("All");
  const [allblogs, setAllBlogs] = useState([]);
  const [expandedBlogIds, setExpandedBlogIds] = useState([]); 
  const [loading, setLoading] = useState(true);

  const getBlogs = async () => {
    setLoading(true);
    try {
      const response = await getBLogsApi();
      if (response?.blogs) {
        setAllBlogs(response.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const getShortDescription = (htmlString) => {
    if (!htmlString) return "";
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    const plainText = doc.body.textContent || "";
    const words = plainText.trim().split(/\s+/);
    if (words.length > 10) {
      return words.slice(0, 10).join(" ") + "...";
    }
    return plainText;
  };

  const toggleReadMore = (id) => {
    setExpandedBlogIds((prev) =>
      prev.includes(id)
        ? prev.filter((blogId) => blogId !== id)
        : [...prev, id],
    );
  };

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(allblogs.map((p) => p.blogCategoryId?.title).filter(Boolean)),
    ];
  }, [allblogs]);

  const createSlug = (title) =>
    title
      ?.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const filteredPosts = useMemo(() => {
    return allblogs
      .filter((post) => {
        const postCategory = post.blogCategoryId?.title || "Uncategorized";
        const postDateFull = post.createdAt ? post.createdAt.split("T")[0] : "";
        const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDate = filterDate === "" || postDateFull === filterDate;
        const matchesCategory = category === "All" || postCategory === category;
        return matchesSearch && matchesDate && matchesCategory;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allblogs, searchQuery, filterDate, category]);

  return (
    <div className="bg-light min-vh-100 mt-5 pt-3 pt-md-5 pb-5">
      {/* Page Header */}
      <div className="container text-center mb-5 mt-2">
        <span className="text-tan fw-bold ls-2 text-uppercase d-block small">
          Journal & News
        </span>
        <h1 className="text-navy fw-800 display-5">
          Our Latest Stories
        </h1>
        <div className="mx-auto mt-3 rounded" style={{ height: "3px", width: "60px", backgroundColor: "#c49a6c" }}></div>
      </div>

      <div className="container-fluid px-3 px-md-5">
        <div className="row g-4">
          {/* Sidebar - Filters */}
          <aside className="col-12 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-lg-top">
              <h6 className="text-navy fw-800 mb-4 text-uppercase">
                Filter Results
              </h6>

              <div className="mb-4 text-start">
                <label className="form-label text-navy fw-bold small">SEARCH BY TITLE</label>
                <input
                  type="text"
                  className="form-control border-light-subtle shadow-none"
                  placeholder="Keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label text-navy fw-bold small">SELECT DATE</label>
                <input
                  type="date"
                  className="form-control border-light-subtle shadow-none"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label text-navy fw-bold small">CATEGORY</label>
                <select
                  className="form-select border-light-subtle shadow-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-outline-secondary w-100 fw-bold rounded-pill"
                onClick={() => { setSearchQuery(""); setFilterDate(""); setCategory("All"); }}>
                RESET FILTERS
              </button>
            </div>
          </aside>

          {/* Blog Content Grid */}
          <div className="col-12 col-lg-9 text-start">
            <div className="row g-4">
              {loading ? (
                <div className="col-12 text-center py-5">
                  <div className="spinner-border text-navy" role="status"></div>
                  <p className="mt-2 text-muted">Loading Stories...</p>
                </div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const isExpanded = expandedBlogIds.includes(post._id);
                  const displayDate = new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "2-digit", year: "numeric",
                  });

                  return (
                    <div key={post._id} className="col-12 col-md-6 col-xl-4">
                      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div className="position-relative">
                          <Link to={`/blog/${createSlug(post.title)}`} state={{ blogId: post._id }}>
                            <img
                              src={getImgURL(post.image)}
                              className="card-img-top"
                              alt={post.title}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          </Link>
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge bg-tan text-navy py-2 px-3 fw-bold shadow-sm">
                              {post.blogCategoryId?.title || "General"}
                            </span>
                          </div>
                        </div>

                        <div className="card-body p-4 d-flex flex-column">
                          <small className="text-muted fw-bold text-uppercase mb-2">
                            {displayDate}
                          </small>
                          <Link to={`/blog/${createSlug(post.title)}`} state={{ blogId: post._id }} className="text-decoration-none">
                            <h5 className="card-title text-navy fw-800 mb-3 lh-sm">
                              {post.title}
                            </h5>
                          </Link>

                          <div className="card-text text-secondary mb-3 small">
                            {isExpanded ? (
                              <div dangerouslySetInnerHTML={{ __html: post.description }} />
                            ) : (
                              <p className="mb-0">{getShortDescription(post.description)}</p>
                            )}
                          </div>

                          <div className="mt-auto">
                            <button
                              onClick={() => toggleReadMore(post._id)}
                              className="btn btn-link p-0 text-tan fw-bold text-decoration-none small d-flex align-items-center gap-2">
                              {isExpanded ? "READ LESS" : "READ MORE"}
                              <i className={`bi bi-arrow-${isExpanded ? "up" : "right"}`}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <h4 className="text-muted">No stories found matching your criteria.</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;