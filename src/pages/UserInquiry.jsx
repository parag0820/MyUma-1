// import React, { useEffect, useState } from "react";
// import {
//   getInquiriesApi,
//   deleteInquireApi,
//   updateInquireApi,
// } from "../services/authService";
// import { getUser } from "../utils/storage";
// import { toast } from "react-toastify";
// import {
//   Trash2,
//   Eye,
//   Edit3,
//   X,
//   Calendar,
//   MessageSquare,
//   Tag,
//   Search,
//   MapPin,
//   User,
// } from "lucide-react";
// import Pagination from "../components/common/Pagination";

// const UserInquiry = () => {
//   const [myInquiries, setMyInquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal States
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedInquiry, setSelectedInquiry] = useState(null);

//   // Edit State
//   const [editComment, setEditComment] = useState("");
//   const [updating, setUpdating] = useState(false);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const currentUser = getUser();
//   const userEmail = currentUser?.email;

//   const fetchMyInquiries = async () => {
//     try {
//       setLoading(true);
//       const res = await getInquiriesApi();
//       if (res?.data) {
//         const filtered = res.data.filter((item) => item.email === userEmail);
//         setMyInquiries(filtered);
//       }
//     } catch (error) {
//       console.error("Error fetching inquiries:", error);
//       toast.error("Failed to load inquiries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userEmail) fetchMyInquiries();
//   }, [userEmail]);

//   // --- ACTIONS ---

//   const handleView = (item) => {
//     setSelectedInquiry(item);
//     setShowViewModal(true);
//   };

//   const openEditModal = (item) => {
//     setSelectedInquiry(item);
//     setEditComment(item.comment);
//     setShowEditModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("क्या आप इस Inquiry को डिलीट करना चाहते हैं?")) return;
//     try {
//       await deleteInquireApi(id);
//       toast.success("Inquiry Deleted Successfully! 🗑️");
//       setMyInquiries(myInquiries.filter((i) => i._id !== id));
//     } catch (error) {
//       toast.error("Failed to delete inquiry");
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     try {
//       // API call to update inquiry (comment)
//       const res = await updateInquireApi(selectedInquiry._id, {
//         comment: editComment.trim(),
//       });
//       if (res) {
//         toast.success("Message Updated! ✨");
//         setShowEditModal(false);
//         fetchMyInquiries();
//       }
//     } catch (error) {
//       toast.error("Update failed ❌");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const truncateMessage = (text) => {
//     if (!text) return "N/A";
//     const words = text.trim().split(/\s+/);
//     return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : text;
//   };

//   // Search filter
//   const filteredData = myInquiries.filter((item) =>
//     item.itemId?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const currentInquiries = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   if (loading)
//     return (
//       <div className="text-center py-5 fw-bold text-navy">
//         Loading Your Inquiries...
//       </div>
//     );

//   return (
//     <div className="container-fluid py-4 bg-light min-vh-100">
//       {/* HEADER */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-start">
//         <div>
//           <h4 className="fw-800 text-navy m-0 text-uppercase">
//             My Inquiries
//           </h4>

//         </div>
//         <div
//           className="position-relative mt-3 mt-md-0"
//           style={{ width: "100%", maxWidth: "350px" }}>
//           <Search
//             className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
//             size={18}
//           />
//           <input
//             type="text"
//             className="form-control ps-5 rounded-pill border-0 shadow-sm"
//             placeholder="Search by listing name..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0 text-start">
//             <thead className="bg-white border-bottom">
//               <tr>
//                 <th className="px-4 py-3 small fw-bold text-navy">S.NO</th>
//                 <th className="py-3 small fw-bold text-navy">
//                   BUSINESS / LISTING
//                 </th>
//                 <th className="py-3 small fw-bold text-navy">MY MESSAGE</th>
//                 <th className="py-3 small fw-bold text-navy">DATE</th>
//                 <th className="px-4 py-3 small fw-bold text-navy text-center">
//                   ACTIONS
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentInquiries.length > 0 ? (
//                 currentInquiries.map((item, index) => (
//                   <tr key={item._id}>
//                     <td className="px-4 text-muted small">
//                       {(currentPage - 1) * itemsPerPage + index + 1}
//                     </td>
//                     <td className="small fw-semibold text-primary">
//                       {item.itemId?.title || "N/A"}
//                     </td>
//                     <td className="text-muted small">
//                       {truncateMessage(item.comment)}
//                     </td>
//                     <td className="small text-muted">
//                       {new Date(item.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 text-center">
//                       <div className="d-flex justify-content-center gap-2">
//                         <button
//                           className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
//                           title="View"
//                           onClick={() => handleView(item)}>
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-warning border-0 rounded-circle p-2"
//                           title="Edit"
//                           onClick={() => openEditModal(item)}>
//                           <Edit3 size={16} />
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
//                           title="Delete"
//                           onClick={() => handleDelete(item._id)}>
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     No inquiries found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={(page) => setCurrentPage(page)}
//       />

//       {/* --- VIEW MODAL --- */}
//       {showViewModal && selectedInquiry && (
//         <div
//           className="modal show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 rounded-4 shadow-lg text-start overflow-hidden">
//               <div
//                 className="modal-header border-0 bg-navy text-white p-4"
//                 style={{ backgroundColor: "#001f3f" }}>
//                 <h5 className="m-0 fw-bold">Inquiry Details</h5>
//                 <X
//                   className="cursor-pointer"
//                   onClick={() => setShowViewModal(false)}
//                 />
//               </div>
//               <div className="modal-body p-4">
//                 <div className="mb-4">
//                   <small className="text-muted d-block mb-1">
//                     <Tag size={14} /> Business Title
//                   </small>
//                   <h6 className="fw-bold text-primary">
//                     {selectedInquiry.itemId?.title}
//                   </h6>
//                   <small className="text-muted">
//                     <MapPin size={12} /> {selectedInquiry.itemId?.address}
//                   </small>
//                 </div>

//                 <div className="row g-3 mb-4 border-top pt-3">
//                   <div className="col-6">
//                     <small className="text-muted d-block">Sent On</small>
//                     <span className="fw-bold small">
//                       {new Date(selectedInquiry.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="col-6">
//                     <small className="text-muted d-block">Contact No</small>
//                     <span className="fw-bold small">
//                       {selectedInquiry.phoneNo}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-light p-3 rounded-3 border-start border-4 border-primary">
//                   <label className="fw-bold small text-navy d-block mb-2">
//                     My Message:
//                   </label>
//                   <p className="m-0 text-dark small font-italic">
//                     "{selectedInquiry.comment}"
//                   </p>
//                 </div>
//               </div>
//               <div className="modal-footer border-0">
//                 <button
//                   className="btn btn-secondary rounded-pill px-4"
//                   onClick={() => setShowViewModal(false)}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- EDIT MODAL --- */}
//       {showEditModal && selectedInquiry && (
//         <div
//           className="modal show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <form
//               onSubmit={handleUpdate}
//               className="modal-content border-0 rounded-4 shadow-lg text-start overflow-hidden">
//               <div className="modal-header border-0 bg-warning text-dark p-4">
//                 <h5 className="m-0 fw-bold">Update Message</h5>
//                 <X
//                   className="cursor-pointer"
//                   onClick={() => setShowEditModal(false)}
//                 />
//               </div>
//               <div className="modal-body p-4">
//                 <div className="mb-3">
//                   <label className="form-label fw-bold small text-navy text-uppercase">
//                     Inquiry Message
//                   </label>
//                   <textarea
//                     className="form-control rounded-3 border-light shadow-sm"
//                     rows="5"
//                     value={editComment}
//                     onChange={(e) => setEditComment(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer border-0 p-4 pt-0">
//                 <button
//                   type="button"
//                   className="btn btn-light rounded-pill px-4"
//                   onClick={() => setShowEditModal(false)}>
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={updating}
//                   className="btn btn-primary rounded-pill px-4 fw-bold shadow">
//                   {updating ? "Updating..." : "Save Changes"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <style>{`.fw-800 { font-weight: 800; } .text-navy { color: #001f3f; } .cursor-pointer { cursor: pointer; }`}</style>
//     </div>
//   );
// };

// export default UserInquiry;
import React, { useEffect, useState } from "react";
import {
  getInquireByUserIdApi, // 👈 New direct API
  deleteInquireApi,
  updateInquireApi,
} from "../services/authService";
import { getUser } from "../utils/storage";
import { toast } from "react-toastify";
import { Trash2, Eye, Edit3, X, Search, MapPin, Tag } from "lucide-react";
import Pagination from "../components/common/Pagination";

const UserInquiry = () => {
  const [myInquiries, setMyInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Edit State
  const [editComment, setEditComment] = useState("");
  const [updating, setUpdating] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Get User ID from storage
  const currentUser = getUser();
  const userId = currentUser?._id || currentUser?.id;

  const fetchMyInquiries = async () => {
    if (!userId) {
      console.warn("📡 User ID missing. Cannot fetch inquiries.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🚀 Fetching inquiries sent by User ID:", userId);

      // 2. Direct API call using UserId
      const res = await getInquireByUserIdApi(userId);

      console.log("✅ Inquiries fetched successfully:", res.data);

      if (res?.data) {
        setMyInquiries(res.data);
      }
    } catch (error) {
      console.error("❌ Error fetching user inquiries:", error);
      toast.error("Failed to load your inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInquiries();
  }, [userId]);

  // --- ACTIONS ---

  const handleView = (item) => {
    setSelectedInquiry(item);
    setShowViewModal(true);
  };

  const openEditModal = (item) => {
    setSelectedInquiry(item);
    setEditComment(item.comment);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to delete this inquiry?")) return;
    try {
      await deleteInquireApi(id);
      toast.success("Inquiry Deleted!");
      setMyInquiries(myInquiries.filter((i) => i._id !== id));
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await updateInquireApi(selectedInquiry._id, {
        comment: editComment.trim(),
      });
      if (res) {
        toast.success("Your message has been updated! ✨");
        setShowEditModal(false);
        fetchMyInquiries();
      }
    } catch (error) {
      toast.error("Update failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  const truncateMessage = (text) => {
    if (!text) return "N/A";
    const words = text.trim().split(/\s+/);
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : text;
  };

  // Search filter applied to the local state
  const filteredData = myInquiries.filter((item) =>
    item.itemId?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentInquiries = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="text-center py-5 fw-bold text-navy">
        Loading Your Inquiries...
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-800 text-navy m-0 text-uppercase">My Inquiries</h4>
          <p className="text-muted small">
            Viewing inquiries you have sent to owners
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
            placeholder="Search by listing name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white border-bottom">
              <tr>
                <th className="px-4 py-3 small fw-bold text-navy">S.NO</th>
                <th className="py-3 small fw-bold text-navy">
                  BUSINESS / LISTING
                </th>
                <th className="py-3 small fw-bold text-navy">MY MESSAGE</th>
                <th className="py-3 small fw-bold text-navy">DATE</th>
                <th className="px-4 py-3 small fw-bold text-navy text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentInquiries.length > 0 ? (
                currentInquiries.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted small">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="small fw-semibold text-primary">
                      {item.itemId?.title || "N/A"}
                    </td>
                    <td className="text-muted small">
                      {truncateMessage(item.comment)}
                    </td>
                    <td className="small text-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
                          title="View"
                          onClick={() => handleView(item)}>
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning border-0 rounded-circle p-2"
                          title="Edit"
                          onClick={() => openEditModal(item)}>
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                          title="Delete"
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
                    You haven't sent any inquiries yet.
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
      {showViewModal && selectedInquiry && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg text-start overflow-hidden">
              <div
                className="modal-header border-0 bg-navy text-white p-4"
                style={{ backgroundColor: "#001f3f" }}>
                <h5 className="m-0 fw-bold">Inquiry Details</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowViewModal(false)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <small className="text-muted d-block mb-1">
                    <Tag size={14} /> Business Title
                  </small>
                  <h6 className="fw-bold text-primary">
                    {selectedInquiry.itemId?.title}
                  </h6>
                  <small className="text-muted">
                    <MapPin size={12} /> {selectedInquiry.itemId?.address}
                  </small>
                </div>
                <div className="bg-light p-3 rounded-3 border-start border-4 border-primary">
                  <label className="fw-bold small text-navy d-block mb-2">
                    My Message Sent:
                  </label>
                  <p className="m-0 text-dark small font-italic">
                    "{selectedInquiry.comment}"
                  </p>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && selectedInquiry && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <form
              onSubmit={handleUpdate}
              className="modal-content border-0 rounded-4 shadow-lg text-start overflow-hidden">
              <div className="modal-header border-0 bg-warning text-dark p-4">
                <h5 className="m-0 fw-bold">Update My Message</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-bold small text-navy">
                    Modify your inquiry text
                  </label>
                  <textarea
                    className="form-control rounded-3 border-light shadow-sm"
                    rows="5"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    required
                  />
                </div>
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

export default UserInquiry;