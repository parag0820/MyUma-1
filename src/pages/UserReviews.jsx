
import React, { useState, useEffect } from "react";
import {
  getRatingsAPI,
  updateRatingAPI,
  deleteRatingAPI,
  getImgURL,
} from "../services/authService";
import { getUser } from "../utils/storage";
import { toast } from "react-toastify";
import { Star, Eye, Edit3, Trash2, X, MapPin } from "lucide-react";
import Pagination from "../components/common/Pagination";

const UserReviews = () => {
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals State
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Edit Form State
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentUser = getUser();
  const currentUserId = currentUser?.id || currentUser?._id;

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const res = await getRatingsAPI();
      if (res.status && res.data) {
        const filtered = res.data.filter((r) => {
          const reviewerId = r.userId?._id || r.userId;
          return reviewerId?.toString() === currentUserId?.toString();
        });
        setMyReviews(filtered);
      }
    } catch (error) {
      toast.error("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchMyReviews();
  }, [currentUserId]);

  // Truncate logic (4 words)
  const truncateTitle = (text) => {
    if (!text) return "N/A";
    const words = text.split(" ");
    return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : text;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await updateRatingAPI(selectedReview._id, {
        userId: currentUserId,
        itemId: selectedReview.itemId?._id || selectedReview.itemId,
        rating: editRating,
        comment: editComment.trim(),
      });
      if (res.status) {
        toast.success("Review Updated! ✨");
        setShowEditModal(false);
        fetchMyReviews();
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      const res = await deleteRatingAPI(id);
      if (res.status) {
        toast.success("Review Deleted! 🗑️");
        setMyReviews(myReviews.filter((r) => r._id !== id));
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const renderStars = (rating, onClick = null) => (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={onClick ? 30 : 14}
          style={{ cursor: onClick ? "pointer" : "default" }}
          fill={n <= rating ? "#ffc107" : "none"}
          stroke={n <= rating ? "#ffc107" : "#dee2e6"}
          onClick={() => onClick && onClick(n)}
        />
      ))}
    </div>
  );

  const filteredData = myReviews.filter((r) =>
    r.itemId?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentReviews = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading)
    return (
      <div className="text-center py-5 fw-bold text-navy">
        Loading Your History...
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-start">
        <div>
          <h4 className="fw-800 text-navy m-0 text-uppercase">My Reviews</h4>
          <p className="text-muted small m-0">
            History of your business feedback
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-start">
            <thead className="bg-white border-bottom">
              <tr>
                <th className="px-4 py-3 small fw-bold text-navy">BUSINESS</th>
                <th className="py-3 small fw-bold text-navy">RATING</th>
                <th className="py-3 small fw-bold text-navy">COMMENT</th>
                <th className="py-3 small fw-bold text-navy">DATE</th>
                <th className="px-4 py-3 small fw-bold text-navy text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length > 0 ? (
                currentReviews.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={getImgURL(item.itemId?.images?.[0])}
                          className="rounded"
                          style={{
                            width: "35px",
                            height: "35px",
                            objectFit: "cover",
                          }}
                          alt="img"
                        />
                        <span className="fw-bold small">
                          {truncateTitle(item.itemId?.title)}
                        </span>
                      </div>
                    </td>
                    <td>{renderStars(item.rating)}</td>
                    <td
                      className="text-muted small text-truncate"
                      style={{ maxWidth: "200px" }}>
                      {item.comment}
                    </td>
                    <td className="small text-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
                          onClick={() => {
                            setSelectedReview(item);
                            setShowViewModal(true);
                          }}>
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning border-0 rounded-circle p-2"
                          onClick={() => {
                            setSelectedReview(item);
                            setEditRating(item.rating);
                            setEditComment(item.comment);
                            setShowEditModal(true);
                          }}>
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                          onClick={() => handleDelete(item._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}

      {/* --- VIEW MODAL --- */}
      {showViewModal && selectedReview && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg text-start overflow-hidden">
              <div
                className="modal-header border-0 bg-navy text-white p-4"
                style={{ backgroundColor: "#001f3f" }}>
                <h5 className="m-0 fw-bold">Review Details</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowViewModal(false)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
                  <img
                    src={getImgURL(selectedReview.itemId?.images?.[0])}
                    className="rounded border"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    alt="biz"
                  />
                  <div>
                    <h6 className="fw-bold m-0">
                      {selectedReview.itemId?.title}
                    </h6>
                    <small className="text-muted">
                      <MapPin size={12} /> {selectedReview.itemId?.address}
                    </small>
                  </div>
                </div>
                <div className="mb-3">
                  {renderStars(selectedReview.rating)}
                  <p className="mt-3 bg-light p-3 rounded italic">
                    "{selectedReview.comment}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && selectedReview && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <form
              onSubmit={handleUpdateSubmit}
              className="modal-content border-0 rounded-4 shadow-lg text-start overflow-hidden">
              <div className="modal-header border-0 bg-warning text-dark p-4">
                <h5 className="m-0 fw-bold">Update Review</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small mb-3">
                  Editing feedback for: <b>{selectedReview.itemId?.title}</b>
                </p>
                <div className="text-center mb-4">
                  {renderStars(editRating, setEditRating)}
                </div>
                <textarea
                  className="form-control bg-light border-0"
                  rows="4"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary rounded-pill px-4 fw-bold">
                  {submitting ? "Updating..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`.fw-800 { font-weight: 800; } .text-navy { color: #001f3f; } .cursor-pointer { cursor: pointer; }`}</style>
    </div>
  );
};

export default UserReviews;