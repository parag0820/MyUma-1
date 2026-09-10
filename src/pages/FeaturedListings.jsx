

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation, Heart, Layers } from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllListingsApi,
  getImgURL,
  addFavoriteAPI,
  deleteFavoriteAPI,
  getFavoritesByUserAPI,
  getRatingsAPI,
} from "../services/authService";
import { getUser } from "../utils/storage";

const FeaturedListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getUser();
  const isLoggedIn = !!localStorage.getItem("token");

  const slugify = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const fetchData = async () => {
    try {
      // 1. Fetch both Listings and Ratings
      const [listingsRes, ratingsRes] = await Promise.all([
        getAllListingsApi(),
        getRatingsAPI(),
      ]);

      const allListings = listingsRes?.listings || [];
      const allRatings = ratingsRes?.data || [];

      // 2. Count ratings per listing (itemId._id based on your JSON)
      const ratingCounts = allRatings.reduce((acc, curr) => {
        const id = curr.itemId?._id || curr.itemId;
        if (id) {
          acc[id] = (acc[id] || 0) + 1;
        }
        return acc;
      }, {});

      // 3. Sort listings by review count (Highest first) and take TOP 6
      const top6Listings = allListings
        .sort((a, b) => (ratingCounts[b._id] || 0) - (ratingCounts[a._id] || 0))
        .slice(0, 6);

      setListings(top6Listings);

      // 4. Favorites logic
      if (isLoggedIn && currentUser) {
        const userId = currentUser._id || currentUser.id;
        const favRes = await getFavoritesByUserAPI(userId);
        if (favRes.success) {
          setFavorites(favRes.data);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  const handleBookmark = async (e, item) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.warn("Please login to bookmark this listing.");
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
      toast.error("Failed to update favorite");
    }
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const slides = chunkArray(listings, 3);

  if (loading) return null;

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h6
            className="fw-bold text-uppercase mb-2"
            style={{ color: "#c49a6c", letterSpacing: "3px" }}>
            Handpicked
          </h6>
          <h2 className="display-6 fw-800 text-navy text-uppercase ls-1">
            Featured Listings
          </h2>
          <div
            className="mx-auto bg-navy mt-2"
            style={{ height: "3px", width: "60px" }}></div>
        </div>

        <div
          id="featuredCarousel"
          className="carousel slide"
          data-bs-ride="carousel">
          <div className="carousel-inner">
            {slides.map((chunk, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}>
                <div className="row g-4 px-2">
                  {chunk.map((item) => {
                    const isFavorited = favorites.some((fav) => {
                      const favId =
                        typeof fav.itemId === "object"
                          ? fav.itemId._id
                          : fav.itemId;
                      return favId?.toString() === item._id?.toString();
                    });

                    return (
                      <div key={item._id} className="col-12 col-md-4">
                        <div
                          className="card h-100 border-0 shadow-sm overflow-hidden listing-card rounded-4 bg-white"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/browse/${slugify(item.title)}`)
                          }>
                          <div className="ratio ratio-4x3 position-relative">
                            <img
                              src={getImgURL(item.images?.[0])}
                              alt={item.title}
                              className="object-fit-cover w-100 h-100"
                            />

                            <div
                              className="position-absolute top-0 start-0 w-100 d-flex justify-content-between align-items-start p-3"
                              style={{ zIndex: 10 }}>
                              <span className="badge bg-white text-navy shadow-sm fw-800 px-3 py-2 rounded-3">
                                ${item.items?.[0]?.price?.toLocaleString() || 0}
                              </span>

                              <button
                                className="btn btn-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: "white",
                                  border: "none",
                                  width: "36px",
                                  height: "36px",
                                }}
                                onClick={(e) => handleBookmark(e, item)}>
                                <Heart
                                  size={18}
                                  color="#ff4d4d"
                                  fill={isFavorited ? "#ff4d4d" : "none"}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex flex-column">
                                <small
                                  className="text-tan fw-800 text-uppercase ls-1"
                                  style={{ fontSize: "10px" }}>
                                  {item.categoryId?.name}
                                </small>
                                {item.subCategoryId?.subcategoryName && (
                                  <small
                                    className="text-navy fw-bold"
                                    style={{ fontSize: "11px" }}>
                                    <Layers size={10} className="me-1" />
                                    {item.subCategoryId.subcategoryName}
                                  </small>
                                )}
                              </div>
                            </div>

                            <h5 className="fw-800 text-navy mb-2 text-truncate ls-1">
                              {item.title}
                            </h5>
                            <p className="text-muted small mb-4 text-truncate">
                              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                              {item.address}
                            </p>

                            <div className="d-flex justify-content-end mt-auto">
                              <button
                                className="bg-white border rounded px-3 py-2 btn-outline-navy"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `https://www.google.com/maps/search/${encodeURIComponent(item.address)}`,
                                  );
                                }}>
                                <Navigation size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-indicators position-relative mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#featuredCarousel"
                data-bs-slide-to={index}
                className={`bg-navy ${index === 0 ? "active" : ""}`}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  margin: "0 5px",
                }}></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;