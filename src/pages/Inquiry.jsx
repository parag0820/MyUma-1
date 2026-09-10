// // import React, { useEffect, useState } from "react";
// // import { getInquiriesApi, deleteInquireApi } from "../services/authService";
// // import { toast } from "react-toastify";
// // import {
// //   Trash2,
// //   Eye,
// //   X,
// //   Calendar,
// //   User,
// //   Mail,
// //   Phone,
// //   MessageSquare,
// //   Tag,
// //   UserCheck,
// // } from "lucide-react";
// // import Pagination from "../components/common/Pagination";

// // const Inquiry = () => {
// //   const [inquiries, setInquiries] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Modal State
// //   const [selectedInquiry, setSelectedInquiry] = useState(null);
// //   const [showModal, setShowModal] = useState(false);

// //   // Pagination State
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 5;

// //   const fetchInquiries = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await getInquiriesApi();
// //       setInquiries(res?.data || []);
// //     } catch (error) {
// //       console.error("Error fetching inquiries:", error);
// //       toast.error("Failed to load inquiries");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchInquiries();
// //   }, []);

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this inquiry?"))
// //       return;
// //     try {
// //       const res = await deleteInquireApi(id);
// //       if (res) {
// //         toast.success("Inquiry Deleted Successfully! 🗑️");
// //         fetchInquiries();
// //         if (currentInquiries.length === 1 && currentPage > 1) {
// //           setCurrentPage(currentPage - 1);
// //         }
// //       }
// //     } catch (error) {
// //       toast.error("Failed to delete inquiry ❌");
// //     }
// //   };

// //   const handleView = (item) => {
// //     setSelectedInquiry(item);
// //     setShowModal(true);
// //   };

// //   const truncateMessage = (text) => {
// //     if (!text) return "N/A";
// //     const words = text.trim().split(/\s+/);
// //     return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : text;
// //   };

// //   // Pagination Logic
// //   const totalPages = Math.ceil(inquiries.length / itemsPerPage);
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentInquiries = inquiries.slice(indexOfFirstItem, indexOfLastItem);

// //   if (loading)
// //     return (
// //       <div className="text-center py-5 fw-bold text-navy">
// //         Loading Inquiries...
// //       </div>
// //     );

// //   return (
// //     <div className="container-fluid py-4 bg-light min-vh-100">
// //       <div className="d-flex justify-content-between align-items-center mb-4">
// //         <h4 className="fw-800 text-navy m-0">Customer Inquiries</h4>
// //         <div className="badge bg-navy px-3 py-2 shadow-sm">
// //           Total: {inquiries.length}
// //         </div>
// //       </div>

// //       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
// //         <div className="table-responsive">
// //           <table className="table table-hover align-middle mb-0">
// //             <thead className="bg-white border-bottom">
// //               <tr>
// //                 <th className="px-4 py-3 text-secondary fw-bold small">S.No</th>
// //                 <th className="py-3 text-secondary fw-bold small">FULL NAME</th>
// //                 <th className="py-3 text-secondary fw-bold small">EMAIL</th>
// //                 <th className="py-3 text-secondary fw-bold small">PHONE</th>
// //                 <th className="py-3 text-secondary fw-bold small">LISTING</th>
// //                 <th className="py-3 text-secondary fw-bold small text-center">
// //                   ACTION
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {currentInquiries.length > 0 ? (
// //                 currentInquiries.map((item, index) => (
// //                   <tr key={item._id}>
// //                     <td className="px-4 text-muted small">
// //                       {indexOfFirstItem + index + 1}
// //                     </td>
// //                     <td className="fw-bold text-primary small">
// //                       {item.fullName}
// //                     </td>
// //                     <td className="text-muted small">{item.email}</td>
// //                     <td className="small">{item.phoneNo}</td>
// //                     <td>
// //                       <span className="badge bg-info-subtle text-info border border-info-subtle small px-2 py-1">
// //                         {item.itemId?.title || "N/A"}
// //                       </span>
// //                     </td>
// //                     <td className="px-4 text-center">
// //                       <div className="d-flex justify-content-center gap-2">
// //                         <button
// //                           className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
// //                           onClick={() => handleView(item)}
// //                           title="View Details">
// //                           <Eye size={18} />
// //                         </button>
// //                         <button
// //                           className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
// //                           onClick={() => handleDelete(item._id)}
// //                           title="Delete">
// //                           <Trash2 size={18} />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="6" className="text-center py-5 text-muted">
// //                     No Inquiries Found.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Pagination Component integration */}
// //       <Pagination
// //         currentPage={currentPage}
// //         totalPages={totalPages}
// //         onPageChange={(page) => setCurrentPage(page)}
// //       />

// //       {/* --- INQUIRY DETAILS MODAL --- */}
// //       {showModal && selectedInquiry && (
// //         <div
// //           className="modal show d-block"
// //           style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 10000 }}>
// //           <div className="modal-dialog modal-dialog-centered modal-lg">
// //             <div className="modal-content border-0 rounded-4 shadow-lg">
// //               <div
// //                 className="modal-header border-0 bg-navy text-white p-4"
// //                 style={{ backgroundColor: "#001f3f" }}>
// //                 <h5 className="m-0 fw-bold">Inquiry Details</h5>
// //                 <X
// //                   className="cursor-pointer"
// //                   onClick={() => setShowModal(false)}
// //                 />
// //               </div>
// //               <div className="modal-body p-4">
// //                 <div className="row g-4">
// //                   <div className="col-md-6">
// //                     <div className="d-flex align-items-center gap-3 mb-3">
// //                       <div className="bg-light p-2 rounded-3 text-primary">
// //                         <User size={20} />
// //                       </div>
// //                       <div>
// //                         <small className="text-muted d-block">Full Name</small>
// //                         <span className="fw-bold">
// //                           {selectedInquiry.fullName}
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div className="d-flex align-items-center gap-3 mb-3">
// //                       <div className="bg-light p-2 rounded-3 text-primary">
// //                         <Mail size={20} />
// //                       </div>
// //                       <div>
// //                         <small className="text-muted d-block">
// //                           Email Address
// //                         </small>
// //                         <span className="fw-bold">{selectedInquiry.email}</span>
// //                       </div>
// //                     </div>
// //                     <div className="d-flex align-items-center gap-3 mb-3">
// //                       <div className="bg-light p-2 rounded-3 text-primary">
// //                         <Phone size={20} />
// //                       </div>
// //                       <div>
// //                         <small className="text-muted d-block">
// //                           Phone Number
// //                         </small>
// //                         <span className="fw-bold">
// //                           {selectedInquiry.phoneNo}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-6">
// //                     <div className="d-flex align-items-center gap-3 mb-3">
// //                       <div className="bg-light p-2 rounded-3 text-info">
// //                         <Tag size={20} />
// //                       </div>
// //                       <div>
// //                         <small className="text-muted d-block">
// //                           Listing / Item
// //                         </small>
// //                         <span className="fw-bold text-info">
// //                           {selectedInquiry.itemId?.title || "N/A"}
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div className="d-flex align-items-center gap-3 mb-3">
// //                       <div className="bg-light p-2 rounded-3 text-warning">
// //                         <UserCheck size={20} />
// //                       </div>
// //                       <div>
// //                         <small className="text-muted d-block">
// //                           Business Owner
// //                         </small>
// //                         <span className="fw-bold">
// //                           {selectedInquiry.ownerId?.fullName || "N/A"}
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div className="d-flex align-items-center gap-3 mb-3">
// //                       <div className="bg-light p-2 rounded-3 text-danger">
// //                         <Calendar size={20} />
// //                       </div>
// //                       <div>
// //                         <small className="text-muted d-block">
// //                           Inquiry Date
// //                         </small>
// //                         <span className="fw-bold">
// //                           {new Date(
// //                             selectedInquiry.createdAt,
// //                           ).toLocaleDateString()}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-12 mt-2">
// //                     <div className="bg-light p-4 rounded-4 border-start border-primary border-4 shadow-sm">
// //                       <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
// //                         <MessageSquare size={18} className="text-primary" />{" "}
// //                         Customer Message
// //                       </h6>
// //                       <p
// //                         className="m-0 text-dark lh-base"
// //                         style={{ textAlign: "justify" }}>
// //                         {selectedInquiry.comment || "No message provided."}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="modal-footer border-0 p-4 pt-0">
// //                 <button
// //                   className="btn btn-secondary rounded-pill px-4"
// //                   onClick={() => setShowModal(false)}>
// //                   Close
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <style>{`
// //         .bg-navy { background-color: #001f3f; }
// //         .text-navy { color: #001f3f; }
// //         .fw-800 { font-weight: 800; }
// //         .cursor-pointer { cursor: pointer; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Inquiry;

// import React, { useEffect, useState } from "react";
// import { getInquiriesApi, deleteInquireApi } from "../services/authService";
// import { getUser } from "../utils/storage";
// import { toast } from "react-toastify";
// import {
//   Trash2,
//   Eye,
//   X,
//   Calendar,
//   User,
//   Mail,
//   Phone,
//   MessageSquare,
//   Tag,
//   UserCheck,
// } from "lucide-react";
// import Pagination from "../components/common/Pagination";

// const Inquiry = () => {
//   const [inquiries, setInquiries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal State
//   const [selectedInquiry, setSelectedInquiry] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Get Current Owner Info
//   const currentUser = getUser();
//   const currentUserId = currentUser?._id || currentUser?.id;

//   const fetchInquiries = async () => {
//     try {
//       setLoading(true);
//       const res = await getInquiriesApi();
//       if (res?.success && res?.data) {
//         // --- FILTERING LOGIC ---
//         // Only show inquiries where the Listing Owner matches the Logged-in Owner
//         const filteredInquiries = res.data.filter((item) => {
//           const itemOwnerId = item.ownerId?._id || item.ownerId;
//           return itemOwnerId?.toString() === currentUserId?.toString();
//         });
//         setInquiries(filteredInquiries);
//       }
//     } catch (error) {
//       console.error("Error fetching inquiries:", error);
//       toast.error("Failed to load inquiries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (currentUserId) fetchInquiries();
//   }, [currentUserId]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this inquiry?"))
//       return;
//     try {
//       const res = await deleteInquireApi(id);
//       if (res) {
//         toast.success("Inquiry Deleted Successfully!");
//         fetchInquiries();
//       }
//     } catch (error) {
//       toast.error("Failed to delete inquiry");
//     }
//   };

//   const handleView = (item) => {
//     setSelectedInquiry(item);
//     setShowModal(true);
//   };

//   // Truncate Comment to 3 words
//   const truncateComment = (text) => {
//     if (!text) return "N/A";
//     const words = text.trim().split(/\s+/);
//     if (words.length > 3) {
//       return words.slice(0, 3).join(" ") + "...";
//     }
//     return text;
//   };

//   // Pagination Logic
//   const totalPages = Math.ceil(inquiries.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentInquiries = inquiries.slice(indexOfFirstItem, indexOfLastItem);

//   if (loading)
//     return (
//       <div className="container vh-100 d-flex align-items-center justify-content-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );

//   return (
//     <div className="container-fluid py-4 bg-light min-vh-100 text-start">
//       {/* Header Section */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
//         <h4 className="fw-bold m-0" style={{ color: "#001f3f" }}>
//           CUSTOMER INQUIRIES
//         </h4>
//         <div className="badge rounded-pill px-3 py-2 shadow-sm" style={{ backgroundColor: "#001f3f" }}>
//           Total Received: {inquiries.length}
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="card border-0 shadow-sm rounded-4">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="bg-white border-bottom">
//               <tr>
//                 <th className="px-4 py-3 text-secondary fw-bold small">S.NO</th>
//                 <th className="py-3 text-secondary fw-bold small">FULL NAME</th>
//                 <th className="py-3 text-secondary fw-bold small">EMAIL</th>
//                 <th className="py-3 text-secondary fw-bold small text-nowrap">PHONE</th>
//                 <th className="py-3 text-secondary fw-bold small text-nowrap">LISTING</th>
//                 <th className="py-3 text-secondary fw-bold small">COMMENT</th>
//                 <th className="py-3 text-secondary fw-bold small text-center">ACTION</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentInquiries.length > 0 ? (
//                 currentInquiries.map((item, index) => (
//                   <tr key={item._id}>
//                     <td className="px-4 text-muted small">
//                       {indexOfFirstItem + index + 1}
//                     </td>
//                     <td className="fw-bold text-primary small text-nowrap">
//                       {item.fullName}
//                     </td>
//                     <td className="text-muted small">{item.email}</td>
//                     <td className="small text-nowrap">{item.phoneNo}</td>
//                     <td className="text-nowrap">
//                       <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">
//                         {item.itemId?.title || "N/A"}
//                       </span>
//                     </td>
//                     <td className="text-muted small">
//                       {truncateComment(item.comment)}
//                     </td>
//                     <td className="px-4 text-center">
//                       <div className="d-flex justify-content-center gap-2">
//                         <button
//                           className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
//                           onClick={() => handleView(item)}
//                         >
//                           <Eye size={18} />
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
//                           onClick={() => handleDelete(item._id)}
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center py-5 text-muted">
//                     No inquiries found for your business listings.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination Integration */}
//       <div className="mt-4">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>

//       {/* --- INQUIRY DETAILS POPUP --- */}
//       {showModal && selectedInquiry && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1050 }}
//         >
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
//               <div
//                 className="modal-header border-0 text-white p-4 d-flex justify-content-between align-items-center"
//                 style={{ backgroundColor: "#001f3f" }}
//               >
//                 <h5 className="m-0 fw-bold">Full Inquiry Details</h5>
//                 <X
//                   className="btn-close-white"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => setShowModal(false)}
//                 />
//               </div>
//               <div className="modal-body p-4">
//                 <div className="row g-4">
//                   {/* Left Column: Contact Info */}
//                   <div className="col-md-6 border-end-md">
//                     <div className="d-flex align-items-center gap-3 mb-3">
//                       <div className="bg-light p-2 rounded-3 text-primary"><User size={20} /></div>
//                       <div>
//                         <small className="text-muted d-block fw-bold small text-uppercase">Full Name</small>
//                         <span className="fw-bold">{selectedInquiry.fullName}</span>
//                       </div>
//                     </div>
//                     <div className="d-flex align-items-center gap-3 mb-3">
//                       <div className="bg-light p-2 rounded-3 text-primary"><Mail size={20} /></div>
//                       <div>
//                         <small className="text-muted d-block fw-bold small text-uppercase">Email Address</small>
//                         <span className="fw-bold">{selectedInquiry.email}</span>
//                       </div>
//                     </div>
//                     <div className="d-flex align-items-center gap-3">
//                       <div className="bg-light p-2 rounded-3 text-primary"><Phone size={20} /></div>
//                       <div>
//                         <small className="text-muted d-block fw-bold small text-uppercase">Phone Number</small>
//                         <span className="fw-bold">{selectedInquiry.phoneNo}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column: Listing Info */}
//                   <div className="col-md-6">
//                     <div className="d-flex align-items-center gap-3 mb-3">
//                       <div className="bg-light p-2 rounded-3 text-info"><Tag size={20} /></div>
//                       <div>
//                         <small className="text-muted d-block fw-bold small text-uppercase">Listing Details</small>
//                         <span className="fw-bold text-info">{selectedInquiry.itemId?.title || "N/A"}</span>
//                       </div>
//                     </div>
//                     <div className="d-flex align-items-center gap-3 mb-3">
//                       <div className="bg-light p-2 rounded-3 text-warning"><UserCheck size={20} /></div>
//                       <div>
//                         <small className="text-muted d-block fw-bold small text-uppercase">Owner</small>
//                         <span className="fw-bold">{selectedInquiry.ownerId?.fullName || "N/A"}</span>
//                       </div>
//                     </div>
//                     <div className="d-flex align-items-center gap-3">
//                       <div className="bg-light p-2 rounded-3 text-danger"><Calendar size={20} /></div>
//                       <div>
//                         <small className="text-muted d-block fw-bold small text-uppercase">Request Date</small>
//                         <span className="fw-bold">{new Date(selectedInquiry.createdAt).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Message Section */}
//                   <div className="col-12 mt-2">
//                     <div className="bg-light p-4 rounded-4 border-start border-primary border-5">
//                       <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
//                         <MessageSquare size={18} className="text-primary" />
//                         CUSTOMER MESSAGE
//                       </h6>
//                       <p className="m-0 text-dark" style={{ lineHeight: "1.6" }}>
//                         {selectedInquiry.comment || "No specific message provided."}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer border-0 p-4">
//                 <button
//                   className="btn btn-secondary rounded-pill px-4 fw-bold shadow-sm"
//                   onClick={() => setShowModal(false)}
//                 >
//                   CLOSE
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inquiry;

import React, { useEffect, useState } from "react";
import {
  getInquiriesByOwnerApi,
  deleteInquireApi,
} from "../services/authService";
import { getUser } from "../utils/storage";
import { toast } from "react-toastify";
import {
  Trash2,
  Eye,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Tag,
  UserCheck,
} from "lucide-react";
import Pagination from "../components/common/Pagination";

const Inquiry = () => {
  // Initialize as an empty array to prevent .slice errors
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get Current Owner ID
  const currentUser = getUser();
  const currentOwnerId = currentUser?._id || currentUser?.id;

  const fetchInquiries = async () => {
    if (!currentOwnerId) return;
    try {
      setLoading(true);
      const res = await getInquiriesByOwnerApi(currentOwnerId);

      // 🛑 FIX: The backend returns { success: true, data: [...] }
      // We must set the state to res.data which is the actual Array.
      if (res && res.success && Array.isArray(res.data)) {
        setInquiries(res.data);
      } else if (Array.isArray(res)) {
        setInquiries(res); // Fallback if API returns raw array
      } else {
        setInquiries([]);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setInquiries([]); // Set to empty array on error to prevent crash
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentOwnerId) fetchInquiries();
  }, [currentOwnerId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;
    try {
      await deleteInquireApi(id);
      toast.success("Inquiry Deleted Successfully!");
      fetchInquiries(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const handleView = (item) => {
    setSelectedInquiry(item);
    setShowModal(true);
  };

  const truncateComment = (text) => {
    if (!text) return "N/A";
    const words = text.trim().split(/\s+/);
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : text;
  };

  // 🛑 PAGINATION LOGIC (Safe handling of array)
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];
  const totalPages = Math.ceil(safeInquiries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // This will no longer crash because safeInquiries is guaranteed to be an array
  const currentInquiries = safeInquiries.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  if (loading)
    return (
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Leads...</span>
        </div>
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      {/* Header Section */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h4 className="fw-bold m-0" style={{ color: "#001f3f" }}>
          CUSTOMER INQUIRIES
        </h4>
        <div
          className="badge rounded-pill px-3 py-2 shadow-sm"
          style={{ backgroundColor: "#001f3f" }}>
          Total Received: {safeInquiries.length}
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white border-bottom">
              <tr>
                <th className="px-4 py-3 text-secondary fw-bold small">S.NO</th>
                <th className="py-3 text-secondary fw-bold small">FULL NAME</th>
                <th className="py-3 text-secondary fw-bold small">EMAIL</th>
                <th className="py-3 text-secondary fw-bold small">PHONE</th>
                <th className="py-3 text-secondary fw-bold small">LISTING</th>
                <th className="py-3 text-secondary fw-bold small">COMMENT</th>
                <th className="py-3 text-secondary fw-bold small text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {currentInquiries.length > 0 ? (
                currentInquiries.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted small">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="fw-bold text-primary small">
                      {item.fullName}
                    </td>
                    <td className="text-muted small">{item.email}</td>
                    <td className="small text-nowrap">{item.phoneNo}</td>
                    <td>
                      <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">
                        {item.itemId?.title || "N/A"}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {truncateComment(item.comment)}
                    </td>
                    <td className="px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
                          onClick={() => handleView(item)}>
                          <Eye size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                          onClick={() => handleDelete(item._id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No inquiries found for your listings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Integration */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* --- INQUIRY DETAILS MODAL --- */}
      {showModal && selectedInquiry && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div
                className="modal-header border-0 text-white p-4 d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#001f3f" }}>
                <h5 className="m-0 fw-bold">Full Inquiry Details</h5>
                <X
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body p-4 text-start">
                <div className="row g-4">
                  <div className="col-md-6 border-end">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-light p-2 rounded text-primary">
                        <User size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block fw-bold small uppercase">
                          Customer Name
                        </small>
                        <b>{selectedInquiry.fullName}</b>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-light p-2 rounded text-primary">
                        <Mail size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block fw-bold small uppercase">
                          Email
                        </small>
                        <b>{selectedInquiry.email}</b>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light p-2 rounded text-primary">
                        <Phone size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block fw-bold small uppercase">
                          Phone
                        </small>
                        <b>{selectedInquiry.phoneNo}</b>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-light p-2 rounded text-info">
                        <Tag size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block fw-bold small uppercase">
                          Listing
                        </small>
                        <b className="text-info">
                          {selectedInquiry.itemId?.title || "N/A"}
                        </b>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light p-2 rounded text-danger">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block fw-bold small uppercase">
                          Date Received
                        </small>
                        <b>
                          {new Date(
                            selectedInquiry.createdAt,
                          ).toLocaleDateString()}
                        </b>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="bg-light p-4 rounded-4 border-start border-primary border-5">
                      <h6 className="fw-bold mb-2">
                        <MessageSquare
                          size={18}
                          className="me-2 text-primary"
                        />
                        CUSTOMER MESSAGE
                      </h6>
                      <p className="m-0 text-dark">
                        {selectedInquiry.comment || "No message provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4">
                <button
                  className="btn btn-secondary rounded-pill px-4 fw-bold"
                  onClick={() => setShowModal(false)}>
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiry;