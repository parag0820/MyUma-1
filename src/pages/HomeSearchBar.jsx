
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronDown,
  ArrowLeft,
  X,
  Search,
  Star,
  Loader2,
} from "lucide-react";
import {
  getCategoriesAPI,
  getAllListingsApi,
  getAllSubCategoriesApi,
} from "../services/authService";

const HomeSearchBar = () => {
  const navigate = useNavigate();

  // Data States
  const [categoriesData, setCategoriesData] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [dropdownData, setDropdownData] = useState([]);

  // UI States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentView, setCurrentView] = useState("categories");
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Suggestion States
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showKeywordSug, setShowKeywordSug] = useState(false);
  const [showLocationSug, setShowLocationSug] = useState(false);

  const [searchState, setSearchState] = useState({
    keyword: "",
    location: "",
    category: "All Categories",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await getCategoriesAPI();
        if (catRes.success) setCategoriesData(catRes.categories || []);
        const subRes = await getAllSubCategoriesApi();
        if (subRes.success) {
          const sortedData = (subRes.data || [])
            .map((item) => ({
              ...item,
              subcategories: (item.subcategories || []).sort((a, b) =>
                a.subcategoryName.localeCompare(b.subcategoryName),
              ),
            }))
            .sort((a, b) =>
              (a.categoryId?.name || "").localeCompare(
                b.categoryId?.name || "",
              ),
            );
          setDropdownData(sortedData);
        }
        const listRes = await getAllListingsApi();
        if (listRes?.listings) setAllListings(listRes.listings);
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    loadData();
  }, []);

  // --- KEYWORD SUGGESTIONS ---
  const handleKeywordChange = (val) => {
    setSearchState({ ...searchState, keyword: val });
    if (val.trim().length > 0) {
      const matchCats = categoriesData
        .filter((c) => c.name.toLowerCase().includes(val.toLowerCase()))
        .map((c) => ({ type: "Category", name: c.name }));

      const matchListings = allListings
        .filter((l) => l.title.toLowerCase().includes(val.toLowerCase()))
        .map((l) => ({ type: "Listing", name: l.title }));

      const combined = [...matchCats, ...matchListings].slice(0, 8);
      setKeywordSuggestions(combined);
      setShowKeywordSug(combined.length > 0);
    } else {
      setShowKeywordSug(false);
    }
  };

  // --- LOCATION API ---
  const fetchLocations = async (query) => {
    if (query.length < 3) return;
    setLoadingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`,
      );
      const data = await response.json();
      const results = data.map((item) => item.display_name);
      setLocationSuggestions(results);
      setShowLocationSug(results.length > 0);
    } catch (error) {
      console.error("Location API Error:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchState.location.trim().length >= 3) {
        fetchLocations(searchState.location);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchState.location]);

  // --- SEARCH LOGIC ---
  // const handleSearch = (overrideCategory) => {
  //   const categoryToSearch = overrideCategory || searchState.category;
  //   const { keyword, location } = searchState;

  //   setShowKeywordSug(false);
  //   setShowLocationSug(false);
  //   setIsDropdownOpen(false);

  //   navigate("/browse", {
  //     state: {
  //       keyword: keyword.trim(),
  //       category: categoryToSearch === "All Categories" ? "All" : categoryToSearch,
  //       location: location.trim(),
  //     },
  //   });
  // };
  // --- SEARCH LOGIC ---
  const handleSearch = (overrideCategory) => {
    const categoryToSearch = overrideCategory || searchState.category;
    const { keyword, location } = searchState;

    // 🛑 VALIDATION: Check if all fields are empty/default
    const isKeywordEmpty = !keyword.trim();
    const isLocationEmpty = !location.trim();
    const isCategoryDefault = categoryToSearch === "All Categories";

    if (isKeywordEmpty && isLocationEmpty && isCategoryDefault) {
      // Optional: You can add a toast notification here if you use react-toastify
      // toast.warn("Please enter a keyword, location, or select a category to search.");
      return; // Stop the function from navigating
    }

    setShowKeywordSug(false);
    setShowLocationSug(false);
    setIsDropdownOpen(false);

    navigate("/browse", {
      state: {
        keyword: keyword.trim(),
        category:
          categoryToSearch === "All Categories" ? "All" : categoryToSearch,
        location: location.trim(),
      },
    });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const featuredBadges = categoriesData
    .filter(
      (cat) =>
        cat.favoriteCategories === true &&
        cat.name?.toLowerCase() !== "business directory",
    )
    .slice(-2);

  return (
    <div className="container-fluid px-2">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11">
          {/* MAIN SEARCH PILL */}
          <div className="bg-white rounded-4 rounded-lg-pill shadow-lg border border-light p-2 p-lg-1 d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center">
            {/* 1. KEYWORD SECTION */}
            <div className="position-relative flex-grow-1 border-bottom border-lg-0 px-3 px-lg-4 py-2 py-lg-0 d-flex align-items-center">
              <Search size={18} className="text-muted me-2 flex-shrink-0" />
              <input
                type="text"
                className="form-control border-0 shadow-none bg-transparent text-black fw-bold p-0"
                style={{ fontSize: "14px", height: "45px" }}
                placeholder="What are you looking for?"
                value={searchState.keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setShowLocationSug(false);
                  setIsDropdownOpen(false);
                  setShowKeywordSug(searchState.keyword.length > 0);
                }}
              />
              {showKeywordSug && (
                <div
                  className="position-absolute start-0 top-100 mt-2 w-100 bg-white shadow-lg rounded-4 border overflow-hidden"
                  style={{ zIndex: 1100 }}>
                  {keywordSuggestions.map((s, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSearchState({ ...searchState, keyword: s.name });
                        setShowKeywordSug(false);
                      }}>
                      <span className="text-black fw-bold small">{s.name}</span>
                      <span
                        className="badge bg-light text-muted fw-normal"
                        style={{ fontSize: "9px" }}>
                        {s.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="vr d-none d-lg-block mx-1 my-2 opacity-25"
              style={{ height: "30px" }}></div>

            {/* 2. LOCATION SECTION */}
            <div className="position-relative flex-grow-1 border-bottom border-lg-0 px-3 px-lg-4 py-2 py-lg-0 d-flex align-items-center">
              {loadingLocation ? (
                <Loader2 size={18} className="text-muted me-2 animate-spin" />
              ) : (
                <MapPin size={18} className="text-muted me-2 flex-shrink-0" />
              )}
              <input
                type="text"
                className="form-control border-0 shadow-none bg-transparent text-black fw-bold p-0"
                style={{ fontSize: "14px", height: "45px" }}
                placeholder="Location..."
                value={searchState.location}
                onChange={(e) =>
                  setSearchState({ ...searchState, location: e.target.value })
                }
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setShowKeywordSug(false);
                  setIsDropdownOpen(false);
                  setShowLocationSug(searchState.location.length >= 3);
                }}
              />
              {showLocationSug && (
                <div
                  className="position-absolute start-0 top-100 mt-2 w-100 bg-white shadow-lg rounded-4 border overflow-hidden"
                  style={{ zIndex: 1100 }}>
                  {locationSuggestions.map((loc, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 border-bottom d-flex align-items-start gap-2 bg-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSearchState({ ...searchState, location: loc });
                        setShowLocationSug(false);
                      }}>
                      <MapPin
                        size={14}
                        className="text-tan mt-1 flex-shrink-0"
                      />
                      <span className="text-black small text-start fw-semibold">
                        {loc}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="vr d-none d-lg-block mx-1 my-2 opacity-25"
              style={{ height: "30px" }}></div>

            {/* 3. CATEGORY & SEARCH BUTTON */}
            <div className="position-relative flex-grow-1 px-3 px-lg-4 py-2 py-lg-0 d-flex align-items-center justify-content-between">
              <div
                className="d-flex align-items-center flex-grow-1 me-2"
                style={{ cursor: "pointer", height: "45px" }}
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setShowKeywordSug(false);
                  setShowLocationSug(false);
                }}>
                <span
                  className={`text-truncate small fw-800 ${searchState.category === "All Categories" ? "text-muted" : "text-black"}`}>
                  {searchState.category}
                </span>
                <ChevronDown
                  size={18}
                  className="text-muted ms-auto flex-shrink-0"
                />
              </div>

              <button
                className="uma-btn-navy rounded-pill px-4 ms-2 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm"
                style={{ height: "40px", minWidth: "120px" }}
                onClick={() => handleSearch()}>
                <Search size={15} /> <span className="fw-800 ls-1">SEARCH</span>
              </button>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <div
                  className="position-absolute end-0 top-100 mt-2 w-100 bg-white shadow-lg rounded-4 border overflow-hidden"
                  style={{ zIndex: 1100, minWidth: "280px" }}>
                  {currentView === "categories" ? (
                    <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                      <div className="p-3 bg-light d-flex justify-content-between align-items-center border-bottom">
                        <span
                          className="fw-800 text-uppercase text-muted ls-1"
                          style={{ fontSize: "10px" }}>
                          Filter by Category
                        </span>
                        <X
                          size={16}
                          className="text-muted cursor-pointer"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                      </div>
                      <div
                        className="px-4 py-3 border-bottom small fw-bold text-black"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSearchState({
                            ...searchState,
                            category: "All Categories",
                          });
                          setIsDropdownOpen(false);
                        }}>
                        All Categories
                      </div>
                      {dropdownData.map((item) => (
                        <div
                          key={item.categoryId?._id}
                          className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}>
                          <div
                            className="small fw-bold text-black flex-grow-1"
                            onClick={() => {
                              setSearchState({
                                ...searchState,
                                category: item.categoryId?.name,
                              });
                              setIsDropdownOpen(false);
                            }}>
                            {item.categoryId?.name}
                          </div>
                          {item.subcategories?.length > 0 && (
                            <ChevronDown
                              size={16}
                              className="text-muted"
                              style={{ transform: "rotate(-90deg)" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCategory(item);
                                setCurrentView("subcategories");
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div
                        className="bg-navy p-3 text-white d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCurrentView("categories")}>
                        <ArrowLeft size={18} className="me-2" />
                        <span className="small fw-800 ls-1 text-uppercase">
                          {activeCategory?.categoryId?.name}
                        </span>
                      </div>
                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {activeCategory?.subcategories.map((sub) => (
                          <div
                            key={sub._id}
                            className="px-4 py-3 border-bottom small fw-bold text-black"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSearchState({
                                ...searchState,
                                category: sub.subcategoryName,
                              });
                              setIsDropdownOpen(false);
                              setCurrentView("categories");
                            }}>
                            {sub.subcategoryName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC & STATIC BADGES SECTION */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            {/* 1. STATIC BADGE: Business Directory */}
            <button
              onClick={() => navigate("/browse")}
              className="uma-btn-primary btn-sm px-4 rounded-pill fw-bold border-0 shadow-sm"
              style={{ height: "38px" }}>
              BUSINESS DIRECTORY
            </button>

            {/* 2. DYNAMIC BADGES */}
            {featuredBadges.map((item) => (
              <div
                key={item._id}
                className="bg-white border-gold px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm transition-hover"
                style={{
                  cursor: "pointer",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                onClick={() => handleSearch(item.name)}>
                <Star size={15} className="text-tan" />
                <span className="text-navy extra-small fw-800 ls-1">
                  {item.name.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .extra-small { font-size: 11px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .cursor-pointer { cursor: pointer; }
        .border-lg-0 { border-bottom: 1px solid #eee; }
        @media (min-width: 992px) {
          .border-lg-0 { border-bottom: 0 !important; }
        }
      `}</style>
    </div>
  );
};;

export default HomeSearchBar;