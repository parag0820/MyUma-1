// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getUser } from "../utils/storage";

// const CheckoutPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [receipt, setReceipt] = useState(null);

//   const plan = location.state?.plan;
//   const user = getUser();

//   if (!plan || !user) {
//     return (
//       <div className="vh-100 bg-dark text-white d-flex align-items-center justify-content-center">
//         <div className="text-center">
//           <h3>Missing Checkout Information</h3>
//           <button
//             className="btn btn-warning mt-3"
//             onClick={() => navigate("/pricing")}>
//             Back to Pricing
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const formatDuration = (count, unit) => {
//     return `${count} ${unit.charAt(0).toUpperCase() + unit.slice(1)}${count > 1 ? "s" : ""}`;
//   };

//   const calculateEndDate = (duration, count) => {
//     let date = new Date();
//     if (duration === "day") date.setDate(date.getDate() + count);
//     else if (duration === "week") date.setDate(date.getDate() + count * 7);
//     else if (duration === "month") date.setMonth(date.getMonth() + count);
//     else if (duration === "year") date.setFullYear(date.getFullYear() + count);
//     return date;
//   };

//   // handlePayNow ke andar ye badlav karein
//   const handlePayNow = async () => {
//     setLoading(true);

//     setTimeout(() => {
//       const endDate = calculateEndDate(plan.duration, plan.durationCount);

//       const mockSub = {
//         planName: plan.name,
//         price: plan.price,
//         userId: user._id || user.id, // User ID save karein
//         subscriptionStartDate: new Date().toISOString(),
//         subscriptionEndDate: endDate.toISOString(),
//         status: "success",
//         subscriptionStatus: "active",
//       };

//       // USER-SPECIFIC KEY: Taaki logout/login ke baad bhi ye record rahe
//       const storageKey = `active_plan_${user._id || user.id}`;
//       localStorage.setItem(storageKey, JSON.stringify(mockSub));

//       // Backup ke liye temp_active_sub bhi rakhen
//       localStorage.setItem("temp_active_sub", JSON.stringify(mockSub));

//       setReceipt(mockSub);
//       setLoading(false);
//       setShowSuccess(true);
//       toast.success("Payment Successful!");
//     }, 1500);
//   };

//   return (
//     <div
//       className="min-vh-100 py-5 d-flex align-items-center justify-content-center"
//       style={{ backgroundColor: "#121418" }}>
//       <div
//         className="p-4 rounded-5 shadow-lg bg-dark text-white border border-secondary"
//         style={{ width: "100%", maxWidth: "480px" }}>
//         {/* TOP BAR WITH BACK BUTTON */}
//         <div className="d-flex align-items-center mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="btn btn-outline-light border-0 rounded-circle p-2 me-3"
//             style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
//             <i className="bi bi-chevron-left"></i>
//           </button>
//           <h4 className="mb-0 fw-bold">Checkout Summary</h4>
//         </div>

//         {/* OWNER INFO */}
//         <div
//           className="mb-4 p-3 rounded-4"
//           style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
//           <small
//             className="text-white text-uppercase fw-bold ls-1"
//             style={{ fontSize: "10px" }}>
//             Purchasing As
//           </small>
//           <div className="d-flex align-items-center mt-2">
//             <div>
//               <h6 className="mb-0 text-white">Name : {user.fullName}</h6>
//               <small className="text-white">Email : {user.email}</small>
//             </div>
//           </div>
//         </div>

//         {/* PLAN DETAILS SECTION */}
//         <div
//           className="p-4 rounded-4 mb-4 border border-secondary"
//           style={{ backgroundColor: "#1c1f26" }}>
//           <div className="mb-3">
//             <span className="badge bg-primary bg-opacity-25 text-primary mb-2">
//               Selected Plan
//             </span>
//             <h3 className="fw-bold text-warning mb-0">{plan.name}</h3>
//           </div>

//           <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-50">
//             <span className="text-white text-start">Duration</span>
//             <span className="fw-bold">
//               {formatDuration(plan.durationCount, plan.duration)}
//             </span>
//           </div>
//           {/*
//           <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-50">
//             <span className="text-white text-start">Features</span>
//             <span className="fw-bold">
//               {plan.features?.length || 0} Included
//             </span>
//           </div> */}

//           <div className="d-flex justify-content-between align-items-center pt-3">
//             <span className="h5 mb-0 fw-bold">Total Amount</span>
//             <span className="display-6 fw-bold text-success">
//               ${plan.price}
//             </span>
//           </div>
//         </div>

//         {/* PAY BUTTON */}
//         <button
//           onClick={handlePayNow}
//           disabled={loading}
//           className="btn btn-warning btn-lg w-100 py-3 rounded-pill fw-bold mb-3 shadow">
//           {loading ? (
//             <span>
//               <span className="spinner-border spinner-border-sm me-2"></span>
//               Processing...
//             </span>
//           ) : (
//             `🔒 Securely Pay $${plan.price}`
//           )}
//         </button>

//         <p className="text-center small text-muted mb-0">
//           <i className="bi bi-shield-lock-fill me-2"></i>
//           Encrypted & Secure Payment
//         </p>
//       </div>

//       {/* SUCCESS MODAL */}
//       {showSuccess && receipt && (
//         <div
//           className="modal fade show d-block"
//           style={{
//             backgroundColor: "rgba(0,0,0,0.9)",
//             backdropFilter: "blur(8px)",
//           }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content bg-dark text-white border-0 rounded-5 shadow-lg overflow-hidden">
//               <div className="bg-success py-4 text-center">
//                 <i
//                   className="bi bi-check-circle-fill"
//                   style={{ fontSize: "4rem" }}></i>
//                 <h2 className="fw-bold mt-2">Payment Success!</h2>
//               </div>
//               <div className="modal-body p-4 p-md-5">
//                 <div className="bg-light bg-opacity-10 p-4 rounded-4">
//                   <div className="text-center mb-4 border-bottom border-secondary pb-3">
//                     <h5 className="text-warning fw-bold mb-1">
//                       {receipt.planName}
//                     </h5>
//                     <p className="small text-white">
//                       Subscription is now active
//                     </p>
//                   </div>

//                   <div className="d-flex justify-content-between mb-3">
//                     <span className="text-white">Validity:</span>
//                     <span className="fw-bold text-white">
//                       {receipt.durationText}
//                     </span>
//                   </div>
//                   <div className="d-flex justify-content-between">
//                     <span className="text-white">Expires On:</span>
//                     <span className="fw-bold text-info">
//                       {new Date(
//                         receipt.subscriptionEndDate,
//                       ).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   className="btn btn-warning btn-lg w-100 mt-4 py-3 rounded-pill fw-bold"
//                   onClick={() => navigate("/pricing")}>
//                   Finish & Go Back
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };;

// export default CheckoutPage;

// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getUser } from "../utils/storage";
// // ADD THIS LINE BELOW:
// import { checkoutAPI } from "../services/authService";

// const CheckoutPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [receipt, setReceipt] = useState(null);

//   const plan = location.state?.plan;
//   const user = getUser();

//   if (!plan || !user) {
//     return (
//       <div className="vh-100 bg-dark text-white d-flex align-items-center justify-content-center">
//         <button
//           className="btn btn-warning"
//           onClick={() => navigate("/pricing")}>
//           Back to Pricing
//         </button>
//       </div>
//     );
//   }

//   // Validity format helper
//   const formatDuration = (count, unit) => {
//     if (!count || !unit) return "Plan";
//     const u = unit.charAt(0).toUpperCase() + unit.slice(1);
//     return `${count} ${u}${count > 1 ? "s" : ""}`;
//   };

//   const calculateEndDate = (duration, count) => {
//     let date = new Date();
//     if (duration === "day") date.setDate(date.getDate() + count);
//     else if (duration === "week") date.setDate(date.getDate() + count * 7);
//     else if (duration === "month") date.setMonth(date.getMonth() + count);
//     else if (duration === "year") date.setFullYear(date.getFullYear() + count);
//     return date;
//   };

//   // src/pages/CheckoutPage.jsx

// const handlePayNow = async () => {
//   // 1. Initial Data Logging
//   console.log("--- Payment Initiation Started ---");
//   console.log("Selected Plan Data:", plan);
//   console.log("Logged-in User Data:", user);

//   // 2. Extract specific IDs
//   // Note: Backend usually expects _id for MongoDB or id for SQL
//   const pId = plan._id;
//   const uId = user._id || user.id;
//   const uEmail = user.email;

//   // 3. Construct the Payload
//   const payload = {
//     planId: pId,
//     userId: uId,
//     email: uEmail,
//   };

//   console.log("Final Payload being sent to Server:", payload);

//   // 4. Client-side Validation before calling API
//   if (!pId || !uId || !uEmail) {
//     console.error("Validation Error: Missing required fields in payload.");
//     toast.error("Critical Information Missing. Please try again.");
//     return;
//   }

//   setLoading(true);

//   try {
//     // 5. Call the real Checkout API
//     const res = await checkoutAPI(payload);

//     console.log("✅ Server Success Response:", res);

//     if (res.success || res.status === true) {
//       // 6. Calculate details for the Receipt UI
//       const dText = formatDuration(plan.durationCount, plan.duration);
//       const eDate = calculateEndDate(plan.duration, plan.durationCount);

//       const realSub = {
//         planName: plan.name,
//         price: plan.price,
//         userName: user.fullName,
//         userEmail: user.email,
//         durationText: dText,
//         subscriptionStartDate: new Date().toISOString(),
//         subscriptionEndDate: eDate.toISOString(),
//         status: "success",
//         subscriptionStatus: "active",
//         userId: uId,
//       };

//       // 7. Persist to LocalStorage so the UI reflects the change immediately
//       localStorage.setItem(`active_plan_${uId}`, JSON.stringify(realSub));

//       // 8. Update State to show Success Modal
//       setReceipt(realSub);
//       setShowSuccess(true);
//       toast.success("Payment Processed Successfully!");
//     } else {
//       console.warn("⚠️ Server responded with success:false", res);
//       toast.error(res.message || "Payment could not be completed.");
//     }
//   } catch (error) {
//     // 9. Detailed Error Logging for Server Error (500)
//     console.error("❌ API ERROR DETECTED:");
//     if (error.response) {
//       // The server responded with a status code that falls out of the range of 2xx
//       console.error("Data:", error.response.data);
//       console.error("Status:", error.response.status);
//       console.error("Headers:", error.response.headers);
//       toast.error(
//         error.response.data.message || "Server error occurred during checkout.",
//       );
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error(
//         "No response received from server. Request details:",
//         error.request,
//       );
//       toast.error("Network error: Server is not responding.");
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error("Request Setup Error:", error.message);
//       toast.error("Failed to initiate request.");
//     }
//   } finally {
//     setLoading(false);
//     console.log("--- Payment Initiation Finished ---");
//   }
// };

//   return (
//     <div
//       className="min-vh-100 py-5 d-flex align-items-center justify-content-center"
//       style={{ backgroundColor: "#121418" }}>
//       {/* CHECKOUT CARD */}
//       <div
//         className="p-4 rounded-5 shadow-lg bg-dark text-white border border-secondary"
//         style={{ width: "100%", maxWidth: "480px" }}>
//         <div className="d-flex align-items-center mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="btn btn-outline-light border-0 rounded-circle p-2 me-3 shadow-none">
//             <i className="bi bi-chevron-left"></i>
//           </button>
//           <h4 className="mb-0 fw-bold">Checkout Summary</h4>
//         </div>

//         {/* DETAILS BOX */}
//         <div
//           className="p-4 rounded-4 mb-4 border border-secondary"
//           style={{ backgroundColor: "#1c1f26" }}>
//           <h5 className="text-white-50 small text-uppercase fw-bold mb-3">
//             Order Details
//           </h5>
//           <h3 className="fw-bold text-warning mb-3">{plan.name}</h3>

//           <div className="d-flex justify-content-between mb-2 text-white">
//             <span>Name:</span>
//             <span className="fw-bold">{user.fullName}</span>
//           </div>
//           <div className="d-flex justify-content-between mb-2 text-white text-truncate">
//             <span>Email:</span>
//             <span className="fw-bold ms-2">{user.email}</span>
//           </div>
//           <div className="d-flex justify-content-between mb-2 text-white">
//             <span>Validity:</span>
//             <span className="fw-bold">
//               {formatDuration(plan.durationCount, plan.duration)}
//             </span>
//           </div>

//           <div className="d-flex justify-content-between pt-3 border-top border-secondary mt-3">
//             <span className="h5 fw-bold text-white">Total:</span>
//             <span className="h4 fw-bold text-success">${plan.price}</span>
//           </div>
//         </div>

//         <button
//           onClick={handlePayNow}
//           disabled={loading}
//           className="btn btn-warning btn-lg w-100 py-3 rounded-pill fw-bold shadow">
//           {loading ? "Processing..." : `Pay $${plan.price} Now`}
//         </button>
//       </div>

//       {/* SUCCESS MODAL */}
//       {showSuccess && receipt && (
//         <div
//           className="modal fade show d-block"
//           style={{
//             backgroundColor: "rgba(0,0,0,0.95)",
//             backdropFilter: "blur(10px)",
//           }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content bg-dark text-white border-0 rounded-5 shadow-lg overflow-hidden">
//               <div className="bg-success py-4 text-center">
//                 <i
//                   className="bi bi-check-circle-fill"
//                   style={{ fontSize: "4rem" }}></i>
//                 <h2 className="fw-bold mt-2 text-white">Payment Successful</h2>
//               </div>

//               <div className="modal-body p-4 p-md-5">
//                 <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-secondary border-opacity-50">
//                   <div className="text-center mb-4 border-bottom border-secondary pb-3">
//                     <h4 className="text-warning fw-bold mb-0">
//                       {receipt.planName}
//                     </h4>
//                     <p className="text-white small mb-0">Subscription Active</p>
//                   </div>

//                   <div className="d-flex justify-content-between mb-3">
//                     <span className="text-white opacity-75">Validity:</span>
//                     <span className="fw-bold text-white">
//                       {receipt.durationText}
//                     </span>
//                   </div>

//                   <div className="d-flex justify-content-between">
//                     <span className="text-white opacity-75">Expires On:</span>
//                     <span className="fw-bold text-info">
//                       {new Date(receipt.subscriptionEndDate).toLocaleDateString(
//                         "en-GB",
//                         {
//                           day: "numeric",
//                           month: "long",
//                           year: "numeric",
//                         },
//                       )}
//                     </span>
//                   </div>
//                 </div>

//                 <button
//                   className="btn btn-warning btn-lg w-100 mt-4 py-3 rounded-pill fw-bold shadow"
//                   onClick={() => navigate("/pricing")}>
//                   Done & Go to Dashboard
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };;

// export default CheckoutPage;
// src/pages/CheckoutPage.jsx



import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { checkoutAPI } from "../services/authService";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const plan = location.state?.plan;
  const { user } = useSelector((state) => state.auth);

  if (!plan || !user) {
    return <div className="vh-100 d-flex align-items-center justify-content-center bg-dark"><button className="btn btn-warning" onClick={() => navigate("/pricing")}>Go Back</button></div>;
  }
// const handlePayNow = async () => {
//   console.log("💳 [CHECKOUT] Pay Now clicked. Plan:", plan.name);
//   setLoading(true);

//   const payload = {
//     planId: plan._id,
//     ownerId: user._id || user.id,
//     email: user.email,
//   };

//   console.log("🚀 [CHECKOUT] Sending Payload to API:", payload);

//   try {
//     const res = await checkoutAPI(payload);
//     console.log("📩 [CHECKOUT] API Success Response:", res);

//     if (res.success && res.url) {
//       console.log("🔗 [CHECKOUT] Redirecting to Stripe URL:", res.url);
//       window.location.href = res.url;
//     }
//   } catch (error) {
//     console.error(
//       "❌ [CHECKOUT] API Call failed:",
//       error.response?.data || error.message,
//     );
//   } finally {
//     setLoading(false);
//   }
// };
const handlePayNow = async () => {
  setLoading(true);

  const payload = {
    planId: plan._id,
    ownerId: user._id || user.id,
    email: user.email,
  };

  try {
    const res = await checkoutAPI(payload);

    // --- यहाँ देखें क्या आ रहा है ---
    console.log("📥 RESPONSE DATA:", res);

    if (res.success && res.url) {
      window.location.href = res.url;
    } else if (res.clientSecret) {
      // अगर यहाँ पहुँच रहे हैं, तो Backend गलत डेटा भेज रहा है
      console.error(
        "🛑 ERROR: Backend sent 'clientSecret' instead of 'url'. Redirect is not possible!",
      );
      toast.error("Backend Error: Redirect URL missing.");
    }
  } catch (error) {
    console.error("❌ API ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-vh-100 py-5 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#121418" }}>
      <div className="p-4 rounded-5 shadow-lg bg-dark text-white border border-secondary w-100" style={{ maxWidth: "450px" }}>
        <h4 className="fw-bold mb-4">Checkout Summary</h4>
        
        <div className="p-4 rounded-4 mb-4 border border-secondary" style={{ backgroundColor: "#1c1f26" }}>
           <h6 className="text-warning text-uppercase small fw-bold mb-3">Order Details</h6>
           <h3 className="fw-bold mb-3">{plan.name}</h3>
           
           <div className="d-flex justify-content-between mb-2 small opacity-75">
             <span>User:</span><span>{user.fullName}</span>
           </div>
           <div className="d-flex justify-content-between mb-2 small opacity-75">
             <span>Validity:</span><span>{plan.durationCount} {plan.duration}</span>
           </div>
           <hr className="border-secondary" />
           <div className="d-flex justify-content-between h5 fw-bold">
             <span>Total:</span><span className="text-success">${plan.price}</span>
           </div>
        </div>

        <button 
          onClick={handlePayNow} 
          disabled={loading} 
          className="btn btn-warning btn-lg w-100 py-3 rounded-pill fw-bold"
        >
          {loading ? "Processing API..." : `Pay $${plan.price} Now`}
        </button>
      </div>

      {/* SUCCESS MODAL (DYNAMIC) */}
      {showSuccess && receipt && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.9)", backdropFilter: "blur(5px)", zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-0 rounded-5 overflow-hidden">
              <div className="bg-success py-4 text-center">
                <i className="bi bi-check-circle-fill" style={{ fontSize: "3.5rem" }}></i>
                <h3 className="fw-bold mt-2">Payment Initialized</h3>
              </div>
              <div className="modal-body p-4 p-md-5 text-start">
                <div className="p-3 bg-white bg-opacity-10 rounded-3 mb-4">
                   <p className="mb-1 opacity-75">Your subscription for <strong>{receipt.planName}</strong> is being processed by the system.</p>
                   <p className="small text-info mb-0">The dashboard will update once the Webhook confirms the status.</p>
                </div>
                <button className="btn btn-warning w-100 py-3 rounded-pill fw-bold" onClick={() => navigate("/pricing")}>
                   Back to My Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;