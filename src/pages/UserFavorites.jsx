import React, { useEffect, useState } from "react";
import {
  getFavoritesByUserAPI,
  deleteFavoriteAPI,
  getImgURL,
} from "../services/authService";
import { toast } from "react-toastify";
import { Trash2, MapPin, X, Eye, Heart } from "lucide-react";
import Pagination from "../components/common/Pagination";

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFav, setSelectedFav] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id || currentUser?._id;

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await getFavoritesByUserAPI(currentUserId);
      if (res.success) {
        setFavorites(res.data || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchFavorites();
    else setLoading(false);
  }, [currentUserId]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = favorites.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this from your favorites?")) return;
    try {
      const res = await deleteFavoriteAPI(id);
      if (res.success || res) {
        toast.success("Removed from favorites ❤️");
        const updatedList = favorites.filter((item) => item._id !== id);
        setFavorites(updatedList);

        // Agar current page empty ho jaye delete ke baad, toh pichle page pe jao
        const newTotalPages = Math.ceil(updatedList.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }
    } catch (err) {
      toast.error("Failed to remove favorite");
    }
  };

  if (loading)
    return (
      <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-white">
        <div className="spinner-border text-danger mb-2" role="status"></div>
        <p className="fw-bold text-navy">Loading Your Favorites...</p>
      </div>
    );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-navy mb-0">My Favorites</h4>
          <p className="text-muted small">Items you've liked and saved</p>
        </div>
        <span className="badge bg-danger rounded-pill px-3 py-2">
          {favorites.length} Favorites
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0">S.No</th>
                <th className="px-4 py-3 border-0">Image</th>
                <th className="px-4 py-3 border-0">Title</th>
                <th className="px-4 py-3 border-0">Address</th>
                <th className="px-4 py-3 border-0 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 text-muted">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={getImgURL(item.itemId?.images?.[0])}
                        className="rounded shadow-sm border"
                        style={{
                          width: "55px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                        alt=""
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/55x45?text=No+Img")
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="fw-bold text-navy small">
                        {item.itemId?.title || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-muted small d-flex align-items-center gap-1">
                        <MapPin size={12} className="text-danger" />
                        {item.itemId?.address?.substring(0, 35)}...
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => setSelectedFav(item)}
                          className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Heart size={40} className="text-muted opacity-25 mb-2" />
                    <p className="text-muted">No favorites found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Pagination Component */}
      {favorites.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* VIEW POPUP */}
      {selectedFav && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div
            className="bg-white rounded-4 shadow-lg overflow-hidden w-100 m-3"
            style={{ maxWidth: "450px" }}>
            <div className="position-relative">
              <img
                src={getImgURL(selectedFav.itemId?.images?.[0])}
                className="w-100"
                style={{ height: "220px", objectFit: "cover" }}
                alt=""
              />
              <button
                onClick={() => setSelectedFav(null)}
                className="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <h5 className="fw-bold text-navy mb-2">
                {selectedFav.itemId?.title}
              </h5>
              <p className="text-muted small mb-3">
                <MapPin size={14} className="text-danger" />{" "}
                {selectedFav.itemId?.address}
              </p>
              <button
                onClick={() => setSelectedFav(null)}
                className="btn btn-navy w-100 rounded-pill text-white fw-bold py-2 shadow-none"
                style={{ backgroundColor: "#001f3f" }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.text-navy { color: #001f3f; }`}</style>
    </div>
  );
};

export default UserFavorites;
