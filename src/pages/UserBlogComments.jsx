import React, { useState, useEffect } from "react";
import {
  getAllCommentsAPI,
  deleteCommentAPI,
  updateCommentAPI,
  getImgURL,
} from "../services/authService";
import { getUser } from "../utils/storage";
import { toast } from "react-toastify";
import {
  Trash2,
  Edit3,
  X,
  MessageSquare,
  BookOpen,
  Calendar,
  Search,
  Eye,
} from "lucide-react";
import Pagination from "../components/common/Pagination";

const UserBlogComments = () => {
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentUser = getUser();
  const currentUserId = currentUser?.id || currentUser?._id;

  const fetchMyComments = async () => {
    try {
      setLoading(true);
      const res = await getAllCommentsAPI();
      if (res?.comments) {
        const filtered = res.comments.filter(
          (c) => (c.userId?._id || c.userId) === currentUserId,
        );
        setMyComments(filtered);
      }
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchMyComments();
  }, [currentUserId]);

  const handleDelete = async (id) => {
    if (!window.confirm("क्या आप इस कमेंट को डिलीट करना चाहते हैं?")) return;
    try {
      const res = await deleteCommentAPI(id);
      if (res) {
        toast.success("Comment deleted successfully 🗑️");
        setMyComments(myComments.filter((c) => c._id !== id));
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newText = formData.get("commentText");

    try {
      setUpdating(true);
      const payload = {
        comment: newText,
        blogId: editItem.blogId?._id,
        userId: currentUserId,
      };

      const res = await updateCommentAPI(editItem._id, payload);
      if (res) {
        toast.success("Comment updated! ✨");
        setEditItem(null);
        fetchMyComments();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const truncateWords = (text, limit = 3) => {
    if (!text) return "N/A";
    const words = text.trim().split(/\s+/);
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  // Search Logic
  const filteredData = myComments.filter((c) =>
    c.blogId?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="text-center py-5 fw-bold text-navy">
        Loading My Comments...
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-800 text-navy m-0 text-uppercase">
            My Blog Comments
          </h4>
          <p className="text-muted small m-0">
            History of thoughts you've shared on blogs.
          </p>
        </div>
        <div
          className="position-relative mt-3 mt-md-0"
          style={{ width: "100%", maxWidth: "350px" }}>
          <Search
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            size={18}
          />
          <input
            type="text"
            className="form-control ps-5 rounded-pill border-0 shadow-sm"
            placeholder="Search by blog title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* LIST TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white border-bottom">
              <tr>
                <th className="px-4 py-3 small fw-bold text-navy">S.NO</th>
                <th className="py-3 small fw-bold text-navy">BLOG TITLE</th>
                <th className="py-3 small fw-bold text-navy">MY COMMENT</th>
                <th className="py-3 small fw-bold text-navy text-center">
                  DATE
                </th>
                <th className="px-4 py-3 small fw-bold text-navy text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted small">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="small fw-semibold text-primary">
                      <BookOpen size={14} className="me-1" />{" "}
                      {item.blogId?.title || "N/A"}
                    </td>
                    <td className="text-muted small">
                      {truncateWords(item.comment)}
                    </td>
                    <td className="small text-muted text-center">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
                          onClick={() => setViewItem(item)}>
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning border-0 rounded-circle p-2"
                          onClick={() => setEditItem(item)}>
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
                    No blog comments found.
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
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* --- VIEW MODAL --- */}
      {viewItem && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div
                className="modal-header border-0 bg-navy text-white p-4"
                style={{ backgroundColor: "#001f3f" }}>
                <h5 className="m-0 fw-bold">Comment Details</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setViewItem(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">
                    Blog Article:
                  </small>
                  <h6 className="fw-bold text-primary">
                    {viewItem.blogId?.title}
                  </h6>
                </div>
                <div className="mb-4">
                  <small className="text-muted d-block">
                    <Calendar size={14} className="me-1" /> Posted On:{" "}
                    {new Date(viewItem.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="bg-light p-3 rounded-3 border-start border-4 border-primary">
                  <label className="fw-bold small text-navy d-block mb-2">
                    My Full Comment:
                  </label>
                  <p className="m-0 text-dark small italic">
                    "{viewItem.comment}"
                  </p>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setViewItem(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editItem && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <form
              onSubmit={handleUpdate}
              className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 bg-warning text-dark p-4">
                <h5 className="m-0 fw-bold">Update Comment</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setEditItem(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-bold small text-navy">
                    BLOG: {editItem.blogId?.title}
                  </label>
                  <textarea
                    name="commentText"
                    defaultValue={editItem.comment}
                    className="form-control rounded-3 border-light shadow-sm"
                    rows="5"
                    required></textarea>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setEditItem(null)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary rounded-pill px-4 fw-bold shadow">
                  {updating ? "Updating..." : "Save Changes"}
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

export default UserBlogComments;
