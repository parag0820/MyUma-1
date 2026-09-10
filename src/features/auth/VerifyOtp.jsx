// // import React, { useState, useEffect } from "react";
// // import { verifyOtpAPI, resendOtpAPI } from "../../services/authService";
// // import { toast } from "react-toastify";
// // import { useLocation, useNavigate } from "react-router-dom";

// // const VerifyOtp = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const [otp, setOtp] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   // Timer State: 120 seconds = 2 minutes
// //   const [timeLeft, setTimeLeft] = useState(120);
// //   const [canResend, setCanResend] = useState(false);

// //   const email = location.state?.email;
// //   const type = location.state?.type; // 'signup' or 'forgot'

// //   // Countdown Logic
// //   useEffect(() => {
// //     let timer;
// //     if (timeLeft > 0) {
// //       timer = setInterval(() => {
// //         setTimeLeft((prev) => prev - 1);
// //       }, 1000);
// //     } else {
// //       setCanResend(true); // Enable resend button when time is up
// //       clearInterval(timer);
// //     }
// //     return () => clearInterval(timer);
// //   }, [timeLeft]);

// //   useEffect(() => {
// //     if (!email || !type) {
// //       navigate("/login");
// //     }
// //   }, [email, type, navigate]);

// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
// //   };

// //   const handleVerify = async (e) => {
// //     e.preventDefault();

// //     if (timeLeft === 0) {
// //       return toast.error("OTP has expired. Please resend a new code.");
// //     }

// //     if (otp.length < 4) return toast.error("Please enter a valid code");

// //     setLoading(true);
// //     try {
// //       const res = await verifyOtpAPI({ email, otp });

// //       if (res) {
// //         toast.success("Verification Successful!");
// //         if (type === "signup") {
// //           navigate("/login");
// //         } else if (type === "forgot") {
// //           navigate("/reset-password", { state: { email } });
// //         }
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "Invalid OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // RESEND OTP METHOD
// //   const handleResend = async () => {
// //     setLoading(true);
// //     try {
// //       // Calling endpoint: /auth/resend-otp with { email }
// //       const res = await resendOtpAPI({ email });

// //       if (res) {
// //         toast.success("A new verification code has been sent!");

// //         // RESET TIMER LOGIC
// //         setTimeLeft(120); // Start 2-minute timer again
// //         setCanResend(false); // Disable resend button
// //         setOtp(""); // Clear input field
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "Failed to resend OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="container d-flex align-items-center justify-content-center min-vh-100">
// //       <div
// //         className="card shadow-lg border-0 p-4"
// //         style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
// //         <h4 className="text-center fw-bold mb-2">Verify OTP</h4>
// //         <p className="text-center text-muted small mb-4">
// //           Code sent to: <br />
// //           <span className="text-dark fw-bold">{email}</span>
// //         </p>

// //         <form onSubmit={handleVerify}>
// //           <div className="mb-2 text-center">
// //             <input
// //               type="text"
// //               className={`form-control form-control-lg text-center fw-bold ${timeLeft === 0 ? "is-invalid" : ""}`}
// //               placeholder="000000"
// //               maxLength="6"
// //               required
// //               value={otp}
// //               disabled={timeLeft === 0 || loading}
// //               onChange={(e) => setOtp(e.target.value)}
// //               style={{ letterSpacing: "8px", border: "2px solid #001f3f" }}
// //             />
// //           </div>

// //           <div className="text-center mb-4">
// //             {timeLeft > 0 ? (
// //               <small className="text-muted">
// //                 Expires in:{" "}
// //                 <span className="text-danger fw-bold">
// //                   {formatTime(timeLeft)}
// //                 </span>
// //               </small>
// //             ) : (
// //               <small className="text-danger fw-bold">OTP Expired</small>
// //             )}
// //           </div>

// //           <button
// //             className="btn btn-lg w-100 text-white shadow mb-3"
// //             style={{ backgroundColor: "#001f3f", borderRadius: "10px" }}
// //             disabled={loading || timeLeft === 0}>
// //             {loading ? "Checking..." : "Confirm"}
// //           </button>
// //         </form>

// //         <div className="text-center">
// //           <p className="small text-muted">
// //             Didn't receive the code?{" "}
// //             <button
// //               onClick={handleResend}
// //               disabled={!canResend || loading}
// //               className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
// //               style={{ color: canResend ? "#001f3f" : "#ccc" }}>
// //               Resend Code
// //             </button>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VerifyOtp;
// import React, { useState, useEffect } from "react";
// import { verifyOtpAPI, resendOtpAPI } from "../../services/authService";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOtp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Timer State: 120 seconds
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [canResend, setCanResend] = useState(false);

//   const email = location.state?.email;
//   const type = location.state?.type; // 'signup' or 'forgot'

//   // Countdown Logic
//   useEffect(() => {
//     let timer;
//     if (timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else {
//       setCanResend(true);
//       clearInterval(timer);
//     }
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   useEffect(() => {
//     if (!email || !type) {
//       navigate("/login");
//     }
//   }, [email, type, navigate]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();

//     // 1. Check if OTP is expired
//     if (timeLeft === 0) {
//       return toast.error("OTP has expired. Please request a new code.");
//     }

//     // 2. Basic length validation
//     if (otp.length < 4) {
//       return toast.error("Please enter a valid verification code.");
//     }

//     setLoading(true);
//     try {
//       const res = await verifyOtpAPI({ email, otp });

//       // 3. Logic for Successful Verification
//       if (res) {
//         toast.success("Identity Verified Successfully!");
//         if (type === "signup") {
//           navigate("/login");
//         } else if (type === "forgot") {
//           navigate("/reset-password", { state: { email } });
//         }
//       }
//     } catch (error) {
//       // 4. LOGIC FOR WRONG OTP (This triggers the Toast Error)
//       console.error("Verification Error:", error);

//       // Extracting message from Backend (e.g., "Invalid OTP" or "OTP Mismatch")
//       const errorMessage =
//         error.response?.data?.message ||
//         "Incorrect OTP. Please check and try again.";

//       toast.error(errorMessage);
//       setOtp(""); // Optional: Clear input on wrong OTP
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setLoading(true);
//     try {
//       const res = await resendOtpAPI({ email });
//       if (res) {
//         toast.success("A new verification code has been sent!");
//         setTimeLeft(120);
//         setCanResend(false);
//         setOtp("");
//       }
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message || "Failed to resend code.";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center min-vh-100">
//       <div
//         className="card shadow-lg border-0 p-4"
//         style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
//         <h4 className="text-center fw-bold mb-2">Verify Account</h4>
//         <p className="text-center text-muted small mb-4">
//           Please enter the code sent to: <br />
//           <span className="text-dark fw-bold">{email}</span>
//         </p>

//         <form onSubmit={handleVerify}>
//           <div className="mb-2 text-center">
//             <input
//               type="text"
//               className={`form-control form-control-lg text-center fw-bold ${
//                 timeLeft === 0 ? "is-invalid" : ""
//               }`}
//               placeholder="••••••"
//               maxLength="6"
//               required
//               value={otp}
//               disabled={timeLeft === 0 || loading}
//               onChange={(e) => setOtp(e.target.value)}
//               style={{ letterSpacing: "8px", border: "2px solid #001f3f" }}
//             />
//           </div>

//           <div className="text-center mb-4">
//             {timeLeft > 0 ? (
//               <small className="text-muted">
//                 Time remaining:{" "}
//                 <span className="text-danger fw-bold">
//                   {formatTime(timeLeft)}
//                 </span>
//               </small>
//             ) : (
//               <small className="text-danger fw-bold">
//                 Verification code expired
//               </small>
//             )}
//           </div>

//           <button
//             className="btn btn-lg w-100 text-white shadow mb-3"
//             style={{ backgroundColor: "#001f3f", borderRadius: "10px" }}
//             disabled={loading || timeLeft === 0}>
//             {loading ? "Verifying..." : "Verify Code"}
//           </button>
//         </form>

//         <div className="text-center">
//           <p className="small text-muted">
//             Didn't receive the code?{" "}
//             <button
//               onClick={handleResend}
//               disabled={!canResend || loading}
//               className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
//               style={{ color: canResend ? "#001f3f" : "#ccc" }}>
//               Resend New Code
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyOtp;

// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { verifyOtp } from "../auth/authSlice"; // Ensure this path is correct for your project
// import { resendOtpAPI } from "../../services/authService";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOtp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(120); // 2 Minute Timer
//   const [canResend, setCanResend] = useState(false);

//   const email = location.state?.email;
//   const type = location.state?.type;
//   const roleFromRegister = location.state?.role;

//   // Timer logic for OTP expiry and Resend button
//   useEffect(() => {
//     let timer;
//     if (timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else {
//       setCanResend(true);
//       clearInterval(timer);
//     }
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   // Redirect to login if accessed without email (security)
//   useEffect(() => {
//     if (!email || !type) {
//       navigate("/login");
//     }
//   }, [email, type, navigate]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();

//     if (timeLeft === 0) {
//       return toast.error("OTP has expired. Please request a new code.");
//     }

//     if (otp.length < 4) {
//       return toast.error("Please enter the full verification code.");
//     }

//     setLoading(true);
//     try {
//       /**
//        * IMPORTANT:
//        * We use 'dispatch' here. This triggers the Redux authSlice.
//        * Because the Navbar is connected to Redux, it will see the
//        * new token/user and update the "Sign In" button to your
//        * Profile Name/Image instantly.
//        */
//       const result = await dispatch(verifyOtp({ email, otp }));

//       if (result.meta.requestStatus === "fulfilled") {
//         toast.success("Identity Verified Successfully!");

//         // Extract user data from the successful Redux action
//         const userData = result.payload.user || result.payload.auth;

//         // Determine role (prioritize API response, fallback to registration state)
//         const finalRole = (
//           userData?.role ||
//           roleFromRegister ||
//           "user"
//         ).toLowerCase();

//         // Redirect based on role
//         if (finalRole === "owner") {
//           navigate("/pricing"); // Owners go to Pricing
//         } else {
//           navigate("/"); // Guests/Users go to Home
//         }
//       } else {
//         // This handles "Invalid OTP" messages from your backend
//         toast.error(result.payload || "Incorrect code. Please try again.");
//       }
//     } catch (error) {
//       console.error("Verification error:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setLoading(true);
//     try {
//       await resendOtpAPI({ email });
//       toast.success("A new verification code has been sent!");
//       setTimeLeft(120); // Reset timer to 2 minutes
//       setCanResend(false);
//       setOtp(""); // Clear input
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message || "Failed to resend code.";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center min-vh-100">
//       <div
//         className="card shadow-lg border-0 p-4"
//         style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
//         <h4 className="text-center fw-bold mb-2">Verify Account</h4>
//         <p className="text-center text-muted small mb-4">
//           Please enter the code sent to: <br />
//           <span className="text-dark fw-bold">{email}</span>
//         </p>

//         <form onSubmit={handleVerify}>
//           <div className="mb-2 text-center">
//             <input
//               type="text"
//               className={`form-control form-control-lg text-center fw-bold ${
//                 timeLeft === 0 ? "is-invalid" : ""
//               }`}
//               placeholder="••••••"
//               maxLength="6"
//               required
//               value={otp}
//               disabled={timeLeft === 0 || loading}
//               onChange={(e) => setOtp(e.target.value)}
//               style={{
//                 letterSpacing: "8px",
//                 border: "2px solid #001f3f",
//                 fontSize: "24px",
//               }}
//             />
//           </div>

//           <div className="text-center mb-4">
//             {timeLeft > 0 ? (
//               <small className="text-muted">
//                 Time remaining:{" "}
//                 <span className="text-danger fw-bold">
//                   {formatTime(timeLeft)}
//                 </span>
//               </small>
//             ) : (
//               <small className="text-danger fw-bold">
//                 Verification code expired
//               </small>
//             )}
//           </div>

//           <button
//             className="btn btn-lg w-100 text-white shadow mb-3"
//             style={{ backgroundColor: "#001f3f", borderRadius: "10px" }}
//             disabled={loading || timeLeft === 0}>
//             {loading ? (
//               <span className="spinner-border spinner-border-sm me-2"></span>
//             ) : (
//               "Verify Code"
//             )}
//           </button>
//         </form>

//         <div className="text-center">
//           <p className="small text-muted mb-0">
//             Didn't receive the code?{" "}
//             <button
//               onClick={handleResend}
//               disabled={!canResend || loading}
//               className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
//               style={{ color: canResend ? "#001f3f" : "#ccc" }}>
//               Resend New Code
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyOtp;

// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { verifyOtp } from "../auth/authSlice";
// import { resendOtpAPI } from "../../services/authService";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";

// const VerifyOtp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(120); // 2 Minute Timer
//   const [canResend, setCanResend] = useState(false);

//   const email = location.state?.email;
//   const type = location.state?.type;
//   const roleFromRegister = location.state?.role;
//   const pendingData = location.state?.pendingData; // Logic added to catch registration data

//   // Timer logic for OTP expiry and Resend button
//   useEffect(() => {
//     let timer;
//     if (timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else {
//       setCanResend(true);
//       clearInterval(timer);
//     }
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   // Redirect to login if accessed without email (security)
//   useEffect(() => {
//     if (!email || !type) {
//       navigate("/login");
//     }
//   }, [email, type, navigate]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();

//     if (timeLeft === 0) {
//       return toast.error("OTP has expired. Please request a new code.");
//     }

//     if (otp.length < 4) {
//       return toast.error("Please enter the full verification code.");
//     }

//     setLoading(true);
//     try {
//       // Logic added: Dispatching OTP along with pendingData to update Navbar instantly
//       const result = await dispatch(
//         verifyOtp({
//           email,
//           otp,
//           pendingUser: pendingData,
//         }),
//       );

//       if (result.meta.requestStatus === "fulfilled") {
//         toast.success("Identity Verified Successfully!");

//         const userData = result.payload.user || result.payload.auth;

//         const finalRole = (
//           userData?.role ||
//           roleFromRegister ||
//           "user"
//         ).toLowerCase();

//         if (finalRole === "owner") {
//           navigate("/pricing");
//         } else {
//           navigate("/");
//         }
//       } else {
//         toast.error(result.payload || "Incorrect code. Please try again.");
//       }
//     } catch (error) {
//       console.error("Verification error:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setLoading(true);
//     try {
//       await resendOtpAPI({ email });
//       toast.success("A new verification code has been sent!");
//       setTimeLeft(120);
//       setCanResend(false);
//       setOtp("");
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message || "Failed to resend code.";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center min-vh-100">
//       <div
//         className="card shadow-lg border-0 p-4"
//         style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
//         <h4 className="text-center fw-bold mb-2">Verify Account</h4>
//         <p className="text-center text-muted small mb-4">
//           Please enter the code sent to: <br />
//           <span className="text-dark fw-bold">{email}</span>
//         </p>

//         <form onSubmit={handleVerify}>
//           <div className="mb-2 text-center">
//             <input
//               type="text"
//               className={`form-control form-control-lg text-center fw-bold ${
//                 timeLeft === 0 ? "is-invalid" : ""
//               }`}
//               placeholder="••••••"
//               maxLength="6"
//               required
//               value={otp}
//               disabled={timeLeft === 0 || loading}
//               onChange={(e) => setOtp(e.target.value)}
//               style={{
//                 letterSpacing: "8px",
//                 border: "2px solid #001f3f",
//                 fontSize: "24px",
//               }}
//             />
//           </div>

//           <div className="text-center mb-4">
//             {timeLeft > 0 ? (
//               <small className="text-muted">
//                 Time remaining:{" "}
//                 <span className="text-danger fw-bold">
//                   {formatTime(timeLeft)}
//                 </span>
//               </small>
//             ) : (
//               <small className="text-danger fw-bold">
//                 Verification code expired
//               </small>
//             )}
//           </div>

//           <button
//             className="btn btn-lg w-100 text-white shadow mb-3"
//             style={{ backgroundColor: "#001f3f", borderRadius: "10px" }}
//             disabled={loading || timeLeft === 0}>
//             {loading ? (
//               <span className="spinner-border spinner-border-sm me-2"></span>
//             ) : (
//               "Verify Code"
//             )}
//           </button>
//         </form>

//         <div className="text-center">
//           <p className="small text-muted mb-0">
//             Didn't receive the code?{" "}
//             <button
//               onClick={handleResend}
//               disabled={!canResend || loading}
//               className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
//               style={{ color: canResend ? "#001f3f" : "#ccc" }}>
//               Resend New Code
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyOtp;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../auth/authSlice";
import { resendOtpAPI, verifyOtpAPI } from "../../services/authService"; // Ensure verifyOtpAPI is exported
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email;
  const type = location.state?.type; // 'signup' or 'reset'
  const roleFromRegister = location.state?.role;
  const pendingData = location.state?.pendingData;

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (!email || !type) {
      toast.error("Invalid session. Please start again.");
      navigate("/login");
    }
  }, [email, type, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (timeLeft === 0) {
      return toast.error("Verification code has expired. Please resend.");
    }

    if (otp.length < 6) {
      return toast.error("Please enter the full 6-digit code.");
    }

    setLoading(true);
    try {
      if (type === "signup") {
        // --- SIGNUP FLOW ---
        const result = await dispatch(
          verifyOtp({
            email,
            otp,
            pendingUser: pendingData,
          }),
        );

        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Account verified successfully!");
          const userData = result.payload.user || result.payload.auth;
          const finalRole = (
            userData?.role ||
            roleFromRegister ||
            "user"
          ).toLowerCase();

          if (finalRole === "owner") {
            navigate("/pricing");
          } else {
            navigate("/");
          }
        } else {
          toast.error(result.payload || "Invalid verification code.");
        }
      } else {
        // --- RESET PASSWORD FLOW ---
        const response = await verifyOtpAPI({ email, otp });

        if (
          response.status === "success" ||
          response.message?.includes("success") ||
          response.token
        ) {
          toast.success("OTP Verified! You can now reset your password.");
          // Send email and token to the reset password page
          navigate("/reset-password", {
            state: { email, token: response.token || otp },
          });
        } else {
          toast.error("Invalid OTP for password reset.");
        }
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      toast.error(errorMsg);
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendOtpAPI({ email });
      toast.info("A new 6-digit code has been sent to your email.");
      setTimeLeft(120);
      setCanResend(false);
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg border-0 p-4"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
        <h4 className="text-center fw-bold mb-2">
          {type === "reset" ? "Reset Security" : "Verify Account"}
        </h4>
        <p className="text-center text-muted small mb-4">
          Code sent to: <span className="text-dark fw-bold">{email}</span>
        </p>

        <form onSubmit={handleVerify}>
          <div className="mb-2 text-center">
            <input
              type="text"
              className={`form-control form-control-lg text-center fw-bold ${timeLeft === 0 ? "is-invalid" : ""}`}
              placeholder="000000"
              maxLength="6"
              required
              value={otp}
              disabled={timeLeft === 0 || loading}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              style={{
                letterSpacing: "8px",
                border: "2px solid #001f3f",
                fontSize: "24px",
              }}
            />
          </div>

          <div className="text-center mb-4">
            {timeLeft > 0 ? (
              <small className="text-muted">
                Time remaining:{" "}
                <span className="text-danger fw-bold">
                  {formatTime(timeLeft)}
                </span>
              </small>
            ) : (
              <small className="text-danger fw-bold">Code expired</small>
            )}
          </div>

          <button
            className="btn btn-lg w-100 text-white shadow mb-3"
            style={{ backgroundColor: "#001f3f", borderRadius: "10px" }}
            disabled={loading || timeLeft === 0}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              "Confirm Code"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="small text-muted mb-0">
            Didn't get it?{" "}
            <button
              onClick={handleResend}
              disabled={!canResend || loading}
              className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
              style={{ color: canResend ? "#001f3f" : "#ccc" }}>
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;