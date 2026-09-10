import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Heart, Navigation, Layers } from "lucide-react";
import { toast } from "react-toastify";

import {
  getAllListingsApi,
  getImgURL,
  addFavoriteAPI,
  deleteFavoriteAPI,
  getFavoritesByUserAPI,
} from "../services/authService";
import { getUser } from "../utils/storage";

const BrowseListings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // States
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL State handling
  const searchState = location.state || {};
  const [searchQuery, setSearchQuery] = useState(searchState.keyword || "");
  const [filter, setFilter] = useState({
    category: searchState.category || "All",
    minPrice: "",
    maxPrice: "",
    location: searchState.location || "",
  });

  const [appliedSearch, setAppliedSearch] = useState(searchState.keyword || "");
  const [appliedFilter, setAppliedFilter] = useState(filter);

  const currentUser = getUser();
  const isLoggedIn = !!localStorage.getItem("token");

  const slugify = (text) =>
    text
      ? text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "";

  // Data Fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllListingsApi();
      setListings(res?.listings || []);

      if (isLoggedIn && currentUser) {
        const userId = currentUser._id || currentUser.id;
        const favRes = await getFavoritesByUserAPI(userId);
        if (favRes.success) {
          setFavorites(favRes.data);
        }
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  // Sync with Home Search
  useEffect(() => {
    if (location.state) {
      const { keyword, category, location: loc } = location.state;
      setSearchQuery(keyword || "");
      setAppliedSearch(keyword || "");
      const newFilter = {
        category: category || "All",
        minPrice: "",
        maxPrice: "",
        location: loc || "",
      };
      setFilter(newFilter);
      setAppliedFilter(newFilter);
    }
  }, [location.state]);

  const handleBookmark = async (e, item) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warn("Please login to favorite this listing.");
      navigate("/login");
      return;
    }

    const existingFav = favorites.find((fav) => {
      const favId =
        typeof fav.itemId === "object" ? fav.itemId._id : fav.itemId;
      return favId?.toString() === item._id?.toString();
    });

    try {
      if (existingFav) {
        await deleteFavoriteAPI(existingFav._id);
        setFavorites(favorites.filter((fav) => fav._id !== existingFav._id));
        toast.info("Removed from favorites");
      } else {
        const payload = {
          userId: currentUser._id || currentUser.id,
          itemId: item._id,
        };
        const res = await addFavoriteAPI(payload);
        if (res.success) {
          setFavorites([...favorites, res.data]);
          toast.success("Added to favorites");
        }
      }
    } catch (error) {
      toast.error("Favorite action failed");
    }
  };

  // Filter Logic
  const filteredListings = listings.filter((item) => {
    const titleMatch = item.title
      ?.toLowerCase()
      .includes(appliedSearch.toLowerCase());

    const categoryMatch =
      appliedFilter.category === "All" ||
      appliedFilter.category === "All Categories" ||
      item.categoryId?.name === appliedFilter.category ||
      item.subCategoryId?.subcategoryName === appliedFilter.category;

    const locationMatch =
      !appliedFilter.location ||
      item.address
        ?.toLowerCase()
        .includes(appliedFilter.location.toLowerCase());

    const price = item.items?.[0]?.price || 0;
    const minMatch =
      appliedFilter.minPrice === "" || price >= Number(appliedFilter.minPrice);
    const maxMatch =
      appliedFilter.maxPrice === "" || price <= Number(appliedFilter.maxPrice);

    return titleMatch && categoryMatch && locationMatch && minMatch && maxMatch;
  });

  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center fw-bold">
        LOADING LISTINGS...
      </div>
    );

  return (
    <div className="min-vh-100 bg-light pt-3">
      <div className="container">
        {/* Advanced Filter Box */}
        <div className="card border-0 shadow-sm p-3 mb-4 rounded-4">
          <div className="row g-3 align-items-end">
            <div className="col-lg-4 col-md-6">
              <label className="form-label small fw-800 text-navy text-uppercase ls-1">
                Search Keyword
              </label>
              <div className="input-group border rounded-3 bg-white">
                <span className="input-group-text bg-transparent border-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-800 text-navy text-uppercase ls-1">
                Category
              </label>
              <select
                className="form-select border rounded-3 shadow-none"
                value={filter.category}
                onChange={(e) =>
                  setFilter({ ...filter, category: e.target.value })
                }
              >
                <option>All</option>
                {[...new Set(listings.map((l) => l.categoryId?.name))]
                  .filter(Boolean)
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-800 text-navy text-uppercase ls-1">
                Min Price
              </label>
              <input
                type="number"
                className="form-control border rounded-3 shadow-none"
                placeholder="$ Min"
                value={filter.minPrice}
                onChange={(e) =>
                  setFilter({ ...filter, minPrice: e.target.value })
                }
              />
            </div>
            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-800 text-navy text-uppercase ls-1">
                Max Price
              </label>
              <input
                type="number"
                className="form-control border rounded-3 shadow-none"
                placeholder="$ Max"
                value={filter.maxPrice}
                onChange={(e) =>
                  setFilter({ ...filter, maxPrice: e.target.value })
                }
              />
            </div>
            <div className="col-lg-1 col-md-12 text-end">
              <button
                className="uma-btn-navy uma-btn w-100"
                onClick={() => {
                  setAppliedSearch(searchQuery);
                  setAppliedFilter(filter);
                }}
                style={{ height: "45px" }}
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-800 text-navy mb-0">
            Showing {filteredListings.length} Results
          </h4>
        </div>

        <div className="row g-3">
          {filteredListings.length > 0 ? (
            filteredListings.map((item) => {
              const isFavorited = favorites.some((fav) => {
                const favId =
                  typeof fav.itemId === "object" ? fav.itemId._id : fav.itemId;
                return favId?.toString() === item._id?.toString();
              });

              return (
                <div key={item._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div
                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden listing-card bg-white"
                    style={{ cursor: "pointer", transition: "0.3s" }}
                    onClick={() => navigate(`/browse/${slugify(item.title)}`)}
                  >
                    {/* Image Area */}
                    <div className="ratio ratio-16x9 position-relative">
                      <img
                        src={getImgURL(item.images?.[0])}
                        alt={item.title}
                        className="object-fit-cover"
                      />
                      <div
                        className="position-absolute top-0 start-0 w-100 d-flex justify-content-between align-items-start p-3"
                        style={{ zIndex: 10 }}
                      >
                        <span className="badge bg-white text-navy shadow-sm fw-800 px-2 py-1 rounded-3">
                          ${item.items?.[0]?.price?.toLocaleString() || 0}
                        </span>
                        <button
                          className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "white",
                            border: "none",
                          }}
                          onClick={(e) => handleBookmark(e, item)}
                        >
                          <Heart
                            size={16}
                            color="#ff4d4d"
                            fill={isFavorited ? "#ff4d4d" : "none"}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="card-body p-3 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex flex-column">
                          <small
                            className="text-tan fw-800 text-uppercase ls-1"
                            style={{ fontSize: "10px" }}
                          >
                            {item.categoryId?.name}
                          </small>
                          {item.subCategoryId?.subcategoryName && (
                            <small
                              className="text-navy fw-bold"
                              style={{ fontSize: "11px" }}
                            >
                              <Layers size={10} className="me-1" />
                              {item.subCategoryId.subcategoryName}
                            </small>
                          )}
                        </div>
                        {/* <span
                          className="small fw-800 text-primary text-decoration-underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/reviews/${slugify(item.title)}`, {
                              state: { listingId: item._id },
                            });
                          }}>
                          View Reviews
                        </span> */}
                      </div>

                      <h5 className="fw-800 text-navy mb-2 text-truncate ls-1">
                        {item.title}
                      </h5>
                      <p className="text-muted small mb-3">
                        <MapPin size={14} className="text-danger me-1" />
                        {item.address}
                      </p>

                      <div className="mt-auto d-flex justify-content-end">
                        <button
                          className="btn btn-light rounded-3 px-2 py-1 border shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `https://www.google.com/maps/search/${encodeURIComponent(item.address)}`,
                            );
                          }}
                        >
                          <Navigation size={18} className="text-navy" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5">
              <h5 className="text-muted">
                No listings found matching your filters.
              </h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseListings;
