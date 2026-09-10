
import React, { useEffect, useState } from "react";
import {
  getAllBookingsAPI,
  deleteBookingAPI,
  getImgURL,
} from "../services/authService";
import { toast } from "react-toastify";
import { Trash2, MapPin, X, Calendar, Bookmark, Eye } from "lucide-react";
// Pagination Import
import Pagination from "../components/common/Pagination";

const MyBookmarks = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id || currentUser?._id;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookingsAPI();
      if (res.status || res.bookings) {
        const allBookings = res.bookings || [];
        const userBookings = allBookings.filter((item) => {
          const bookingUserId =
            item.userId?._id || item.userId?.id || item.userId;
          return bookingUserId === currentUserId;
        });
        setBookings(userBookings);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchBookings();
    else setLoading(false);
  }, [currentUserId]);

  // --- Truncate Title Logic (4 Words) ---
  const truncateTitle = (text) => {
    if (!text) return "N/A";
    const words = text.split(" ");
    if (words.length > 4) {
      return words.slice(0, 4).join(" ") + "...";
    }
    return text;
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this bookmark?")) return;
    try {
      const res = await deleteBookingAPI(id);
      if (res) {
        toast.success("Removed successfully");
        const updatedList = bookings.filter((item) => item._id !== id);
        setBookings(updatedList);

        // Agar delete ke baad current page empty ho jaye toh pichle page pe bhejo
        const newTotalPages = Math.ceil(updatedList.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 fw-bold text-navy">Loading Your Bookmarks...</p>
      </div>
    );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-navy mb-0">My Bookmarks</h4>
          <p className="text-muted small">Items you have bookmarked</p>
        </div>
        <span className="badge bg-danger rounded-pill px-3 py-2">
          {bookings.length} Items
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
                <th className="px-4 py-3 border-0">Date</th>
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
                          width: "45px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                        alt=""
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/45x40?text=No+Img")
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="fw-bold text-navy small">
                        {truncateTitle(item.itemId?.title)}
                      </div>
                    </td>
                    <td className="px-4 py-3 small text-muted">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => setSelectedBookmark(item)}
                          className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2 shadow-none">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2 shadow-none">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Bookmark
                      size={40}
                      className="text-muted opacity-25 mb-2"
                    />
                    <p className="text-muted">No bookmarks found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Component - Shows if at least 1 item exists */}
      {bookings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* VIEW MODAL (Popup) */}
      {selectedBookmark && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div
            className="bg-white rounded-4 shadow-lg overflow-hidden w-100 m-3"
            style={{ maxWidth: "500px" }}>
            <div className="position-relative">
              <img
                src={getImgURL(selectedBookmark.itemId?.images?.[0])}
                className="w-100"
                style={{ height: "200px", objectFit: "cover" }}
                alt=""
              />
              <button
                onClick={() => setSelectedBookmark(null)}
                className="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <h5 className="fw-bold text-navy mb-1">
                {selectedBookmark.itemId?.title}
              </h5>
              <div className="d-flex align-items-center gap-1 text-muted small mb-3">
                <MapPin size={14} className="text-danger" />{" "}
                {selectedBookmark.itemId?.address}
              </div>
              <hr />
              <div className="d-flex justify-content-between small text-secondary mb-2">
                <span>Bookmarked On:</span>
                <span className="fw-bold">
                  {formatDate(selectedBookmark.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedBookmark(null)}
                className="btn btn-navy w-100 mt-3 rounded-pill text-white fw-bold py-2"
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

export default MyBookmarks;