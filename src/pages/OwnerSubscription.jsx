// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { getPlansAPI, getMySubscriptionAPI } from "../services/authService";
// import Pagination from "../components/common/Pagination";

// const OwnerSubscription = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [activeSub, setActiveSub] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const accentColor = "#de9f57";
//   const navyColor = "#002147";

//   const fetchSubscriptionData = async () => {
//     if (!user) return;
//     setLoading(true);
//     try {
//       const planRes = await getPlansAPI();
//       const availablePlans = planRes.data?.[0]?.Plan || [];

//       const userId = user._id || user.id;
//       const res = await getMySubscriptionAPI(userId);

//       if (res?.success && res.payments?.length > 0) {
//         const sortedHistory = [...res.payments].sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
//         );
//         setHistory(sortedHistory);

//         const latestSuccessful = sortedHistory.find((p) => p.status === "success");

//         if (latestSuccessful) {
//           const planMeta = availablePlans.find((p) => p.name === latestSuccessful.planName);

//           if (planMeta) {
//             const startDate = new Date(latestSuccessful.createdAt);
//             const endDate = new Date(startDate);
//             const count = planMeta.durationCount || 1;
//             const unit = planMeta.duration?.toLowerCase();

//             if (unit === "day") endDate.setDate(endDate.getDate() + count);
//             else if (unit === "week") endDate.setDate(endDate.getDate() + count * 7);
//             else if (unit === "month") endDate.setMonth(endDate.getMonth() + count);
//             else if (unit === "year") endDate.setFullYear(endDate.getFullYear() + count);

//             setActiveSub({ ...latestSuccessful, startDate, endDate });
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error loading subscription:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubscriptionData();
//   }, [user?._id]);

//   const totalPages = Math.ceil(history.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const calculateTimeline = (start, end) => {
//     if (!start || !end) return null;
//     const today = new Date();
//     const total = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//     const remaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
//     const percentage = Math.min(100, Math.max(0, ((total - remaining) / total) * 100));
//     return { remaining: Math.max(0, remaining), percentage };
//   };

//   if (loading)
//     return (
//       <div className="vh-100 d-flex justify-content-center align-items-center">
//         <div className="spinner-border text-warning"></div>
//       </div>
//     );

//   return (
//     <div className="container-fluid py-4 bg-light min-vh-100 text-start">
//       <div className="row justify-content-center">
//         <div className="col-12">
//           <div className="mb-4">
//             <h3 className="fw-bold text-navy">Subscription Overview</h3>
//             <p className="text-muted small">View your current active plan and billing history.</p>
//           </div>

//           <div className="row">
//             <div className="col-12">
//               {activeSub ? (
//                 <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white overflow-hidden position-relative">
//                   {/* ICON REMOVED FROM HERE */}

//                   <div className="d-flex justify-content-between align-items-start mb-4 position-relative">
//                     <div>
//                       <label className="small text-muted fw-bold text-uppercase">Plan Name</label>
//                       <h2 className="fw-bold text-navy mb-1">{activeSub.planName}</h2>
//                       <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill small">
//                         ACTIVE
//                       </span>
//                     </div>
//                     <div className="text-end">
//                        <label className="small text-muted fw-bold text-uppercase">Amount Paid</label>
//                        <h3 className="fw-bold text-navy mb-0">${activeSub.amount}</h3>
//                     </div>
//                   </div>

//                   {(() => {
//                     const timeline = calculateTimeline(activeSub.startDate, activeSub.endDate);
//                     return timeline && (
//                       <div className="mt-2 position-relative">
//                         <div className="d-flex justify-content-between mb-2">
//                           <span className="small fw-bold text-muted">Plan Progress</span>
//                           <span className="small fw-bold text-navy">{timeline.remaining} Days Remaining</span>
//                         </div>
//                         <div className="progress mb-4" style={{ height: "10px", borderRadius: "20px", backgroundColor: "#f0f0f0" }}>
//                           <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${timeline.percentage}%`, backgroundColor: accentColor }}></div>
//                         </div>

//                         <div className="row g-3 bg-light rounded-3 p-3 m-0">
//                           <div className="col-md-6 border-end">
//                             <small className="text-muted d-block extra-small fw-bold">ACTIVATED ON</small>
//                             <span className="fw-bold text-navy">{activeSub.startDate.toLocaleDateString('en-GB')}</span>
//                           </div>
//                           <div className="col-md-6 ps-md-4">
//                             <small className="text-muted d-block extra-small fw-bold text-danger">EXPIRES ON</small>
//                             <span className="fw-bold text-danger">{activeSub.endDate.toLocaleDateString('en-GB')}</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })()}
//                 </div>
//               ) : (
//                 <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white mb-4">
//                   <h5 className="fw-bold text-muted">No Active Plan Found</h5>
//                   <button className="btn btn-warning px-4 py-2 rounded-pill fw-bold mt-2 shadow-sm" onClick={() => (window.location.href = "/pricing")}>
//                     Browse Plans
//                   </button>
//                 </div>
//               )}

//               <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mt-4">
//                 <div className="card-header bg-white p-4 border-bottom">
//                   <h5 className="fw-bold m-0 text-navy">Billing & Transaction History</h5>
//                 </div>
//                 <div className="table-responsive">
//                   <table className="table table-hover align-middle mb-0">
//                     <thead className="bg-light text-muted small text-uppercase fw-bold">
//                       <tr>
//                         <th className="px-4 py-3">#</th>
//                         <th>Plan Details</th>
//                         <th>Amount</th>
//                         <th>Status</th>
//                         <th className="text-end px-4">Transaction Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentItems.length > 0 ? (
//                         currentItems.map((item, idx) => (
//                           <tr key={item._id}>
//                             <td className="px-4 text-muted small">{indexOfFirstItem + idx + 1}</td>
//                             <td>
//                               <div className="fw-bold text-navy small">{item.planName}</div>
//                               <div className="extra-small text-muted" style={{ fontSize: "10px" }}>
//                                 {item.paymentMethod?.toUpperCase()}
//                               </div>
//                             </td>
//                             <td className="fw-bold text-dark">${item.amount}</td>
//                             <td>
//                               <span className={`badge rounded-pill px-3 py-1 small ${item.status === "success" ? "bg-success-subtle text-success border border-success-subtle" : "bg-warning-subtle text-warning border border-warning-subtle"}`}>
//                                 {item.status?.toUpperCase()}
//                               </span>
//                             </td>
//                             <td className="text-end px-4 small text-muted">
//                               {new Date(item.createdAt).toLocaleDateString('en-GB')}
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="5" className="text-center py-5 text-muted small">No transaction records available.</td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="pb-4">
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={handlePageChange}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OwnerSubscription;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPlansAPI, getMySubscriptionAPI } from "../services/authService";
import Pagination from "../components/common/Pagination";

const OwnerSubscription = () => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [plans, setPlans] = useState([]); // Plans store karne ke liye
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navyColor = "#002147";

  const fetchSubscriptionData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Get All Plans to find duration
      const planRes = await getPlansAPI();
      const availablePlans = planRes.data?.[0]?.Plan || [];
      setPlans(availablePlans);

      // 2. Get Transaction History
      const userId = user._id || user.id;
      const res = await getMySubscriptionAPI(userId);

      if (res?.success && res.payments?.length > 0) {
        const sortedHistory = [...res.payments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setHistory(sortedHistory);
      }
    } catch (error) {
      console.error("Error loading subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user?._id]);

  // Expiry Date Calculate karne ka function
  const getExpiryDate = (createdAt, planName) => {
    const planMeta = plans.find((p) => p.name === planName);
    if (!planMeta) return "N/A";

    const startDate = new Date(createdAt);
    const endDate = new Date(startDate);
    const count = planMeta.durationCount || 1;
    const unit = planMeta.duration?.toLowerCase();

    if (unit === "day") endDate.setDate(endDate.getDate() + count);
    else if (unit === "week") endDate.setDate(endDate.getDate() + count * 7);
    else if (unit === "month") endDate.setMonth(endDate.getMonth() + count);
    else if (unit === "year")
      endDate.setFullYear(endDate.getFullYear() + count);

    return endDate.toLocaleDateString("en-GB");
  };

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning"></div>
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="mb-4">
            <h3 className="fw-bold" style={{ color: navyColor }}>
              Billing History
            </h3>
            <p className="text-muted small">
              View your payment details and plan validity.
            </p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted small text-uppercase fw-bold">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th>Plan Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th className="text-end px-4">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, idx) => (
                      <tr key={item._id}>
                        <td className="px-4 text-muted small">
                          {indexOfFirstItem + idx + 1}
                        </td>
                        <td>
                          <div
                            className="fw-bold small"
                            style={{ color: navyColor }}>
                            {item.planName}
                          </div>
                          <div
                            className="extra-small text-muted"
                            style={{ fontSize: "10px" }}>
                            {item.paymentMethod?.toUpperCase()}
                          </div>
                        </td>
                        <td className="fw-bold text-dark">${item.amount}</td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-1 small ${
                              item.status === "success"
                                ? "bg-success-subtle text-success border border-success-subtle"
                                : "bg-warning-subtle text-warning border border-warning-subtle"
                            }`}>
                            {item.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="small text-muted">
                          {new Date(item.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="text-end px-4 fw-bold text-danger small">
                          {item.status === "success"
                            ? getExpiryDate(item.createdAt, item.planName)
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-5 text-muted small">
                        No transaction records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSubscription;