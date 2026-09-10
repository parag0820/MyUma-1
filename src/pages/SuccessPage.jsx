// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle } from "lucide-react";

// const SuccessPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
//       <div
//         className="card border-0 shadow-lg p-5 text-center rounded-5"
//         style={{ maxWidth: "500px" }}>
//         <div className="mb-4">
//           <div className="d-inline-flex p-4 rounded-circle bg-success bg-opacity-10 text-success animate-bounce">
//             <CheckCircle size={80} strokeWidth={2.5} />
//           </div>
//         </div>

//         <h1 className="fw-bold text-navy mb-3">Payment Successful!</h1>
//         <p className="text-muted fs-5 mb-4">
//         Your payment has been processed. Your premium subscription is
//           now active.
//         </p>

//         <div className="bg-light p-3 rounded-4 mb-4 text-start border">
//           <small
//             className="text-muted d-block text-uppercase fw-bold mb-1"
//             style={{ fontSize: "10px" }}>
//             Order Status
//           </small>
//           <span className="badge bg-success px-3 py-2 rounded-pill">
//             COMPLETED
//           </span>
//         </div>

//         <button
//           className="btn btn-warning w-100 py-3 rounded-pill fw-bold fs-5 shadow-sm text-white"
//           style={{ backgroundColor: "#de9f57", border: "none" }}
//           onClick={() => navigate("/pricing")}>
//           Back to Dashboard
//         </button>
//       </div>

//       <style>{`
//         .animate-bounce {
//           animation: bounce 2s infinite;
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SuccessPage;
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, PartyPopper } from "lucide-react";
import { toast } from "react-toastify";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  // URL से session_id निकालें (अगर आपको स्टोर करना हो)
  const sessionId = searchParams.get("session_id");

useEffect(() => {
  // 1. यूआरएल को साफ (Clean) करें
  // यह "?session_id=..." वाले हिस्से को एड्रेस बार से हटा देगा
  if (window.location.search.includes("session_id")) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // 2. वेरिफिकेशन टाइमर (पुराना वाला लॉजिक)
  const timer = setTimeout(() => {
    setIsProcessing(false);
  }, 3000);

  return () => clearTimeout(timer);
}, []);

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light text-start">
      <div className="card border-0 shadow-lg p-5 text-center rounded-5" style={{ maxWidth: "550px", width: "90%" }}>
        
        {isProcessing ? (
          <div className="py-4">
            <Loader2 className="animate-spin mx-auto text-warning mb-4" size={60} />
            <h2 className="fw-bold text-navy mb-2">Verifying Payment...</h2>
            <p className="text-muted">Please wait while we sync your subscription with Stripe.</p>
            <div className="mt-4 p-3 bg-white rounded-4 border border-dashed text-start">
               <small className="text-muted d-block fw-bold mb-1">SESSION ID:</small>
               <code className="text-break small text-primary">{sessionId || "Processing..."}</code>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-4">
              <div className="d-inline-flex p-4 rounded-circle bg-success bg-opacity-10 text-success shadow-sm">
                <CheckCircle size={80} strokeWidth={2.5} />
              </div>
            </div>
            
            <h1 className="fw-bold text-navy mb-3">Success! Payment Received</h1>
            <p className="text-muted fs-5 mb-4">
              Thank you for choosing **MyUma**. Your premium membership has been activated and is ready to use.
            </p>
{/* 
            <div className="bg-success bg-opacity-5 p-3 rounded-4 mb-4 text-start border border-success border-opacity-25">
                <div className="d-flex align-items-center gap-2">
                   <PartyPopper size={20} className="text-success" />
                   <span className="fw-bold text-success">Membership Status: ACTIVE</span>
                </div>
            </div> */}

            <div className="row g-2">
               <div className="col-12">
                  <button 
                    className="btn btn-warning w-100 py-3 rounded-pill fw-bold fs-5 shadow-sm text-white border-0"
                    style={{ backgroundColor: "#de9f57" }}
                    onClick={() => navigate("/pricing")}
                  >
                    Go to Dashboard
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SuccessPage;