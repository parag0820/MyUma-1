import React, { useState, useEffect } from "react";
import {
  getRatingsAPI,
  deleteRatingAPI,
  getImgURL,
} from "../services/authService";
import { getUser } from "../utils/storage"; // Import storage utility
import { toast } from "react-toastify";
import {
  Star,
  User,
  Trash2,
  Eye,
  X,
  Calendar,
  MessageCircle,
  Tag,
  MapPin,
} from "lucide-react";
import Pagination from "../components/common/Pagination";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Get Current Logged-in Owner Details
  const currentUser = getUser();
  const currentUserId = currentUser?._id || currentUser?.id;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getRatingsAPI();
      
      if (res.status && res.data) {
        // --- DYNAMIC FILTERING LOGIC ---
        // Only show reviews where the Item belongs to the logged-in Owner
        const ownerSpecificReviews = res.data.filter((rev) => {
          const itemOwnerId = rev.itemId?.ownerId?._id || rev.itemId?.ownerId;
          return itemOwnerId?.toString() === currentUserId?.toString();
        });

        setReviews(ownerSpecificReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchReviews();
    }
  }, [currentUserId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await deleteRatingAPI(id);
      if (res.status) {
        toast.success("Review deleted successfully! 🗑️");
        setReviews(reviews.filter((r) => r._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleView = (item) => {
    setSelectedReview(item);
    setShowModal(true);
  };

  const truncateComment = (text) => {
    if (!text) return "N/A";
    const words = text.trim().split(/\s+/);
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : text;
  };

  const renderStars = (rating) => (
    <div className="d-flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "#ffc107" : "none"}
          stroke={i < rating ? "#ffc107" : "#dee2e6"}
        />
      ))}
    </div>
  );

  // Filter Logic (for Search Bar if you add one later)
  const filteredData = reviews.filter(
    (r) =>
      r.itemId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  if (loading)
    return (
      <div className="text-center py-5 fw-bold text-navy vh-100 d-flex align-items-center justify-content-center">
        Loading Your Listing Feedback...
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      <div className="mb-4">
        <h4 className="fw-800 text-navy m-0 text-uppercase">Review Management</h4>
        <p className="text-muted small">Feedback left by users on your properties.</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white border-bottom">
              <tr>
                <th className="px-4 py-3 small fw-bold text-navy">S.NO</th>
                <th className="py-3 small fw-bold text-navy">REVIEWER</th>
                <th className="py-3 small fw-bold text-navy">LISTING</th>
                <th className="py-3 small fw-bold text-navy">RATING</th>
                <th className="py-3 small fw-bold text-navy">COMMENT</th>
                <th className="px-4 py-3 small fw-bold text-navy text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length > 0 ? (
                currentReviews.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted small">{indexOfFirstItem + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.userId?.profileImage ? getImgURL(item.userId.profileImage.trim()) : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          className="rounded-circle border"
                          style={{ width: "30px", height: "30px", objectFit: "cover" }}
                          alt=""
                        />
                        <span className="fw-bold small">{item.userId?.fullName || "Guest User"}</span>
                      </div>
                    </td>
                    <td className="small fw-semibold">{item.itemId?.title || "N/A"}</td>
                    <td>{renderStars(item.rating)}</td>
                    <td className="text-muted small">{truncateComment(item.comment)}</td>
                    <td className="px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2" onClick={() => handleView(item)}>
                          <Eye size={18} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2" onClick={() => handleDelete(item._id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No reviews found for your listings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* --- VIEW MODAL --- */}
      {showModal && selectedReview && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 bg-navy text-white p-4" style={{ backgroundColor: "#001f3f" }}>
                <h5 className="m-0 fw-bold">Feedback Details</h5>
                <X className="cursor-pointer" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
                    <img 
                      src={selectedReview.userId?.profileImage ? getImgURL(selectedReview.userId.profileImage.trim()) : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                      className="rounded-circle border" 
                      style={{ width: "55px", height: "55px", objectFit: "cover" }} 
                      alt="" 
                    />
                  <div>
                    <h6 className="fw-bold m-0 text-navy">{selectedReview.userId?.fullName || "Guest User"}</h6>
                    <small className="text-muted">{selectedReview.userId?.email || "No email provided"}</small>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <small className="text-muted d-block"><Tag size={14} className="me-1" /> Listing</small>
                    <span className="fw-bold small">{selectedReview.itemId?.title}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block"><Calendar size={14} className="me-1" /> Posted On</small>
                    <span className="fw-bold small">{new Date(selectedReview.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="fw-bold m-0 small">Rating</h6>
                    {renderStars(selectedReview.rating)}
                  </div>
                  <div className="bg-light p-3 rounded-3 border-start border-4 border-primary mt-2">
                    <p className="m-0 text-dark small italic">
                      <MessageCircle size={14} className="me-2 text-primary" />
                      "{selectedReview.comment}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`.fw-800 { font-weight: 800; } .text-navy { color: #001f3f; } .cursor-pointer { cursor: pointer; }`}</style>
    </div>
  );
};

export default ReviewPage;