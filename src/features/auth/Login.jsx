// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loginUser, logout } from "./authSlice";
// import { toast } from "react-toastify";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const SESSION_DURATION = 24 * 60 * 60 * 1000;

//   const startSession = () => {
//     const expiryTime = Date.now() + SESSION_DURATION;
//     localStorage.setItem("sessionExpiry", expiryTime.toString());
//   };

//   useEffect(() => {
//     const expiry = localStorage.getItem("sessionExpiry");
//     if (expiry && Date.now() > parseInt(expiry)) {
//       dispatch(logout());
//       toast.warn("Session expired. Please login again.");
//     }
//   }, [dispatch]);
// const handleLogin = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     const res = await dispatch(loginUser(loginData));

//     if (res.meta.requestStatus === "fulfilled") {
//       // ⭐ FIX: payload structure changed from .auth to .user
//       const userData = res.payload.user;

//       // 🛑 ADMIN BLOCK
//       if (userData.role === "admin") {
//         toast.error(
//           "Unauthorized: Admin cannot login from here. Use Admin Panel.",
//         );
//         dispatch(logout());
//         setLoading(false);
//         return;
//       }

//       // ✅ SUCCESS
//       // Note: We don't need manual localStorage.setItem here anymore
//       // because authSlice + storage.js is already doing it!

//       toast.success(`Welcome, ${userData.fullName}`);
//       startSession();
//       navigate("/");
//     } else {
//       // Error from thunk rejectWithValue
//       toast.error(res.payload || "Authentication failed");
//     }
//   } catch (error) {
//     // This catches actual code crashes
//     console.error("Login Error:", error);
//     toast.error("An unexpected error occurred");
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="container d-flex align-items-center justify-content-center min-vh-100">
//       <div
//         className="card shadow-lg border-0 p-4"
//         style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}>
//         <h2 className="text-center fw-bold mb-4" style={{ color: "#001f3f" }}>
//           MyUma
//         </h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label className="form-label small fw-bold">Email Address</label>
//             <input
//               type="email"
//               className="form-control py-2"
//               placeholder="name@example.com"
//               required
//               onChange={(e) =>
//                 setLoginData({ ...loginData, email: e.target.value })
//               }
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label small fw-bold">Password</label>
//             <input
//               type="password"
//               className="form-control py-2"
//               placeholder="••••••••"
//               required
//               onChange={(e) =>
//                 setLoginData({ ...loginData, password: e.target.value })
//               }
//             />
//           </div>
//           <div className="text-end mb-3">
//             <Link
//               to="/forgot-password"
//               style={{ color: "#f39c12", textDecoration: "none" }}
//               className="small fw-bold">
//               Forgot Password?
//             </Link>
//           </div>
//           <button
//             className="btn btn-lg w-100 text-white"
//             style={{ backgroundColor: "#001f3f" }}
//             disabled={loading}>
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>
//         <p className="text-center mt-4 small">
//           Don't have an account?{" "}
//           <Link to="/register" className="fw-bold text-decoration-none">
//             Register Here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, logout } from "./authSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const SESSION_DURATION = 24 * 60 * 60 * 1000;

  const startSession = () => {
    const expiryTime = Date.now() + SESSION_DURATION;
    localStorage.setItem("sessionExpiry", expiryTime.toString());
  };

  // Check session validity on component mount and every minute
  useEffect(() => {
    const checkSession = () => {
      const expiry = localStorage.getItem("sessionExpiry");
      if (expiry && Date.now() > parseInt(expiry)) {
        dispatch(logout());
        localStorage.removeItem("sessionExpiry");
        toast.warn("Session expired. Please login again.");
        navigate("/login");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dispatch(loginUser(loginData));

      if (res.meta.requestStatus === "fulfilled") {
        // Correctly target user object from payload
        const userData = res.payload.user;

        // 🛑 ADMIN BLOCK LOGIC
        if (userData.role === "admin") {
          // Immediately log out and show error toast
          dispatch(logout());
          localStorage.removeItem("sessionExpiry");
          toast.error(
            "Unauthorized: Admins cannot login through this portal. Please use the Admin Panel.",
          );
          setLoading(false);
          return; // Stop the function here
        }

        // ✅ SUCCESS FOR USER / OWNER
        toast.success(`Welcome, ${userData.fullName}`);
        startSession();
        navigate("/");
      } else {
        toast.error(
          res.payload || "Authentication failed. Check your credentials.",
        );
      }
    } catch (error) {
      console.error("Login System Error:", error);
      toast.error("A system error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg border-0 p-4"
        style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "#001f3f" }}>
          MyUma
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted text-uppercase">
              Email Address
            </label>
            <input
              type="email"
              className="form-control py-2 shadow-none"
              placeholder="name@example.com"
              required
              autoComplete="email"
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted text-uppercase">
              Password
            </label>
            <input
              type="password"
              className="form-control py-2 shadow-none"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </div>
          <div className="text-end mb-3">
            <Link
              to="/forgot-password"
              style={{ color: "#f39c12", textDecoration: "none" }}
              className="small fw-bold">
              Forgot Password?
            </Link>
          </div>
          <button
            className="btn btn-lg w-100 text-white shadow-sm"
            style={{ backgroundColor: "#001f3f" }}
            disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            {loading ? "Authorizing..." : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-4 small text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="fw-bold text-decoration-none"
            style={{ color: "#001f3f" }}>
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;