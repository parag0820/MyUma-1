// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getAllListingsApi,
//   getBookingsByOwnerAPI,
//   getRatingsAPI,
//   getMySubscriptionAPI, // Add this
//   getPlansAPI, // Add this to calculate expiry
// } from "../services/authService";
// import { getUser } from "../utils/storage";
// import {
//   Layers,
//   BookmarkCheck,
//   Star,
//   ArrowRight,
//   CreditCard,
//   Clock,
//   RefreshCw,
// } from "lucide-react";

// const StatCard = ({
//   title,
//   count,
//   icon: Icon,
//   link,
//   bgColor,
//   iconColor,
//   navigate,
// }) => (
//   <div className="col-md-4 mb-4">
//     <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
//       <div className="d-flex justify-content-between align-items-start mb-3">
//         <div>
//           <h6
//             className="text-muted fw-bold text-uppercase mb-2"
//             style={{ fontSize: "11px", letterSpacing: "1px" }}>
//             {title}
//           </h6>
//           <h1 className="fw-800 text-navy mb-0" style={{ fontSize: "32px" }}>
//             {count}
//           </h1>
//         </div>
//         <div className="p-3 rounded-4" style={{ backgroundColor: bgColor }}>
//           <Icon size={26} color={iconColor} />
//         </div>
//       </div>
//       <hr className="my-3 opacity-25" />
//       <button
//         onClick={() => navigate(link)}
//         className="btn btn-link p-0 text-decoration-none fw-bold text-navy d-flex align-items-center gap-1 small">
//         View All <ArrowRight size={14} />
//       </button>
//     </div>
//   </div>
// );

// const OwnerDashboard = () => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({
//     totalListings: 0,
//     totalBookmarks: 0,
//     totalReviews: 0,
//   });

//   const [activeSub, setActiveSub] = useState(null);
//   const [subLoading, setSubLoading] = useState(true);

//   const currentUser = getUser();
//   const currentUserId = currentUser?._id || currentUser?.id;

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setSubLoading(true);
//         const [listingsRes, ratingsRes, bookingsRes, subRes, plansRes] =
//           await Promise.all([
//             getAllListingsApi(),
//             getRatingsAPI(),
//             getBookingsByOwnerAPI(currentUserId),
//             getMySubscriptionAPI(currentUserId),
//             getPlansAPI(),
//           ]);

//         // 1. Stats Logic (Existing)
//         const myListings =
//           listingsRes?.listings?.filter(
//             (l) =>
//               (l.ownerId?._id || l.ownerId)?.toString() ===
//               currentUserId?.toString(),
//           ) || [];
//         const myBookmarks = bookingsRes?.bookings || [];
//         const myReceivedReviews = (ratingsRes?.data || []).filter((rate) => {
//           const itemOwnerId = rate.itemId?.ownerId?._id || rate.itemId?.ownerId;
//           return itemOwnerId?.toString() === currentUserId?.toString();
//         });

//         setStats({
//           totalListings: myListings.length,
//           totalBookmarks: myBookmarks.length,
//           totalReviews: myReceivedReviews.length,
//         });

//         // 2. Subscription Expiry Logic
//         if (subRes?.success && subRes.payments?.length > 0) {
//           const latest = [...subRes.payments]
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//             .find((p) => p.status === "success");

//           if (latest) {
//             const availablePlans = plansRes.data?.[0]?.Plan || [];
//             const planMeta = availablePlans.find(
//               (p) => p.name === latest.planName,
//             );

//             if (planMeta) {
//               const start = new Date(latest.createdAt);
//               const end = new Date(start);
//               const count = planMeta.durationCount || 1;
//               const unit = planMeta.duration?.toLowerCase();

//               if (unit === "day") end.setDate(end.getDate() + count);
//               else if (unit === "week") end.setDate(end.getDate() + count * 7);
//               else if (unit === "month") end.setMonth(end.getMonth() + count);
//               else if (unit === "year")
//                 end.setFullYear(end.getFullYear() + count);

//               setActiveSub({ ...latest, expiryDate: end });
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Dashboard Fetch Error:", error);
//       } finally {
//         setSubLoading(false);
//       }
//     };

//     if (currentUserId) fetchDashboardData();
//   }, [currentUserId]);

//   return (
//     <div className="container-fluid py-4 bg-light min-vh-100 text-start">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="fw-800 text-navy mb-1">
//             Welcome, {currentUser?.fullName?.split(" ")[0]}.
//           </h2>
//           <p className="text-muted small mb-0">
//             Overview of your business performance.
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/pricing")}
//           className="btn btn-navy rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
//           <RefreshCw size={16} /> Renew Plan
//         </button>
//       </div>

//       {/* NEW: SUBSCRIPTION STATUS BANNER */}
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//             <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between p-4 bg-white border-start border-4 border-warning">
//               <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
//                 <div className="p-3 bg-light rounded-circle text-warning">
//                   <CreditCard size={24} />
//                 </div>
//                 <div>
//                   <h6 className="text-muted extra-small fw-bold text-uppercase m-0 ls-1">
//                     Current Plan
//                   </h6>
//                   <h5 className="fw-bold text-navy mb-0">
//                     {activeSub ? activeSub.planName : "No Active Plan"}
//                   </h5>
//                 </div>
//               </div>

//               {activeSub && (
//                 <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
//                   <div className="p-3 bg-light rounded-circle text-info">
//                     <Clock size={24} />
//                   </div>
//                   <div>
//                     <h6 className="text-muted extra-small fw-bold text-uppercase m-0 ls-1">
//                       Expires On
//                     </h6>
//                     <h5 className="fw-bold text-danger mb-0">
//                       {activeSub.expiryDate.toLocaleDateString("en-GB", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </h5>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <button
//                   onClick={() => navigate("/subscription")}
//                   className="btn btn-gold text-navy fw-bold rounded-pill px-4 shadow-sm">
//                   {activeSub ? "View Billing" : "Subscribe Now"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         <StatCard
//           title="Listings"
//           count={stats.totalListings}
//           icon={Layers}
//           bgColor="#eef5ff"
//           iconColor="#448ef6"
//           link="/manage-listings"
//           navigate={navigate}
//         />
//         <StatCard
//           title="Bookmarks"
//           count={stats.totalBookmarks}
//           icon={BookmarkCheck}
//           bgColor="#fff0f0"
//           iconColor="#f64444"
//           link="/bookmarks"
//           navigate={navigate}
//         />
//         <StatCard
//           title="Reviews Received"
//           count={stats.totalReviews}
//           icon={Star}
//           bgColor="#fff9e6"
//           iconColor="#f6b144"
//           link="/reviews"
//           navigate={navigate}
//         />
//       </div>

//       <style>{`
//         .fw-800 { font-weight: 800; }
//         .text-navy { color: #001f3f; }
//         .btn-navy { background-color: #001f3f; border: none; }
//         .btn-gold { background-color: #de9f57; border: none; color: #001f3f; }
//         .ls-1 { letter-spacing: 1px; }
//         .extra-small { font-size: 10px; }

//       `}</style>
//     </div>
//   );
// };

// export default OwnerDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllListingsApi,
  getBookingsByOwnerAPI,
  getRatingsAPI,
  getMySubscriptionAPI,
  getPlansAPI,
} from "../services/authService";
import { getUser } from "../utils/storage";
import {
  Layers,
  BookmarkCheck,
  Star,
  ArrowRight,
  CreditCard,
  Clock,
  RefreshCw,
  Loader2,
} from "lucide-react";

const StatCard = ({
  title,
  count,
  icon: Icon,
  link,
  bgColor,
  iconColor,
  navigate,
}) => (
  <div className="col-md-4 mb-4">
    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6
            className="text-muted fw-bold text-uppercase mb-2"
            style={{ fontSize: "11px", letterSpacing: "1px" }}>
            {title}
          </h6>
          <h1 className="fw-800 text-navy mb-0" style={{ fontSize: "32px" }}>
            {count}
          </h1>
        </div>
        <div className="p-3 rounded-4" style={{ backgroundColor: bgColor }}>
          <Icon size={26} color={iconColor} />
        </div>
      </div>
      <hr className="my-3 opacity-25" />
      <button
        onClick={() => navigate(link)}
        className="btn btn-link p-0 text-decoration-none fw-bold text-navy d-flex align-items-center gap-1 small">
        View All <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalListings: 0,
    totalBookmarks: 0,
    totalReviews: 0,
  });
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true); // Single loading state for everything

  const currentUser = getUser();
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [listingsRes, ratingsRes, bookingsRes, subRes, plansRes] =
          await Promise.all([
            getAllListingsApi(),
            getRatingsAPI(),
            getBookingsByOwnerAPI(currentUserId),
            getMySubscriptionAPI(currentUserId),
            getPlansAPI(),
          ]);

        // 1. Stats Calculation
        const myListings =
          listingsRes?.listings?.filter(
            (l) =>
              (l.ownerId?._id || l.ownerId)?.toString() ===
              currentUserId?.toString(),
          ) || [];
        const myBookmarks = bookingsRes?.bookings || [];
        const myReceivedReviews = (ratingsRes?.data || []).filter(
          (rate) =>
            (rate.itemId?.ownerId?._id || rate.itemId?.ownerId)?.toString() ===
            currentUserId?.toString(),
        );

        setStats({
          totalListings: myListings.length,
          totalBookmarks: myBookmarks.length,
          totalReviews: myReceivedReviews.length,
        });

        // 2. Optimized Subscription Logic
        if (subRes?.success && subRes.payments?.length > 0) {
          const latest = [...subRes.payments]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .find((p) => p.status === "success");

          if (latest) {
            // Priority 1: Use backend's subscriptionEndDate if available
            // Priority 2: Calculate manually using planMeta
            let expiryDate = latest.subscriptionEndDate
              ? new Date(latest.subscriptionEndDate)
              : null;

            if (!expiryDate || isNaN(expiryDate.getTime())) {
              const availablePlans = plansRes.data?.[0]?.Plan || [];
              const planMeta = availablePlans.find(
                (p) => p.name === latest.planName,
              );
              if (planMeta) {
                expiryDate = new Date(latest.createdAt);
                const count = planMeta.durationCount || 1;
                const unit = planMeta.duration?.toLowerCase();
                if (unit === "day")
                  expiryDate.setDate(expiryDate.getDate() + count);
                else if (unit === "week")
                  expiryDate.setDate(expiryDate.getDate() + count * 7);
                else if (unit === "month")
                  expiryDate.setMonth(expiryDate.getMonth() + count);
                else if (unit === "year")
                  expiryDate.setFullYear(expiryDate.getFullYear() + count);
              }
            }
            setActiveSub({ ...latest, expiryDate });
          }
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) fetchDashboardData();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <Loader2 className="animate-spin text-warning mb-2" size={40} />
        <p className="text-muted fw-bold">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-800 text-navy mb-1">
            Welcome, {currentUser?.fullName?.split(" ")[0]}.
          </h2>
          <p className="text-muted small mb-0">
            Overview of your business performance.
          </p>
        </div>
        <button
          onClick={() => navigate("/pricing")}
          className="btn btn-navy rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
          <RefreshCw size={16} /> Renew Plan
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div
              className={`d-flex flex-column flex-md-row align-items-md-center justify-content-between p-4 bg-white border-start border-4 ${activeSub ? "border-success" : "border-warning"}`}>
              <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                <div
                  className={`p-3 bg-light rounded-circle ${activeSub ? "text-success" : "text-warning"}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h6 className="text-muted extra-small fw-bold text-uppercase m-0 ls-1">
                    Current Plan
                  </h6>
                  <h5 className="fw-bold text-navy mb-0">
                    {activeSub ? activeSub.planName : "No Active Plan"}
                  </h5>
                </div>
              </div>

              {activeSub && activeSub.expiryDate && (
                <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                  <div className="p-3 bg-light rounded-circle text-info">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted extra-small fw-bold text-uppercase m-0 ls-1">
                      Expires On
                    </h6>
                    <h5 className="fw-bold text-danger mb-0">
                      {activeSub.expiryDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </h5>
                  </div>
                </div>
              )}

              <div>
                <button
                  onClick={() =>
                    navigate(activeSub ? "/subscription" : "/pricing")
                  }
                  className="btn btn-gold text-navy fw-bold rounded-pill px-4 shadow-sm">
                  {activeSub ? "View Billing" : "Subscribe Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <StatCard
          title="Listings"
          count={stats.totalListings}
          icon={Layers}
          bgColor="#eef5ff"
          iconColor="#448ef6"
          link="/manage-listings"
          navigate={navigate}
        />
        <StatCard
          title="Bookmarks"
          count={stats.totalBookmarks}
          icon={BookmarkCheck}
          bgColor="#fff0f0"
          iconColor="#f64444"
          link="/bookmarks"
          navigate={navigate}
        />
        <StatCard
          title="Reviews Received"
          count={stats.totalReviews}
          icon={Star}
          bgColor="#fff9e6"
          iconColor="#f6b144"
          link="/reviews"
          navigate={navigate}
        />
      </div>

      <style>{`
        .fw-800 { font-weight: 800; }
        .text-navy { color: #001f3f; }
        .btn-navy { background-color: #001f3f; border: none; color: white; }
        .btn-gold { background-color: #de9f57; border: none; color: #001f3f; }
        .ls-1 { letter-spacing: 1px; }
        .extra-small { font-size: 10px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OwnerDashboard;