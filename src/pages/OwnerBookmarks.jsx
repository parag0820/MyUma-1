import React, { useEffect, useState } from "react";
import {
  getBookingsByUserAPI,
  getBookingsByOwnerAPI,
  deleteBookingAPI,
  getImgURL,
} from "../services/authService";
import { toast } from "react-toastify";
import {
  Trash2,
  MapPin,
  X,
  Calendar,
  User as UserIcon,
  Eye,
  Image as ImageIcon,
  Bookmark as BookmarkIcon,
} from "lucide-react";
// Pagination Component Import
import Pagination from "../components/common/Pagination";

const OwnerBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]); // State name changed to bookmarks
  const [loading, setLoading] = useState(true);

  // States for Modals
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [viewData, setViewData] = useState(null);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id || currentUser?.id;
  const userRole = currentUser?.role;

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      let res;
      if (userRole === "owner") {
        res = await getBookingsByOwnerAPI(currentUserId);
      } else {
        res = await getBookingsByUserAPI(currentUserId);
      }

      if (res) {
        const data = res.bookings || res.data || [];
        setBookmarks(data);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchBookmarks();
  }, [currentUserId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this bookmark?")) {
      try {
        const res = await deleteBookingAPI(id);
        if (res.status || res.success) {
          toast.success("Bookmark removed successfully");
          setBookmarks(bookmarks.filter((item) => item._id !== id));
          if (currentBookmarks.length === 1 && currentPage > 1)
            setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        toast.error("Failed to delete bookmark");
      }
    }
  };

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookmarks = bookmarks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookmarks.length / itemsPerPage);

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
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-navy mb-1">
            <BookmarkIcon size={24} className="text-danger me-2 mb-1" />
            {userRole === "owner" ? "Received Bookmarks" : "My Bookmarks"}
          </h4>
          <p className="text-muted small mb-0">
            {bookmarks.length} saved items found.
          </p>
        </div>
        <span className="badge bg-danger rounded-pill px-3 py-2">
          {bookmarks.length} Bookmarks
        </span>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-secondary border-0 small fw-bold">
                  S.NO
                </th>
                <th className="px-4 py-3 text-secondary border-0 small fw-bold">
                  USER
                </th>
                <th className="px-4 py-3 text-secondary border-0 small fw-bold">
                  ITEM NAME
                </th>
                <th className="px-4 py-3 text-secondary border-0 small fw-bold">
                  ADDRESS
                </th>
                <th className="px-4 py-3 text-secondary border-0 small fw-bold">
                  SAVED ON
                </th>
                <th className="px-4 py-3 text-secondary border-0 text-center small fw-bold">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBookmarks.length > 0 ? (
                currentBookmarks.map((item, index) => (
                  <tr key={item._id} className="border-bottom">
                    <td className="px-4 py-3 text-muted small">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={getImgURL(item.userId?.profileImage)}
                          className="rounded-circle border"
                          style={{
                            width: "35px",
                            height: "35px",
                            objectFit: "cover",
                          }}
                          alt=""
                          onError={(e) =>
                            (e.target.src =
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                          }
                        />
                        <div className="fw-bold text-dark small">
                          {item.userId?.fullName || "Guest"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 fw-bold text-navy small">
                      {item.itemId?.title || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="small text-muted d-flex align-items-center gap-1">
                        <MapPin
                          size={14}
                          className="text-danger flex-shrink-0"
                        />
                        <span
                          className="text-truncate"
                          style={{ maxWidth: "120px" }}>
                          {item.itemId?.address}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedInfo({
                              title: item.itemId?.title,
                              address: item.itemId?.address,
                            })
                          }
                          className="btn btn-link btn-sm p-0 text-primary text-decoration-none fw-bold"
                          style={{ fontSize: "10px" }}>
                          Read
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 small text-muted">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => setViewData(item)}
                          className="btn btn-light btn-sm rounded-circle shadow-sm border text-primary"
                          title="View Details">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-light btn-sm rounded-circle shadow-sm border text-danger"
                          title="Remove">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No bookmarks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Integration */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* --- VIEW POPUP --- */}
      {viewData && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div
            className="bg-white rounded-4 shadow-lg w-100"
            style={{ maxWidth: "500px", overflow: "hidden" }}>
            <div
              className="p-3 bg-navy text-white d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#001f3f" }}>
              <h6 className="m-0 fw-bold">Bookmark Info</h6>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => setViewData(null)}
              />
            </div>
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={getImgURL(viewData.itemId?.images?.[0])}
                    className="rounded-4 shadow-sm border"
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                    alt="item"
                  />
                  <span className="position-absolute top-0 end-0 m-2 badge bg-danger rounded-pill">
                    <ImageIcon size={12} className="me-1" /> Gallery
                  </span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="text-muted small fw-bold d-block">
                    User Name
                  </label>
                  <p className="small fw-bold text-dark">
                    {viewData.userId?.fullName}
                  </p>
                </div>
                <div className="col-6">
                  <label className="text-muted small fw-bold d-block">
                    Saved Date
                  </label>
                  <p className="small text-dark">
                    {formatDate(viewData.createdAt)}
                  </p>
                </div>
                <div className="col-12">
                  <label className="text-muted small fw-bold d-block">
                    Bookmark Item
                  </label>
                  <p className="fw-bold text-navy">{viewData.itemId?.title}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted small fw-bold d-block">
                    Location
                  </label>
                  <div className="p-2 bg-light border rounded small text-secondary">
                    <MapPin size={14} className="text-danger me-1" />{" "}
                    {viewData.itemId?.address}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-navy w-100 mt-4 rounded-pill text-white fw-bold py-2 shadow-sm"
                style={{ backgroundColor: "#001f3f" }}
                onClick={() => setViewData(null)}>
                CLOSE INFO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMPLE ADDRESS POPUP --- */}
      {selectedInfo && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
          <div
            className="bg-white rounded-4 shadow-lg p-4 w-100"
            style={{ maxWidth: "400px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h6 className="fw-bold text-navy m-0">Bookmark Location</h6>
              <X
                size={18}
                className="cursor-pointer"
                onClick={() => setSelectedInfo(null)}
              />
            </div>
            <p className="small text-secondary bg-light p-3 rounded border mb-0">
              {selectedInfo.address}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .text-navy { color: #001f3f; }
        .cursor-pointer { cursor: pointer; }
        .table-hover tbody tr:hover { background-color: #f8f9fa; transition: 0.3s; }
      `}</style>
    </div>
  );
};

export default OwnerBookmarks;
